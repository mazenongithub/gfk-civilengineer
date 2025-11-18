import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { LoadSeismic, HandleSeismic } from './actions/api';
import { newSeismic, SeismicPoint, newSeismicPoint, newStrain } from './functions';
import { removeIconSmall, saveProjectIcon } from './svg';
import MakeID from './makeids';
import SoilClassification from './soilclassification';
import SesimicCalcs from './seismiccalcs';


class Seismic extends Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0, render: 'render', magnitude: '', activepointid: false, depth: '', spt: '', pi: '', fines: '', sampleid: '', siteacceleration: '', message: '' }
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



    getAcceleration() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const seismic = gfk.getSeismicByProjectID.call(this, projectid);
        return seismic?.siteacceleration || "";
    }

    handleAcceleration(value) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // If seismic data already exists → update it
        if (project.seismic) {
            projects[i].seismic.siteacceleration = value;
        }
        // Otherwise create new seismic object
        else {
            const magnitude = this.state.magnitude;
            const newSeismicRecord = newSeismic(magnitude, value);
            newSeismicRecord.points = [];
            projects[i].seismic = newSeismicRecord;
        }

        // Save changes
        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }


    getMagnitude() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.seismic) return "";

        return project.seismic.magnitude || "";
    }


    handleMagnitude(value) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // If seismic data already exists → update magnitude
        if (project.seismic) {
            projects[i].seismic.magnitude = value;
        }
        // Otherwise create new seismic record
        else {
            const acceleration = this.state.acceleration; // stored locally
            const newSeismicRecord = newSeismic(value, acceleration);
            newSeismicRecord.points = [];
            projects[i].seismic = newSeismicRecord;
        }

        // Save updates
        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }

    getDepth() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const pointid = this.state.activepointid;

        if (!pointid) return "";

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        return point?.depth || "";
    }


    handleDepth(value) {
        const gfk = new GFK();
        const makeid = new MakeID();

        const projectid = this.props.match.params.projectid;
        const projects = gfk.getProjects.call(this) || [];
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];

        if (!project) return;

        // Ensure seismic object exists
        if (!project.seismic) {
            project.seismic = {
                magnitude: this.state.magnitude,
                siteacceleration: this.state.siteacceleration,
                points: []
            };
        }

        // Ensure points array exists
        if (!Array.isArray(project.seismic.points)) {
            project.seismic.points = [];
        }

        const points = project.seismic.points;
        const activePointId = this.state.activepointid;

        // -------------------------------------------------
        // 1️⃣ UPDATE EXISTING POINT
        // -------------------------------------------------
        if (activePointId) {
            const pointIndex = gfk.getPointKeybyID.call(this, projectid, activePointId);
            if (pointIndex !== false && points[pointIndex]) {
                points[pointIndex].depth = value;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
                return;
            }
        }

        // -------------------------------------------------
        // 2️⃣ CREATE NEW POINT
        // -------------------------------------------------
        const pointid = makeid.seismicpointid.call(this, projectid);

        const { pi, fines, spt, sampleid } = this.state;

        const newPoint = SeismicPoint(
            pointid,
            value,     // depth
            pi,
            fines,
            spt,
            sampleid
        );

        points.push(newPoint);

        this.props.reduxProjects(projects);
        this.setState({ activepointid: pointid, render: "render" });
    }


    getPI() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;

        if (!pointid) return "";

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        return point?.pi ?? "";
    }


    handlePI(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getProjectById.call(this, projectid);
        const projects = gfk.getProjects.call(this);
        const makeid = new MakeID();

        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);

        // Make sure seismic exists on the project
        if (!project.seismic) {
            project.seismic = {
                siteacceleration: this.state.siteacceleration || "",
                magnitude: this.state.magnitude || "",
                points: []
            };
        }

        const seismic = project.seismic;

        // ---- UPDATE EXISTING POINT ----
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const pointIndex = gfk.getPointKeybyID.call(this, projectid, pointid);

            if (pointIndex !== false) {
                seismic.points[pointIndex].pi = value;
                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
                return;
            }
        }

        // ---- CREATE NEW POINT ----
        const newPointID = makeid.seismicpointid.call(this, projectid);

        const newPoint = {
            pointid: newPointID,
            depth: this.state.depth || "",
            pi: value,
            fines: this.state.fines || "",
            spt: this.state.spt || "",
            sampleid: this.state.sampleid || ""
        };

        seismic.points.push(newPoint);

        this.props.reduxProjects(projects);
        this.setState({ activepointid: newPointID, render: "render" });
    }


    getSPT() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;

        if (!pointid) return "";

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        return point?.spt ?? "";
    }


    handleSPT(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getProjectById.call(this, projectid);
        const projects = gfk.getProjects.call(this);
        const makeid = new MakeID();

        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);

        // Ensure seismic exists
        if (!project.seismic) {
            project.seismic = {
                siteacceleration: this.state.siteacceleration || "",
                magnitude: this.state.magnitude || "",
                points: []
            };
        }

        const seismic = project.seismic;

        // ---- UPDATE EXISTING POINT ----
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const pointIndex = gfk.getPointKeybyID.call(this, projectid, pointid);

            if (pointIndex !== false) {
                seismic.points[pointIndex].spt = value;
                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
                return;
            }
        }

        // ---- CREATE NEW POINT ----
        const newPointID = makeid.seismicpointid.call(this, projectid);

        const newPoint = {
            pointid: newPointID,
            depth: this.state.depth || "",
            pi: this.state.pi || "",
            fines: this.state.fines || "",
            spt: value,
            sampleid: this.state.sampleid || ""
        };

        seismic.points.push(newPoint);

        this.props.reduxProjects(projects);
        this.setState({ activepointid: newPointID, render: "render" });
    }


    getFines() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;

        if (!pointid) return "";

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        return point?.fines ?? "";
    }

    handleFines(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getProjectById.call(this, projectid);
        const projects = gfk.getProjects.call(this);
        const makeid = new MakeID();

        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);

        // Ensure `seismic` object exists
        if (!project.seismic) {
            project.seismic = {
                siteacceleration: this.state.siteacceleration || "",
                magnitude: this.state.magnitude || "",
                points: []
            };
        }

        const seismic = project.seismic;

        // ---- UPDATE EXISTING POINT ----
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const pointIndex = gfk.getPointKeybyID.call(this, projectid, pointid);

            if (pointIndex !== false) {
                seismic.points[pointIndex].fines = value;
                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
                return;
            }
        }

        // ---- CREATE NEW POINT ----
        const newPointID = makeid.seismicpointid.call(this, projectid);

        const newPoint = {
            pointid: newPointID,
            depth: this.state.depth || "",
            pi: this.state.pi || "",
            fines: value,
            spt: this.state.spt || "",
            sampleid: this.state.sampleid || ""
        };

        seismic.points.push(newPoint);

        this.props.reduxProjects(projects);
        this.setState({ activepointid: newPointID, render: "render" });
    }


    handlePointID(pointid) {
        this.setState(prevState => ({
            activepointid: prevState.activepointid === pointid ? false : pointid
        }));
    }

    handleStrainID(strainid) {
        const { activestrainid } = this.state;

        // If clicking a new strain → activate it and its parent point
        if (activestrainid !== strainid) {
            const gfk = new GFK();
            const projectid = this.props.match.params.projectid;

            const pointid = gfk.getPointIDfromStrainID.call(this, projectid, strainid);

            this.setState({
                activestrainid: strainid,
                activepointid: pointid || false,
            });

            return;
        }

        // Clicking the same strain again → deactivate
        this.setState({ activestrainid: false });
    }



    removePoint(projectid, pointid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);

        if (!projects) return;

        // Get the project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        // Index of project in array
        const i = gfk.getProjectKeyById.call(this, projectid);
        if (i === false) return;

        // Seismic object
        const seismic = project.seismic;
        if (!seismic || !Array.isArray(seismic.points)) return;

        // Get point & index
        const j = seismic.points.findIndex(p => p.pointid === pointid);
        if (j === -1) return;

        // Remove the point
        projects[i].seismic.points.splice(j, 1);

        // Save updated projects
        this.props.reduxProjects(projects);

        // Reset UI state
        this.setState({ activepointid: false });
    }



    showpoint(point) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const removeIcon = gfk.getremoveicon.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const projectid = this.props.match.params.projectid;

        const highlightactive = () => {

            if (this.state.activepointid === point.pointid) {
                return (styles.activefieldreport)
            }
        }


        return (

            <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }} key={point.pointid}>
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handlePointID(point.pointid) }}>
                    <span style={{ ...regularFont }}>Depth: {point.depth} SPT:{point.spt} Fines:{point.fines}%  PI: {point.pi} </span>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => {
                        this.removePoint(projectid, point.pointid)
                    }}>
                        {removeIconSmall()}
                    </button>

                </div>
            </div>
        )
    }



    getPoints() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const points = gfk.getPointsByProjectID.call(this, projectid)
        let showpoints = [];
        if (points) {
            // eslint-disable-next-line
            points.map(point => {
                showpoints.push(this.showpoint(point))
            })
        }
        return showpoints;

    }

    removeStrain(projectid, pointid, strainid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);

        if (!projects) return;

        // Get project
        const project = gfk.getProjectByID.call(this, projectid);
        if (!project) return;

        // Index of project
        const i = gfk.getProjectKeyByID.call(this, projectid);
        if (i === false) return;

        const seismic = project.seismic;
        if (!seismic || !Array.isArray(seismic.points)) return;

        // Find the point inside seismic.points
        const j = seismic.points.findIndex(p => p.pointid === pointid);
        if (j === -1) return;

        const point = seismic.points[j];

        if (!Array.isArray(point.strain)) return;

        // Find strain index
        const k = point.strain.findIndex(s => s.strainid === strainid);
        if (k === -1) return;

        // Remove strain
        projects[i].seismic.points[j].strain.splice(k, 1);

        // Save updated projects
        this.props.reduxProjects(projects);

        // Reset UI state
        this.setState({ activestrainid: false });
    }


    handleStrainRatio(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure seismic object exists
        if (!project.seismic) {
            project.seismic = { points: [] };
        }

        const pointid = this.state.activepointid;
        if (!pointid) return; // Cannot assign strain without a point

        // Ensure points array exists
        if (!Array.isArray(project.seismic.points)) {
            project.seismic.points = [];
        }

        // Find point
        const point = gfk.getPointbyID.call(this, projectid, pointid);
        const pointIndex = gfk.getPointKeybyID.call(this, projectid, pointid);

        if (!point) return;

        // Ensure strain array exists
        if (!Array.isArray(point.strain)) {
            project.seismic.points[pointIndex].strain = [];
        }

        const strainid = this.state.activestrainid;

        if (strainid) {
            // -------------------------------------------------------
            // UPDATE EXISTING STRAIN
            // -------------------------------------------------------
            const strainIndex = point.strain.findIndex(s => s.strainid === strainid);
            if (strainIndex !== -1) {
                project.seismic.points[pointIndex].strain[strainIndex].strainratio = value;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
                return;
            }
        }

        // -------------------------------------------------------
        // CREATE NEW STRAIN ENTRY
        // -------------------------------------------------------
        const newStrainID = makeid.strainid.call(this);
        const toplayer = this.state.toplayer || "";
        const bottomlayer = this.state.bottomlayer || "";

        const newStrainEntry = newStrain(
            newStrainID,
            toplayer,
            bottomlayer,
            value
        );

        project.seismic.points[pointIndex].strain.push(newStrainEntry);

        this.props.reduxProjects(projects);

        // Set new active strain
        this.setState({ activestrainid: newStrainID, render: "render" });
    }


    getStrainRatio() {
        const gfk = new GFK();

        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;
        const strainid = this.state.activestrainid;

        if (!pointid || !strainid) return "";

        // Find point
        const point = gfk.getPointbyID.call(this, projectid, pointid);
        if (!point || !Array.isArray(point.strain)) return "";

        // Find strain entry
        const strain = point.strain.find(s => s.strainid === strainid);
        if (!strain) return "";

        return strain.strainratio || "";
    }


    getTopLayer() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const strainid = this.state.activestrainid;

        if (!strainid) return "";

        const pointid = this.state.activepointid;
        if (!pointid) return "";

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        if (!point || !Array.isArray(point.strain)) return "";

        const strain = point.strain.find(s => s.strainid === strainid);
        return strain ? strain.toplayer : "";
    }


    handleTopLayer(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure seismic structure exists
        if (!project.seismic) {
            project.seismic = { points: [] };
        }
        if (!Array.isArray(project.seismic.points)) {
            project.seismic.points = [];
        }

        const pointid = this.state.activepointid;
        if (!pointid) return;

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        const pointIndex = gfk.getPointKeybyID.call(this, projectid, pointid);
        if (!point) return;

        // Ensure strain array exists
        if (!Array.isArray(point.strain)) {
            project.seismic.points[pointIndex].strain = [];
        }

        const strainid = this.state.activestrainid;

        // -----------------------------------------------------
        // UPDATE EXISTING STRAIN
        // -----------------------------------------------------
        if (strainid) {
            const strainIndex = point.strain.findIndex(s => s.strainid === strainid);
            if (strainIndex !== -1) {
                project.seismic.points[pointIndex]
                    .strain[strainIndex]
                    .toplayer = value;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
                return;
            }
        }

        // -----------------------------------------------------
        // CREATE NEW STRAIN ENTRY
        // -----------------------------------------------------
        const newStrainID = makeid.strainid.call(this);
        const bottomlayer = this.state.bottomlayer || "";
        const strainratio = this.state.strainratio || "";

        const newEntry = newStrain(
            newStrainID,
            value,           // toplayer
            bottomlayer,     // bottomlayer
            strainratio      // strainratio
        );

        project.seismic.points[pointIndex].strain.push(newEntry);

        this.props.reduxProjects(projects);

        this.setState({
            activestrainid: newStrainID,
            render: "render"
        });
    }


    getBottomLayer() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const strainid = this.state.activestrainid;
        const pointid = this.state.activepointid;

        if (!pointid || !strainid) return "";

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        if (!point || !Array.isArray(point.strain)) return "";

        const strain = point.strain.find(s => s.strainid === strainid);
        return strain ? strain.bottomlayer : "";
    }


    handleBottomLayer(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure seismic structure exists
        if (!project.seismic) project.seismic = { points: [] };
        if (!Array.isArray(project.seismic.points)) project.seismic.points = [];

        const pointid = this.state.activepointid;
        if (!pointid) return;

        const point = gfk.getPointbyID.call(this, projectid, pointid);
        const pointIndex = gfk.getPointKeybyID.call(this, projectid, pointid);
        if (!point) return;

        if (!Array.isArray(point.strain)) project.seismic.points[pointIndex].strain = [];

        const strainid = this.state.activestrainid;

        // -----------------------------------------------------
        // UPDATE EXISTING STRAIN
        // -----------------------------------------------------
        if (strainid) {
            const strainIndex = point.strain.findIndex(s => s.strainid === strainid);
            if (strainIndex !== -1) {
                project.seismic.points[pointIndex]
                    .strain[strainIndex]
                    .bottomlayer = value;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
                return;
            }
        }

        // -----------------------------------------------------
        // CREATE NEW STRAIN ENTRY
        // -----------------------------------------------------
        const newStrainID = makeid.strainid.call(this);
        const toplayer = this.state.toplayer || "";
        const strainratio = this.state.strainratio || "";

        const newEntry = newStrain(
            newStrainID,
            toplayer,    // toplayer
            value,       // bottomlayer
            strainratio  // strainratio
        );

        project.seismic.points[pointIndex].strain.push(newEntry);

        this.props.reduxProjects(projects);

        this.setState({
            activestrainid: newStrainID,
            render: "render"
        });
    }


    getStrainIDs() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let strainids = [];
        const strain = gfk.getSeismicStrainByProjectID.call(this, projectid)
        if (strain) {
            // eslint-disable-next-line
            strain.map(getstrain => {
                strainids.push(this.showStrainIDs(getstrain))

            })
        }
        return strainids;

    }
    showStrainIDs(strain) {

        const styles = MyStylesheet();
        const gfk = new GFK();
        const removeIcon = gfk.getremoveicon.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const projectid = this.props.match.params.projectid;

        const highlightactive = () => {

            if (this.state.activestrainid === strain.strainid) {
                return (styles.activefieldreport)
            }
        }

        const settlement = () => {
            let inches = 0
            if (Number(strain.strainratio) > 0 && Number(strain.bottomlayer) > 0 && Number(strain.toplayer) > 0) {
                const layer = Number(strain.bottomlayer) - Number(strain.toplayer)
                inches = Number((Number(strain.strainratio) * layer) * 12).toFixed(2)
            }
            return inches;
        }


        return (

            <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }} key={strain.strainid}>
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handleStrainID(strain.strainid) }}>
                    <span style={{ ...regularFont }}>Top Depth: {strain.toplayer}ft Bottom Depth:{strain.bottomlayer} Strain Ratio:{strain.strainratio}  Settlement {settlement()} in </span>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => {
                        this.removeStrain(projectid, strain.strainid)
                    }}>
                        {removeIconSmall()}
                    </button>

                </div>
            </div>
        )

    }

    getProjectSamples() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const options = [];

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (!Array.isArray(borings)) return options;

        borings.forEach(boring => {
            const { boringid, boringnumber } = boring;
            const samples = gfk.getSamplesByBoringId.call(this, projectid, boringid);

            if (Array.isArray(samples)) {
                samples.forEach(sample => {
                    const { sampleid, sampleset, samplenumber, depth } = sample;
                    options.push(
                        <option key={sampleid} value={sampleid}>
                            {boringnumber}-{sampleset}({samplenumber}){depth}
                        </option>
                    );
                });
            }
        });

        return options;
    }

