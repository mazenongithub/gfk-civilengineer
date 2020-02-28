import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { minus20, plus20, removeIconSmall } from './svg'
import { makeID, UnconfinedTest, UnconfinedTestData, sortdisplacement } from './functions';
import { Link } from 'react-router-dom';

class Unconfined extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activeunid: false, loadreading: '', displacement: '' }
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

    getloadreading() {
        const gfk = new GFK();
        if (this.state.activeunid) {
            const sampleid = this.props.match.params.sampleid;
            const test = gfk.unconfinedtestdatabyid.call(this, sampleid, this.state.activeunid)
            if (test) {
                return (test.loadreading)
            }

        } else {
            return this.state.loadreading;
        }


    }

    handleloadreading(loadreading) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activeunid) {
                const unid = this.state.activeunid;
                const sampleid = this.props.match.params.sampleid;
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid);
                const j = gfk.unconfinedtestdatakeybyid.call(this, sampleid, unid);
                myuser.unconfinedtests.unconfined[i].testdata.data[j].loadreading = loadreading;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })


            } else {
                this.setState({ loadreading })
            }
        }
    }

    getdisplacement() {
        const gfk = new GFK();
        if (this.state.activeunid) {
            const sampleid = this.props.match.params.sampleid;
            const test = gfk.unconfinedtestdatabyid.call(this, sampleid, this.state.activeunid)
            if (test) {
                return (test.displacement)
            }

        } else {
            return this.state.displacement;
        }


    }
    removetestdata(unid) {
        const gfk = new GFK();
        const sampleid = this.props.match.params.sampleid;
        const data = gfk.unconfinedtestdatabyid.call(this, sampleid, unid);
        if (window.confirm(`Are you sure you want to delete Displacement ${data.displacement}?`)) {
            const myuser = gfk.getuser.call(this);
            if (myuser) {
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid);
                const j = gfk.unconfinedtestdatakeybyid.call(this, sampleid, unid);
                myuser.unconfinedtests.unconfined[i].testdata.data.splice(j, 1);
                if (myuser.unconfinedtests.unconfined[i].testdata.data.length === 0) {
                    delete myuser.unconfinedtests.unconfined[i].testdata.data;
                    delete myuser.unconfinedtests.unconfined[i].testdata;
                }
                this.props.reduxUser(myuser)
                this.setState({ activeunid: false })
            }


        }

    }
    maketestidactive(unid) {
        if (this.state.activeunid === unid) {
            this.setState({ activeunid: false })
        } else {
            this.setState({ activeunid: unid })
        }

    }
    showtestid(data) {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const removeIcon = gfk.getremoveicon.call(this)
        const activeid = () => {
            if (this.state.activeunid === data.unid) {
                return (styles.activefieldreport)
            } else {
                return;
            }
        }
        return (<div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }} key={data.unid}>
            <span style={{ ...activeid() }}
                onClick={() => { this.maketestidactive(data.unid) }}> Displacement {data.displacement} Loading Reading:{data.loadreading}</span>
            <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removetestdata(data.unid) }}>
                {removeIconSmall()}
            </button>
        </div>)

    }

    showtestids() {
        const gfk = new GFK();
        const sampleid = this.props.match.params.sampleid;
        const unconfined = gfk.getunconfinedtestbyid.call(this, sampleid);

        let ids = [];
        if (unconfined) {
            if (unconfined.hasOwnProperty("testdata")) {

                const data = unconfined.testdata.data.sort((testa, testb) => {
                    return (sortdisplacement(testa, testb))
                })
                // eslint-disable-next-line
                data.map(data => {
                    ids.push(this.showtestid(data))
                })
            }
        }
        return ids;
    }

    handledisplacement(displacement) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activeunid) {
                const unid = this.state.activeunid;
                const sampleid = this.props.match.params.sampleid;
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid);
                const j = gfk.unconfinedtestdatakeybyid.call(this, sampleid, unid);
                myuser.unconfinedtests.unconfined[i].testdata.data[j].displacement = displacement;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })


            } else {
                this.setState({ displacement })
            }
        }
    }
    addtest() {
        const gfk = new GFK();
        const sampleid = this.props.match.params.sampleid;
        const unconfined = gfk.getunconfinedtestbyid.call(this, sampleid);
        const loadreading = this.state.loadreading;
        const displacement = this.state.displacement;
        const unid = makeID(16)
        const myuser = gfk.getuser.call(this);
        if (myuser) {

            if (unconfined) {
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid)
                const newData = UnconfinedTestData(unid, loadreading, displacement)
                if (unconfined.hasOwnProperty("testdata")) {

                    myuser.unconfinedtests.unconfined[i].testdata.data.push(newData)

                } else {
                    const testdata = { data: [newData] }
                    myuser.unconfinedtests.unconfined[i].testdata = testdata;
                }
                this.props.reduxUser(myuser)
                this.setState({ render: 'render', displacement: Number(this.state.displacement) + 20, loadreading: '' })
                this.loadReading.focus();
            } else {
                const sampleid = this.props.match.params.sampleid;
                const newTest = UnconfinedTest(unid, sampleid, loadreading, displacement)
                const tests = gfk.getunconfinedtests.call(this);
                if (tests) {
                    myuser.unconfinedtests.unconfined.push(newTest)
                } else {
                    const unconfinedtests = { unconfined: [newTest] }
                    myuser.unconfinedtests = unconfinedtests;
                }
                this.props.reduxUser(myuser)
                this.setState({ render: 'render', displacement: Number(this.state.displacement) + 20, loadreading: '' })
                this.loadReading.focus();
            }

        }
    }
    handleminus20() {
        if (this.state.displacement) {
            let displacement = Number(this.state.displacement);
            if (displacement >= 20) {
                displacement = displacement - 20;
                this.setState({ displacement, loadreading: '' })
                this.loadReading.focus();
            }

        }

    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this);
        const project = gfk.getprojectbyid.call(this, this.props.match.params.projectid)
        const boring = gfk.getboringbyid.call(this, this.props.match.params.boringid)
        const sample = gfk.getsamplebyid.call(this, this.props.match.params.sampleid)
        const myuser = gfk.getuser.call(this);
        const projectid = this.props.match.params.projectid;
        const boringid = this.props.match.params.boringid;
        const regularFont = gfk.getRegularFont.call(this)
        const plusIcon = () => {
            if (this.state.width > 1200) {
                return ({ width: '101px', height: '66px' })
            } else if (this.state.width > 800) {
                return ({ width: '92px', height: '62px' })
            } else {
                return ({ width: '67px', height: '42px' })
            }
        }
        const fieldWidth = () => {
            if (this.state.width > 1200) {
                return ({ width: '190px' })
            } else if (this.state.width > 800) {
                return ({ width: '175px' })
            } else {
                return ({ width: '93px' })
            }
        }
        const fieldGap = () => {
            if (this.state.width > 1200) {
                return ({ marginLeft: '25px' })
            } else if (this.state.width > 800) {
                return ({ marginLeft: '20px' })
            } else {
                return;
            }
        }
        const showForm = () => {
            if (this.state.width > 1200) {

                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {plus20()}
                                </button>
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {minus20()}
                                </button>
                            </div>
                        </div>
                        <div style={{ ...styles.flex2 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldWidth() }}>
                                Displacement <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getdisplacement()}
                                    onChange={event => { this.handledisplacement(event.target.value) }}
                                />
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldGap() }}>
                                Load Reading <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getloadreading()}
                                    onChange={event => { this.handleloadreading(event.target.value) }}
                                    ref={(input) => { this.loadReading = input; }}
                                />
                            </div>

                        </div>
                    </div>
                )

            } else if (this.state.width > 800) {

                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {plus20()}
                                </button>
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {minus20()}
                                </button>
                            </div>
                        </div>
                        <div style={{ ...styles.flex3 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldWidth() }}>
                                Displacement <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getdisplacement()}
                                    onChange={event => { this.handledisplacement(event.target.value) }}
                                />
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldGap() }}>
                                Load Reading <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getloadreading()}
                                    onChange={event => { this.handleloadreading(event.target.value) }}
                                    ref={(input) => { this.loadReading = input; }}
                                />
                            </div>
                        </div>
                    </div>
                )

            } else {
                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <button style={{ ...styles.generalButton, ...plusIcon() }} onClick={() => { this.addtest() }}>
                                        {plus20()}
                                    </button>
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <button style={{ ...styles.generalButton, ...plusIcon() }} onClick={() => { this.handleminus20() }}>
                                        {minus20()}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                                Displacement <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getdisplacement()}
                                    onChange={event => { this.handledisplacement(event.target.value) }}
                                />
                            </div>

                        </div>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                                Load Reading <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getloadreading()}
                                    onChange={event => { this.handleloadreading(event.target.value) }}
                                    ref={(input) => { this.loadReading = input; }}
                                />
                            </div>
                        </div>
                    </div>
                )

            }
        }
        if (myuser) {
            const engineerid = myuser.engineerid;
            return (
                <div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                            <div style={{ ...styles.flex1, ...styles.alignCenter, ...headerFont, ...styles.boldFont }}>
                                Project Number {project.projectnumber} /{project.title} <br />
                                {project.address} {project.city} <br />
                                <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/gfk/projects/${projectid}/borings`}>Boring Number {boring.boringnumber}</Link> <br />
                                <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/gfk/projects/${projectid}/borings/${boringid}/samples`}> Depth {sample.depth} ft </Link> <br />
                                Unconfined
                            </div>
                        </div>
                        {showForm()}
                        {this.showtestids()}
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                                {this.state.message}
                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1 }}>
                                {gfk.showsaveboring.call(this)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<span>&nbsp;</span>)
        }

    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(Unconfined);