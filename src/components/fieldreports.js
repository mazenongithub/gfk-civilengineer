import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import DateReport from './datereport';
import CurveID from './curveid';
import { removeIconSmall, saveReport, uploadImage } from './svg';
import { fieldReport, makeID, makeDatefromObj, makeUTCStringCurrentTime, compactionTest, milestoneformatdatestring, inputUTCStringForLaborID, sorttimesdesc, CreateImage } from './functions';
import { SaveFieldReport, UploadFieldImage } from './actions/api'
class FieldReports extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, datereport: new Date(), activefieldid: false, calender: 'open', projectnumber: '', projectid: '', content: '', activetestid: false, testnum: '', elevation: '', location: '', wetpcf: 0, moistpcf: 0, curveid: '', message: '', activeimageid: '', image: '', caption: '' }
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
                    let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)
                    console.log(newTest)
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
    compactiontestinput() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const smallFont = gfk.getSmallFont.call(this);
        const projectid = this.props.match.params.projectid;
        const headerFont = gfk.getHeaderFont.call(this)
        const curveid = new CurveID();
        if (this.state.activefieldid) {
            if (this.state.width > 1200) {

                return (
                    <div style={{ ...styles.generalFlex, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont }}>Compaction Tests by Report</div>
                            </div>

                            <div style={{ ...styles.generalFlex, ...styles.generalFont }}>
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
                            </div>
                        </div>
                    </div>)
            } else {

                return (
                    <div style={{ ...styles.generalFlex, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont }}>Compaction Tests by Report</div>
                            </div>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
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


                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
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
            this.setState({ activefieldid: false, testnum: '', elevation: '', location: '', wetpcf: 0, moistpcf: 0, curveid: '', message: '', image: '', caption: '', activetestid: false, activeimageid: false })
        } else {
            this.setState({ activefieldid: fieldid, testnum: '', elevation: '', location: '', wetpcf: 0, moistpcf: 0, curveid: '', message: '', image: '', caption: '', activetestid: false, activeimageid: false })
        }
    }
    removefieldreport(fieldid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const report = gfk.getfieldreportbyid.call(this, fieldid);
            if (window.confirm(`Are you sure you want to delete report ${milestoneformatdatestring(report.datereport)}`)) {
                const i = gfk.getfieldkeybyid.call(this, fieldid);
                myuser.fieldreports.fieldreport.splice(i, 1);
                if (myuser.fieldreports.fieldreport.length === 0) {
                    delete myuser.fieldreports.fieldreport;
                    delete myuser.fieldreports;
                }
                this.props.reduxUser(myuser);
                this.setState({ activefieldid: false })
            }

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
        return (<div style={{ ...styles.generalFlex, ...regularFont, ...styles.generalFont, ...styles.bottomMargin15, ...activebackground() }} key={report.fieldid}>
            <div style={{ ...styles.flex5 }} onClick={() => { this.makereportactive(report.fieldid) }}>
                {milestoneformatdatestring(report.datereport)}
            </div>
            <div style={{ ...styles.flex1 }}>
                <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removefieldreport(report.fieldid) }}>
                    {removeIconSmall()}
                </button>
            </div>
        </div>)
    }
    showotherreports() {
        const gfk = new GFK();
        const reports = gfk.getfieldreports.call(this)
        if (reports.length > 0) {
            reports.sort((a, b) => {

                return sorttimesdesc(a.datereport, b.datereport)
            })
        }
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

                const projectid = this.props.match.params.projectid;
                let fieldreport = fieldReport(fieldid, projectid, datereport, content);

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
    removetest(testid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const test = gfk.getcompactiontestbyid.call(this, testid)
            if (window.confirm(`Are you sure you want to delete test number ${test.testnum}?`)) {
                const i = gfk.getcompactiontestkeybyid.call(this, testid)
                myuser.compactiontests.compactiontest.splice(i, 1);
                if (myuser.compactiontests.compactiontest.length === 0) {
                    delete myuser.compactiontests.compactiontest;
                    delete myuser.compactiontests;
                }
                this.props.reduxUser(myuser);
                this.setState({ activetestid: false })

            }


        }
    }
    showtest(test) {

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
            <div style={{ ...regularFont, ...styles.generalFont, ...styles.generalFlex, ...styles.bottomMargin15 }} key={test.testid}>
                <div style={{ ...styles.flex5, ...activebackground() }} onClick={() => { this.maketestactive(test.testid) }}>
                    {test.testnum} {test.elevation} {test.location} {test.wetpcf} {test.moistpcf} {test.dryden} {test.moistpcf} {test.moist} {test.maxden} {test.relative} {test.curvenumber}
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removetest(test.testid) }}> {removeIconSmall()}</button>
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
    handleactiveids(response) {
        let message = "";
        if (response.hasOwnProperty("message")) {
            message = `${response.message} last updated ${inputUTCStringForLaborID(response.lastsaved)}`
        }

        if (this.state.activefieldid) {
            if (response.hasOwnProperty("reports")) {
                // eslint-disable-next-line
                response.reports.fieldreport.map(report => {
                    if (report.oldfieldid === this.state.activefieldid) {
                        let fieldid = report.fieldid;
                        this.setState({ activefieldid: fieldid })
                    }
                })
            }



            if (this.state.activetestid) {
                if (response.hasOwnProperty("compactiontests")) {
                    // eslint-disable-next-line
                    response.compactiontests.compactiontest.map(test => {
                        if (test.oldtestid === this.state.activetestid) {
                            this.setState({ activetestid: test.testid })
                        }
                    })
                }
            }

            if (this.state.activeimageid) {
                if (response.hasOwnProperty("images")) {
                    // eslint-disable-next-line
                    response.images.image.map(image => {
                        if (image.oldimageid === this.state.activeimageid) {
                            this.setState({ activeimageid: image.imageid })
                        }
                    })
                }
            }
            if (response.hasOwnProperty("message")) {
                this.setState({ message })
            }


        } else {
            if (response.hasOwnProperty("message")) {
                this.setState({ message })
            }
        }



    }
    async savereport() {

        const gfk = new GFK();
        let myuser = gfk.getuser.call(this);
        const projectid = this.props.match.params.projectid;
        let params = {};
        const fieldreports = gfk.getfieldreportbyprojectid.call(this, this.props.match.params.projectid);

        if (fieldreports.length > 0) {
            params.fieldreports = {};
            params.fieldreports.fieldreport = [];
            // eslint-disable-next-line
            fieldreports.map((report, i) => {
                params.fieldreports.fieldreport.push(report)
                let fieldimages = gfk.getfieldimagesbyid.call(this, report.fieldid);
                if (fieldimages) {
                    let images = { image: fieldimages }
                    params.fieldreports.fieldreport[i].images = images;
                }

                let mycompactiontests = gfk.getcompactiontestsbyfieldid.call(this, report.fieldid)

                if (mycompactiontests) {
                    let compactiontests = { compactiontest: mycompactiontests }
                    params.fieldreports.fieldreport[i].compactiontests = compactiontests;
                }

                let images = gfk.getfieldimagesbyid.call(this, report.fieldid)
                if (images) {

                    let myimages = { image: images }
                    params.fieldreports.fieldreport[i].images = myimages;
                }
            })

        }

        let values = { engineerid: myuser.engineerid, projectid, fieldreports: params.fieldreports }

        console.log(values)
        let response = await SaveFieldReport(values);
        console.log(response)
        if (response.hasOwnProperty("reports")) {

            // eslint-disable-next-line
            response.reports.fieldreport.map(fieldreport => {

                let oldfieldid = fieldreport.oldfieldid;
                let fieldid = fieldreport.fieldid;
                // eslint-disable-next-line
                const i = gfk.getfieldkeybyid.call(this, oldfieldid)
                myuser.fieldreports.fieldreport[i].fieldid = fieldid;

            })

        }

        if (response.hasOwnProperty("compactiontests")) {
            // eslint-disable-next-line
            response.compactiontests.compactiontest.map(test => {
                //console.log(test.oldtestid, test.testid)
                if (myuser.hasOwnProperty("compactiontests")) {
                    // eslint-disable-next-line
                    myuser.compactiontests.compactiontest.map((mytest, i) => {
                        if (mytest.testid === test.oldtestid) {
                            myuser.compactiontests.compactiontest[i].testid = test.testid;

                        }
                    })
                }

            })

        }
        if (response.hasOwnProperty("images")) {
            // eslint-disable-next-line
            response.images.image.map(image => {
                let oldimageid = image.oldimageid;
                let imageid = image.imageid;
                let n = gfk.getimagekeybyid.call(this, oldimageid);
                myuser.images.image[n].imageid = imageid;
            })
        }

        if (response.hasOwnProperty("fieldreports")) {
            // eslint-disable-next-line
            response.fieldreports.fieldreport.map(report => {
                let newreport = fieldReport(report.fieldid, projectid, report.datereport, report.content)
                let k = gfk.getfieldkeybyid.call(this, report.fieldid);
                myuser.fieldreports.fieldreport[k] = newreport;

                if (report.hasOwnProperty("compactiontests")) {
                    // eslint-disable-next-line
                    report.compactiontests.compactiontest.map(test => {
                        let newtest = compactionTest(test.testid, test.timetest, test.testnum, test.elevation, test.location, test.wetpcf, test.moistpcf, test.curveid, test.fieldid, test.letterid)
                        let l = gfk.getcompactiontestkeybyid.call(this, test.testid)
                        myuser.compactiontests.compactiontest[l] = newtest;
                    })

                }
                if (report.hasOwnProperty("images")) {
                    // eslint-disable-next-line
                    report.images.image.map(image => {
                        let newImage = CreateImage(image.imageid, image.image, image.caption, report.fieldid);
                        let m = gfk.getimagekeybyid.call(this, image.imageid)
                        myuser.images.image[m] = newImage;
                    })
                }

            })
        }

        this.props.reduxUser(myuser)
        this.handleactiveids(response)

    }
    makeimageactive(imageid) {
        if (this.state.activeimageid === imageid) {
            this.setState({ activeimageid: false })
        } else {
            this.setState({ activeimageid: imageid })
        }
    }
    handlecaption(caption) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activefieldid) {

                if (this.state.activeimageid) {
                    const i = gfk.getimagekeybyid.call(this, this.state.activeimageid);
                    myuser.images.image[i].caption = caption;
                    this.props.reduxUser(myuser);
                    this.setState({ render: 'render' })

                } else {
                    let imageid = makeID(16);
                    let image = this.state.image;
                    let fieldid = this.state.activefieldid;
                    let newImage = CreateImage(imageid, image, caption, fieldid)
                    const images = gfk.getimages.call(this);
                    if (images) {
                        myuser.images.image.push(newImage)
                    } else {
                        const myimage = { image: [newImage] }
                        myuser.images = myimage;

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activeimageid: imageid })
                }
            }
        }
    }
    getcaption() {
        const gfk = new GFK();
        if (this.state.activeimageid) {
            const activeimage = gfk.getimagebyid.call(this, this.state.activeimageid)
            return activeimage.caption;

        } else {
            return (this.state.caption);
        }
    }
    async uploadimage() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (this.state.activefieldid) {
            let fieldid = this.state.activefieldid;

            if (myuser) {
                let myfile = document.getElementById("field-image");
                let formdata = new FormData();
                formdata.append("profilephoto", myfile.files[0]);
                try {
                    let imageid = makeID(16)
                    if (this.state.activeimageid) {
                        imageid = this.state.activeimageid;

                    }
                    let response = await UploadFieldImage(formdata, imageid);
                    if (response.hasOwnProperty("image")) {
                        if (this.state.activeimageid) {
                            const i = gfk.getimagekeybyid.call(this, this.state.activeimageid);
                            myuser.images.image[i].image = response.image;
                            this.props.reduxUser(myuser)
                            this.setState({ render: 'render' })
                        } else {
                            let imageid = makeID(16);
                            let image = response.image;
                            let caption = this.state.caption;
                            let newImage = CreateImage(imageid, image, caption, fieldid)
                            const images = gfk.getimages.call(this)
                            if (images) {
                                myuser.images.image.push(newImage)
                            } else {
                                myuser.images = { image: [newImage] }
                            }
                            this.props.reduxUser(myuser)
                            this.setState({ activeimageid: imageid })
                        }
                    }
                } catch (err) {
                    alert(err)
                }
            }
        }
    }
    showimageuploader() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const uploadbutton = gfk.getuploadbutton.call(this)
        const regularFont = gfk.getRegularFont.call(this);
        const thumbphoto = gfk.getthumbimage.call(this)
        const imagecontainer = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>
                        Add Field Image
                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <input type="file" id="field-image" style={{ ...styles.generalField }} />
                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <button style={{ ...styles.generalButton, ...uploadbutton }} onClick={() => { this.uploadimage() }}>{uploadImage()}</button>

                    </div>
                </div>)

            } else {
                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1 }}>
                                    Add Field Image
                                </div>
                            </div>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1 }}>
                                    <input type="file" id="field-image" style={{ ...styles.generalField }} />
                                </div>
                                <div style={{ ...styles.flex1 }}>
                                    <button style={{ ...styles.generalButton, ...uploadbutton }} onClick={() => { this.uploadimage() }}>{uploadImage()}</button>
                                </div>
                            </div>
                        </div>
                    </div>)

            }
        }
        const activebackground = (imageid) => {
            if (this.state.activeimageid === imageid) {
                return (styles.activefieldreport)
            } else {
                return;
            }
        }
        const showimage = (image) => {
            return (<div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>
                    <div style={{ ...styles.generalContainer, ...styles.marginAuto, ...thumbphoto, ...styles.showBorder }} onClick={() => { this.makeimageactive(image.imageid) }}>
                        <img src={image.image} alt={image.caption} style={{ ...thumbphoto }} />
                    </div>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <div style={{ ...styles.generalContainer, ...activebackground(image.imageid) }}>
                        {image.image}
                    </div>
                    <div style={{ ...styles.generalContainer, ...activebackground(image.imageid) }}>
                        {image.caption}
                    </div>
                </div>
            </div>)

        }
        const imageids = () => {
            let myimages = [];
            if (this.state.activefieldid) {
                let images = gfk.getfieldimagesbyid.call(this, this.state.activefieldid)
                if (images.hasOwnProperty("length")) {
                    // eslint-disable-next-line
                    images.map(image => {
                        myimages.push(showimage(image))
                    })


                }
            }
            return myimages;
        }
        if (this.state.activefieldid) {
            return (
                <div style={{ ...styles.generalFlex, ...styles.generalFont, ...regularFont }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.generalFont, ...regularFont, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1 }}>
                                {imagecontainer()}
                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.generalFont, ...regularFont }}>
                            <div style={{ ...styles.flex1 }}>
                                Caption <br />
                                <textarea style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                                    value={this.getcaption()}
                                    onChange={event => { this.handlecaption(event.target.value) }}></textarea>

                            </div>
                        </div>

                        {imageids()}

                    </div>
                </div>
            )
        } else {
            return;
        }
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
        const saveReportIcon = gfk.getreporticon.call(this)
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
                    {this.showimageuploader()}

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont }}>
                            {this.state.message}
                        </div>
                    </div>
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <button style={{ ...styles.generalButton, ...saveReportIcon }} onClick={() => { this.savereport() }}>{saveReport()}</button>
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
