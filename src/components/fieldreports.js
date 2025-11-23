import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import DateReport from './datereport';
import CurveID from './curveid';
import { removeIconSmall, saveReport, uploadImage, goToIcon } from './svg';
import { fieldReport, makeDatefromObj, makeUTCStringCurrentTime, compactionTest, milestoneformatdatestring, inputUTCStringForLaborID, sorttimesdesc, CreateImage } from './functions';
import { SaveFieldReports, UploadFieldImage } from './actions/api'
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
            const { projectid } = this.props.match.params;
            const myproject = gfk.getProjectById.call(this, projectid);
            return (`ProjectID ${myproject.projectid} #${myproject.projectnumber} ${myproject.address} ${myproject.city}`)
        } else {
            return;
        }

    }

    getFieldReport() {
        const gfk = new GFK();
        const fieldid = this.state.activefieldid
        const { projectid } = this.props.match.params;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid)
        return fieldreport;

    }
    gettestnum() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        // No active field → no testnum
        if (!this.state.activefieldid) return "";

        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, this.state.activefieldid);
        if (!fieldreport) return "";

        // If a test is active, return its testnum
        if (this.state.activetestid) {
            const test = gfk.getcompactiontestbyid.call(
                this,
                projectid,
                this.state.activefieldid,
                this.state.activetestid
            );
            return test?.testnum || "";
        }

        // Otherwise return locally stored testnum
        return this.state.testnum || "";
    }


    handletestnum(testnum) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);

        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Must have an active field
        if (!this.state.activefieldid) return;

        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);

        // If a test is active → update it
        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const k = gfk.getcompactiontestkeybyid.call(this, projectid, fieldid, testid);

            projects[i].fieldreports[j].compactiontests[k].testnum = testnum;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // Otherwise → create a new test
        const newTestId = makeid.compactionTest.call(this);

        const newTest = compactionTest(
            newTestId,
            makeUTCStringCurrentTime(),
            testnum,
            this.state.elevation,
            this.state.location,
            this.state.wetpcf,
            this.state.moistpcf,
            this.state.curveid,
            fieldid,
            "" // letterid
        );

        if (!fieldreport.compactiontests) {
            projects[i].fieldreports[j].compactiontests = [];
        }

        projects[i].fieldreports[j].compactiontests.push(newTest);

        this.props.reduxProjects(projects);
        this.setState({ activetestid: newTestId });
    }

    getelevation() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        if (!this.state.activefieldid) return "";

        const fieldreport = gfk.getfieldreportbyid.call(
            this,
            projectid,
            this.state.activefieldid
        );
        if (!fieldreport) return "";

        // If a test is active → return stored elevation
        if (this.state.activetestid) {
            const test = gfk.getcompactiontestbyid.call(
                this,
                projectid,
                this.state.activefieldid,
                this.state.activetestid
            );
            return test?.elevation || "";
        }

        // No active test → return local elevation state
        return this.state.elevation || "";
    }


    handleelevation(elevation) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);

        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        if (!this.state.activefieldid) return;

        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);

        // --- Update existing test ---
        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const k = gfk.getcompactiontestkeybyid.call(this, projectid, fieldid, testid);

            projects[i].fieldreports[j].compactiontests[k].elevation = elevation;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // --- Create new test ---
        const newTestId = makeid.compactionTest.call(this);

        const newTest = compactionTest(
            newTestId,
            makeUTCStringCurrentTime(),
            this.state.testnum,
            elevation,
            this.state.location,
            this.state.wetpcf,
            this.state.moistpcf,
            this.state.curveid,
            fieldid,
            "" // letterid
        );

        if (!fieldreport.compactiontests) {
            projects[i].fieldreports[j].compactiontests = [];
        }

        projects[i].fieldreports[j].compactiontests.push(newTest);

        this.props.reduxProjects(projects);
        this.setState({ activetestid: newTestId });
    }




    getlocation() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        // No active field → no location
        if (!this.state.activefieldid) return "";

        const fieldreport = gfk.getfieldreportbyid.call(
            this,
            projectid,
            this.state.activefieldid
        );
        if (!fieldreport) return "";

        // If a test is active, return its location
        if (this.state.activetestid) {
            const test = gfk.getcompactiontestbyid.call(
                this,
                projectid,
                this.state.activefieldid,
                this.state.activetestid
            );
            return test?.location || "";
        }

        // Otherwise return the pending local location
        return this.state.location || "";
    }

    handlelocation(location) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Must have an active field
        if (!this.state.activefieldid) return;

        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);

        // If a test is active → update location
        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const k = gfk.getcompactiontestkeybyid.call(
                this,
                projectid,
                fieldid,
                testid
            );

            projects[i].fieldreports[j].compactiontests[k].location = location;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // Otherwise create a new test
        const newTestId = makeid.compactionTest.call(this);

        const newTest = compactionTest(
            newTestId,
            makeUTCStringCurrentTime(),
            this.state.testnum,     // testnum
            this.state.elevation,   // elevation
            location,               // location (changed)
            this.state.wetpcf,
            this.state.moistpcf,
            this.state.curveid,
            fieldid,
            "" // letterid
        );

        if (!fieldreport.compactiontests) {
            projects[i].fieldreports[j].compactiontests = [];
        }

        projects[i].fieldreports[j].compactiontests.push(newTest);

        this.props.reduxProjects(projects);
        this.setState({ activetestid: newTestId });
    }


    getwetpcf() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        // No active field → no wetpcf
        if (!this.state.activefieldid) return "";

        const fieldreport = gfk.getfieldreportbyid.call(
            this,
            projectid,
            this.state.activefieldid
        );
        if (!fieldreport) return "";

        // If a test is active, return its wetpcf
        if (this.state.activetestid) {
            const test = gfk.getcompactiontestbyid.call(
                this,
                projectid,
                this.state.activefieldid,
                this.state.activetestid
            );
            return test?.wetpcf || "";
        }

        // Otherwise return pending local wetpcf
        return this.state.wetpcf || "";
    }


    handlewetpcf(wetpcf) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Must have an active field
        if (!this.state.activefieldid) return;

        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);

        // If a test is active → update wetpcf
        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const k = gfk.getcompactiontestkeybyid.call(
                this,
                projectid,
                fieldid,
                testid
            );

            projects[i].fieldreports[j].compactiontests[k].wetpcf = wetpcf;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // Otherwise create a new test
        const newTestId = makeid.compactionTest.call(this);

        const newTest = compactionTest(
            newTestId,
            makeUTCStringCurrentTime(),
            this.state.testnum,
            this.state.elevation,
            this.state.location,
            wetpcf,                 // wetpcf (changed)
            this.state.moistpcf,
            this.state.curveid,
            fieldid,
            "" // letterid
        );

        if (!fieldreport.compactiontests) {
            projects[i].fieldreports[j].compactiontests = [];
        }

        projects[i].fieldreports[j].compactiontests.push(newTest);

        this.props.reduxProjects(projects);
        this.setState({ activetestid: newTestId });
    }


    getmoistpcf() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        // No active field → no moistpcf
        if (!this.state.activefieldid) return "";

        const fieldreport = gfk.getfieldreportbyid.call(
            this,
            projectid,
            this.state.activefieldid
        );
        if (!fieldreport) return "";

        // If a test is active, return its moistpcf
        if (this.state.activetestid) {
            const test = gfk.getcompactiontestbyid.call(
                this,
                projectid,
                this.state.activefieldid,
                this.state.activetestid
            );
            return test?.moistpcf || "";
        }

        // Otherwise return the pending local moistpcf
        return this.state.moistpcf || "";
    }


    handlemoistpcf(moistpcf) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Must have an active field
        if (!this.state.activefieldid) return;

        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);

        // If a test is active → update moistpcf
        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const k = gfk.getcompactiontestkeybyid.call(
                this,
                projectid,
                fieldid,
                testid
            );

            projects[i].fieldreports[j].compactiontests[k].moistpcf = moistpcf;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // Otherwise create a new test
        const newTestId = makeid.compactionTest.call(this);

        const newTest = compactionTest(
            newTestId,
            makeUTCStringCurrentTime(),
            this.state.testnum,
            this.state.elevation,
            this.state.location,
            this.state.wetpcf,
            moistpcf,              // moistpcf (updated)
            this.state.curveid,
            fieldid,
            "" // letterid
        );

        if (!fieldreport.compactiontests) {
            projects[i].fieldreports[j].compactiontests = [];
        }

        projects[i].fieldreports[j].compactiontests.push(newTest);

        this.props.reduxProjects(projects);
        this.setState({ activetestid: newTestId });
    }



    getcurveid() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        // No active field → no curveid
        if (!this.state.activefieldid) return "";

        const fieldreport = gfk.getfieldreportbyid.call(
            this,
            projectid,
            this.state.activefieldid
        );
        if (!fieldreport) return "";

        // If a test is active → return its curveid
        if (this.state.activetestid) {
            const test = gfk.getcompactiontestbyid.call(
                this,
                projectid,
                this.state.activefieldid,
                this.state.activetestid
            );
            return test?.curveid || "";
        }

        // Otherwise return the pending local curveid
        return this.state.curveid || "";
    }



    handlecurveid(curveid) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);

        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Must have active field
        if (!this.state.activefieldid) return;

        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);

        // If a test is active → update its curveid
        if (this.state.activetestid) {
            const testid = this.state.activetestid;
            const k = gfk.getcompactiontestkeybyid.call(
                this,
                projectid,
                fieldid,
                testid
            );

            projects[i].fieldreports[j].compactiontests[k].curveid = curveid;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // Otherwise → Create a new compaction test
        const newTestId = makeid.compactionTest.call(this);

        const newTest = compactionTest(
            newTestId,
            makeUTCStringCurrentTime(),
            this.state.testnum,
            this.state.elevation,
            this.state.location,
            this.state.wetpcf,
            this.state.moistpcf,
            curveid,               // updated curveid
            fieldid,
            "" // letterid
        );

        if (!fieldreport.compactiontests) {
            projects[i].fieldreports[j].compactiontests = [];
        }

        projects[i].fieldreports[j].compactiontests.push(newTest);

        this.props.reduxProjects(projects);
        this.setState({ activetestid: newTestId });
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
        console.log(fieldid)
        const isActive = this.state.activefieldid === fieldid;

        const resetState = {
            testnum: '',
            elevation: '',
            location: '',
            wetpcf: 0,
            moistpcf: 0,
            curveid: '',
            message: '',
            image: '',
            caption: '',
            activetestid: false,
            activeimageid: false
        };

        this.setState({
            activefieldid: isActive ? false : fieldid,
            ...resetState
        });
    }

    removefieldreport(fieldid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        const report = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!report) return;

        // Confirm deletion
        if (!window.confirm(`Are you sure you want to delete report ${milestoneformatdatestring(report.datereport)}?`)) {
            return;
        }

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);

        // Remove the report
        projects[i].fieldreports.splice(j, 1);

        this.props.reduxProjects(projects);
        this.setState({ activefieldid: false });
    }

    showreportid(report) {

        const styles = MyStylesheet();
        const gfk = new GFK();
        const removeIcon = gfk.getremoveicon.call(this)
        const regularFont = gfk.getRegularFont.call(this);
        const headerFont = gfk.getHeaderFont.call(this)
        const engineerid = 'mazen'
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
        const { projectid } = this.props.match.params;

        const reports = gfk.getfieldreports.call(this, projectid) || [];
        if (!Array.isArray(reports)) return [];

        // Sort newest → oldest
        const sortedReports = [...reports].sort((a, b) =>
            sorttimesdesc(a.datereport, b.datereport)
        );

        // Map all reports to render
        return sortedReports.map(report => this.showreportid(report));
    }


    getcontent() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        if (this.state.activefieldid) {
            const report = gfk.getfieldreportbyid.call(
                this,
                projectid,
                this.state.activefieldid
            );
            return report?.content || "";
        }

        return this.state.content || "";
    }

    handlecontent(content) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        if (this.state.activefieldid) {
            // Update existing field report
            const j = gfk.getfieldkeybyid.call(this, projectid, this.state.activefieldid);
            projects[i].fieldreports[j].content = content;
            this.setState({ render: 'render' });
        } else {
            // Create new field report
            const fieldid = makeid.fieldID.call(this);
            const datereport = makeDatefromObj(this.state.datereport);
            const engineerid = 'mazen'; // fallback if not in state

            const newFieldReport = fieldReport(fieldid,  datereport, content, engineerid);

            if (!projects[i].fieldreports) {
                projects[i].fieldreports = [];
            }
            projects[i].fieldreports.push(newFieldReport);

            this.props.reduxProjects(projects);
            this.setState({ activefieldid: fieldid });
        }
    }

    maketestactive(testid) {
        this.setState(prevState => ({
            activetestid: prevState.activetestid === testid ? false : testid
        }));
    }

    removetest(testid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        if (!projects || !this.state.activefieldid) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);
        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);
        const test = gfk.getcompactiontestbyid.call(this, projectid, fieldid, testid);
        if (!test) return;

        if (!window.confirm(`Are you sure you want to delete test number ${test.testnum}?`)) return;

        const k = gfk.getcompactiontestkeybyid.call(this, projectid, fieldid, testid);

        projects[i].fieldreports[j].compactiontests.splice(k, 1);

        // Remove the compactiontests property if empty
        if (projects[i].fieldreports[j].compactiontests.length === 0) {
            delete projects[i].fieldreports[j].compactiontests;
        }

        this.props.reduxProjects(projects);
        this.setState({ activetestid: false });
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

        if (!this.state.activefieldid) return [];

        const { projectid } = this.props.match.params;
        const fieldid = this.state.activefieldid;

        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport || !Array.isArray(fieldreport.compactiontests)) return [];

        return fieldreport.compactiontests.map(test => this.showtest(test));
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
        const projectid = this.props.match.params.projectid;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const fieldreports = gfk.getfieldreports.call(this, projectid)
        if (!fieldreports) return;

        try {
            // Send fieldreports to backend
            const values = { projectid, fieldreports };
            console.log(values)
            const response = await SaveFieldReports(values);
            console.log(response)
            // Extract response properties safely
            const message = response?.message;
            const returnedFieldReportsObj = response?.fieldreports;

            if (!returnedFieldReportsObj) return;

            const returnedProjectId = returnedFieldReportsObj.projectid;
            const returnedFieldReports = returnedFieldReportsObj.fieldreports

            // Update projects in Redux
            const projects = gfk.getProjects.call(this);
            const index = gfk.getProjectKeyById.call(this, returnedProjectId);

            if (index !== false && projects[index]) {
                projects[index].fieldreports = returnedFieldReports;
                this.props.reduxProjects(projects);
                this.setState({ message });
            }


        } catch (err) {
            alert(err?.errorMessage || err?.message || String(err));
        }


    }
    makeimageactive(imageid) {
        this.setState(prevState => ({
            activeimageid: prevState.activeimageid === imageid ? false : imageid
        }));
    }

    handlecaption(caption) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projects = gfk.getProjects.call(this);
        if (!projects || !this.state.activefieldid) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);
        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);
        const images = gfk.getimagesbyfieldid.call(this, projectid, fieldid) || [];

        if (this.state.activeimageid) {
            // Update existing image caption
            const imageid = this.state.activeimageid;
            const k = gfk.getimagekeybyid.call(this, projectid, fieldid, imageid);

            projects[i].fieldreports[j].images[k].caption = caption;

            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
        } else {
            // Create new image with caption
            const imageid = makeid.imageID.call(this);
            const image = this.state.image;
            const newImage = CreateImage(imageid, image, caption);

            if (!projects[i].fieldreports[j].images) {
                projects[i].fieldreports[j].images = [];
            }

            projects[i].fieldreports[j].images.push(newImage);

            this.props.reduxProjects(projects);
            this.setState({ activeimageid: imageid });
        }
    }


    getcaption() {
        const gfk = new GFK();

        if (!this.state.activefieldid) return this.state.caption || "";

        const { projectid } = this.props.match.params;
        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return this.state.caption || "";

        if (this.state.activeimageid) {
            const imageid = this.state.activeimageid;
            const activeimage = gfk.getimagebyid.call(this, projectid, fieldid, imageid);
            return activeimage?.caption || "";
        }

        return this.state.caption || "";
    }

    removeimage(imageid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        if (!projects || !this.state.activefieldid) return;

        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);
        const fieldid = this.state.activefieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport) return;

        const j = gfk.getfieldkeybyid.call(this, projectid, fieldid);
        const image = gfk.getimagebyid.call(this, projectid, fieldid, imageid);
        if (!image) return;

        if (!window.confirm(`Are you sure you want to delete image ${image.image}?`)) return;

        const k = gfk.getimagekeybyid.call(this, projectid, fieldid, imageid);

        projects[i].fieldreports[j].images.splice(k, 1);

        // Remove images property if empty
        if (projects[i].fieldreports[j].images.length === 0) {
            delete projects[i].fieldreports[j].images;
        }

        this.props.reduxProjects(projects);
        this.setState({ activeimageid: false });
    }


 async uploadimage() {
    const gfk = new GFK();
    const { projectid } = this.props.match.params;

    // Validate project list
    const projects = gfk.getProjects.call(this);
    if (!projects) return;
  
    const projectIndex = gfk.getProjectKeyById.call(this, projectid);
    if (projectIndex === false) return;

    const fieldreports = gfk.getfieldreports.call(this, projectid)
    console.log(fieldreports)
    if (!fieldreports) return;

    const fieldid = this.state.activefieldid;
    const imageid = this.state.activeimageid;
    console.log(fieldid, imageid)
    if (!fieldid || !imageid) return;
    console.log(fieldid, imageid)

    const fieldIndex = gfk.getfieldkeybyid.call(this, projectid, fieldid);
    const imageIndex = gfk.getimagekeybyid.call(this, projectid, fieldid, imageid);
    if (fieldIndex === false || imageIndex === false) return;

    // File selection
    const fileInput = document.getElementById("field-image");
    const file = fileInput?.files?.[0];
    if (!file) return;
  console.log("report")
    // Build form payload
    const formdata = new FormData();
    formdata.append("fieldimage", file);
    formdata.append("fieldid", fieldid);
    formdata.append("imageid", imageid);
    formdata.append("projectid", projectid);
    formdata.append("fieldreports", JSON.stringify(fieldreports));  // FIXED

    try {
        const response = await UploadFieldImage(formdata);
        console.log(response)
        // Update Redux if images returned
        const returnedReports = response?.fieldreports?.fieldreports

        if (returnedReports) {
            projects[projectIndex].fieldreports = returnedReports;
            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
        }

        if (response?.message) {
            this.setState({ message: response.message });
        }

    } catch (err) {
        alert(err);
    }
}



showimageuploader() {
    const styles = MyStylesheet();
    const gfk = new GFK();
    const uploadbutton = gfk.getuploadbutton.call(this)
    const regularFont = gfk.getRegularFont.call(this);
    const thumbphoto = gfk.getthumbimage.call(this)
    const removeIcon = gfk.getremoveicon.call(this)
    const projectid = this.props.match.params.projectid;
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
                    <img src={`${process.env.REACT_APP_SERVER_API}${image.image}`} alt={image.caption} style={{ ...thumbphoto }} />
                </div>
            </div>
            <div style={{ ...styles.flex3 }}>
                <div style={{ ...styles.generalContainer, ...activebackground(image.imageid) }}>
                    {process.env.REACT_APP_SERVER_API}{image.image}
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
            let images = gfk.getimagesbyfieldid.call(this, projectid, this.state.activefieldid)
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
    const engineerid = 'mazen'
    const projectid = this.props.match.params.projectid;
    const myproject = gfk.getProjectById.call(this, this.props.match.params.projectid)
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
        projects: state.projects
    }
}
export default connect(mapStateToProps, actions)(FieldReports);
