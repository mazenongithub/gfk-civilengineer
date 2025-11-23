import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { LoadSlopeStability, SaveSlope } from './actions/api';
import SlopeStabilityCalcs from './slopestabilitycalcs';
import { removeIconSmall, layerDown, layerUp, saveProjectIcon } from './svg';
import { newSection, newLayer, subSurface, failureSurface, newPoint, inputUTCStringForLaborID } from './functions';
import MakeID from './makeids';


class SlopeStability extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0, height: 0, render: 'render', message: '', activesectionid: false, section: '', slices: '', activelayerid: false, layer: "", layertype:
                "", cx: '', cy: "", rx: "", ry: "", gamma: '', cohesion: '', friction: '', activepointid: false, xcoord: '', ycoord: ''
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

    async saveSlopeStability() {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;


        if (!project.slope) return;
        const slope = project.slope;
        console.log(slope)
        try {
            // Send slope to backend
            const values = { projectid, slope };
            console.log(values)
            const response = await SaveSlope(values);
            console.log(response)
            // Extract response properties safely
            const message = response?.message;
            const returnedSlopeObj = response?.slope


            if (!returnedSlopeObj) return;

            const returnedProjectId = returnedSlopeObj.projectid;


            // Update projects in Redux
            const projects = gfk.getProjects.call(this);
            const index = gfk.getProjectKeyById.call(this, returnedProjectId);

            if (index !== false && projects[index]) {
                projects[index].slope = returnedSlopeObj;
                this.props.reduxProjects(projects);
                this.setState({ message });
            }


        } catch (err) {
            alert(err?.errorMessage || err?.message || String(err));
        }


    }

    getFactorofSafety() {
        const gfk = new GFK();
        const calcs = new SlopeStabilityCalcs();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;

        const extents = calcs.getExtents.call(this, projectid, sectionid);
        const failuresurface = gfk.getFailureSurface.call(this, projectid, sectionid);

        // Safely get failure surface properties
        const cx = failuresurface?.failure?.cx ?? 0;
        const cy = failuresurface?.failure?.cy ?? 0;
        const rx = failuresurface?.failure?.rx ?? 0;
        const ry = failuresurface?.failure?.ry ?? 0;

        const slices = gfk.getSlices.call(this, projectid, sectionid);
        const deltax = slices > 0 ? extents / slices : 0;

        let fs = 0;
        let driving = 0;
        let resisting = 0;

        const subsurfaces = gfk.getSubsurfaces.call(this, projectid, sectionid);

        if (extents > 0 && Array.isArray(subsurfaces) && deltax > 0) {
            const numberofsurfaces = subsurfaces.length;

            for (let x = 0; x <= extents; x += deltax) {
                let weight = 0;
                const pointy = calcs.getellispey(rx, ry, cx, cy, x);

                subsurfaces.forEach((subsurface, i) => {
                    if (!subsurface || !subsurface.points || !subsurface.strength) return;

                    const cohesion = subsurface.strength.cohesion ?? 0;
                    const phi = subsurface.strength.friction ?? 0;
                    const density = subsurface.strength.gamma ?? 0;

                    const surfacey = calcs.getYsurface.call(this, subsurface.points, x);
                    const surfacedeltay = calcs.getYsurface.call(this, subsurface.points, x + deltax);
                    const pointdeltay = calcs.getellispey(rx, ry, cx, cy, x + deltax);

                    if (numberofsurfaces === i + 1) {
                        if (surfacedeltay > pointdeltay && x + deltax <= extents) {
                            const area = calcs.getarea(deltax, pointy, pointdeltay, surfacey, surfacedeltay);
                            weight += density * area;
                            const alpha = calcs.getalpha(pointdeltay, pointy, deltax);
                            resisting += calcs.calcfsnum(cohesion, weight, phi, alpha, deltax);
                            driving += calcs.calcfsden(weight, alpha);
                            weight = 0;
                        }
                    } else {
                        const surfacey_next = calcs.getYsurface.call(this, subsurfaces[i + 1].points, x);
                        const surfacedeltay_next = calcs.getYsurface.call(this, subsurfaces[i + 1].points, x + deltax);

                        if (surfacey_next > pointdeltay && x + deltax <= extents) {
                            const area = calcs.getarea(deltax, surfacey_next, surfacedeltay_next, surfacey, surfacedeltay);
                            weight += density * area;
                        } else if (surfacedeltay > pointdeltay && x + deltax <= extents) {
                            const area = calcs.getarea(deltax, pointy, pointdeltay, surfacey, surfacedeltay);
                            weight += density * area;
                            const alpha = calcs.getalpha(pointdeltay, pointy, deltax);
                            resisting += calcs.calcfsnum(cohesion, weight, phi, alpha, deltax);
                            driving += calcs.calcfsden(weight, alpha);
                            weight = 0;
                        }
                    }
                });
            }
        }

        fs = driving > 0 ? Number(resisting / driving).toFixed(2) : 0;
        return fs;
    }


    drawslices() {

        const gfk = new GFK();
        const calcs = new SlopeStabilityCalcs();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;
        const extents = calcs.getExtents.call(this, projectid, sectionid)
        const failuresurface = gfk.getFailureSurface.call(this, projectid, sectionid)
        const cx = failuresurface?.failure?.cx ?? 0;
        const cy = failuresurface?.failure?.cy ?? 0;
        const rx = failuresurface?.failure?.rx ?? 0;
        const ry = failuresurface?.failure?.ry ?? 0;
        const slices = gfk.getSlices.call(this, projectid, sectionid)
        const deltax = extents / slices;
        let scale = calcs.getScale.call(this, projectid, sectionid)
        scale = 10 * (10 / scale)
        let getslices = [];

        const subsurfaces = gfk.getSubsurfaces.call(this, projectid, sectionid)
        if (extents > 0) {
            if (subsurfaces) {
                const numberofsurfaces = subsurfaces.length

                for (let x = 0; x <= extents; x = x + deltax) {

                    let pointy = calcs.getellispey(rx, ry, cx, cy, x)
                    // eslint-disable-next-line
                    subsurfaces.map((subsurface, i) => {

                        if (subsurface.hasOwnProperty("points")) {

                            subsurface.points.sort((a, b) => {
                                if (Number(a.xcoord) >= Number(b.xcoord)) {
                                    return 1;
                                } else {
                                    return -1
                                }
                            })

                        }

                        let surfacey = calcs.getYsurface.call(this, subsurface.points, x)
                        let surfacedeltay = calcs.getYsurface.call(this, subsurface.points, x + deltax)
                        let pointdeltay = calcs.getellispey(rx, ry, cx, cy, x + deltax)

                        if (numberofsurfaces === i + 1) {



                            if (surfacedeltay > pointdeltay) {

                                if (x + deltax <= extents) {


                                    let slice = `${scale * x} ${scale * surfacey} ${scale * x} ${scale * pointy} ${scale * (x + deltax)} ${scale * pointdeltay} ${scale * (x + deltax)} ${scale * surfacedeltay} `
                                    getslices.push(this.drawsurface(slice))
                                }
                            }



                        } else {
                            // check second surface to see if its above failure surface. If so, then slices goes to second surface
                            let surfacey_2 = calcs.getYsurface.call(this, subsurfaces[i + 1].points, x)
                            let surfacedeltay_2 = calcs.getYsurface.call(this, subsurfaces[i + 1].points, x + deltax)

                            if (surfacey_2 > pointdeltay) {

                                if (x + deltax <= extents) {

                                    let slice = `${scale * x} ${scale * surfacey} ${scale * x} ${scale * surfacey_2} ${scale * (x + deltax)} ${scale * surfacedeltay_2} ${scale * (x + deltax)} ${scale * surfacedeltay} `

                                    getslices.push(this.drawsurface(slice))

                                }


                            } else {

                                if (surfacedeltay > pointdeltay) {

                                    if (x + deltax <= extents) {

                                        let slice = `${scale * x} ${scale * surfacey} ${scale * x} ${scale * pointy} ${scale * (x + deltax)} ${scale * pointdeltay} ${scale * (x + deltax)} ${scale * surfacedeltay} `
                                        getslices.push(this.drawsurface(slice))

                                    }
                                }

                            }


                            // if not slice goes to failure surface


                        }



                    })



                }

            }

        }



        return getslices;

    }

    drawfailuresurface() {
        const gfk = new GFK();
        const calcs = new SlopeStabilityCalcs();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;
        const extents = calcs.getExtents.call(this, projectid, sectionid)
        const failuresurface = gfk.getFailureSurface.call(this, projectid, sectionid)
        const cx = failuresurface?.failure?.cx ?? 0;
        const cy = failuresurface?.failure?.cy ?? 0;
        const rx = failuresurface?.failure?.rx ?? 0;
        const ry = failuresurface?.failure?.ry ?? 0;
        const slices = gfk.getSlices.call(this, projectid, sectionid)
        const deltax = extents / slices;
        let scale = calcs.getScale.call(this, projectid, sectionid)
        scale = 10 * (10 / scale)
        let surface = [];
        let points = "";
        const topsurface = gfk.getTopSurface.call(this, projectid, sectionid)
        if (extents > 0) {
            if (topsurface) {

                topsurface.points.sort((a, b) => {
                    if (Number(a.xcoord) >= Number(b.xcoord)) {
                        return 1;
                    } else {
                        return -1
                    }
                })

                for (let x = 0; x <= extents; x = x + deltax) {



                    let pointy = calcs.getellispey(rx, ry, cx, cy, x)
                    let surfacey = calcs.getYsurface.call(this, topsurface.points, x)
                    if (surfacey >= pointy) {
                        points += `${scale * (x)} ${scale * pointy} `

                    }



                }


                surface.push(this.drawsurface(points))

            }

        }
        return surface;


    }

    drawsurface(points) {
        return (<g transform="translate(110,1002.5) scale(1,-1)">
            <polyline className="unchart-8" points={points} />
        </g>)
    }

    drawSubsurface() {
        const gfk = new GFK();
        const calcs = new SlopeStabilityCalcs();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;
        const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid)
        let subsurface = [];

        let scale = calcs.getScale.call(this, projectid, sectionid)
        scale = 10 * (10 / scale)
        if (section.hasOwnProperty("layers")) {
            // eslint-disable-next-line
            section.layers.map(layer => {
                let points = "";
                if (layer.hasOwnProperty("subsurface")) {
                    if (layer.hasOwnProperty("points")) {

                        layer.points.sort((a, b) => {
                            if (Number(a.xcoord) >= Number(b.xcoord)) {
                                return 1;
                            } else {
                                return -1
                            }
                        })
                        // eslint-disable-next-line
                        layer.points.map(point => {
                            points += `${scale * point.xcoord} ${scale * point.ycoord} `
                        })
                        subsurface.push(this.drawsurface(points))
                    }
                }

            })
        }

        return subsurface;

    }

    drawBlock() {
        const calcs = new SlopeStabilityCalcs();
        const projectid = this.props.match.params.projectid;
        let scale = 1;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            scale = calcs.getScale.call(this, projectid, sectionid)
            scale = scale / 10;
        }

        const styles = MyStylesheet();

        return (
            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

                <svg id="Layer_2"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1112.5 1048">
                    <defs>
                        <style></style>
                    </defs>
                    <g id="Layer_1-2">
                        <text className="slopestability-1" transform="translate(102.81 1040.3)">
                            <tspan x="0" y="0">0</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(294.11 1040.3)">
                            <tspan x="0" y="0">{20 * scale}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(34.61 812.3)">
                            <tspan x="0" y="0">{20 * scale}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(34.61 614.3)">
                            <tspan x="0" y="0">{40 * scale}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(34.61 409.3)">
                            <tspan x="0" y="0">{60 * scale}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(34.61 209.3)">
                            <tspan x="0" y="0">{80 * scale}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(424.61 49.3)">
                            <tspan x="0" y="0">Factor of Safety: {this.getFactorofSafety()}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(494.11 1040.3)">
                            <tspan x="0" y="0">{40 * scale}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(695.11 1040.3)">
                            <tspan x="0" y="0">{60 * scale}</tspan>
                        </text>
                        <text className="slopestability-1" transform="translate(893.11 1040.3)">
                            <tspan x="0" y="0">{80 * scale}</tspan>
                        </text>
                    </g>
                    <g id="grid">
                        <rect className="slopestability-2" x="110" y="2.5" width="1000" height="1000" />
                        <line className="slopestability-2" x1="310" y1="986" x2="310" y2="1012" />
                        <line className="slopestability-2" x1="510" y1="986" x2="510" y2="1012" />
                        <line className="slopestability-2" x1="710" y1="987" x2="710" y2="1013" />
                        <line className="slopestability-2" x1="710" y1="986" x2="710" y2="1012" />
                        <line className="slopestability-2" x1="910" y1="986" x2="910" y2="1012" />
                        <line className="slopestability-2" x1="130.62" y1="202.5" x2="87.62" y2="202.5" />
                        <line className="slopestability-2" x1="130.62" y1="402.5" x2="87.62" y2="402.5" />
                        <line className="slopestability-2" x1="130.5" y1="602.5" x2="87.5" y2="602.5" />
                        <line className="slopestability-2" x1="130.5" y1="602.5" x2="87.5" y2="602.5" />
                        <line className="slopestability-2" x1="130.62" y1="602.5" x2="87.62" y2="602.5" />
                        <line className="slopestability-2" x1="130.62" y1="802.5" x2="87.62" y2="802.5" />
                        <circle className="slopestability-3" cx="110" cy="1002.5" r="6.5" />
                    </g>

                    {this.drawSubsurface()}
                    {this.drawfailuresurface()}
                    {this.drawslices()}


                </svg>


            </div>)
    }

    getGamma() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        // No active section
        if (!this.state.activesectionid) return "";

        const sectionid = this.state.activesectionid;

        // No active layer
        if (!this.state.activelayerid) return "";

        const layerid = this.state.activelayerid;

        // Get the layer
        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
        if (!layer) return "";

        // Failure layers do not have gamma
        if (layer.layertype === "failure") return "";

        // Ensure strength exists & gamma exists
        if (layer.strength && typeof layer.strength.gamma !== "undefined") {
            return layer.strength.gamma;
        }

        // Default fallback
        return "";
    }


    handleGamma(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const layerid = this.state.activelayerid;
        if (!layerid) return;

        // Find section + layer indexes
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        // Deep clone project safely
        const updatedProject = JSON.parse(JSON.stringify(project));

        const layer =
            updatedProject.slope.sections[sectionIndex].layers[layerIndex];

        // Ensure strength object exists
        if (!layer.strength) {
            layer.strength = {
                gamma: "",
                friction: "",
                cohesion: ""
            };
        }

        // Set new gamma value
        layer.strength.gamma = value;

        // --- UPDATE PROJECTS IN REDUX ---
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = updatedProject;

        this.props.reduxProjects(updatedProjects);

        // Re-render
        this.setState({ render: "render" });
    }




    getCohesion() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return "";

        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
        if (!layer || !layer.strength) return "";

        return layer.strength.cohesion || "";
    }


    handleCohesion(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const layerid = this.state.activelayerid;
        if (!layerid) return;

        // Find section + layer indexes
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        // Deep clone the project safely
        const updatedProject = JSON.parse(JSON.stringify(project));

        const layer =
            updatedProject.slope.sections[sectionIndex].layers[layerIndex];

        // Ensure strength object exists
        if (!layer.strength) {
            layer.strength = {
                gamma: "",
                friction: "",
                cohesion: ""
            };
        }

        // Apply cohesion update
        layer.strength.cohesion = value;

        // --- UPDATE PROJECTS IN REDUX ---
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = updatedProject;

        this.props.reduxProjects(updatedProjects);

        // Refresh UI
        this.setState({ render: "render" });
    }



    getFriction() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return "";

        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
        if (!layer || !layer.strength) return "";

        return layer.strength.friction || "";
    }


    handleFriction(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        const sectionid = this.state.activesectionid;
        if (!sectionid) return;

        const layerid = this.state.activelayerid;
        if (!layerid) return;

        // Find section + layer indexes
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        // Deep clone project
        const updatedProject = JSON.parse(JSON.stringify(project));

        const layer =
            updatedProject.slope.sections[sectionIndex].layers[layerIndex];

        // Ensure strength object exists
        if (!layer.strength) {
            layer.strength = {
                gamma: "",
                friction: "",
                cohesion: ""
            };
        }

        // Apply friction (phi) update
        layer.strength.friction = value;

        // --- UPDATE PROJECTS IN REDUX ---
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = updatedProject;

        this.props.reduxProjects(updatedProjects);

        // Trigger UI refresh
        this.setState({ render: "render" });
    }



    showPointIDs() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let getpoints = [];
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid)
            if (section) {
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("points")) {

                            layer.points.sort((a, b) => {
                                if (Number(a.xcoord) >= Number(b.xcoord)) {
                                    return 1;
                                } else {
                                    return -1
                                }
                            })

                            // eslint-disable-next-line
                            layer.points.map(point => {
                                getpoints.push(this.showPointID(point))
                            })





                        }

                    }
                }


            }

        }
        return getpoints;


    }

    handlePointID(pointid) {
        const { activepointid } = this.state;

        // Toggle behavior:
        // If no active point → activate this point
        // If already active → deactivate
        const newActivePointID = activepointid ? false : pointid;

        this.setState({ activepointid: newActivePointID });
    }


    showPointID(point) {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
        const removeIcon = gfk.getremoveicon.call(this)

        const highlightactive = () => {

            if (this.state.activepointid === point.pointid) {
                return (styles.activefieldreport)
            }
        }
        return (<div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex5, ...styles.generalFont }}>
                    <span style={{ ...regularFont, ...highlightactive() }} onClick={() => { this.handlePointID(point.pointid) }}>
                        X: {point.xcoord} Y: {point.ycoord}
                    </span>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => {
                        this.removePoint(point.pointid)
                    }}>
                        {removeIconSmall()}
                    </button>

                </div>
            </div>
        </div>)

    }

    removePoint(pointid) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return;

        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const section = project.slope.sections[sectionIndex];
        if (!section || !Array.isArray(section.layers)) return;

        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        const layer = section.layers[layerIndex];
        if (!layer || !Array.isArray(layer.points)) return;

        const pointIndex = gfk.getSlopePointKeyByID.call(this, projectid, sectionid, layerid, pointid);
        if (pointIndex === false) return;

        // ---- Remove the point ----
        layer.points.splice(pointIndex, 1);

        // ---- Push updated project list to Redux ----
        this.props.reduxProjects(projects);

        // ---- Clear active point if removing selected one ----

        this.setState({ activepointid: false });

    }


    getXcoord() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        if (!this.state.activesectionid || !this.state.activelayerid || !this.state.activepointid) {
            return "";
        }

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;
        const pointid = this.state.activepointid;

        const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid);
        return point && point.xcoord ? point.xcoord : "";
    }


    handleXcoord(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;
        const projectIndex = gfk.getProjectKeyById.call(this, projectid)

        // Must have active section and layer
        if (!this.state.activesectionid || !this.state.activelayerid) return;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        // Ensure points array exists
        const layer = projects[projectIndex].slope.sections[sectionIndex].layers[layerIndex];
        if (!Array.isArray(layer.points)) {
            layer.points = [];
        }

        // If a point is active → update its xcoord
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const pointIndex = gfk.getSlopePointKeyByID.call(
                this,
                projectid,
                sectionid,
                layerid,
                pointid
            );

            if (pointIndex === false) return;

            layer.points[pointIndex].xcoord = value;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // Otherwise create a new point
        const newPointID = makeid.pointID.call(this, projectid);
        const ycoord = ""; // default ycoord until user enters it

        const createdPoint = newPoint(newPointID, value, ycoord);

        // Append it
        layer.points.push(createdPoint);

        // Make this new point active
        this.setState({ activepointid: newPointID });

        // Update Redux
        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }



    getYcoord() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        if (!this.state.activesectionid || !this.state.activelayerid || !this.state.activepointid) {
            return "";
        }

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;
        const pointid = this.state.activepointid;

        const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid);
        if (point && point.hasOwnProperty("ycoord")) {
            return point.ycoord;
        }

        return "";
    }


    handleYcoord(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid)

        // Must have active section + layer
        if (!this.state.activesectionid || !this.state.activelayerid) return;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        const layer = projects[projectIndex].slope.sections[sectionIndex].layers[layerIndex];

        // Ensure points array exists
        if (!Array.isArray(layer.points)) {
            layer.points = [];
        }

        // If a point is active → update ycoord
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const pointIndex = gfk.getSlopePointKeyByID.call(
                this,
                projectid,
                sectionid,
                layerid,
                pointid
            );

            if (pointIndex === false) return;

            layer.points[pointIndex].ycoord = value;

            this.props.reduxProjects(projects);
            this.setState({ render: "render" });
            return;
        }

        // Otherwise create a brand-new point
        const newPointID = makeid.pointID.call(this);

        // We don't know xcoord yet → default empty
        const xcoord = "";

        const createdPoint = newPoint(newPointID, xcoord, value);

        // Append it to the layer
        layer.points.push(createdPoint);

        // Make this new point active
        this.setState({ activepointid: newPointID });

        // Update Redux
        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }

    showSubsurface() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)

        return (<div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1, ...styles.alignCenter }}>

                    <span style={{ ...styles.generalFont, ...regularFont }}>Subsurface</span>

                </div>
                <div style={{ ...styles.flex1, ...styles.alignCenter }}>

                    <span style={{ ...styles.generalFont, ...regularFont }}>Add Points</span>

                </div>
            </div>


            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.addMargin }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getGamma()}
                                    onChange={event => { this.handleGamma(event.target.value) }}
                                />
                            </div>
                            <span style={{ ...styles.generalFont, ...regularFont }}>γ (lbs/ft3)</span>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.addMargin }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getCohesion()}
                                    onChange={event => { this.handleCohesion(event.target.value) }} />
                            </div>
                            <span style={{ ...styles.generalFont, ...regularFont }}>Cohesion (psf)</span>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.addMargin }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getFriction()}
                                    onChange={event => { this.handleFriction(event.target.value) }}
                                />
                            </div>
                            <span style={{ ...styles.generalFont, ...regularFont }}>Friction Angle</span>
                        </div>
                    </div>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.addMargin }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getXcoord()}
                                    onChange={event => { this.handleXcoord(event.target.value) }}
                                />
                            </div>
                            <span style={{ ...styles.generalFont, ...regularFont }}>X:</span>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.addMargin }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getYcoord()}
                                    onChange={event => { this.handleYcoord(event.target.value) }}
                                />
                            </div>
                            <span style={{ ...styles.generalFont, ...regularFont }}>Y:</span>
                        </div>

                    </div>
                    {this.showPointIDs()}
                </div>
            </div>


        </div>)

    }

    getCx() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return "";

        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
        if (!layer) return "";

        if (layer.layertype === "failure" && layer.failure?.cx !== undefined) {
            return layer.failure.cx;
        }

        return "";
    }


    handleCx(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return;

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        // Get section & layer indexes
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        const section = project.slope.sections[sectionIndex];
        if (!section || !Array.isArray(section.layers)) return;

        const layer = section.layers[layerIndex];
        if (!layer) return;

        // Only applies to failure layers
        if (layer.layertype !== "failure") return;

        // Ensure failure object exists
        if (!layer.failure) layer.failure = {};

        // Update value
        layer.failure.cx = value;

        // Save back to full project list
        const projects = gfk.getProjects.call(this);
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        projects[projectIndex] = project;

        // Push updated project list to Redux
        this.props.reduxProjects(projects);

        // Trigger UI update
        this.setState({ render: "render" });
    }



    getCy() {
        let cy = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);

            if (layer && layer.layertype === "failure") {
                if (layer.failure && layer.failure.cy !== undefined) {
                    cy = layer.failure.cy;
                }
            }
        }

        return cy;
    }


    handleCy(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return;

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        // Get section index
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        // Get layer index
        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        const section = project.slope.sections[sectionIndex];
        if (!section || !Array.isArray(section.layers)) return;

        const layer = section.layers[layerIndex];
        if (!layer) return;

        // Only applies to failure layers
        if (layer.layertype !== "failure") return;

        // Make sure failure object exists
        if (!layer.failure) layer.failure = {};

        // Update Cy
        layer.failure.cy = value;

        // Save back into the projects array
        const projects = gfk.getProjects.call(this);
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        projects[projectIndex] = project;

        // Dispatch Redux update
        this.props.reduxProjects(projects);

        // Refresh UI
        this.setState({ render: "render" });
    }



    getRx() {
        let rx = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);

            if (layer && layer.layertype === "failure") {
                if (layer.failure && layer.failure.rx !== undefined) {
                    rx = layer.failure.rx;
                }
            }
        }

        return rx;
    }


    handleRx(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return;

        // Get the full project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        // Get section index
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        // Get layer index
        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        const section = project.slope.sections[sectionIndex];
        if (!section || !Array.isArray(section.layers)) return;

        const layer = section.layers[layerIndex];
        if (!layer) return;

        // Only applies to failure layers
        if (layer.layertype !== "failure") return;

        // Ensure failure object exists
        if (!layer.failure) {
            layer.failure = {};
        }

        // Update Rx
        layer.failure.rx = value;

        // Update global projects list
        const projects = gfk.getProjects.call(this);
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        projects[projectIndex] = project;

        // Push to Redux
        this.props.reduxProjects(projects);

        // Trigger UI update
        this.setState({ render: "render" });
    }


    getRy() {
        let ry = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;

            const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);

            if (layer && layer.layertype === "failure") {
                if (layer.failure && layer.failure.ry !== undefined) {
                    ry = layer.failure.ry;
                }
            }
        }

        return ry;
    }


    handleRy(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        const sectionid = this.state.activesectionid;
        const layerid = this.state.activelayerid;

        if (!sectionid || !layerid) return;

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope) return;

        // Get section index
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        // Get layer index
        const layerIndex = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid);
        if (layerIndex === false) return;

        const section = project.slope.sections[sectionIndex];
        if (!section || !Array.isArray(section.layers)) return;

        const layer = section.layers[layerIndex];
        if (!layer) return;

        // Only applies to failure layers
        if (layer.layertype !== "failure") return;

        // Ensure failure object exists
        if (!layer.failure) layer.failure = {};

        // Update Ry
        layer.failure.ry = value;

        // Update the full projects array
        const projects = gfk.getProjects.call(this);
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false) return;

        projects[projectIndex] = project;

        // Dispatch Redux update
        this.props.reduxProjects(projects);

        // Trigger UI refresh
        this.setState({ render: "render" });
    }


    showFailureSurface() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        return (<div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
            <span style={{ ...regularFont }}>Failure Surface</span>

            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1, ...styles.addMargin }}>
                    <div style={{ ...styles.generalContainer }}>
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getCx()}
                            onChange={event => { this.handleCx(event.target.value) }}
                        />
                    </div>
                    <span style={{ ...styles.generalFont, ...regularFont }}>Cx:</span>

                </div>
                <div style={{ ...styles.flex1, ...styles.addMargin }}>
                    <div style={{ ...styles.generalContainer }}>
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getCy()}
                            onChange={event => { this.handleCy(event.target.value) }} />
                    </div>
                    <span style={{ ...styles.generalFont, ...regularFont }}>Cy:</span>

                </div>
                <div style={{ ...styles.flex1, ...styles.addMargin }}>

                    <div style={{ ...styles.generalContainer }}>
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getRx()}
                            onChange={event => { this.handleRx(event.target.value) }}
                        />
                    </div>
                    <span style={{ ...styles.generalFont, ...regularFont }}>Rx:</span>

                </div>
                <div style={{ ...styles.flex1, ...styles.addMargin }}>

                    <div style={{ ...styles.generalContainer }}>
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getRy()}
                            onChange={event => { this.handleRy(event.target.value) }} />
                    </div>
                    <span style={{ ...styles.generalFont, ...regularFont }}>Ry:</span>

                </div>
            </div>


        </div>)
    }

    showSectionIDs() {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();

        const slope = gfk.getSlopeByProjectID.call(this, projectid);
        if (!slope || !Array.isArray(slope.sections)) return [];

        const sectionids = slope.sections.map(section => this.showSectionID(section));
        return sectionids;
    }


    removeSection(sectionid) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        // Get projects and current project
        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope || !Array.isArray(project.slope.sections)) return;

        // Find section index
        const sectionIndex = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
        if (sectionIndex === false) return;

        // Remove section
        project.slope.sections.splice(sectionIndex, 1);

        // Push updated projects to Redux
        this.props.reduxProjects(projects);

        // Reset active section if it was the one removed

        this.setState({ activesectionid: false });

    }


    makeSectionActive(sectionid) {
        this.setState(prevState => ({
            activesectionid: prevState.activesectionid === sectionid ? false : sectionid
        }));
    }




    showSectionID(section) {
        const styles = MyStylesheet();
        const gfk = new GFK()
        const regularFont = gfk.getRegularFont.call(this)
        const removeIcon = gfk.getremoveicon.call(this)

        const highlightactive = () => {

            if (this.state.activesectionid === section.sectionid) {
                return (styles.activefieldreport)
            }
        }

        return (
            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }} key={section.sectionid} >
                <div style={{ ...styles.flex5 }}>

                    <span style={{ ...regularFont, ...highlightactive() }} onClick={() => { this.makeSectionActive(section.sectionid) }}>{section.sectionname} Slices: {section.slices}</span>
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => {
                        this.removeSection(section.sectionid)
                    }}>
                        {removeIconSmall()}
                    </button>
                </div>
            </div>

        )

    }

    getSectionName() {
        const gfk = new GFK();
        let section = "";
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const projectid = this.props.match.params.projectid;
            const getsection = gfk.getSlopeBySectionID.call(this, projectid, sectionid)
            if (getsection) {
                section = getsection.sectionname;
            }

        } else {
            section = this.state.section;
        }
        return section;

    }



    handleSectionName(value) {
        const gfk = new GFK();
        const makeid = new MakeID()
        const projectid = this.props.match.params.projectid;
        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        if (this.state.activesectionid) {
            // Update existing section
            const sectionid = this.state.activesectionid;
            const j = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
            if (j === false) return;

            projects[i].slope.sections[j].sectionname = value;
        } else {
            // Create new section with default slices = 100
            const sectionid = makeid.sectionID.call(this, projectid);
            const newsection = newSection(sectionid, value, 100);
            if (!Array.isArray(projects[i].slope.sections)) {
                projects[i].slope.sections = [];
            }
            projects[i].slope.sections.push(newsection);

            // Set the new section as active
            this.setState({ activesectionid: sectionid });
        }

        this.props.reduxProjects(projects);
        this.setState({ render: 'render' });
    }



    getSlices() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let slices = 100; // default numeric value

        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid);
            if (section && section.hasOwnProperty("slices")) {
                slices = Number(section.slices) || 100; // convert to number if defined
            }
        }

        return slices;
    }

    // Retrieve the number of slices for the active section
    getSlices() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let slices = "" // default numeric value

        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid);
            if (section && section.hasOwnProperty("slices")) {
                slices = Number(section.slices) || ""; // convert to number if defined
            }
        }

        return slices;
    }

    // Update the number of slices for the active section
    handleSlices(value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const projectid = this.props.match.params.projectid;
        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const i = gfk.getProjectKeyById.call(this, projectid);

        if (this.state.activesectionid) {
            // Update existing section
            const sectionid = this.state.activesectionid;
            const j = gfk.getSlopeKeyBySectionID.call(this, projectid, sectionid);
            if (j === false) return;

            projects[i].slope.sections[j].slices = String(value); // store as string
        } else {
            // Create new section with default value and slices
            const sectionid = makeid.sectionID.call(this, projectid);
            const newSectionObj = newSection(sectionid, "", value); // store slices as string
            if (!Array.isArray(projects[i].slope.sections)) {
                projects[i].slope.sections = [];
            }
            projects[i].slope.sections.push(newSectionObj);

            // Set the new section as active
            this.setState({ activesectionid: sectionid });
        }

        this.props.reduxProjects(projects);
        this.setState({ render: "render" });
    }


    showlayerids() {
        const gfk = new GFK();
        let layerids = [];
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid)
            if (section) {
                if (section.hasOwnProperty("layers")) {
                    // eslint-disable-next-line
                    section.layers.map(layer => {
                        layerids.push(this.showlayerid(layer))
                    })
                }
            }
        }
        return layerids;
    }

    handleLayerID(layerid) {
        this.setState({
            activelayerid: this.state.activelayerid ? false : layerid
        });
    }

    removeLayer(layerid) {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;

        if (!this.state.activesectionid) return;

        const sectionid = this.state.activesectionid;
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope || !Array.isArray(project.slope.sections)) return;

        const sections = project.slope.sections;
        const sectionIndex = sections.findIndex(sec => sec.sectionid === sectionid);
        if (sectionIndex === -1) return;


        const section = sections[sectionIndex];
        if (!Array.isArray(section.layers)) return;

        const layerIndex = section.layers.findIndex(layer => layer.layerid === layerid);
        if (layerIndex === -1) return;

        // Remove the layer
        section.layers.splice(layerIndex, 1);

        // Push updated project back to Redux
        const projects = gfk.getProjects.call(this);
        const projectIndex = projects.findIndex(p => p.projectid === projectid);
        if (projectIndex !== -1) {
            projects[projectIndex] = project;
            this.props.reduxProjects(projects);
        }

        // Reset active layer if it was removed

        this.setState({ activelayerid: false });

    }


    moveLayerUp(layerid) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;

        if (!sectionid || !layerid) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope || !Array.isArray(project.slope.sections)) return;

        const sectionIndex = project.slope.sections.findIndex(sec => sec.sectionid === sectionid);
        if (sectionIndex === -1) return;

        const section = project.slope.sections[sectionIndex];
        if (!Array.isArray(section.layers)) return;

        const layerIndex = section.layers.findIndex(layer => layer.layerid === layerid);
        if (layerIndex <= 0) return; // already at top or not found

        // Swap with previous layer
        const temp = section.layers[layerIndex - 1];
        section.layers[layerIndex - 1] = section.layers[layerIndex];
        section.layers[layerIndex] = temp;

        // Update Redux
        const projects = gfk.getProjects.call(this);
        const projectIndex = projects.findIndex(p => p.projectid === projectid);
        if (projectIndex !== -1) {
            projects[projectIndex] = project;
            this.props.reduxProjects(projects);
        }
    }


    moveLayerDown(layerid) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;

        if (!sectionid || !layerid) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope || !Array.isArray(project.slope.sections)) return;

        const sectionIndex = project.slope.sections.findIndex(sec => sec.sectionid === sectionid);
        if (sectionIndex === -1) return;

        const section = project.slope.sections[sectionIndex];
        if (!Array.isArray(section.layers)) return;

        const layerIndex = section.layers.findIndex(layer => layer.layerid === layerid);
        if (layerIndex === -1 || layerIndex === section.layers.length - 1) return; // already at bottom or not found

        // Swap with next layer
        const temp = section.layers[layerIndex + 1];
        section.layers[layerIndex + 1] = section.layers[layerIndex];
        section.layers[layerIndex] = temp;

        // Update Redux
        const projects = gfk.getProjects.call(this);
        const projectIndex = projects.findIndex(p => p.projectid === projectid);
        if (projectIndex !== -1) {
            projects[projectIndex] = project;
            this.props.reduxProjects(projects);
        }
    }




    showlayerid(layer) {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
        const removeIcon = gfk.getremoveicon.call(this)
        const layerarrow = gfk.getLayerArrow.call(this)

        const highlightactive = () => {

            if (this.state.activelayerid === layer.layerid) {
                return (styles.activefieldreport)
            }
        }

        return (
            <div style={{ ...styles.generalContainer }} key={layer.layerid}>
                <div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex5 }}>
                        <span style={{ ...regularFont, ...highlightactive() }} onClick={() => { this.handleLayerID(layer.layerid) }}>
                            {layer.layer} Type: {layer.layertype}
                        </span>

                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <button style={{ ...styles.generalButton, ...layerarrow }} onClick={() => { this.moveLayerUp(layer.layerid) }}>{layerUp()}</button>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <button style={{ ...styles.generalButton, ...layerarrow }} onClick={() => { this.movelayerdown(layer.layerid) }}>{layerDown()}</button>
                        </div>
                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => {
                            this.removeLayer(layer.layerid)
                        }}>
                            {removeIconSmall()}
                        </button>
                    </div>
                </div>

            </div>)
    }

    // Get the layer value of the active layer
    getLayer() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let layerValue = '';

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
            if (layer) {
                layerValue = layer.layer || '';
            }
        }

        return layerValue;
    }

    // Get the layer value of the active layer
    getLayer() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let layerValue = '';

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
            if (layer) {
                layerValue = layer.layer || '';
            }
        }

        return layerValue;
    }

    // Handle setting the layer property
    handleLayer(value) {
        const gfk = new GFK();
        const makeid = new MakeID()
        const projectid = this.props.match.params.projectid;

        if (!this.state.activesectionid) return; // no section selected
        const sectionid = this.state.activesectionid;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope || !Array.isArray(project.slope.sections)) return;

        const sectionIndex = project.slope.sections.findIndex(sec => sec.sectionid === sectionid);
        if (sectionIndex === -1) return;
        const section = project.slope.sections[sectionIndex];

        if (!Array.isArray(section.layers)) section.layers = [];

        // If active layer exists, update it
        if (this.state.activelayerid) {
            const layerIndex = section.layers.findIndex(layer => layer.layerid === this.state.activelayerid);
            if (layerIndex !== -1) {
                section.layers[layerIndex].layer = value;

            }
        } else {
            // Create new layer
            const layerid = makeid.layerID.call(this, projectid);
            const layertype = ''
            const newLayerObj = newLayer(layerid, value, layertype);
            section.layers.push(newLayerObj);

            // Set the new layer as active
            this.setState({ activelayerid: layerid });
        }

        // Update Redux
        const projects = gfk.getProjects.call(this);
        const projectIndex = projects.findIndex(p => p.projectid === projectid);
        if (projectIndex !== -1) {
            projects[projectIndex] = project;
            this.props.reduxProjects(projects);
        }

        this.setState({ render: 'render' });
    }



    getLayerType() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let layertype = '';

        if (this.state.activesectionid && this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
            if (layer) {
                layertype = layer.layertype || '';
            }
        }

        return layertype;
    }

    handleLayerType(value) {
        const gfk = new GFK();
        const makeid = new MakeID()
        const projectid = this.props.match.params.projectid;

        if (!this.state.activesectionid) return; // no section selected
        const sectionid = this.state.activesectionid;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.slope || !Array.isArray(project.slope.sections)) return;

        const sectionIndex = project.slope.sections.findIndex(sec => sec.sectionid === sectionid);
        if (sectionIndex === -1) return;
        const section = project.slope.sections[sectionIndex];

        if (!Array.isArray(section.layers)) section.layers = [];

        // If active layer exists, update its layertype
        if (this.state.activelayerid) {
            const layerIndex = section.layers.findIndex(layer => layer.layerid === this.state.activelayerid);
            if (layerIndex !== -1) {
                section.layers[layerIndex].layertype = value;
            }
        } else {
            // Create a new layer with default layer name and the provided layertype
            const layerid = makeid.layerID.call(this, projectid);
            const newLayerObj = newLayer(layerid, '', value); // empty string for layer name
            section.layers.push(newLayerObj);

            // Set the new layer as active
            this.setState({ activelayerid: layerid });
        }

        // Update Redux
        const projects = gfk.getProjects.call(this);
        const projectIndex = projects.findIndex(p => p.projectid === projectid);
        if (projectIndex !== -1) {
            projects[projectIndex] = project;
            this.props.reduxProjects(projects);
        }

        this.setState({ render: 'render' });
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
                        to={`/${engineerid}/projects/${projectid}/slopestability`}>
                        /slopestability
                    </Link>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer }}>
                            <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                value={this.getSectionName()}
                                onChange={(event) => { this.handleSectionName(event.target.value) }} />
                        </div>
                        <span style={{ ...styles.generalFont, ...regularFont }}>
                            Section Name
                        </span>
                        {this.showSectionIDs()}
                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1 }}>&nbsp;</div>
                            <div style={{ ...styles.flex1 }}>&nbsp;</div>
                            <div style={{ ...styles.flex1 }}>
                                <div style={{ ...styles.generalContainer }}>

                                    <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                        value={this.getSlices()}
                                        onChange={event => { this.handleSlices(event.target.value) }} />
                                </div>

                                <span style={{ ...styles.generalFont, ...regularFont }}>
                                    Slices
                                </span>
                            </div>

                        </div>
                    </div>
                </div>



                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer }}>
                            <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                                value={this.getLayer()}
                                onChange={event => { this.handleLayer(event.target.value) }} />
                        </div>
                        <span style={{ ...styles.generalFont, ...regularFont }}>Layer Name </span>
                        {this.showlayerids()}
                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer }}>
                            <select style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                                value={this.getLayerType()}
                                onChange={event => { this.handleLayerType(event.target.value) }}>
                                <option value="">Select Type</option>
                                <option value="failure">Failure</option>
                                <option value="subsurface">Subsurface</option>
                            </select>
                        </div>
                        <span style={{ ...styles.generalFont, ...regularFont }}>Layer Type </span>
                    </div>


                </div>

                {this.showSubsurface()}

                {this.showFailureSurface()}

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter }}>
                    <button style={{ ...styles.generalButton, ...saveprojecticon }} onClick={() => { this.saveSlopeStability() }}>{saveProjectIcon()}</button>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                    <span style={{ ...styles.regularFont }}>{this.state.message}</span>
                </div>

                {this.drawBlock()}

            </div>
            )

        } else {
            return (<div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>Project Not Found</span>
            </div>)
        }

    }




}

function mapStateToProps(state) {
    return {
        projects: state.projects
    }
}
export default connect(mapStateToProps, actions)(SlopeStability);