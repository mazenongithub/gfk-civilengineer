import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { saveSection, removeIconSmall } from './svg';
import { LoadZoneCharts, LoadPTSlab, HandlePTSlab, DeletePTSlab } from './actions/api'
import MakeID from './makeids';
import { PTSlabSection, PTSlabLayer } from './functions'
import SoilClassification from './soilclassification';
import PTSlabCalcs from './ptslabcalcs';

class PTSlab extends Component {

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0, sectionname: '', layername: '', toplayer: '', bottomlayer: '', fines: '', micro: '', activesectionid: '', activelayerid: '', message: '' }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
       



    }

    async loadProgram() {
        if (!this.props.zonecharts.hasOwnProperty("zone_1")) {
            const response = LoadZoneCharts();
            const zonecharts = await response;
            this.props.reduxZones(zonecharts.zonecharts)

        }
        if (!this.props.ptslab.hasOwnProperty("length")) {
            const response_1 = LoadPTSlab();
            const ptslab = await response_1;
            this.props.reduxPTSlab(ptslab.ptslab.sections)
        }


    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getSectionName() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const { activesectionid } = this.state;

        if (!activesectionid) return "";

        const section = gfk.getPTSlabByID.call(this, projectid, activesectionid);
        if (!section) return "";

        return section.sectionname || "";
    }


    handleSectionName(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;

        // Load projects
        const projects = gfk.getProjects.call(this);
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        const project = projects[projectIndex];

        // Ensure ptslab and sections array exist
        if (!project.ptslab) project.ptslab = {};
        if (!Array.isArray(project.ptslab.sections)) project.ptslab.sections = [];

        const sections = project.ptslab.sections;

        // If a section is active, update it
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;

            const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
            if (sectionIndex === false) return;

            sections[sectionIndex].sectionname = value;

        } else {
            // CREATE A NEW SECTION
            const sectionid = makeid.ptslabsectionid.call(this, projectid);

            const newSection = PTSlabSection(sectionid, value);
            sections.push(newSection);

            // NEW SECTION BECOMES ACTIVE
            this.setState({ activesectionid: sectionid });
        }

        // Save back to Redux
        this.props.reduxProjects(projects);

        // Trigger UI update
        this.setState({ render: 'render' });
    }


    getLayerName() {
        const gfk = new GFK();
        let layername = '';

        const projectid = this.props.match.params.projectid;

        if (this.state.activelayerid && this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getPTSlabLayerByID.call(this, projectid, sectionid, layerid);

            if (layer) {
                layername = layer.layername;
            }
        }

        return layername;
    }


    handleLayerName(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;
        const projects = gfk.getProjects.call(this);
        const i = gfk.getProjectKeyById.call(this, projectid);

        if (i === false) return;

        // Ensure ptslab object exists
        if (!projects[i].ptslab) {
            projects[i].ptslab = { sections: [] };
        }

        const ptslab = projects[i].ptslab;

        // Must have an active section selected
        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = ptslab.sections[sectionIndex];

        // Ensure layers array exists
        if (!Array.isArray(section.layers)) {
            section.layers = [];
        }

        // Case 1: Update existing layer
        if (this.state.activelayerid) {
            const layerid = this.state.activelayerid;
            const layerIndex = gfk.getPTSlabLayerKeyByID.call(this, projectid, sectionid, layerid);

            if (layerIndex !== false) {
                section.layers[layerIndex].layername = value;

                this.props.reduxProjects(projects);
                this.setState({ render: 'render' });
                return;
            }
        }

        // Case 2: Create new layer
        const newLayerID = makeid.ptslablayerid.call(this, projectid, sectionid);

        const toplayer = "";
        const bottomlayer = "";
        const ll = 0;
        const pi = 0;
        const fines = 0;
        const micro = "";

        const newLayer = PTSlabLayer(
            newLayerID,
            value,
            toplayer,
            bottomlayer,
            ll,
            pi,
            fines,
            micro
        );

        section.layers.push(newLayer);

        // Make new layer active
        this.setState({ activelayerid: newLayerID });

        // Save results
        this.props.reduxProjects(projects);
        this.setState({ render: 'render' });
    }

    getTopLayer() {
        const gfk = new GFK();
        let toplayer = "";

        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return toplayer;

        const layer = gfk.getPTSlabLayerByID.call(this, projectid, sectionid, layerid);

        if (layer && layer.toplayer !== undefined) {
            toplayer = layer.toplayer;
        }

        return toplayer;
    }


    handleTopLayer(value) {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const makeid = new MakeID();

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure ptslab object exists
        if (!projects[i].ptslab) projects[i].ptslab = {};
        if (!Array.isArray(projects[i].ptslab.sections)) {
            projects[i].ptslab.sections = [];
        }

        const ptslab = projects[i].ptslab;

        const sectionid = this.state.activesectionid;
        if (!sectionid) return; // Cannot assign a layer without an active section

        // Ensure section exists
        const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = ptslab.sections[sectionIndex];

        // Ensure layers array exists
        if (!Array.isArray(section.layers)) {
            section.layers = [];
        }

        const layerid = this.state.activelayerid;

        if (layerid) {
            // --- UPDATE EXISTING LAYER ---
            const layerIndex = gfk.getPTSlabLayerKeyByID.call(this, projectid, sectionid, layerid);
            if (layerIndex === false) return;

            section.layers[layerIndex].toplayer = value;

        } else {
            // --- CREATE NEW LAYER ---
            const newLayerID = makeid.ptslablayerid.call(this, projectid, sectionid);

            const newLayer = PTSlabLayer(
                newLayerID,
                "",        // layername default
                value,     // toplayer
                "",        // bottomlayer default
                0,         // ll
                0,         // pi
                0,         // fines
                ""         // micro
            );

            section.layers.push(newLayer);

            // Set new layer active
            this.setState({ activelayerid: newLayerID });
        }

        // Update Redux
        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }

    getBottomLayer() {
        const gfk = new GFK();
        let bottomlayer = "";

        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getPTSlabLayerByID.call(this, projectid, sectionid, layerid);
            if (layer && layer.bottomlayer) {
                bottomlayer = layer.bottomlayer;
            }
        }

        return bottomlayer;
    }


    handleBottomLayer(value) {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const makeid = new MakeID();

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure ptslab object exists
        if (!projects[i].ptslab) projects[i].ptslab = {};
        if (!Array.isArray(projects[i].ptslab.sections)) {
            projects[i].ptslab.sections = [];
        }

        const ptslab = projects[i].ptslab;

        const sectionid = this.state.activesectionid;
        if (!sectionid) return; // Can't assign bottomlayer without active section

        const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = ptslab.sections[sectionIndex];

        // Ensure layers array exists
        if (!Array.isArray(section.layers)) {
            section.layers = [];
        }

        const layerid = this.state.activelayerid;

        if (layerid) {
            // --- UPDATE EXISTING LAYER ---
            const layerIndex = gfk.getPTSlabLayerKeyByID.call(this, projectid, sectionid, layerid);
            if (layerIndex === false) return;

            section.layers[layerIndex].bottomlayer = value;

        } else {
            // --- CREATE NEW LAYER ---
            const newLayerID = makeid.ptslablayerid.call(this, projectid, sectionid);

            const newLayer = PTSlabLayer(
                newLayerID,
                "",        // layername
                "",        // toplayer
                value,     // bottomlayer
                0,         // ll
                0,         // pi
                0,         // fines
                ""         // micro
            );

            section.layers.push(newLayer);

            // Set the new layer active
            this.setState({ activelayerid: newLayerID });
        }

        // Update Redux
        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }


    getLL() {
        const gfk = new GFK();
        let ll = "";

        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getPTSlabLayerByID.call(this, projectid, sectionid, layerid);
            if (layer && layer.ll !== undefined) {
                ll = layer.ll;
            }
        }

        return ll;
    }


    handleLL(value) {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const makeid = new MakeID();

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure ptslab exists
        if (!projects[i].ptslab) projects[i].ptslab = {};
        if (!Array.isArray(projects[i].ptslab.sections)) {
            projects[i].ptslab.sections = [];
        }

        const ptslab = projects[i].ptslab;

        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = ptslab.sections[sectionIndex];

        // Ensure layers array
        if (!Array.isArray(section.layers)) {
            section.layers = [];
        }

        const layerid = this.state.activelayerid;

        if (layerid) {
            // ----- UPDATE EXISTING LAYER -----
            const layerIndex = gfk.getPTSlabLayerKeyByID.call(this, projectid, sectionid, layerid);
            if (layerIndex === false) return;

            section.layers[layerIndex].ll = value;

        } else {
            // ----- CREATE NEW LAYER -----
            const newLayerID = makeid.ptslablayerid.call(this, projectid, sectionid);

            const newLayer = PTSlabLayer(
                newLayerID,
                "",     // layername
                "",     // toplayer
                "",     // bottomlayer
                value,  // ll
                0,      // pi
                0,      // fines
                ""      // micro
            );

            section.layers.push(newLayer);

            // Make new layer the active one
            this.setState({ activelayerid: newLayerID });
        }

        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }


    getPI() {
        const gfk = new GFK();
        let pi = "";

        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getPTSlabLayerByID.call(this, projectid, sectionid, layerid);
            if (layer && layer.pi !== undefined) {
                pi = layer.pi;
            }
        }

        return pi;
    }


    handlePI(value) {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const makeid = new MakeID();

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure ptslab exists
        if (!projects[i].ptslab) projects[i].ptslab = {};
        if (!Array.isArray(projects[i].ptslab.sections)) {
            projects[i].ptslab.sections = [];
        }

        const ptslab = projects[i].ptslab;
        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = ptslab.sections[sectionIndex];

        // Ensure layers array
        if (!Array.isArray(section.layers)) {
            section.layers = [];
        }

        const layerid = this.state.activelayerid;

        if (layerid) {
            // ----- UPDATE EXISTING LAYER -----
            const layerIndex = gfk.getPTSlabLayerKeyByID.call(this, projectid, sectionid, layerid);
            if (layerIndex === false) return;

            section.layers[layerIndex].pi = value;

        } else {
            // ----- CREATE NEW LAYER -----
            const newLayerID = makeid.ptslablayerid.call(this, projectid, sectionid);

            const newLayer = PTSlabLayer(
                newLayerID,
                "",     // layername
                "",     // toplayer
                "",     // bottomlayer
                "",     // ll
                value,  // pi
                0,      // fines
                ""      // micro
            );

            section.layers.push(newLayer);

            // Set newly created layer active
            this.setState({ activelayerid: newLayerID });
        }

        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }

    getFines() {
        const gfk = new GFK();
        let fines = "";

        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getPTSlabLayerByID.call(this, projectid, sectionid, layerid);
            if (layer && layer.fines !== undefined) {
                fines = layer.fines;
            }
        }

        return fines;
    }


    handleFines(value) {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const makeid = new MakeID();

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure ptslab exists
        if (!projects[i].ptslab) projects[i].ptslab = {};
        if (!Array.isArray(projects[i].ptslab.sections)) {
            projects[i].ptslab.sections = [];
        }

        const ptslab = projects[i].ptslab;
        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = ptslab.sections[sectionIndex];

        // Ensure layers exist
        if (!Array.isArray(section.layers)) {
            section.layers = [];
        }

        const layerid = this.state.activelayerid;

        if (layerid) {
            // ----- UPDATE EXISTING LAYER -----
            const layerIndex = gfk.getPTSlabLayerKeyByID.call(this, projectid, sectionid, layerid);
            if (layerIndex === false) return;

            section.layers[layerIndex].fines = value;

        } else {
            // ----- CREATE NEW LAYER -----
            const newLayerID = makeid.ptslablayerid.call(this, projectid, sectionid);

            const newLayer = PTSlabLayer(
                newLayerID,
                "",     // layername
                "",     // toplayer
                "",     // bottomlayer
                "",     // ll
                "",     // pi
                value,  // fines
                ""      // micro
            );

            section.layers.push(newLayer);

            // Set new layer active
            this.setState({ activelayerid: newLayerID });
        }

        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }


    getMicro() {
        const gfk = new GFK();
        let micro = "";

        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getPTSlabLayerByID.call(this, projectid, sectionid, layerid);
            if (layer && layer.micro !== undefined) {
                micro = layer.micro;
            }
        }

        return micro;
    }


    handleMicro(value) {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const makeid = new MakeID();

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        // Ensure ptslab exists
        if (!projects[i].ptslab) projects[i].ptslab = {};
        if (!Array.isArray(projects[i].ptslab.sections)) {
            projects[i].ptslab.sections = [];
        }

        const ptslab = projects[i].ptslab;
        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const sectionIndex = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = ptslab.sections[sectionIndex];

        // Ensure layers array exists
        if (!Array.isArray(section.layers)) {
            section.layers = [];
        }

        const layerid = this.state.activelayerid;

        if (layerid) {
            // ---- UPDATE EXISTING LAYER ----
            const layerIndex = gfk.getPTSlabLayerKeyByID.call(this, projectid, sectionid, layerid);
            if (layerIndex === false) return;

            section.layers[layerIndex].micro = value;

        } else {
            // ---- CREATE NEW LAYER ----
            const newLayerID = makeid.ptslablayerid.call(this, projectid, sectionid);

            const newLayer = PTSlabLayer(
                newLayerID,
                "",     // layername
                "",     // toplayer
                "",     // bottomlayer
                "",     // ll
                "",     // pi
                "",     // fines
                value   // micro
            );

            section.layers.push(newLayer);

            // Set new layer active
            this.setState({ activelayerid: newLayerID });
        }

        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }


    async saveSection() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectidl
        const ptslab = gfk.getPTSlabByProjectID.call(this,projectid)
        const response = await HandlePTSlab({ ptslab })
       



    }

   loadslabids() {
    const gfk = new GFK();
    const projectid = this.props.match.params.projectid;

    const project = gfk.getProjectById.call(this, projectid);
    if (!project || !project.ptslab || !Array.isArray(project.ptslab.sections)) {
        return [];
    }

    const sections = project.ptslab.sections;
    const sectionids = [];

    sections.forEach(section => {
        sectionids.push(this.showslabid(section));
    });

    return sectionids;
}


  handleSectionId(sectionid) {
    const active = this.state.activesectionid;

    this.setState({
        activesectionid: active === sectionid ? false : sectionid
    });
}


    showslabid(ptslab) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const removeIcon = gfk.getremoveicon.call(this)
        const projectid = this.props.match.params.projectid;

        const highlightactive = () => {

            if (this.state.activesectionid === ptslab.sectionid) {
                return (styles.activefieldreport)
            }
        }



        return (
            <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15, }}>
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handleSectionId(ptslab.sectionid) }}>
                    <span style={{ ...regularFont }}>
                        {ptslab.sectionname}
                    </span>

                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => {
                        this.removeSection(ptslab.sectionid)
                    }}>
                        {removeIconSmall()}
                    </button>
                </div>

            </div>)



    }

    removeSection(sectionid) {
    const gfk = new GFK();
    const projectid = this.props.match.params.projectid;
    const projects = gfk.getProjects.call(this);

    // Find project index
    const i = gfk.getProjectKeyById.call(this, projectid);
    if (i === false) return false;

    const project = projects[i];

    // Ensure ptslab exists
    if (!project.ptslab || !Array.isArray(project.ptslab.sections)) return false;

    const sections = project.ptslab.sections;

    // Find section index
    const j = sections.findIndex(sec => sec.sectionid === sectionid);
    if (j === -1) return false;

    // Remove the section
    sections.splice(j, 1);

    // Update Redux
    this.props.reduxProjects(projects);

    // Clear active section if it was removed
    if (this.state.activesectionid === sectionid) {
        this.setState({ activesectionid: false });
    }

    return true;
}


    showlayerids() {
        const gfk = new GFK();
        const layerids = [];
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const layers = gfk.getPTSlabLayersbysectionID.call(this,projectid, sectionid)
            if (layers) {
                // eslint-disable-next-line
                layers.map(layer => {
                    layerids.push(this.showlayerid(layer))

                })
            }
        }
        return layerids;


    }

    showlayerid(layer) {

        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const removeIcon = gfk.getremoveicon.call(this)
        const highlightactive = () => {

            if (this.state.activelayerid === layer.layerid) {
                return (styles.activefieldreport)
            }
        }


        return (

            <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handleLayerID(layer.layerid) }}>
                    <span style={{ ...regularFont }}>{layer.layername} Top:{layer.toplayer}ft Bottom:{layer.bottomlayer}ft LL:{layer.ll} PI: {layer.pi} Fines: {layer.fines}% Micro:{layer.micro}%</span>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => {
                        this.removeLayer(layer.layerid)
                    }}>
                        {removeIconSmall()}
                    </button>

                </div>
            </div>
        )


    }

   removeLayer(layerid) {
    const gfk = new GFK();
    const projects = gfk.getProjects.call(this);
    const projectid = this.props.match.params.projectid;
    const sectionid = this.state.activesectionid;
    const project = gfk.getProjectById.call(this, projectid);
    if (!project || !project.ptslab || !Array.isArray(project.ptslab.sections)) return;

    const i = gfk.getProjectKeyById.call(this, projectid);
    const section = project.ptslab.sections.find(sec => sec.sectionid === sectionid);
    if (!section || !Array.isArray(section.layers)) return;

    const layerIndex = section.layers.findIndex(layer => layer.layerid === layerid);
    if (layerIndex === -1) return;

    // Remove the layer
    projects[i].ptslab.sections.find(sec => sec.sectionid === sectionid)
                              .layers.splice(layerIndex, 1);

    this.props.reduxProjects(projects);
    this.setState({ activelayerid: false, render: 'render' });
}


    handleLayerID(layerid) {
    this.setState(prevState => ({
        activelayerid: prevState.activelayerid === layerid ? false : layerid
    }));
}


    getPISamples() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const borings = gfk.getBoringsByProjectId.call(this, projectid)
        const sampleids = [];
        let showoptions = [];

        const checksampleid = (sampleids, checksampleid) => {
            let check = false;
            // eslint-disable-next-line
            sampleids.map(sampleid => {
                if (sampleid.sampleid === checksampleid) {
                    check = true;
                }
            })

            return check;

        }

        if (borings) {
            // eslint-disable-next-line
            borings.map(boring => {
                const boringid = boring.boringid;
                const boringnumber = boring.boringnumber;
                const samples = gfk.getSamplesByBoringId.call(this,projectid, boringid)
                if (samples) {
                    // eslint-disable-next-line
                    samples.map(sample => {
                        if (Number(sample.ll) > 0 && Number(sample.pi) > 0) {

                            let check = checksampleid(sampleids, sample.sampleid)
                            if (!check) {
                                sampleids.push({ sampleid: sample.sampleid })

                            }



                        }
                        const sieve = gfk.getsievekeybysampleid.call(this, boringid, sample.sampleid)
                        if (sieve) {

                            let check = checksampleid(sampleids, sample.sampleid)
                            if (!check) {
                                sampleids.push({ sampleid: sample.sampleid })

                            }


                        }
                    })

                }

                // eslint-disable-next-line
                sampleids.map(id => {
                    const getsample = gfk.getSampleById.call(this, projectid, boringid, id.sampleid)
                    const label = `${boringnumber}-${getsample.sampleset}(${getsample.samplenumber})${getsample.depth}`
                    showoptions.push(this.showPISamples(id.sampleid, label))


                })



            })

        }

        return showoptions;

    }

    showPISamples(sampleid, label) {
        return (<option value={sampleid}>{label}</option>)

    }

    getLabData(value) {
        const gfk = new GFK();
        const sampleid = value;
        const projectid = this.props.match.params.projectid;
        if (this.state.activelayerid) {
            const boring = gfk.getBoringfromSampleID.call(this, projectid, sampleid)

            let ll = 0
            let pi = 0
            let fines = '';
            const sample = gfk.getSampleById.call(this, projectid, boring.boringid, sampleid)
            console.log(sample)
            if (sample) {

                if (Number(sample.ll) > 0) {
                    ll = Number(sample.ll)
                    this.handleLL(ll)
                }
                if (Number(sample.pi) > 0) {
                    pi = Number(sample.pi)
                    this.handlePI(pi)
                }

                const sieve = gfk.getSieveBySampleId.call(this, projectid, boring.boringid, sampleid)
                if (sieve) {
                    const netwgt = Number(sample.drywgt) - Number(sample.tarewgt)
                    const wgt34 = sieve.wgt34;
                    const wgt38 = sieve.wgt38;
                    const wgt4 = sieve.wgt4;
                    const wgt10 = sieve.wgt10;
                    const wgt30 = sieve.wgt30;
                    const wgt40 = sieve.wgt40;
                    const wgt100 = sieve.wgt100;
                    const wgt200 = sieve.wgt200;
                    const soilclassification = new SoilClassification(netwgt, ll, pi, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200)
                    fines = soilclassification.getFines()
                    this.handleFines(fines)
                }

            }

        }

    }

    showOutput() {
        let output = [];
        const gfk = new GFK();
        const ptslabcalcs = new PTSlabCalcs();
        const projectid = this.props.match.params.projectid;
        let calculate = [];
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getPTSlabByID.call(this, projectid, sectionid)
            if (section) {

                if (section.hasOwnProperty("layers")) {

                    // eslint-disable-next-line
                    section.layers.map((layer, i) => {
                        const layerid = layer.layerid;
                        const layername = layer.layername;
                        const toplayer = Number(layer.toplayer)
                        const bottomlayer = Number(layer.bottomlayer)
                        const ll = Number(layer.ll);
                        const pi = Number(layer.pi)
                        const fines = Number(layer.fines)
                        const micro = Number(layer.micro)
                        const zone = ptslabcalcs.getzone(ll, pi)
                        const Ss = Number(ptslabcalcs.getSs(ll, pi, fines)).toFixed(4)
                        const Fc = ptslabcalcs.getFc(fines, micro)
                        const pifc = ptslabcalcs.getPIFc(pi, Fc)
                        const llfc = ptslabcalcs.getLLFc(ll, Fc)
                        const gamma = ptslabcalcs.getGamma.call(this, zone, pifc, llfc)
                        const gammah = ptslabcalcs.getGammah(gamma, Fc)
                        const gammahswell = ptslabcalcs.getGammaSwell(gammah)
                        const gammahshrink = ptslabcalcs.getGammaShrink(gammah)
                        const alphah = ptslabcalcs.getAlphah(Ss, Number(gammah))
                        const alphahswell = ptslabcalcs.getAlphah(Ss, Number(gammahswell))
                        const alphahshrink = ptslabcalcs.getAlphah(Ss, Number(gammahshrink))

                        calculate.push({ layername, toplayer, bottomlayer, gamma, gammah, gammahshrink, gammahswell, alphah, alphahshrink, alphahswell })
                        output.push(this.showResults(layerid, layername, zone, Ss, Fc, llfc, pifc, gamma, gammah, gammahswell, gammahshrink, alphah, alphahswell, alphahshrink))

                    })

                }

                const averages = ptslabcalcs.getWeightAvg(calculate)
                const centerliftem = ptslabcalcs.calcCenterLiftem(averages.alphahshrinkavg);
                averages.centerliftem = centerliftem;
                const edgeliftem = ptslabcalcs.calcEdgeLiftem(averages.alphahswellavg)
                averages.edgeliftem = edgeliftem;
                const centerliftym = ptslabcalcs.calcCenterLiftym(averages.gammahshrinkavg);
                averages.centerliftym = centerliftym;
                const edgeliftym = ptslabcalcs.calcEdgeLiftym(averages.gammahswellavg)
                averages.edgeliftym = edgeliftym;
                output.push(this.showFinal(averages))

            }
        }
        return output;
    }

    showFinal(averages) {
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const styles = MyStylesheet();
        return (
            <div style={{ ...styles.flex1, ...styles.generalFont, ...styles.showBorder }}>

                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        γhavg: {averages.gammahavg}
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        γhswellavg: {averages.gammahswellavg}
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        γhshrinkavg: {averages.gammahshrinkavg}
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        αhavg: {averages.alphahavg}
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        αhswellavg: {averages.alphahswellavg}
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        αhshrinkavg: {averages.alphahshrinkavg}
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        CenterLift em: {averages.centerliftem} ft
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        EdgeLift em: {averages.edgeliftem} ft
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        CenterLift ym: {averages.centerliftym} in
                    </span>
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        EdgeLift ym: {averages.edgeliftym} in
                    </span>
                </div>

            </div>)
    }

    showResults(layerid, layername, zone, Ss, Fc, llfc, pifc, gamma, gammah, gammahswell, gammahshrink, alphah, alphahswell, alphahshrink) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this)

        return (<div style={{ ...styles.flex1, ...styles.showBorder }} key={`a${layerid}`}>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...headerFont, ...styles.boldFont }}>
                    {layername}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    Mineral Classification: Zone {zone}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    Ss: {Ss}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    Fc: {Fc}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    PI/Fc: {pifc}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    LL/Fc: {llfc}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    γo: {gamma}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    γh: {gammah}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    γhswell: {gammahswell}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    γhshrink: {gammahshrink}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    αh: {alphah}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    αhswell: {alphahswell}
                </span>
            </div>
            <div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>
                    αhshrink {alphahshrink}
                </span>
            </div>


        </div>)





    }





    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const engineerid = this.props.match.params.engineerid;
        const headerFont = gfk.getHeaderFont.call(this)
        const projectid = this.props.match.params.projectid;
        const project = gfk.getProjectById.call(this, projectid)
        const regularFont = gfk.getRegularFont.call(this)
        const buttonWidth = gfk.getsaveprojecticon.call(this)
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
                        to={`/${engineerid}/projects/${projectid}/ptslab`}>
                        /PTSlab
                    </Link>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                    <span style={{ ...headerFont, ...styles.boldFont }}>Section</span>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>
                        <span style={{ ...regularFont }}>Section Name</span>
                    </div>
                    <div style={{ ...styles.flex5 }}>
                        <input style={{ ...regularFont, ...styles.mediumWidth }}
                            value={this.getSectionName()}
                            onChange={(event) => { this.handleSectionName(event.target.value) }}
                        />
                    </div>
                </div>

                {this.loadslabids()}

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                &nbsp;
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <span style={{ ...headerFont, ...styles.boldFont }}>Create A Layer</span>

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> Name </span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getLayerName()}
                                    onChange={event => { this.handleLayerName(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> Top of Layer</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this. getTopLayer()}
                                    onChange={event => { this.handleTopLayer(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> Bottom of Layer</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getBottomLayer()}
                                    onChange={event => { this.handleBottomLayer(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> LL</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getLL()}
                                    onChange={event => { this.handleLL(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> PI</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getPI()}
                                    onChange={event => { this.handlePI(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> Fines</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getFines()}
                                    onChange={event => { this.handleFines(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> % Micro</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getMicro()}
                                    onChange={event => { this.handleMicro(event.target.value) }}
                                />

                            </div>
                        </div>



                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1 }}>
                                &nbsp;
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <button style={{ ...styles.generalButton, ...buttonWidth }}
                                    onClick={() => this.saveSection()}>
                                    {saveSection()}
                                </button>

                            </div>
                        </div>

                        <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                            <span style={{ ...regularFont }}>{this.state.message}</span>
                        </div>



                    </div>


                    <div style={{ ...styles.flex1 }}>

                        <select style={{ ...styles.generalField, ...regularFont }} onChange={event => { this.getLabData(event.target.value) }}>
                            <option value="">Select A Sample</option>
                            {this.getPISamples()}
                        </select>

                    </div>

                </div>

                {this.showlayerids()}





                <div style={{ ...styles.generalFlex }}>
                    {this.showOutput()}
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
        projects:state.projects,
        zonecharts: state.zonecharts,
        ptslab: state.ptslab
    }
}
export default connect(mapStateToProps, actions)(PTSlab);