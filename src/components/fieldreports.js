import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import DateReport from './datereport';
import ProjectID from './projectid';
import CurveID from './curveid';
import { removeIconSmall } from './svg';
import { fieldReport, makeID, makeDatefromObj, makeUTCStringCurrentTime, compactionTest, milestoneformatdatestring } from './functions'
class FieldReports extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, datereport: new Date(), activefieldid: false, calender: 'open', projectnumber: '', projectid: '', content: '', activetestid: false, testnum: '', elevation: '', location: '', wetpcf: 0, moistpcf: 0, curveid: '' }
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

    getprojectid() {
        const gfk = new GFK();
        if (this.state.activefieldid) {
            const report = gfk.getfieldreportbyid.call(this, this.state.activefieldid)
            const myproject = gfk.getprojectbyid.call(this, report.projectid);
            return (`ProjectID ${myproject.projectid} #${myproject.projectnumber} ${myproject.address} ${myproject.city}`)
        } else {
            return;
        }

    }
    gettestnum() {
        const gfk = new GFK();

        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const test = gfk.getcompactiontestbyid.call(this, testid)
            return (test.testnum);
        } else {
            return this.state.testnum;
        }

    }
    handletestnum(testnum) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;

                if (this.state.activetestid) {
                    const testid = this.state.activetestid;
                    const i = gfk.getcompactiontestkeybyid.call(this, testid)
                    myuser.compactiontests.compactiontest[i].testnum = testnum;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    let testid = makeID(16);
                    let timetest = makeUTCStringCurrentTime();
                    let elevation = this.state.elevation;
                    let location = this.state.location;
                    let wetpcf = this.state.wetpcf;
                    let moistpcf = this.state.moistpcf;
                    let curveid = this.state.curveid;
                    let letterid = "";
                    let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)
                    const compactiontests = gfk.getcompactiontests.call(this)

                    if (compactiontests) {

                        myuser.compactiontests.compactiontest.push(newTest);

                    } else {
                        let compactiontests = { compactiontest: [newTest] }
                        myuser.compactiontests = compactiontests;
                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activetestid: testid })


                }

            }
        }

    }
    getelevation() {
        const gfk = new GFK();

        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const test = gfk.getcompactiontestbyid.call(this, testid)
            return (test.elevation);
        } else {
            return this.state.elevation;
        }

    }
    handleelevation(elevation) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                if (this.state.activetestid) {
                    const testid = this.state.activetestid;
                    const i = gfk.getcompactiontestkeybyid.call(this, testid)
                    myuser.compactiontests.compactiontest[i].elevation = elevation;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    let testid = makeID(16);
                    let timetest = makeUTCStringCurrentTime();
                    let testnum = this.state.testnum;
                    let location = this.state.location;
                    let wetpcf = this.state.wetpcf;
                    let moistpcf = this.state.moistpcf;
                    let curveid = this.state.curveid;
                    let letterid = "";
                    let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)
                    const compactiontests = gfk.getcompactiontests.call(this)
                    if (compactiontests) {
                        myuser.compactiontests.compactiontests.push(newTest);

                    } else {
                        let compactiontests = { compactiontest: [newTest] }
                        myuser.compactiontests = compactiontests;
                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activetestid: testid })


                }

            }
        }

    }
    getlocation() {
        const gfk = new GFK();

        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const test = gfk.getcompactiontestbyid.call(this, testid)
            return (test.location);
        } else {
            return this.state.location;
        }

    }
    handlelocation(location) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                if (this.state.activetestid) {
                    const testid = this.state.activetestid;
                    const i = gfk.getcompactiontestkeybyid.call(this, testid)
                    myuser.compactiontests.compactiontest[i].location = location;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    let testid = makeID(16);
                    let timetest = makeUTCStringCurrentTime();
                    let testnum = this.state.testnum;
                    let elevation = this.state.elevation;
                    let wetpcf = this.state.wetpcf;
                    let moistpcf = this.state.moistpcf;
                    let curveid = this.state.curveid;
                    let letterid = "";
                    let newTest = compactionTest({ testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid })
                    const compactiontests = gfk.getcompactiontests.call(this)
                    if (compactiontests) {
                        myuser.compactiontests.compactiontests.push(newTest);

                    } else {
                        let compactiontests = { compactiontest: [newTest] }
                        myuser.compactiontests = compactiontests;
                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activetestid: testid })


                }

            }
        }

    }
    getwetpcf() {
        const gfk = new GFK();

        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const test = gfk.getcompactiontestbyid.call(this, testid)
            return (test.wetpcf);
        } else {
            return this.state.wetpcf;
        }

    }
    handlewetpcf(wetpcf) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                if (this.state.activetestid) {
                    const testid = this.state.activetestid;
                    const i = gfk.getcompactiontestkeybyid.call(this, testid)
                    myuser.compactiontests.compactiontest[i].wetpcf = wetpcf;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    let testid = makeID(16);
                    let timetest = makeUTCStringCurrentTime();
                    let testnum = this.state.testnum;
                    let elevation = this.state.elevation;
                    let location = this.state.location;
                    let moistpcf = this.state.moistpcf;
                    let curveid = this.state.curveid;
                    let letterid = "";
                    let newTest = compactionTest({ testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid })
                    const compactiontests = gfk.getcompactiontests.call(this)
                    if (compactiontests) {
                        myuser.compactiontests.compactiontests.push(newTest);

                    } else {
                        let compactiontests = { compactiontest: [newTest] }
                        myuser.compactiontests = compactiontests;
                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activetestid: testid })


                }

            }
        }

    }

    getmoistpcf() {
        const gfk = new GFK();

        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const test = gfk.getcompactiontestbyid.call(this, testid)
            return (test.moistpcf);
        } else {
            return this.state.moistpcf;
        }

    }
    handlemoistpcf(moistpcf) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                if (this.state.activetestid) {
                    const testid = this.state.activetestid;
                    const i = gfk.getcompactiontestkeybyid.call(this, testid)
                    myuser.compactiontests.compactiontest[i].moistpcf = moistpcf;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    let testid = makeID(16);
                    let timetest = makeUTCStringCurrentTime();
                    let testnum = this.state.testnum;
                    let elevation = this.state.elevation;
                    let location = this.state.location;
                    let curveid = this.state.curveid;
                    let wetpcf = this.state.wetpcf;
                    let letterid = "";
                    let newTest = compactionTest({ testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid })
                    const compactiontests = gfk.getcompactiontests.call(this)
                    if (compactiontests) {
                        myuser.compactiontests.compactiontests.push(newTest);

                    } else {
                        let compactiontests = { compactiontest: [newTest] }
                        myuser.compactiontests = compactiontests;
                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activetestid: testid })


                }

            }
        }

    }
    getcurveid() {
        const gfk = new GFK();

        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const test = gfk.getcompactiontestbyid.call(this, testid)
            return (test.curveid);
        } else {
            return this.state.curveid;
        }

    }

    handlecurveid(curveid) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                if (this.state.activetestid) {
                    const testid = this.state.activetestid;
                    const i = gfk.getcompactiontestkeybyid.call(this, testid)
                    myuser.compactiontests.compactiontest[i].curveid = curveid;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    let testid = makeID(16);
                    let timetest = makeUTCStringCurrentTime();
                    let testnum = this.state.testnum;
                    let elevation = this.state.elevation;
                    let location = this.state.location;
                    let moistpcf = this.state.moistpcf;
                    let wetpcf = this.state.wetpcf;
                    let letterid = "";
                    let newTest = compactionTest({ testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid })
                    const compactiontests = gfk.getcompactiontests.call(this)
                    if (compactiontests) {
                        myuser.compactiontests.compactiontests.push(newTest);

                    } else {
                        let compactiontests = { compactiontest: [newTest] }
                        myuser.compactiontests = compactiontests;
                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activetestid: testid })


                }

            }
        }

    }
    compactiontestinput() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const smallFont = gfk.getSmallFont.call(this);
        const projectid = this.props.match.params.projectid;
        const curveid = new CurveID();
        if (this.state.activefieldid) {
            if (this.state.width > 1200) {

                return (<div style={{ ...styles.generalFlex, ...styles.generalFont }}>
                    <div style={{ ...styles.flex1, ...styles.addMargin }}>
                        <span style={{ ...smallFont }}> Num</span> <br />
                        <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                            value={this.gettestnum()}
                            onChange={event => { this.handletestnum(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addMargin }}>
                        <span style={{ ...smallFont }}> Elev </span> <br />
                        <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                            value={this.getelevation()}
                            onChange={event => { this.handleelevation(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex2, ...styles.addMargin }}>
                        <span style={{ ...smallFont }}> Location  </span> <br />
                        <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                            value={this.getlocation()}
                            onChange={event => { this.handlelocation(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addMargin }}>
                        <span style={{ ...smallFont }}> Wet Den P.C.F.  </span> <br />
                        <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                            value={this.getwetpcf()}
                            onChange={event => { this.handlewetpcf(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addMargin }}>
                        <span style={{ ...smallFont }}> Water P.C.F. </span> <br />
                        <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                            value={this.getmoistpcf()}
                            onChange={event => { this.handlemoistpcf(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex2, ...styles.addMargin }}>
                        <span style={{ ...smallFont }}> Curve </span>
                        {curveid.showcurveid.call(this, projectid)}

                    </div>
                </div>)
            } else {

                return (
                    <div style={{ ...styles.generalFlex, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex }}>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.addMargin }}>
                                    <span style={{ ...smallFont }}> Num </span> <br />
                                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                                        value={this.gettestnum()}
                                        onChange={event => { this.handletestnum(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addMargin }}>
                                    <span style={{ ...smallFont }}> Elev </span> <br />
                                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                                        value={this.getelevation()}
                                        onChange={event => { this.handleelevation(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex2, ...styles.addMargin }}>
                                    <span style={{ ...smallFont }}> Location  </span><br />
                                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                                        value={this.getlocation()}
                                        onChange={event => { this.handlelocation(event.target.value) }}
                                    />
                                </div>
                            </div>


                            <div style={{ ...styles.generalFlex }}>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.addMargin }}>
                                    <span style={{ ...smallFont }}> Wet Den P.C.F. </span> <br />
                                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                                        value={this.getwetpcf()}
                                        onChange={event => { this.handlewetpcf(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addMargin }}>
                                    <span style={{ ...smallFont }}> Water P.C.F. </span> <br />
                                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                                        value={this.getmoistpcf()}
                                        onChange={event => { this.handlemoistpcf(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex2, ...styles.addMargin }}>
                                    <span style={{ ...smallFont }}> Curve </span> <br />
                                    {curveid.showcurveid.call(this, projectid)}
                                </div>
                            </div>


                        </div>
                    </div>)
            }
        } else {
            return;
        }
    }
    showallreports() {
        let fieldid = false;
        if (this.state.activefieldid) {
            fieldid = this.state.activefieldid;
        }
        return (fieldid);

    }
    makereportactive(fieldid) {
        if (this.state.activefieldid === fieldid) {
            this.setState({ activefieldid: false })
        } else {
            this.setState({ activefieldid: fieldid })
        }
    }
    showreportid(report) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const removeIcon = gfk.getremoveicon.call(this)
        const regularFont = gfk.getRegularFont.call(this);
        const activebackground = () => {
            if (this.state.activefieldid === report.fieldid) {
                return (styles.activefieldreport)
            } else {
                return;
            }
        }
        return (<div style={{ ...styles.generalFlex, ...regularFont, ...styles.generalFont, ...styles.bottomMargin15, ...activebackground() }}>
            <div style={{ ...styles.flex5 }} onClick={() => { this.makereportactive(report.fieldid) }}>
                {milestoneformatdatestring(report.datereport)}
            </div>
            <div style={{ ...styles.flex1 }}>
                <button style={{ ...styles.generalButton, ...removeIcon }}>
                    {removeIconSmall()}
                </button>
            </div>
        </div>)
    }
    showotherreports() {
        const gfk = new GFK();
        const reports = gfk.getfieldreports.call(this)

        const fieldreports = [];
        const projectid = this.props.match.params.projectid;
        if (reports.hasOwnProperty("length")) {
            // eslint-disable-next-line
            reports.map(report => {
                if (report.projectid === projectid && report.reportid !== this.state.activefieldid) {
                    fieldreports.push(this.showreportid(report))
                }
            })
        }
        return fieldreports;
    }
    getcontent() {
        const gfk = new GFK();
        if (this.state.activefieldid) {
            const report = gfk.getfieldreportbyid.call(this, this.state.activefieldid);

            return (report.content)
        } else {
            return (this.state.content)
        }
    }
    handlecontent(content) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activefieldid) {
                const i = gfk.getfieldkeybyid.call(this, this.state.activefieldid);
                myuser.fieldreports.fieldreport[i].content = content;
                this.setState({ render: 'render' })
            } else {
                let fieldid = makeID(6);
                let datereport = makeDatefromObj(this.state.datereport);
                let engineerid = myuser.engineerid;
                const projectid = this.props.match.params.projectid;
                let fieldreport = fieldReport(fieldid, projectid, datereport, content, engineerid);

                let fieldreports = gfk.getfieldreports.call(this);
                if (fieldreports) {
                    myuser.fieldreports.fieldreport.push(fieldreport)
                } else {
                    myuser.fieldreports = { fieldreport: [fieldreport] }
                }
                this.props.reduxUser(myuser);
                this.setState({ activefieldid: fieldid })

            }
        }
    }
    maketestactive(testid) {
        if (this.state.activetestid === testid) {
            this.setState({ activetestid: false })
        } else {
            this.setState({ activetestid: testid })
        }
    }
    showtest(test) {
        console.log(test)
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const styles = MyStylesheet();
        const removeIcon = gfk.getremoveicon.call(this)

        const activebackground = () => {
            if (this.state.activetestid === test.testid) {
                return (styles.activefieldreport)
            } else {
                return;
            }
        }
        return (
            <div style={{ ...regularFont, ...styles.generalFont, ...styles.generalFlex }}>
                <div style={{ ...styles.flex5, ...activebackground() }} onClick={() => { this.maketestactive(test.testid) }}>
                    {test.testnum} {test.elevation} {test.location} {test.wetpcf} {test.moistpcf} {test.dryden} {test.moistpcf} {test.maxden} {test.relative} {test.curvenumber}
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }}> {removeIconSmall()}</button>
                </div>
            </div>
        )

    }
    showcompactiontests() {
        const gfk = new GFK();
        let compactiontest = [];
        if (this.state.activefieldid) {
            let fieldid = this.state.activefieldid;
            const compactiontests = gfk.getcompactiontestsbyfieldid.call(this, fieldid);

            if (compactiontests.hasOwnProperty("length")) {
                // eslint-disable-next-line
                compactiontests.map(test => {
                    compactiontest.push(this.showtest(test))
                })
            }
        }
        return compactiontest;
    }

    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this);
        const smallFont = gfk.getSmallFont.call(this);
        const regularFont = gfk.getRegularFont.call(this);

        const projecttitle = () => {
            const myproject = gfk.getprojectbyid.call(this, this.props.match.params.projectid)
            return (<div style={{ ...styles.generalContainer, ...headerFont }}>{myproject.projectnumber}/{myproject.title} <br />
                {myproject.address} {myproject.city}</div>)
        }
        const datereport = new DateReport();
        const projectid = new ProjectID();
        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.alignCenter }}>
                            Field Reports
                            {projecttitle()}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter, ...styles.generalFont }}>
                            {datereport.showdatein.call(this)}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont }}>
                            {projectid.showprojectid.call(this)}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}>Report Content</span> <textarea style={{ ...smallFont, ...styles.generalField, ...styles.generalFont }}
                                value={this.getcontent()}
                                onChange={event => { this.handlecontent(event.target.value) }}> </textarea>
                        </div>
                    </div>

                    {this.compactiontestinput()}
                    {this.showcompactiontests()}
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont }}>
                            Field Reports by Project
                        </div>
                    </div>
                    {this.showotherreports()}
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
export default connect(mapStateToProps, actions)(FieldReports);
