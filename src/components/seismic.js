import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { LoadSeismic } from './actions/api';
import { newSeismic, SeismicPoint, newSeismicPoint, newStrain } from './functions';
import { removeIconSmall } from './svg';
import MakeID from './makeids';
import SoilClassification from './soilclassification';
import SesimicCalcs from './seismiccalcs';


class Seismic extends Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0, render: 'render', magnitude: '', activepointid: false, depth: '', spt: '', pi: '', fines: '', sampleid: '', siteacceleration: '' }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
        this.loadSeismic();

    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    async loadSeismic() {
        if (!this.props.seismic.hasOwnProperty("length")) {
            const response = await LoadSeismic();
            this.props.reduxSeismic(response.seismic.seismic)
            this.setState({ render: 'render' })

        }


    }

    getAcceleration() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid);
        let value = '';
        if (seismic) {
            value = seismic.siteacceleration;
        }
        return value;

    }

    handleAcceleration(value) {
        const gfk = new GFK()
        const projectid = this.props.match.params.projectid;
        const seismics = gfk.getSeismic.call(this)
        if (seismics) {
            const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
            if (seismic) {
                const key = gfk.getSeismicKeybyProjectID.call(this, projectid)
                seismics[key].siteacceleration = value;
                this.props.reduxSeismic(seismics);
                this.setState({ render: 'render' })
            } else {
                const magnitude = this.state.magnitude;
                const newValue = newSeismic(projectid, magnitude, value)
                seismics.push(newValue)
                this.props.reduxSeismic(seismics);
                this.setState({ render: 'render' })
            }

        }


    }

    getMagnitude() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid);
        let value = '';
        if (seismic) {
            value = seismic.magnitude;
        }
        return value;

    }

    handleMagnitude(value) {
        const gfk = new GFK()
        const projectid = this.props.match.params.projectid;
        const seismics = gfk.getSeismic.call(this)
        if (seismics) {
            const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
            if (seismic) {
                const key = gfk.getSeismicKeybyProjectID.call(this, projectid)
                seismics[key].magnitude = value;
                this.props.reduxSeismic(seismics);
                this.setState({ render: 'render' })
            } else {
                const siteacceleration = this.state.siteacceleration;
                const newValue = newSeismic(projectid, value, siteacceleration)
                seismics.push(newValue)
                this.props.reduxSeismic(seismics);
                this.setState({ render: 'render' })
            }

        }


    }
    getDepth() {
        const gfk = new GFK();
        let depth = "";
        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;
        if (this.state.activepointid) {
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            if (point) {
                depth = point.depth;
            }


        }
        return depth;


    }

    handleDepth(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const makeid = new MakeID();
        const seismics = gfk.getSeismic.call(this)

        if (this.state.activepointid) {
            const pointid = this.state.activepointid;


            if (seismics) {
                let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
                if (seismic) {
                    const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                    const points = gfk.getPointsByProjectID.call(this, projectid)
                    if (points) {
                        const point = gfk.getPointbyID.call(this, projectid, pointid)
                        if (point) {
                            const j = gfk.getPointKeybyID.call(this, projectid, pointid)
                            seismics[i].points[j].depth = value
                            this.props.reduxSeismic(seismics);
                            this.setState({ render: 'render' })
                        }

                    }
                }

            }

        } else {
            let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
            const magnitude = this.state.magnitude;
            const siteacceleration = this.state.siteacceleration;
            let pointid = makeid.seismicpointid.call(this)
            const pi = this.state.pi;
            const fines = this.state.fines;
            const spt = this.state.spt;
            const sampleid = this.state.sampleid;

            if (seismic) {

                const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                const points = gfk.getPointsByProjectID.call(this, projectid);
                let newSeismic = SeismicPoint(pointid, value, pi, fines, spt, sampleid)

                if (points) {

                    seismics[i].points.push(newSeismic);


                } else {
                    seismics[i].points = [newSeismic]

                }
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })

            } else {

                let newseismic = newSeismicPoint(projectid, siteacceleration, magnitude, pointid, value, pi, fines, spt, sampleid)

                seismics.push(newseismic)
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })
            }



        }

    }

    getPI() {
        const gfk = new GFK();
        let pi = "";
        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;
        if (this.state.activepointid) {
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            if (point) {
                pi = point.pi;
            }


        }
        return pi;


    }

    handlePI(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const makeid = new MakeID();
        const seismics = gfk.getSeismic.call(this)

        if (this.state.activepointid) {
            const pointid = this.state.activepointid;


            if (seismics) {
                let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
                if (seismic) {
                    const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                    const points = gfk.getPointsByProjectID.call(this, projectid)
                    if (points) {
                        const point = gfk.getPointbyID.call(this, projectid, pointid)
                        if (point) {
                            const j = gfk.getPointKeybyID.call(this, projectid, pointid)
                            seismics[i].points[j].pi = value
                            this.props.reduxSeismic(seismics);
                            this.setState({ render: 'render' })
                        }

                    }
                }

            }

        } else {
            let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
            const magnitude = this.state.magnitude;
            const siteacceleration = this.state.siteacceleration;
            let pointid = makeid.seismicpointid.call(this)
            const depth = this.state.depth
            const fines = this.state.fines;
            const spt = this.state.spt;
            const sampleid = this.state.sampleid;

            if (seismic) {

                const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                const points = gfk.getPointsByProjectID.call(this, projectid);
                let newSeismic = SeismicPoint(pointid, depth, value, fines, spt, sampleid)

                if (points) {

                    seismics[i].points.push(newSeismic);


                } else {
                    seismics[i].points = [newSeismic]

                }
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })

            } else {

                let newseismic = newSeismicPoint(projectid, magnitude, siteacceleration, pointid, depth, value, fines, spt, sampleid)

                seismics.push(newseismic)
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })
            }



        }

    }

    getSPT() {
        const gfk = new GFK();
        let spt = "";
        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;
        if (this.state.activepointid) {
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            if (point) {
                spt = point.spt;
            }


        }
        return spt;


    }

    handleSPT(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const makeid = new MakeID();
        const seismics = gfk.getSeismic.call(this)

        if (this.state.activepointid) {
            const pointid = this.state.activepointid;


            if (seismics) {
                let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
                if (seismic) {
                    const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                    const points = gfk.getPointsByProjectID.call(this, projectid)
                    if (points) {
                        const point = gfk.getPointbyID.call(this, projectid, pointid)
                        if (point) {
                            const j = gfk.getPointKeybyID.call(this, projectid, pointid)
                            seismics[i].points[j].spt = value
                            this.props.reduxSeismic(seismics);
                            this.setState({ render: 'render' })
                        }

                    }
                }

            }

        } else {
            let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
            const magnitude = this.state.magnitude;
            const siteacceleration = this.state.siteacceleration;
            let pointid = makeid.seismicpointid.call(this)
            const depth = this.state.depth
            const fines = this.state.fines;
            const pi = this.state.pi;
            const sampleid = this.state.sampleid;

            if (seismic) {

                const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                const points = gfk.getPointsByProjectID.call(this, projectid);
                let newSeismic = SeismicPoint(pointid, depth, pi, fines, value, sampleid)

                if (points) {

                    seismics[i].points.push(newSeismic);


                } else {
                    seismics[i].points = [newSeismic]

                }
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })

            } else {

                let newseismic = newSeismicPoint(projectid, magnitude, siteacceleration, pointid, depth, pi, fines, value, sampleid)

                seismics.push(newseismic)
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })
            }



        }

    }

    getFines() {
        const gfk = new GFK();
        let fines = "";
        const projectid = this.props.match.params.projectid;
        const pointid = this.state.activepointid;
        if (this.state.activepointid) {
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            if (point) {
                fines = point.fines;
            }


        }
        return fines;


    }

    handleFines(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const makeid = new MakeID();
        const seismics = gfk.getSeismic.call(this)

        if (this.state.activepointid) {
            const pointid = this.state.activepointid;


            if (seismics) {
                let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
                if (seismic) {
                    const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                    const points = gfk.getPointsByProjectID.call(this, projectid)
                    if (points) {
                        const point = gfk.getPointbyID.call(this, projectid, pointid)
                        if (point) {
                            const j = gfk.getPointKeybyID.call(this, projectid, pointid)
                            seismics[i].points[j].fines = value
                            this.props.reduxSeismic(seismics);
                            this.setState({ render: 'render' })
                        }

                    }
                }

            }

        } else {
            let seismic = gfk.getSeismicbyProjectID.call(this, projectid)
            const magnitude = this.state.magnitude;
            const siteacceleration = this.state.siteacceleration;
            let pointid = makeid.seismicpointid.call(this)
            const depth = this.state.depth
            const spt = this.state.spt;
            const pi = this.state.pi;
            const sampleid = this.state.sampleid;

            if (seismic) {

                const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                const points = gfk.getPointsByProjectID.call(this, projectid);
                let newSeismic = SeismicPoint(pointid, depth, pi, value, spt, sampleid)

                if (points) {

                    seismics[i].points.push(newSeismic);


                } else {
                    seismics[i].points = [newSeismic]

                }
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })

            } else {

                let newseismic = newSeismicPoint(projectid, magnitude, siteacceleration, pointid, depth, pi, value, spt, sampleid)
                seismics.push(newseismic)
                this.props.reduxSeismic(seismics);
                this.setState({ activepointid: pointid })
            }



        }

    }


    handlepointid(pointid) {
        if (!this.state.activepointid) {
            this.setState({ activepointid: pointid })
        } else {
            this.setState({ activepointid: false })
        }
    }

    handlestrainid(strainid) {

        if (!this.state.activestrainid) {
            const gfk = new GFK();
            const projectid = this.props.match.params.projectid;
            const pointid = gfk.getPointIDfromStrainID.call(this, projectid, strainid)

            this.setState({ activestrainid: strainid, activepointid: pointid })
        } else {
            this.setState({ activestrainid: false })
        }
    }


    removePoint(projectid, pointid) {

        const gfk = new GFK();
        const seismics = gfk.getSeismic.call(this)
        if (seismics) {
            const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
            if (seismic) {
                const i = gfk.getSeismicKeybyProjectID.call(this, projectid)
                const points = gfk.getPointsByProjectID.call(this, projectid)
                if (points) {
                    const point = gfk.getPointbyID.call(this, projectid, pointid)
                    if (point) {
                        const j = gfk.getPointKeybyID.call(this, projectid, pointid)
                        seismics[i].points.splice(j, 1);
                        this.props.reduxSeismic(seismics);
                        this.setState({ activepointid: false })
                    }

                }
            }

        }
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
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handlepointid(point.pointid) }}>
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

    removeStrain(projectid, strainid) {
        const gfk = new GFK();
        const seismics = gfk.getSeismic.call(this)
        const strain = gfk.getStrainbyID.call(this, projectid, strainid)
        if (strain) {
            const keys = gfk.getStrainKeybyProjectID.call(this, projectid, strainid)
            let i = keys.a;
            let j = keys.b;
            let k = keys.c;
            seismics[i].points[j].strain.splice(k, 1)
            this.props.reduxSeismic(seismics)
            this.setState({ activestrainid: false })

        }

    }

    handleStrainRatio(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const seismics = gfk.getSeismic.call(this)
        const makeid = new MakeID();
        if (this.state.activestrainid) {
            const strainid = this.state.activestrainid;

            if (seismics) {
                const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
                if (seismic) {

                    const keys = gfk.getStrainKeybyProjectID.call(this, projectid, strainid)
                    const i = keys.a;
                    const j = keys.b;
                    const k = keys.c;

                    seismics[i].points[j].strain[k].strainratio = value;
                    this.props.reduxSeismic(seismics);
                    this.setState({ render: 'render' })
                }



            }

        } else {

            const strainid = makeid.seismicstrainid.call(this)
            const toplayer = this.state.toplayer;
            const bottomlayer = this.state.bottomlayer;

            // if pointid is active
            if (this.state.activepointid) {
                let pointid = this.state.activepointid;
                const point = gfk.getPointbyID.call(this, projectid, pointid);
                let getStrain = newStrain(strainid, pointid, toplayer, bottomlayer, value)
                if (point) {
                    let i = gfk.getSeismicKeybyProjectID.call(this, projectid);
                    let j = gfk.getPointKeybyID.call(this, projectid, pointid)

                    if (point.hasOwnProperty("strain")) {
                        seismics[i].points[j].strain.push(getStrain)

                    } else {
                        seismics[i].points[j].strain = [getStrain];

                    }
                    this.props.reduxSeismic(seismics)
                    this.setState({ activestrainid: strainid })

                }


            }


        }

    }

    getStrainRatio() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let strainratio = '';
        if (this.state.activestrainid) {
            const strainid = this.state.activestrainid;
            const strain = gfk.getStrainbyID.call(this, projectid, strainid)
            if (strain) {
                strainratio = strain.strainratio;
            }

        }
        return strainratio;
    }

    getTopLayer() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let toplayer = '';
        if (this.state.activestrainid) {
            const strainid = this.state.activestrainid;
            const strain = gfk.getStrainbyID.call(this, projectid, strainid)
            if (strain) {
                toplayer = strain.toplayer;
            }

        }
        return toplayer;
    }



    handleTopLayer(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const seismics = gfk.getSeismic.call(this)
        const makeid = new MakeID();
        if (this.state.activestrainid) {
            const strainid = this.state.activestrainid;

            if (seismics) {
                const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
                if (seismic) {

                    const keys = gfk.getStrainKeybyProjectID.call(this, projectid, strainid)
                    const i = keys.a;
                    const j = keys.b;
                    const k = keys.c;

                    seismics[i].points[j].strain[k].toplayer = value;
                    this.props.reduxSeismic(seismics);
                    this.setState({ render: 'render' })
                }



            }

        } else {

            const strainid = makeid.seismicstrainid.call(this)
            const strainratio = this.state.strainratio;
            const bottomlayer = this.state.bottomlayer;

            // if pointid is active
            if (this.state.activepointid) {
                let pointid = this.state.activepointid;
                const point = gfk.getPointbyID.call(this, projectid, pointid);
                let getStrain = newStrain(strainid, pointid, value, bottomlayer, strainratio)
                if (point) {
                    let i = gfk.getSeismicKeybyProjectID.call(this, projectid);
                    let j = gfk.getPointKeybyID.call(this, projectid, pointid)

                    if (point.hasOwnProperty("strain")) {
                        seismics[i].points[j].strain.push(getStrain)

                    } else {
                        seismics[i].points[j].strain = [getStrain];

                    }
                    this.props.reduxSeismic(seismics)
                    this.setState({ activestrainid: strainid })

                }


            }


        }

    }

    getBottomLayer() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        let bottomlayer = '';
        if (this.state.activestrainid) {
            const strainid = this.state.activestrainid;
            const strain = gfk.getStrainbyID.call(this, projectid, strainid)
            if (strain) {
                bottomlayer = strain.bottomlayer;
            }

        }
        return bottomlayer;
    }

    handleBottomLayer(value) {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const seismics = gfk.getSeismic.call(this)
        const makeid = new MakeID();
        if (this.state.activestrainid) {
            const strainid = this.state.activestrainid;

            if (seismics) {
                const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
                if (seismic) {

                    const keys = gfk.getStrainKeybyProjectID.call(this, projectid, strainid)
                    const i = keys.a;
                    const j = keys.b;
                    const k = keys.c;

                    seismics[i].points[j].strain[k].bottomlayer = value;
                    this.props.reduxSeismic(seismics);
                    this.setState({ render: 'render' })
                }



            }

        } else {

            const strainid = makeid.seismicstrainid.call(this)
            const strainratio = this.state.strainratio;
            const toplayer = this.state.toplayer;

            // if pointid is active
            if (this.state.activepointid) {
                let pointid = this.state.activepointid;
                const point = gfk.getPointbyID.call(this, projectid, pointid);
                let getStrain = newStrain(strainid, pointid, toplayer, value, strainratio)
                if (point) {
                    let i = gfk.getSeismicKeybyProjectID.call(this, projectid);
                    let j = gfk.getPointKeybyID.call(this, projectid, pointid)

                    if (point.hasOwnProperty("strain")) {
                        seismics[i].points[j].strain.push(getStrain)

                    } else {
                        seismics[i].points[j].strain = [getStrain];

                    }
                    this.props.reduxSeismic(seismics)
                    this.setState({ activestrainid: strainid })

                }


            }


        }

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
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handlestrainid(strain.strainid) }}>
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

    getprojectsamples() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid
        let options = [];
        const borings = gfk.getboringsbyprojectid.call(this, projectid);
        if (borings) {
            // eslint-disable-next-line
            borings.map(boring => {
                let boringid = boring.boringid;
                const samples = gfk.getsamplesbyboringid.call(this, boringid)
                const boringnumber = boring.boringnumber;
                if (samples) {
                    // eslint-disable-next-line
                    samples.map(sample => {
                        const sampleid = sample.sampleid;
                        const sampleset = sample.sampleset;
                        const samplenumber = sample.samplenumber;
                        const depth = sample.depth;

                        options.push(<option key={sampleid} value={sampleid}>{boringnumber}-{sampleset}({samplenumber}){depth}</option>)


                    })


                }


            })


        }
        return options;

    }
    handleSampleID(sampleid) {
        let depth = 0;
        let pi = 0;
        let spt = 0;
        let fines = 0;
        let ll = 0;
        const projectid = this.props.match.params.projectid;
        const makeid = new MakeID();


        const netwgt = (sample) => {

            let wgt = Number(sample.drywgt) - Number(sample.tarewgt)
            wgt = Number(wgt).toFixed(1)

            return (wgt)
        }

        const gfk = new GFK();
        const sample = gfk.getsamplebyid.call(this, sampleid);
        let i = false;
        if (sample) {
            depth = Number(sample.depth);
            pi = Number(sample.pi);
            spt = Number(sample.spt)
            ll = Number(sample.ll)

            const sieve = gfk.getsievebysampleid.call(this, sampleid)
            const wgt34 = sieve.wgt34;
            const wgt38 = sieve.wgt38;
            const wgt4 = sieve.wgt4;
            const wgt10 = sieve.wgt10;
            const wgt30 = sieve.wgt30;
            const wgt40 = sieve.wgt40;
            const wgt100 = sieve.wgt100;
            const wgt200 = sieve.wgt200;
            const soilclassification = new SoilClassification(netwgt(sample), ll, pi, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200)

            fines = soilclassification.getFines();

        }

        const seismics = gfk.getSeismic.call(this)
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
        if (seismic) {
            i = gfk.getSeismicKeybyProjectID.call(this, projectid)
        }


        if (this.state.activepointid) {
            let pointid = this.state.activepointid;
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            if (point) {
                const j = gfk.getPointKeybyID.call(this, projectid, pointid)
                seismics[i].points[j].sampleid = sampleid;
                seismics[i].points[j].depth = depth;
                seismics[i].points[j].pi = pi;
                seismics[i].points[j].spt = spt;
                seismics[i].points[j].fines = fines;
                this.props.reduxSeismic(seismics)
                this.setState({ render: 'render' })
            }

        } else {
            let pointid = makeid.seismicpointid.call(this)

            if (seismic) {
                let newPoint = SeismicPoint(pointid, depth, pi, fines, spt, sampleid)
                if (seismic.hasOwnProperty("points")) {

                    seismics[i].points.push(newPoint)

                } else {
                    seismics[i].points = [newPoint]
                }
                this.props.reduxSeismic(seismics)
                this.setState({ activepointid: pointid })

            } else {
                // make
                const siteacceleration = this.state.siteacceleration;
                const magnitude = this.state.magnitude
                let newPoint = newSeismicPoint(projectid, siteacceleration, magnitude, pointid, depth, pi, fines, spt, sampleid)
                seismics.push(newPoint)
                this.props.reduxSeismic(seismics)
                this.setState({ activepointid: pointid })

            }


        }
    }

    getSampleID() {
        const gfk = new GFK();
        let sampleid = '';
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;
            const point = gfk.getPointbyID.call(this, projectid, pointid)
            if (point) {
                sampleid = point.sampleid;
            }
        }
        return sampleid;
    }

    getOverBurden() {
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs
        let overburden = 0
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const sampleid = point.sampleid;
            const depth = point.depth

            const stress = seismiccalcs.getOverBurden.call(this, sampleid, depth)
            overburden = stress.overburden

        }

        return overburden
    }

    getEffective() {
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs
        let effective = 0
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const sampleid = point.sampleid;
            const depth = point.depth

            const stress = seismiccalcs.getOverBurden.call(this, sampleid, depth)
            effective = stress.effective

        }

        return effective;
    }

    getOverBurdenCorrection() {
        const gfk = new GFK();
        const seismiccalcs = new SesimicCalcs
        let correction = 0
        let effective = 0;
        const projectid = this.props.match.params.projectid;
        if (this.state.activepointid) {
            const pointid = this.state.activepointid;

            const point = gfk.getPointbyID.call(this, projectid, pointid)
            const sampleid = point.sampleid;
            const depth = point.depth

            const stress = seismiccalcs.getOverBurden.call(this, sampleid, depth)
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
        const seismiccalcs = new SesimicCalcs();
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
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
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
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
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
        const driving = Number(this.getDepthReductionFactor())
        const allowable = Number(this.getAllowableCSR())
        fs = allowable/driving
        return Number(fs).toFixed(2)
    }

    render() {
        const styles = MyStylesheet()
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this)
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;
        const project = gfk.getprojectbyid.call(this, projectid);
        const regularFont = gfk.getRegularFont.call(this)
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
                        {this.getprojectsamples()}
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
        myuser: state.myuser,
        seismic: state.seismic
    }
}
export default connect(mapStateToProps, actions)(Seismic);