import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { removeIconSmall, savetimeicon } from './svg'
import GFK from './gfk';
import { inputUTCStringForLaborID, inputDateObjOutputAdjString, CreateTime, sorttimesdesc } from './functions';
import ActualLaborTimeIn from './actuallabortimein';
import ActualLaborTimeOut from './actuallabortimeout'
import { SaveTime } from './actions/api'
import MakeID from './makeids'

class Timesheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '', width: 0, height: 0, activelaborid: false, description: '', traveltimein: 0, traveltimeout: 0, timein: new Date(),
            timeout: new Date(new Date().getTime() + (1000 * 60 * 60))
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();

    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    removeactuallabor(laborid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        const mylabor = gfk.getactuallaborbyid.call(this, laborid)
        if (window.confirm(`Are you sure you want to delete actual laborid ${mylabor.description}`)) {


            if (myuser) {
                const i = gfk.getactuallaborkeybyid.call(this, laborid)
                myuser.actuallabor.mylabor.splice(i, 1)
                if (myuser.actuallabor.mylabor.length === 0) {
                    delete myuser.actuallabor.mylabor
                    delete myuser.actuallabor;

                }
                this.props.reduxUser(myuser)
                this.setState({ activelaborid: false })

            }

        }

    }
    makelaboridactive(laborid) {
        if (this.state.activelaborid === laborid) {
            this.setState({ activelaborid: false })
        } else {
            this.setState({ activelaborid: laborid })
        }
    }
    handledescription(description) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            if (this.state.activelaborid) {
                const i = gfk.getactuallaborkeybyid.call(this, this.state.activelaborid);
                myuser.actuallabor.mylabor[i].description = description;
                this.props.reduxUser(myuser)
                this.setState({ render: 'render' })

            } else {
                let laborid = makeid.laborid.call(this)
                let timein = inputDateObjOutputAdjString(this.state.timein);
                let timeout = inputDateObjOutputAdjString(this.state.timeout);
                let traveltimein = this.state.traveltimein;
                let traveltimeout = this.state.traveltimeout;
                let invoiceid = this.state.invoiceid;
                let projectid = this.props.match.params.projectid;
                let newtime = CreateTime(laborid, projectid, timein, timeout, traveltimein, traveltimeout, description, invoiceid)
                console.log(newtime)
                const labor = gfk.getactuallabor.call(this);
                if (labor) {
                    myuser.actuallabor.mylabor.push(newtime)

                } else {
                    let actuallabor = { mylabor: [newtime] }
                    myuser.actuallabor = actuallabor;
                }
                this.props.reduxUser(myuser)
                this.setState({ activelaborid: laborid })
            }

        }
    }
    getdescription() {
        const gfk = new GFK();
        let description = "";
        if (this.state.activelaborid) {
            const mylabor = gfk.getactuallaborbyid.call(this, this.state.activelaborid)
            description = mylabor.description;
        } else {
            description = this.state.description;
        }
        return description;
    }

    showlaborid(mylabor) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const removeIcon = gfk.getremoveicon.call(this)
        const activebackground = () => {
            if (this.state.activelaborid === mylabor.laborid) {
                return (styles.activefieldreport)
            } else {
                return;
            }
        }
        return (
            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.flex4, ...regularFont, ...activebackground() }} onClick={() => { this.makelaboridactive(mylabor.laborid) }}>
                    {inputUTCStringForLaborID(mylabor.timein)} to {inputUTCStringForLaborID(mylabor.timeout)}  <br />
                    {mylabor.description}
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removeactuallabor(mylabor.laborid) }}>
                        {removeIconSmall()}
                    </button>
                </div>
            </div>
        )
    }
    showlaborids() {
        const gfk = new GFK();
        const labor = gfk.getactuallaborbyproject.call(this, this.props.match.params.projectid)
        if (labor) {
            labor.sort((a, b) => {

                return sorttimesdesc(a.timein, b.timein)
            })
        }
        const ids = [];
        if (labor) {
            // eslint-disable-next-line
            labor.map(mylabor => {
                ids.push(this.showlaborid(mylabor))
            })
        }
        return ids;
    }
    async savetime() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            const mylabor = gfk.getactuallaborbyproject.call(this, this.props.match.params.projectid)
            const values = { labor: mylabor, engineerid: this.props.match.params.engineerid, projectid: this.props.match.params.projectid }
            console.log(values)
            let response = await SaveTime(values)
            console.log(response)
            if (response.hasOwnProperty("replaceids")) {
                if (this.state.activelaborid) {
                    // eslint-disable-next-line
                    response.replaceids.map(mylabor => {
                        if (mylabor.oldlaborid === this.state.activelaborid) {
                            const j = gfk.getactuallaborkeybyid.call(this,mylabor.oldlaborid);
                            myuser.actuallabor.mylabor[j].laborid = mylabor.laborid;
                            this.props.reduxUser(myuser)
                            this.setState({ activelaborid: mylabor.laborid })
                        }
                    })
                }

            }
            if (response.hasOwnProperty("mylabor")) {
                // eslint-disable-next-line
                response.mylabor.map(labor => {
                    let laborid = labor.laborid;
                    const i = gfk.getactuallaborkeybyid.call(this, laborid);
                    myuser.actuallabor.mylabor[i] = labor;

                })
                this.props.reduxUser(myuser);

            }

            
         
            if (response.hasOwnProperty("message")) {
                let message = `${response.message} last saved ${inputUTCStringForLaborID(response.lastsaved)}`
                this.setState({ message })
            } else {
                this.setState({ render: 'render' })
            }

        }
    }
    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const myproject = gfk.getprojectbyid.call(this, this.props.match.params.projectid);
        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this)
        const actuallabortimein = new ActualLaborTimeIn();
        const actuallabortimeout = new ActualLaborTimeOut();
        const savetime = gfk.getsavetime.call(this)
        const projecttitle = () => {

            return (<div>{myproject.projectnumber}/{myproject.title} <br />
                {myproject.address} {myproject.city}</div>)
        }
        const showtimes = () => {
            if (this.state.width > 1200) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>
                        {actuallabortimein.showtimein.call(this)}
                    </div>
                    <div style={{ ...styles.flex1 }}>
                        {actuallabortimeout.showtimeout.call(this)}
                    </div>
                </div>)

            } else {

                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1 }}>
                                    <div> {actuallabortimein.showtimein.call(this)}</div>

                                </div>

                            </div>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1 }}>
                                    {actuallabortimeout.showtimeout.call(this)}

                                </div>
                            </div>

                        </div>
                    </div>)

            }
        }
        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.alignCenter, ...styles.boldFont }}>
                            Timesheet
                        {projecttitle()}
                        </div>
                    </div>

                    {showtimes()}

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            Description <br />
                            <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                                value={this.getdescription()}
                                onChange={event => { this.handledescription(event.target.value) }} />
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter, ...regularFont, ...styles.generalFont }}>
                            {this.state.message}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <button style={{ ...styles.generalButton, ...savetime }} onClick={() => { this.savetime() }}>{savetimeicon()}</button>
                        </div>
                    </div>

                    {this.showlaborids()}
                </div>
            </div>

        )
    }
}
function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(Timesheet);