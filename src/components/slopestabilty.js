import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { LoadSlopeStability, HandleSlopeStability } from './actions/api';
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
        this.loadslopestability()


    }
    async loadslopestability() {
        let response = await LoadSlopeStability();
        if (response.hasOwnProperty("slopestability")) {
            this.props.reduxSlopeStability(response.slopestability.slopestability)
        }


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
        const sections = gfk.getSlopebyProjectID.call(this, projectid)
        if (sections) {
            try {
                let response = await HandleSlopeStability(projectid, sections)
                console.log(response)
                if (response.hasOwnProperty("sectionsdb")) {
                    this.props.reduxSlopeStability(response.sectionsdb)
                }
                let message = "";
                if (response.hasOwnProperty("lastupdated")) {
                    message += `Last Saved ${inputUTCStringForLaborID(response.lastupdated)} `
                }
                if (response.hasOwnProperty("message")) {
                    message += `${response.message}`;
                }
                this.setState({ message })
            } catch (err) {
                alert(err)
            }
        }

    }

    getFactorofSafety() {

        const gfk = new GFK();
        const calcs = new SlopeStabilityCalcs();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;
        const extents = calcs.getExtents.call(this, projectid, sectionid)
        const failuresurface = gfk.getFailureSurface.call(this, projectid, sectionid)
        const cx = Number(failuresurface.cx);
        const cy = Number(failuresurface.cy);
        const rx = Number(failuresurface.rx);
        const ry = Number(failuresurface.ry);
        const slices = gfk.getSlices.call(this, projectid, sectionid)
        const deltax = extents / slices;
        let fs = 0;
        let driving = 0;
        let resisting = 0;

        const subsurfaces = gfk.getSubsurfaces.call(this, projectid, sectionid)
        if (extents > 0) {
            if (subsurfaces) {
                const numberofsurfaces = subsurfaces.length

                for (let x = 0; x <= extents; x = x + deltax) {
                    let weight = 0;
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


                        let cohesion = subsurface.subsurface.cohesion;
                        let phi = subsurface.subsurface.friction;
                        let surfacey = calcs.getYsurface.call(this, subsurface.points, x)
                        let surfacedeltay = calcs.getYsurface.call(this, subsurface.points, x + deltax)
                        let pointdeltay = calcs.getellispey(rx, ry, cx, cy, x + deltax)

                        if (numberofsurfaces === i + 1) {


                            if (surfacedeltay > pointdeltay) {

                                if (x + deltax <= extents) {


                                    let area = calcs.getarea(deltax, pointy, pointdeltay, surfacey, surfacedeltay)
                                    let density = subsurface.subsurface.gamma;
                                    weight += density * area;
                                    let alpha = calcs.getalpha(pointdeltay, pointy, deltax)

                                    resisting += calcs.calcfsnum(cohesion, weight, phi, alpha, deltax)

                                    driving += calcs.calcfsden(weight, alpha)
                                    weight = 0;
                                    // console.log(resisting, driving)



                                }
                            }



                        } else {

                            let surfacey_2 = calcs.getYsurface.call(this, subsurfaces[i + 1].points, x)
                            let surfacedeltay_2 = calcs.getYsurface.call(this, subsurfaces[i + 1].points, x + deltax)

                            if (surfacey_2 > pointdeltay) {

                                if (x + deltax <= extents) {
                                    let area = calcs.getarea(deltax, surfacey_2, surfacedeltay_2, surfacey, surfacedeltay)
                                    let density = subsurface.subsurface.gamma;
                                    weight += density * area;


                                }

                            } else {

                                if (surfacedeltay > pointdeltay) {

                                    if (x + deltax <= extents) {

                                        let area = calcs.getarea(deltax, pointy, pointdeltay, surfacey, surfacedeltay)
                                        let density = subsurface.subsurface.gamma;
                                        weight += density * area;
                                        let alpha = calcs.getalpha(pointdeltay, pointy, deltax)
                                        resisting += calcs.calcfsnum(cohesion, weight, phi, alpha, deltax)
                                        driving += calcs.calcfsden(weight, alpha)
                                        weight = 0;



                                    }
                                }

                            }
                            // check second surface to see if its above failure surface. If so, then slices goes to second surface

                            // if not slice goes to failure surface


                        }



                    })








                }

            }

        }

        fs = Number(resisting / driving).toFixed(2)
        return fs;

    }

    drawslices() {

        const gfk = new GFK();
        const calcs = new SlopeStabilityCalcs();
        const projectid = this.props.match.params.projectid;
        const sectionid = this.state.activesectionid;
        const extents = calcs.getExtents.call(this, projectid, sectionid)
        const failuresurface = gfk.getFailureSurface.call(this, projectid, sectionid)
        const cx = Number(failuresurface.cx);
        const cy = Number(failuresurface.cy);
        const rx = Number(failuresurface.rx);
        const ry = Number(failuresurface.ry);
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
        const cx = Number(failuresurface.cx);
        const cy = Number(failuresurface.cy);
        const rx = Number(failuresurface.rx);
        const ry = Number(failuresurface.ry);
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
        const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
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
        let gamma = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    if (layer.hasOwnProperty("subsurface")) {
                        gamma = layer.subsurface.gamma;
                    }
                }
            }

        }

        return gamma;


    }

    handleGamma(value) {
        const gfk = new GFK();
        const sections = gfk.getSlopeStability.call(this)
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("subsurface")) {
                            const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                            sections[i].layers[j].subsurface.gamma = value;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })

                        }
                    }
                }
            }
        }

    }

    getCohension() {
        let cohesion = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    if (layer.hasOwnProperty("subsurface")) {
                        cohesion = layer.subsurface.cohesion;
                    }
                }
            }

        }

        return cohesion;


    }

    handleCohension(value) {
        const gfk = new GFK();
        const sections = gfk.getSlopeStability.call(this)
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("subsurface")) {
                            const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                            sections[i].layers[j].subsurface.cohesion = value;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })

                        }
                    }
                }
            }
        }

    }

    getFriction() {
        let friction = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    if (layer.hasOwnProperty("subsurface")) {
                        friction = layer.subsurface.friction;
                    }
                }
            }

        }

        return friction;


    }

    handleFriction(value) {
        const gfk = new GFK();
        const sections = gfk.getSlopeStability.call(this)
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("subsurface")) {
                            const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                            sections[i].layers[j].subsurface.friction = value;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })

                        }
                    }
                }
            }
        }

    }

    showPointIDs() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let getpoints = [];
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
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

    handlepointid(pointid) {
        let activepointid = false;
        if (!this.state.activepointid) {
            activepointid = pointid;
        }
        this.setState({ activepointid })

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
                    <span style={{ ...regularFont, ...highlightactive() }} onClick={() => { this.handlepointid(point.pointid) }}>
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
        console.log(pointid)
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sections = gfk.getSlopeStability.call(this)
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                console.log(section)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        console.log(layer)
                        const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                        const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid)
                        if (point) {
                            console.log(point)
                            const k = gfk.getSlopePointKeyByID.call(this, projectid, sectionid, layerid, pointid)
                            sections[i].layers[j].points.splice(k, 1)
                            this.props.reduxSlopeStability(sections)
                            this.setState({ activepointid: false })

                        }


                    }

                }
            }

        }

    }

    getXcoord() {

        let xcoord = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;

            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;


                if (this.state.activepointid) {
                    const pointid = this.state.activepointid;
                    const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid)
                    if (point) {
                        xcoord = point.xcoord;
                    }

                }

            }
        }
        return xcoord;

    }

    handleXcoord(value) {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sections = gfk.getSlopeStability.call(this)
        const makeid = new MakeID();
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                        if (this.state.activepointid) {
                            const pointid = this.state.activepointid;
                            const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid)
                            if (point) {
                                const k = gfk.getSlopePointKeyByID.call(this, projectid, sectionid, layerid, pointid)
                                sections[i].layers[j].points[k].xcoord = value
                                this.props.reduxSlopeStability(sections)
                                this.setState({ render: 'render' })

                            }

                        } else {
                            // new point
                            const pointid = makeid.pointID.call(this)
                            const ycoord = this.state.ycoord;
                            const newpoint = newPoint(pointid, value, ycoord)
                            if (layer.hasOwnProperty("points")) {
                                sections[i].layers[j].points.push(newpoint)
                            } else {
                                sections[i].layers[j].points = [newpoint]
                            }
                            this.setState({ activepointid: pointid })

                        }


                    }

                }
            }

        }

    }


    getYcoord() {

        let ycoord = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;

            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;


                if (this.state.activepointid) {
                    const pointid = this.state.activepointid;
                    const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid)
                    if (point) {
                        ycoord = point.ycoord;
                    }

                }

            }
        }
        return ycoord;

    }

    handleYcoord(value) {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sections = gfk.getSlopeStability.call(this)
        const makeid = new MakeID();
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                        if (this.state.activepointid) {
                            const pointid = this.state.activepointid;
                            const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid)
                            if (point) {
                                const k = gfk.getSlopePointKeyByID.call(this, projectid, sectionid, layerid, pointid)
                                sections[i].layers[j].points[k].ycoord = value
                                this.props.reduxSlopeStability(sections)
                                this.setState({ render: 'render' })

                            }

                        } else {
                            // new point
                            const pointid = makeid.pointID.call(this)
                            const xcoord = this.state.xcoord;
                            const newpoint = newPoint(pointid, xcoord, value)
                            if (layer.hasOwnProperty("points")) {
                                sections[i].layers[j].points.push(newpoint)
                            } else {
                                sections[i].layers[j].points = [newpoint]
                            }
                            this.setState({ activepointid: pointid })

                        }


                    }

                }
            }

        }

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
                                    value={this.getCohension()}
                                    onChange={event => { this.handleCohension(event.target.value) }} />
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
        let cx = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    if (layer.hasOwnProperty("failuresurface")) {
                        cx = layer.failuresurface.cx;
                    }
                }
            }

        }

        return cx;


    }

    handleCx(value) {
        const gfk = new GFK();
        const sections = gfk.getSlopeStability.call(this)
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("failuresurface")) {
                            const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                            sections[i].layers[j].failuresurface.cx = value;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })

                        }
                    }
                }
            }
        }

    }

    getCy() {
        let cy = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    if (layer.hasOwnProperty("failuresurface")) {
                        cy = layer.failuresurface.cy;
                    }
                }
            }

        }

        return cy;


    }

    handleCy(value) {
        const gfk = new GFK();
        const sections = gfk.getSlopeStability.call(this)
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("failuresurface")) {
                            const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                            sections[i].layers[j].failuresurface.cy = value;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })

                        }
                    }
                }
            }
        }

    }

    getRx() {
        let rx = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    if (layer.hasOwnProperty("failuresurface")) {
                        rx = layer.failuresurface.rx;
                    }
                }
            }

        }

        return rx;


    }

    handleRx(value) {
        const gfk = new GFK();
        const sections = gfk.getSlopeStability.call(this)
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("failuresurface")) {
                            const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                            sections[i].layers[j].failuresurface.rx = value;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })

                        }
                    }
                }
            }
        }

    }

    getRy() {
        let ry = "";
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    if (layer.hasOwnProperty("failuresurface")) {
                        ry = layer.failuresurface.ry;
                    }
                }
            }

        }

        return ry;


    }

    handleRy(value) {
        const gfk = new GFK();
        const sections = gfk.getSlopeStability.call(this)
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    const layerid = this.state.activelayerid;
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    if (layer) {
                        if (layer.hasOwnProperty("failuresurface")) {
                            const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                            sections[i].layers[j].failuresurface.ry = value;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })

                        }
                    }
                }
            }
        }

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
                            value={this.getRx()}
                            onChange={event => { this.handleRx(event.target.value) }} />
                    </div>
                    <span style={{ ...styles.generalFont, ...regularFont }}>Ry:</span>

                </div>
            </div>


        </div>)
    }

    showSectionIDs() {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const sections = gfk.getSlopebyProjectID.call(this, projectid)
        let sectionids = [];
        if (sections) {
            // eslint-disable-next-line
            sections.map(section => {
                sectionids.push(this.showSectionID(section))


            })
        }

        return (sectionids)

    }

    removeSection(sectionid) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sections = gfk.getSlopeStability.call(this)
        const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
        if (section) {
            const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
            sections.splice(i, 1)
            this.props.reduxSlopeStability(sections)
            this.setState({ activesectionid: false })

        }

    }

    makeSectionActive(sectionid) {
        let activesectionid = false;
        if (!this.state.activesectionid) {
            activesectionid = sectionid;
        }
        this.setState({ activesectionid })
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

                    <span style={{ ...regularFont, ...highlightactive() }} onClick={() => { this.makeSectionActive(section.sectionid) }}>{section.section} Slices: {section.slices}</span>
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

    getSection() {
        const gfk = new GFK();
        let section = "";
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const projectid = this.props.match.params.projectid;
            const getsection = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (getsection) {
                section = getsection.section;
            }

        } else {
            section = this.state.section;
        }
        return section;

    }

    handleSection(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let sections = gfk.getSlopeStability.call(this)
        const makeid = new MakeID();
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                sections[i].section = value
                this.props.reduxSlopeStability(sections);
                this.setState({ render: 'render' })
            }
        } else {
            const slices = this.state.slices;
            const sectionid = makeid.sectionID.call(this)
            const newSlope = newSection(sectionid, projectid, value, slices)
            if (sections) {
                sections.push(newSlope)
            } else {
                sections = [newSlope]
            }
            this.props.reduxSlopeStability(sections);
            this.setState({ activesectionid: sectionid })

        }

    }

    getSlices() {
        const gfk = new GFK();
        let slices = "";
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const projectid = this.props.match.params.projectid;
            const getsection = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (getsection) {
                slices = getsection.slices;
            }

        } else {
            slices = this.state.slices;
        }
        return slices;

    }

    handleSlices(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let sections = gfk.getSlopeStability.call(this)
        const makeid = new MakeID();
        if (this.state.activesectionid) {
            let sectionid = this.state.activesectionid;
            const getsection = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (getsection) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                sections[i].slices = value
                this.props.reduxSlopeStability(sections);
                this.setState({ render: 'render' })
            }
        } else {
            const section = this.state.section;
            const sectionid = makeid.sectionID.call(this)
            const newSlope = newSection(sectionid, projectid, section, value)
            console.log(newSlope)
            if (sections) {
                sections.push(newSlope)
            } else {
                sections = [newSlope]
            }
            console.log(sections)
            this.props.reduxSlopeStability(sections);
            this.setState({ activesectionid: sectionid })

        }

    }

    showlayerids() {
        const gfk = new GFK();
        let layerids = [];
        const projectid = this.props.match.params.projectid;
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
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

    handlelayerid(layerid) {
        let activelayerid = false;
        if (!this.state.activelayerid) {
            activelayerid = layerid;
        }
        this.setState({ activelayerid })

    }

    removeLayer(layerid) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const slopestablity = gfk.getSlopeStability.call(this)
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                console.log(layer)
                if (layer) {
                    const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                    slopestablity[i].layers.splice(j, 1)
                    this.props.reduxSlopeStability(slopestablity)
                    this.setState({ activelayerid: false })
                }
            }
        }
    }

    movelayerup(layerid) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sections = gfk.getSlopeStability.call(this)
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (section.hasOwnProperty("layers")) {
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    const layercount = section.layers.length;
                    if (layer) {
                        const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                        if (layercount > 1 && j > 0) {
                            const layer_1 = sections[i].layers[j - 1]
                            sections[i].layers[j] = layer_1;
                            sections[i].layers[j - 1] = layer;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })
                        }

                    }
                }

            }
        }


    }

    movelayerdown(layerid) {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const sections = gfk.getSlopeStability.call(this)
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (section.hasOwnProperty("layers")) {
                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                    const layercount = section.layers.length;
                    if (layer) {
                        const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                        if (layercount > 1 && j < layercount - 1) {
                            const layer_1 = sections[i].layers[j + 1]
                            sections[i].layers[j] = layer_1;
                            sections[i].layers[j + 1] = layer;
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render: 'render' })
                        }

                    }
                }

            }
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
                        <span style={{ ...regularFont, ...highlightactive() }} onClick={() => { this.handlelayerid(layer.layerid) }}>
                            {layer.layer} Type: {layer.layertype}
                        </span>

                    </div>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                            <button style={{ ...styles.generalButton, ...layerarrow }} onClick={() => { this.movelayerup(layer.layerid) }}>{layerUp()}</button>
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

    getLayer() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let getlayer = "";
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                if (section.hasOwnProperty("layers")) {
                    if (this.state.activelayerid) {
                        const layerid = this.state.activelayerid;
                        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                        if (layer) {
                            getlayer = layer.layer;

                        }
                    }
                }
            }
        }
        return getlayer;

    }

    handleLayer(value) {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const slopestablity = gfk.getSlopeStability.call(this)
        const makeid = new MakeID();
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    let layerid = this.state.activelayerid;

                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)

                    if (layer) {
                        const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                        slopestablity[i].layers[j].layer = value
                        this.props.reduxSlopeStability(slopestablity)
                        this.setState({ render: 'render' })
                    }

                } else {
                    let layerid = makeid.layerID.call(this)
                    const layertype = this.state.layertype;
                    const makeLayer = newLayer(layerid, value, layertype)
                    if (section.hasOwnProperty("layers")) {
                        slopestablity[i].layers.push(makeLayer)
                    } else {
                        slopestablity[i].layers = [makeLayer]
                    }
                    this.props.reduxSlopeStability(slopestablity);
                    this.setState({ activelayerid: layerid })


                }
            }
        }

    }

    getLayerType() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let getlayer = "";
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                if (section.hasOwnProperty("layers")) {
                    if (this.state.activelayerid) {
                        const layerid = this.state.activelayerid;
                        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                        if (layer) {
                            getlayer = layer.layertype;

                        }
                    }
                }
            }
        }
        return getlayer;

    }

    handleLayerType(value) {

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const slopestablity = gfk.getSlopeStability.call(this)
        const makeid = new MakeID();
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
            if (section) {
                const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
                if (this.state.activelayerid) {
                    let layerid = this.state.activelayerid;

                    const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)

                    if (layer) {
                        const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                        slopestablity[i].layers[j].layertype = value
                        if (value === 'failure') {
                            let cx = this.state.cx;
                            let cy = this.state.cy;
                            let rx = this.state.rx;
                            let ry = this.state.ry;
                            const newfailure = failureSurface(cx, cy, rx, ry)
                            slopestablity[i].layers[j].failuresurface = newfailure;
                            if (layer.hasOwnProperty("subsurface")) {
                                delete slopestablity[i].layers[j].subsurface;
                            }
                        } else if (value === "subsurface") {
                            let gamma = this.state.gamma;
                            let cohesion = this.state.cohesion;
                            let friction = this.state.friction;
                            const newSubsurface = subSurface(gamma, cohesion, friction)
                            slopestablity[i].layers[j].subsurface = newSubsurface;
                            if (layer.hasOwnProperty("failuresurface")) {
                                delete slopestablity[i].layers[j].failuresurface
                            }
                        }
                        this.props.reduxSlopeStability(slopestablity)
                        this.setState({ render: 'render' })
                    }

                } else {
                    let layerid = makeid.layerID.call(this)
                    const getlayer = this.state.layer;
                    const makeLayer = newLayer(layerid, getlayer, value)
                    if (value === 'failure') {
                        let cx = this.state.cx;
                        let cy = this.state.cy;
                        let rx = this.state.rx;
                        let ry = this.state.ry;
                        const newfailure = failureSurface(cx, cy, rx, ry)
                        makeLayer.failuresurface = newfailure;
                    } else if (value === "subsurface") {
                        let gamma = this.state.gamma;
                        let cohesion = this.state.cohesion;
                        let friction = this.state.friction;
                        const newSubsurface = subSurface(gamma, cohesion, friction)
                        makeLayer.subsurface = newSubsurface;
                    }
                    if (section.hasOwnProperty("layers")) {
                        slopestablity[i].layers.push(makeLayer)
                    } else {
                        slopestablity[i].layers = [makeLayer]
                    }
                    this.props.reduxSlopeStability(slopestablity);
                    this.setState({ activelayerid: layerid })


                }
            }
        }

    }

    render() {
        const styles = MyStylesheet()
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this)
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;
        const project = gfk.getprojectbyid.call(this, projectid);
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
                                value={this.getSection()}
                                onChange={(event) => { this.handleSection(event.target.value) }} />
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
        myuser: state.myuser,
        slopestability: state.slopestability
    }
}
export default connect(mapStateToProps, actions)(SlopeStability);