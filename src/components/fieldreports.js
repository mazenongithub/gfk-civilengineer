import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import DateReport from './datereport';
import CurveID from './curveid';
import { removeIconSmall, saveReport, uploadImage, goToIcon } from './svg';
import { fieldReport, makeDatefromObj, makeUTCStringCurrentTime, compactionTest, milestoneformatdatestring, inputUTCStringForLaborID, sorttimesdesc, CreateImage } from './functions';
import { SaveFieldReport, UploadFieldImage } from './actions/api'
import { Link } from 'react-router-dom';
import MakeID from './makeids';

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

    getFieldReport() {
        const gfk = new GFK();
        const fieldid = this.state.activefieldid
        const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
        return fieldreport;

    }
    gettestnum() {
        const gfk = new GFK();
        let testnum = "";
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            if (fieldreport) {

                if (this.state.activetestid) {

                    const testid = this.state.activetestid;
                    const test = gfk.getcompactiontestbyid.call(this, fieldid, testid)

                    testnum = (test.testnum);
                } else {
                    testnum = this.state.testnum;
                }

            }

        }
        return testnum;


    }

    handletestnum(testnum) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        const makeid = new MakeID()
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    if (this.state.activetestid) {
                        const testid = this.state.activetestid;
                        const j = gfk.getcompactiontestkeybyid.call(this, fieldid, testid)
                        myuser.fieldreports[i].compactiontests[j].testnum = testnum;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    } else {

                        let testid = makeid.compactionTest.call(this)
                        let timetest = makeUTCStringCurrentTime();
                        let elevation = this.state.elevation;
                        let location = this.state.location;
                        let wetpcf = this.state.wetpcf;
                        let moistpcf = this.state.moistpcf;
                        let curveid = this.state.curveid;
                        let letterid = "";
                        let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)


                        if (fieldreport.hasOwnProperty("compactiontests")) {

                            myuser.fieldreports[i].compactiontests.push(newTest);

                        } else {

                            myuser.fieldreports[i].compactiontests = [newTest];
                        }

                        this.props.reduxUser(myuser)
                        this.setState({ activetestid: testid })


                    }

                }

            }
        }

    }
    getelevation() {
        const gfk = new GFK();
        let elevation = "";
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            if (fieldreport) {

                if (this.state.activetestid) {

                    const testid = this.state.activetestid;
                    const test = gfk.getcompactiontestbyid.call(this, fieldid, testid)

                    elevation = (test.elevation);
                } else {
                    elevation = this.state.elevation;
                }

            }

        }
        return elevation;


    }

    handleelevation(elevation) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        const makeid = new MakeID()
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    if (this.state.activetestid) {
                        const testid = this.state.activetestid;
                        const j = gfk.getcompactiontestkeybyid.call(this, fieldid, testid)
                        myuser.fieldreports[i].compactiontests[j].elevation = elevation;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    } else {

                        let testid = makeid.compactionTest.call(this)
                        let timetest = makeUTCStringCurrentTime();
                        let location = this.state.location;
                        let testnum = this.state.testnum
                        let wetpcf = this.state.wetpcf;
                        let moistpcf = this.state.moistpcf;
                        let curveid = this.state.curveid;
                        let letterid = "";
                        let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)


                        if (fieldreport.hasOwnProperty("compactiontests")) {

                            myuser.fieldreports[i].compactiontests.push(newTest);

                        } else {

                            myuser.fieldreports[i].compactiontests = [newTest];
                        }

                        this.props.reduxUser(myuser)
                        this.setState({ activetestid: testid })


                    }

                }

            }
        }

    }




    getlocation() {
        const gfk = new GFK();
        let location = "";
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            if (fieldreport) {

                if (this.state.activetestid) {

                    const testid = this.state.activetestid;
                    const test = gfk.getcompactiontestbyid.call(this, fieldid, testid)

                    location = (test.location);
                } else {
                    location = this.state.location;
                }

            }

        }
        return location;


    }

    handlelocation(location) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        const makeid = new MakeID()
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    if (this.state.activetestid) {
                        const testid = this.state.activetestid;
                        const j = gfk.getcompactiontestkeybyid.call(this, fieldid, testid)
                        myuser.fieldreports[i].compactiontests[j].location = location;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    } else {

                        let testid = makeid.compactionTest.call(this)
                        let timetest = makeUTCStringCurrentTime();
                        let elevation = this.state.elevation;
                        let testnum = this.state.testnum
                        let wetpcf = this.state.wetpcf;
                        let moistpcf = this.state.moistpcf;
                        let curveid = this.state.curveid;
                        let letterid = "";
                        let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)


                        if (fieldreport.hasOwnProperty("compactiontests")) {

                            myuser.fieldreports[i].compactiontests.push(newTest);

                        } else {

                            myuser.fieldreports[i].compactiontests = [newTest];
                        }

                        this.props.reduxUser(myuser)
                        this.setState({ activetestid: testid })


                    }

                }

            }
        }

    }

    getwetpcf() {

        const gfk = new GFK();
        let wetpcf = "";
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            if (fieldreport) {

                if (this.state.activetestid) {

                    const testid = this.state.activetestid;
                    const test = gfk.getcompactiontestbyid.call(this, fieldid, testid)

                    wetpcf = (test.wetpcf);
                } else {
                    wetpcf = this.state.wetpcf;
                }

            }

        }
        return wetpcf;


    }

    handlewetpcf(wetpcf) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        const makeid = new MakeID()
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    if (this.state.activetestid) {
                        const testid = this.state.activetestid;
                        const j = gfk.getcompactiontestkeybyid.call(this, fieldid, testid)
                        myuser.fieldreports[i].compactiontests[j].wetpcf = wetpcf;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    } else {

                        let testid = makeid.compactionTest.call(this)
                        let timetest = makeUTCStringCurrentTime();
                        let location = this.state.location;
                        let testnum = this.state.testnum
                        let elevation = this.state.elevation;
                        let moistpcf = this.state.moistpcf;
                        let curveid = this.state.curveid;
                        let letterid = "";
                        let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)


                        if (fieldreport.hasOwnProperty("compactiontests")) {

                            myuser.fieldreports[i].compactiontests.push(newTest);

                        } else {

                            myuser.fieldreports[i].compactiontests = [newTest];
                        }

                        this.props.reduxUser(myuser)
                        this.setState({ activetestid: testid })


                    }

                }

            }
        }

    }

    getmoistpcf() {
        const gfk = new GFK();
        let moistpcf = "";
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            if (fieldreport) {

                if (this.state.activetestid) {

                    const testid = this.state.activetestid;
                    const test = gfk.getcompactiontestbyid.call(this, fieldid, testid)

                    moistpcf = (test.moistpcf);
                } else {
                    moistpcf = this.state.moistpcf;
                }

            }

        }
        return moistpcf;


    }


    handlemoistpcf(moistpcf) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        const makeid = new MakeID()
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    if (this.state.activetestid) {
                        const testid = this.state.activetestid;
                        const j = gfk.getcompactiontestkeybyid.call(this, fieldid, testid)
                        myuser.fieldreports[i].compactiontests[j].moistpcf = moistpcf;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    } else {

                        let testid = makeid.compactionTest.call(this)
                        let timetest = makeUTCStringCurrentTime();
                        let location = this.state.location;
                        let testnum = this.state.testnum
                        let elevation = this.state.elevation;
                        let wetpcf = this.state.wetpcf;
                        let curveid = this.state.curveid;
                        let letterid = "";
                        let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)


                        if (fieldreport.hasOwnProperty("compactiontests")) {

                            myuser.fieldreports[i].compactiontests.push(newTest);

                        } else {

                            myuser.fieldreports[i].compactiontests = [newTest];
                        }

                        this.props.reduxUser(myuser)
                        this.setState({ activetestid: testid })


                    }

                }

            }
        }
    }



    getcurveid() {
        const gfk = new GFK();
        let curveid = "";
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

            if (fieldreport) {

                if (this.state.activetestid) {

                    const testid = this.state.activetestid;
                    const test = gfk.getcompactiontestbyid.call(this, fieldid, testid)

                    curveid = (test.curveid);
                } else {
                    curveid = this.state.curveid;
                }

            }

        }
        return curveid;


    }


    handlecurveid(curveid) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        const makeid = new MakeID()
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    if (this.state.activetestid) {
                        const testid = this.state.activetestid;
                        const j = gfk.getcompactiontestkeybyid.call(this, fieldid, testid)
                        myuser.fieldreports[i].compactiontests[j].curveid = curveid;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    } else {

                        let testid = makeid.compactionTest.call(this)
                        let timetest = makeUTCStringCurrentTime();
                        let location = this.state.location;
                        let testnum = this.state.testnum
                        let elevation = this.state.elevation;
                        let wetpcf = this.state.wetpcf;
                        let moistpcf = this.state.moistpcf;
                        let letterid = "";
                        let newTest = compactionTest(testid, timetest, testnum, elevation, location, wetpcf, moistpcf, curveid, fieldid, letterid)


                        if (fieldreport.hasOwnProperty("compactiontests")) {

                            myuser.fieldreports[i].compactiontests.push(newTest);

                        } else {

                            myuser.fieldreports[i].compactiontests = [newTest];
                        }

                        this.props.reduxUser(myuser)
                        this.setState({ activetestid: testid })


                    }

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
        const headerFont = gfk.getHeaderFont.call(this)
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;
        const goIconWidth = gfk.getgotoicon.call(this)
        const activebackground = () => {
            if (this.state.activefieldid === report.fieldid) {
                return (styles.activefieldreport)
            } else {
                return;
            }
        }
        return (
            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, }}>
                <div style={{ ...styles.generalFlex, ...regularFont, ...styles.generalFont, ...activebackground() }} key={report.fieldid}>
                    <div style={{ ...styles.flex5 }} onClick={() => { this.makereportactive(report.fieldid) }}>
                        {milestoneformatdatestring(report.datereport)}
                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removefieldreport(report.fieldid) }}>
                            {removeIconSmall()}
                        </button>
                    </div>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                        to={`/${engineerid}/projects/${projectid}/fieldreports/${report.fieldid}`}>
                        <button style={{ ...styles.generalButton, ...goIconWidth }}>
                            {goToIcon()}
                        </button>
                        <span style={{ ...styles.generalFont, ...regularFont }}>View Report</span>
                    </Link>
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
        const makeid = new MakeID();
        if (myuser) {
            if (this.state.activefieldid) {
                const i = gfk.getfieldkeybyid.call(this, this.state.activefieldid);
                myuser.fieldreports[i].content = content;
                this.setState({ render: 'render' })
            } else {
                let fieldid = makeid.fieldID.call(this)
                let datereport = makeDatefromObj(this.state.datereport);
                let engineerid = myuser.engineerid;
                const projectid = this.props.match.params.projectid;
                let fieldreport = fieldReport(fieldid, projectid, datereport, content, engineerid);

                let fieldreports = gfk.getfieldreports.call(this);
                if (fieldreports) {
                    myuser.fieldreports.push(fieldreport)
                } else {
                    myuser.fieldreports = [fieldreport]
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
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    const test = gfk.getcompactiontestbyid.call(this, fieldid, testid)
                    if (test) {
                        if (window.confirm(`Are you sure you want to delete test number ${test.testnum}?`)) {


                            const j = gfk.getcompactiontestkeybyid.call(this, fieldid, testid)

                            myuser.fieldreports[i].compactiontests.splice(j, 1);
                            if (myuser.fieldreports[i].compactiontests.length === 0) {
                                delete myuser.fieldreports[i].compactiontests

                            }
                            this.props.reduxUser(myuser);
                            this.setState({ activetestid: false })

                        }

                    }

                }

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
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
            if (fieldreport) {

                if (fieldreport.hasOwnProperty("compactiontests")) {

                    // eslint-disable-next-line
                    fieldreport.compactiontests.map(test => {
                        compactiontest.push(this.showtest(test))
                    })


                }
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
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
            if (fieldreport) {

                try {
                    console.log(fieldreport)
                    let response = await SaveFieldReport(fieldreport);
                    console.log(response)
                    if (response.hasOwnProperty("fieldreportdb")) {
                        const i = gfk.getfieldkeybyid.call(this, fieldid)
                        myuser.fieldreports[i] = response.fieldreportdb
                    }
                    this.props.reduxUser(myuser)
                    let message = "";
                    if (response.hasOwnProperty("message")) {
                        message = response.message;
                    }
                    this.setState({ message: message })

                } catch (err) {
                    alert(err)
                }

            }

        }


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
        const makeid = new MakeID();
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)

                    const images = gfk.getimagesbyfieldid.call(this, fieldid);


                    if (this.state.activeimageid) {
                        const imageid = this.state.activeimageid;
                        const j = gfk.getimagekeybyid.call(this, fieldid, imageid)

                        myuser.fieldreports[i].images[j].caption = caption;
                        this.props.reduxUser(myuser);
                        this.setState({ render: 'render' })

                    } else {

                        let imageid = makeid.imageID.call(this)
                        let image = this.state.image;
                        let newImage = CreateImage(imageid, image, caption)

                        if (images) {

                            myuser.fieldreports[i].images.push(newImage)
                        } else {

                            myuser.fieldreports[i].images = [newImage];

                        }
                        this.props.reduxUser(myuser)
                        this.setState({ activeimageid: imageid })

                    }
                }
            }
        }

    }

    getcaption() {
        const gfk = new GFK();
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
            if (fieldreport) {

                if (this.state.activeimageid) {
                    const imageid = this.state.activeimageid;
                    const activeimage = gfk.getimagebyid.call(this, fieldid, imageid)
                    return activeimage.caption;

                } else {
                    return (this.state.caption);
                }

            }

        }
    }

    removeimage(imageid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activefieldid) {
                const fieldid = this.state.activefieldid;
                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    const image = gfk.getimagebyid.call(this, fieldid, imageid)
                    if (image) {
                        if (window.confirm(`Are you sure you want to delete image  ${image.image}?`)) {


                            const j = gfk.getimagesbyfieldid.call(this, fieldid, imageid)

                            myuser.fieldreports[i].images.splice(j, 1);
                            if (myuser.fieldreports[i].images.length === 0) {
                                delete myuser.fieldreports[i].images

                            }
                            this.props.reduxUser(myuser);
                            this.setState({ activeimageid: false })

                        }

                    }

                }

            }


        }
    }

    async uploadimage() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activefieldid) {
                let fieldid = this.state.activefieldid;

                const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
                if (fieldreport) {
                    const i = gfk.getfieldkeybyid.call(this, fieldid)
                    if (this.state.activeimageid) {
                        const imageid = this.state.activeimageid;
                        const image = gfk.getimagebyid.call(this, fieldid, imageid)
                        if (image) {
                            const j = gfk.getimagekeybyid.call(this,fieldid,imageid)
                            
                            image.fieldid = fieldid;
                            console.log(image)
                            let formdata = new FormData();
                            let myfile = document.getElementById("field-image");
                            formdata.append("fieldimage", myfile.files[0]);
                            formdata.append("image",  JSON.stringify(image))
                            try {
                      
                                let response = await UploadFieldImage(formdata);
                                console.log(response)
                                                 
                                 if (response.hasOwnProperty("imagedb")) {
                              
                                        myuser.fieldreports[i].images[j] = response.imagedb;
                                        this.props.reduxUser(myuser)
                                        this.setState({ render: 'render' })
                                   
                                 }
                                 let message = "";
                                 if(response.hasOwnProperty("message")) {
                                     message = response.message;
                                 }

                                 this.setState({message})
                            } catch (err) {
                                alert(err)
                            }

                        }

                    }
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
        const removeIcon = gfk.getremoveicon.call(this)
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
            return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }} onClick={() => { this.makeimageactive(image.imageid) }}>
                <div style={{ ...styles.flex1 }}>
                    <div style={{ ...styles.generalContainer, ...styles.marginAuto, ...thumbphoto, ...styles.showBorder }}

                    >
                        <img src={image.image} alt={image.caption} style={{ ...thumbphoto }} />
                    </div>
                </div>
                <div style={{ ...styles.flex3 }}>
                    <div style={{ ...styles.generalContainer, ...activebackground(image.imageid) }}>
                        {image.image}
                    </div>
                    <div style={{ ...styles.generalContainer, ...activebackground(image.imageid) }}>
                        {image.caption}
                    </div>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removeimage(image.imageid) }}>
                        {removeIconSmall()}
                    </button>

                </div>
            </div>)

        }
        const imageids = () => {
            let myimages = [];
            if (this.state.activefieldid) {
                let images = gfk.getimagesbyfieldid.call(this, this.state.activefieldid)
                if (images) {
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
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;


        const myproject = gfk.getprojectbyid.call(this, this.props.match.params.projectid)

        const datereport = new DateReport();
        const saveReportIcon = gfk.getreporticon.call(this)
        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}`}>
                            /{engineerid}
                        </Link>
                    </div>
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects`}>
                            /projects
                        </Link>
                    </div>
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}`}>
                            /{myproject.projectnumber} - {myproject.title} {myproject.address} {myproject.city}
                        </Link>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/fieldreports`}>
                            /fieldreports
                        </Link>
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