handleSampleID(sampleid) {
    const projectid = this.props.match.params.projectid;
    const makeid = new MakeID();
    const gfk = new GFK();

    let depth = 0, pi = 0, spt = 0, fines = 0, ll = 0;

    const netwgt = sample => {
        let wgt = Number(sample.drywgt) - Number(sample.tarewgt);
        return Number(wgt).toFixed(1);
    };

    // Get the sample and calculate fines
    const boring = gfk.getBoringfromSampleID.call(this, projectid, sampleid);
    const sample = gfk.getSampleById.call(this, projectid, boring.boringid, sampleid);

    if (sample) {
        console.log(sample)
        depth = Number(sample.depth);
        pi = Number(sample.pi);
        spt = Number(sample.spt);
        ll = Number(sample.ll);

        const sieve = gfk.getSieveBySampleId.call(this, projectid, boring.boringid, sampleid);
        const soilclassification = new SoilClassification(
            netwgt(sample),
            ll,
            pi,
            sieve.wgt34,
            sieve.wgt38,
            sieve.wgt4,
            sieve.wgt10,
            sieve.wgt30,
            sieve.wgt40,
            sieve.wgt100,
            sieve.wgt200
        );
        fines = soilclassification.getFines();
    }

    // Get projects and ensure project exists
    const projects = gfk.getProjects.call(this);
    const project = gfk.getProjectById.call(this, projectid);
    if (!project) return;

    const i = gfk.getProjectKeyById.call(this, projectid);

    // Ensure seismic object and points array exist
    if (!projects[i].seismic) projects[i].seismic = {};
    if (!Array.isArray(projects[i].seismic.points)) projects[i].seismic.points = [];

    const seismic = projects[i].seismic;

    if (this.state.activepointid) {
        // Update existing point
        const pointid = this.state.activepointid;
        const j = gfk.getPointKeybyID.call(this, projectid, pointid);
        if (j === false) return;

        seismic.points[j].sampleid = sampleid;
        seismic.points[j].depth = depth;
        seismic.points[j].pi = pi;
        seismic.points[j].spt = spt;
        seismic.points[j].fines = fines;
    } else {
        // Create new point and append to seismic.points
        const pointid = makeid.seismicpointid.call(this, projectid);
        console.log(pointid, depth, pi, fines, spt, sampleid)
        const newPoint = SeismicPoint(pointid, depth, pi, fines, spt, sampleid);
        seismic.points.push(newPoint);

        // Set new active point
        this.setState({ activepointid: pointid });
    }

    // Push updated projects to Redux
    this.props.reduxProjects(projects);
    this.setState({ render: 'render' });
}


   getSampleID() {
    const gfk = new GFK();
    const projectid = this.props.match.params.projectid;
    const pointid = this.state.activepointid;

    if (!pointid) return '';

    const point = gfk.getPointbyID.call(this, projectid, pointid);
    return point?.sampleid || '';
}


    getOverBurden() {
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs()
        let overburden = 0
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const sampleid = point.sampleid;
            const depth = point.depth

            const stress = seismiccalcs.getOverBurden.call(this, projectid, sampleid, depth)
            overburden = stress.overburden

        }

        return overburden
    }

    getEffective() {
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs()
        let effective = 0
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const sampleid = point.sampleid;
            const depth = point.depth

            const stress = seismiccalcs.getOverBurden.call(this, projectid, sampleid, depth)
            effective = stress.effective

        }

        return effective;
    }

    getOverBurdenCorrection() {
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs()
        let correction = 0
        let effective = 0;
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const sampleid = point.sampleid;
            const depth = point.depth

            const stress = seismiccalcs.getOverBurden.call(this, projectid, sampleid, depth)
            effective = stress.effective

        }
        correction = seismiccalcs.overburdenCorrection(effective)

        return correction;
    }

    getRodLengthCorrection() {
        let correction = 1;
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs();
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const depth = point.depth;
            correction = seismiccalcs.rodLengthCorrection(depth)
        }
        return correction;

    }

    getDepthReductionFactor() {

        let correction = 1;
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs();
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const depth = point.depth;
            correction = seismiccalcs.depthReductionFactor(depth)
        }
        return correction;


    }

    getPICorrectionFactor() {

        let correction = 1;
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs();
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const pi = point.pi
            correction = seismiccalcs.piCorrectionFactor(pi)
        }
        return correction;

    }

    getN60() {
        let n60 = 0;

        const gfk = new GFK();

        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const spt = Number(point.spt)
            const overburdenCorrection = this.getOverBurdenCorrection()
            const rodCorrection = this.getRodLengthCorrection();

            n60 = Math.round(spt * overburdenCorrection * rodCorrection)
        }
        return n60;

    }
    getDrivingCSR() {
        const seismiccalcs = new SesimicCalcs();
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let csr = 0;
        const seismic = gfk.getSeismicByProjectID.call(this, projectid)
        if (seismic) {
            const siteacceleration = seismic.siteacceleration;
            const overburden = this.getOverBurden();
            const effective = this.getEffective();
            const depthreduction = this.getDepthReductionFactor();
            csr = seismiccalcs.drivingCSR(siteacceleration, overburden, effective, depthreduction)
        }
        return csr;

    }

    getAllowableCSR() {
        const seismiccalcs = new SesimicCalcs();
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const seismic = gfk.getSeismicByProjectID.call(this, projectid)
        let csr = 0;
        if (seismic) {
            const fines = this.getFines();
            const n60 = this.getN60();
            const picorrection = this.getPICorrectionFactor();
            const magnitude = Number(seismic.magnitude)
            const magcorrection = Number(seismiccalcs.magnitudeCorrectionFactor(magnitude))

            csr = seismiccalcs.allowableStrengthRatio(fines, n60, picorrection, magcorrection)

        }

        return csr;


    }

    getSafetyFactor() {
        let fs = 0;
        const driving = Number(this.getDrivingCSR())
        const allowable = Number(this.getAllowableCSR())
        fs = allowable / driving
        return Number(fs).toFixed(2)
    }

    async handleSaveProject() {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const seismic = gfk.getSeismicByProjectID.call(this, projectid)
        if (seismic) {
            const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
            let response = await HandleSeismic({ seismic })
            console.log(response)
         
        }
    }



    render() {
        const styles = MyStylesheet()
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this)
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;
        const project = gfk.getProjectById.call(this, projectid);
        const regularFont = gfk.getRegularFont.call(this)
        const saveprojecticon = gfk.getsaveprojecticon.call(this)
        if (project) {
            return (<div style={{ ...styles.generalContainer }}>

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
                        /{project.projectnumber} - {project.title}
                    </Link>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                    <Link
                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                        to={`/${engineerid}/projects/${projectid}/seismic`}>
                        /Seismic
                    </Link>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter, ...styles.generalFont }}>
                    <span style={{ ...headerFont, ...styles.boldFont }}>Liquefaction Settlement Calculator</span>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Site Acceleration</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField }}
                            value={this.getAcceleration()}
                            onChange={event => { this.handleAcceleration(event.target.value) }}
                        />

                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Magnitude</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField }}
                            value={this.getMagnitude()}
                            onChange={event => { this.handleMagnitude(event.target.value) }}
                        />
                    </div>

                </div>

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter, ...styles.generalFont }}>
                    <select style={{ ...regularFont, ...styles.mediumWidth }}
                        value={this.getSampleID()}
                        onChange={(event) => { this.handleSampleID(event.target.value) }}>
                        <option value="">Select A Sample</option>
                        {this.getProjectSamples()}
                    </select>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Depth</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField, ...styles.bottomMargin15 }}
                            value={this.getDepth()}
                            onChange={event => { this.handleDepth(event.target.value) }}
                        />

                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>SPT</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField, ...styles.bottomMargin15 }}
                            value={this.getSPT()}
                            onChange={event => { this.handleSPT(event.target.value) }}
                        />

                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Fines</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField, ...styles.bottomMargin15 }}
                            value={this.getFines()}
                            onChange={event => { this.handleFines(event.target.value) }} />

                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>PI</span>
                        </div>

                        <input type="text" style={{ ...regularFont, ...styles.generalField, ...styles.bottomMargin15 }}
                            value={this.getPI()}
                            onChange={event => { this.handlePI(event.target.value) }} />
                        {this.getPoints()}
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Poverburden (psf): {this.getOverBurden()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Peffective (psf): {this.getEffective()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Overburden Correction:{this.getOverBurdenCorrection()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Rod Length Correction:{this.getRodLengthCorrection()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Depth Reduction Factor:{this.getDepthReductionFactor()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>PI Correction Factor:{this.getPICorrectionFactor()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Adjusted N60: {this.getN60()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Driving Stress Ratio (Ri): {this.getDrivingCSR()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Allowable Strength Ratio (Rf): {this.getAllowableCSR()}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>Factor of Safety (FS):{this.getSafetyFactor()}</span>
                        </div>


                    </div>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.alignCenter }}>
                            <span style={{ ...regularFont }}><u>Strain</u></span>
                        </div>

                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Strain Ratio</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField, ...styles.bottomMargin15 }}
                            value={this.getStrainRatio()}
                            onChange={event => { this.handleStrainRatio(event.target.value) }}
                        />
                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Top Layer</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField, ...styles.bottomMargin15 }}
                            value={this.getTopLayer()}
                            onChange={event => { this.handleTopLayer(event.target.value) }}
                        />
                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Bottom Layer</span>
                        </div>
                        <input type="text" style={{ ...regularFont, ...styles.generalField, ...styles.bottomMargin15 }}
                            value={this.getBottomLayer()}
                            onChange={event => { this.handleBottomLayer(event.target.value) }}
                        />
                        <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                            <span style={{ ...regularFont }}>{this.state.message}</span>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <button style={{ ...styles.generalButton, ...saveprojecticon }} onClick={() => { this.handleSaveProject() }}>{saveProjectIcon()}</button>
                        </div>
                        {this.getStrainIDs()}
                    </div>
                </div>






            </div>)

        } else {
            return (<div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>Project Not Found</span>
            </div>)
        }
    }





}

function mapStateToProps(state) {
    return {
        projects:state.projects
    }
}
export default connect(mapStateToProps, actions)(Seismic);