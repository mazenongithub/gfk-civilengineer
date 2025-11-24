import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { removeIconSmall, saveProjectIcon } from './svg';
import MakeID from './makeids';
import { SaveCompactionCurves } from './actions/api';

class Compaction extends Component {

    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activecurveid: false }
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

    getCurveNumber() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project?.compactioncurves) return "";

        const curveid = this.state.activecurveid;
        if (!curveid) return "";

        const curve = gfk.getcurvebyid.call(this, projectid, curveid);
        return curve?.curvenumber || "";
    }

    createCurve(curveid, curvenumber, description, maxden, moist) {
        return ({ curveid, curvenumber, description, maxden, moist })
    }

    handleCurveNumber(value) {
        const gfk = new GFK();
        const makeid = new MakeID();

        const { projectid } = this.props.match.params;
        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);
        let { activecurveid } = this.state;

        // Always ensure compactioncurves is an array
        if (!projects[i].compactioncurves) {
            projects[i].compactioncurves = [];
        }

        // -------------------------------
        // UPDATE EXISTING CURVE
        // -------------------------------
        if (activecurveid) {
            const curve = gfk.getcurvebyid.call(this, projectid, activecurveid);
            if (!curve) return;

            const j = gfk.getcurvekeybyid.call(this, projectid, activecurveid);
            if (j === false) return;

            projects[i].compactioncurves[j].curvenumber = value;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // -------------------------------
        // CREATE NEW CURVE
        // -------------------------------
        activecurveid = makeid.curveID.call(this, projectid);

        const newcurve = this.createCurve(
            activecurveid,
            value,
            "",
            "",
            ""
        );

        projects[i].compactioncurves.push(newcurve);

        this.props.reduxProjects(projects);
        this.setState({ activecurveid });
    }

    getDescription() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project?.compactioncurves) return "";

        const curveid = this.state.activecurveid;
        if (!curveid) return "";

        const curve = gfk.getcurvebyid.call(this, projectid, curveid);
        return curve?.description || "";
    }

    handleDescription(value) {
        const gfk = new GFK();
        const makeid = new MakeID();

        const { projectid } = this.props.match.params;
        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);
        let { activecurveid } = this.state;

        // Ensure compactioncurves always exists
        if (!projects[i].compactioncurves) {
            projects[i].compactioncurves = [];
        }

        // ---------------------------------
        // UPDATE EXISTING CURVE
        // ---------------------------------
        if (activecurveid) {
            const curve = gfk.getcurvebyid.call(this, projectid, activecurveid);
            if (!curve) return;

            const j = gfk.getcurvekeybyid.call(this, projectid, activecurveid);
            if (j === false) return;

            // Update DESCRIPTION instead of number
            projects[i].compactioncurves[j].description = value;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // ---------------------------------
        // CREATE NEW CURVE
        // ---------------------------------
        activecurveid = makeid.curveID.call(this, projectid);

        // Create a new curve; description is the 2nd parameter
        const newcurve = this.createCurve(
            activecurveid,
            "",        // curvenumber (left empty)
            value,     // description (this value)
            "",        // max density
            ""         // moisture
        );

        projects[i].compactioncurves.push(newcurve);

        this.props.reduxProjects(projects);
        this.setState({ activecurveid });
    }


    getMaxDen() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project?.compactioncurves) return "";

        const curveid = this.state.activecurveid;
        if (!curveid) return "";

        const curve = gfk.getcurvebyid.call(this, projectid, curveid);
        return curve?.maxden || "";
    }

    handleMaxDen(value) {
        const gfk = new GFK();
        const makeid = new MakeID();

        const { projectid } = this.props.match.params;
        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);
        let { activecurveid } = this.state;

        // Ensure compactioncurves always exists
        if (!projects[i].compactioncurves) {
            projects[i].compactioncurves = [];
        }

        // ---------------------------------
        // UPDATE EXISTING CURVE
        // ---------------------------------
        if (activecurveid) {
            const curve = gfk.getcurvebyid.call(this, projectid, activecurveid);
            if (!curve) return;

            const j = gfk.getcurvekeybyid.call(this, projectid, activecurveid);
            if (j === false) return;

            // Update max density
            projects[i].compactioncurves[j].maxden = value;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // ---------------------------------
        // CREATE NEW CURVE
        // ---------------------------------
        activecurveid = makeid.curveID.call(this, projectid);

        // createCurve(curveid, curvenumber, description, maxden, moisture)
        const newcurve = this.createCurve(
            activecurveid,
            "",        // curvenumber
            "",        // description
            value,     // maxden (this value)
            ""         // moisture
        );

        projects[i].compactioncurves.push(newcurve);

        this.props.reduxProjects(projects);
        this.setState({ activecurveid });
    }


    getMoist() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project?.compactioncurves) return "";

        const curveid = this.state.activecurveid;
        if (!curveid) return "";

        const curve = gfk.getcurvebyid.call(this, projectid, curveid);
        return curve?.moist || "";
    }

    handleMoist(value) {
        const gfk = new GFK();
        const makeid = new MakeID();

        const { projectid } = this.props.match.params;
        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);
        let { activecurveid } = this.state;

        // Ensure compactioncurves array always exists
        if (!projects[i].compactioncurves) {
            projects[i].compactioncurves = [];
        }

        // ---------------------------------
        // UPDATE EXISTING CURVE
        // ---------------------------------
        if (activecurveid) {
            const curve = gfk.getcurvebyid.call(this, projectid, activecurveid);
            if (!curve) return;

            const j = gfk.getcurvekeybyid.call(this, projectid, activecurveid);
            if (j === false) return;

            // Update moisture
            projects[i].compactioncurves[j].moist = value;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // ---------------------------------
        // CREATE NEW CURVE
        // ---------------------------------
        activecurveid = makeid.curveID.call(this, projectid);

        // createCurve(curveid, curvenumber, description, maxden, moist)
        const newcurve = this.createCurve(
            activecurveid,
            "",        // curvenumber
            "",        // description
            "",        // maxden
            value      // moist (this value)
        );

        projects[i].compactioncurves.push(newcurve);

        this.props.reduxProjects(projects);
        this.setState({ activecurveid });
    }

    removeCurve(curveid) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure compactioncurves exists
        if (!projects[i].compactioncurves) {
            projects[i].compactioncurves = [];
        }

        // Find the curve index
        const index = gfk.getcurvekeybyid.call(this, projectid, curveid);
        if (index === false) return; // Nothing to remove

        // Remove the curve
        projects[i].compactioncurves.splice(index, 1);

        // Update Redux
        this.props.reduxProjects(projects);

        // Clear activecurveid if we deleted the active curve
        if (this.state.activecurveid === curveid) {
            this.setState({ activecurveid: false });
        } else {
            this.setState({ render: "render" });
        }
    }




    showCurveIDs() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);

        // Always treat compactioncurves as an array
        const curves = Array.isArray(project?.compactioncurves)
            ? project.compactioncurves
            : [];

        // If empty array → return nothing
        if (curves.length === 0) return null;

        return curves.map(curve => this.showCurveID(curve));
    }


    handleCurveID(curveid) {
        this.setState({
            activecurveid: this.state.activecurveid === curveid ? false : curveid
        });
    }

    showCurveID(curve) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const buttonWidth = { width: '41px' }

        const activeBackground = (curveid) => {
            if (this.state.activecurveid === curveid) {

                return (styles.activefieldreport)
            } else {
                return;
            }
        }



        return (<div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
            <div style={{ ...styles.flex3, ...activeBackground(curve.curveid) }} onClick={() => { this.handleCurveID(curve.curveid) }}>
                <spam style={{ ...regularFont }}>Curve: {curve.curvenumber} Description: {curve.description} MaxDen: {curve.maxden}pcf Moisture: {curve.moist}%</spam>
            </div>
            <div style={{ ...styles.flex1 }}>
                <button style={{ ...styles.generalButton, ...buttonWidth }} onClick={() => { this.removeCurve(curve.curveid) }}>
                    {removeIconSmall()}
                </button>

            </div>

        </div>)
    }

    async saveCompactionCurves() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects?.[projectIndex];

        // Exit early if project not found
        if (!project) return;

        const compactioncurves = gfk.getcurves.call(this, projectid);

        try {
            const response = await SaveCompactionCurves({ projectid, compactioncurves });

            // The API shape is unclear, but based on your code:
            const returned = response.compactioncurves;

            if (returned?.compactioncurves) {
                projects[projectIndex].compactioncurves = returned.compactioncurves;
            }

            this.props.reduxProjects(projects);
            this.setState({ message: response.message });

        } catch (err) {
            console.error("Error saving compaction curves:", err);
            this.setState({ message: "Error saving compaction curves" });
        }
    }


    render() {

        const { projectid, engineerid } = this.props.match.params;
        const gfk = new GFK()
        const project = gfk.getProjectById.call(this, projectid)
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
        const headerFont = gfk.getHeaderFont.call(this)
        const saveProjectIconStyle = gfk.getsaveprojecticon.call(this);



        if (project) {

            return (
                <div style={{ ...styles.generalContainer }}>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/profile`}>
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
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}`}>
                            /{project.projectnumber} - {project.title}
                        </Link>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/compaction`}>
                            /compaction
                        </Link>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                                <span style={{ ...regularFont }}>Curve #</span>
                            </div>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getCurveNumber()}
                                    onChange={event => { this.handleCurveNumber(event.target.value) }} />
                            </div>
                        </div>

                        <div style={{ ...styles.flex3 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                                <span style={{ ...regularFont }}>Description</span>
                            </div>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getDescription()}
                                    onChange={event => { this.handleDescription(event.target.value) }} />
                            </div>

                        </div>

                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                                <span style={{ ...regularFont }}>Max Density (p.c.f)</span>
                            </div>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getMaxDen()}
                                    onChange={event => { this.handleMaxDen(event.target.value) }} />
                            </div>
                        </div>

                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                <span style={{ ...regularFont }}>Moisture %</span>
                            </div>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getMoist()}
                                    onChange={event => { this.handleMoist(event.target.value) }} />
                            </div>
                        </div>


                    </div>

                    <div style={{ ...styles.generalContainer }}>
                        {this.showCurveIDs()}
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <span style={{ ...regularFont }}>{this.state.message}</span>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter }}>
                        <button style={{ ...styles.generalButton, ...saveProjectIconStyle }} onClick={() => { this.saveCompactionCurves() }}>{saveProjectIcon()}</button>
                    </div>




                </div>

            )

        } else {

            return (<div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.generalFont }}>

                <span style={{ ...regularFont }}> Project Not Found</span>
            </div>)

        }


    }



}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects
    }
}

export default connect(mapStateToProps, actions)(Compaction);