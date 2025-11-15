import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { removeIconSmall, goToIcon, calculateIcon, remarksIcon, addSieveIcon } from './svg'
import { Sample } from './functions';
import { Link } from 'react-router-dom';
import GraphicLog from './graphiclog'
import SoilClassification from './soilclassification';
import UnconfinedCalcs from './unconfinedcalcs';
import MakeID from './makeids';

class Samples extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activesampleid: false, sampleset: '', samplenumber: '', sampledepth: '', depth: '', diameter: '', samplelength: '', tareno: '', tarewgt: '', wetwgt: '', wetwgt_2: '', drywgt: '', spt: '', uscs: '', ll: '', pi: '', description: '', graphiclog: '', sptlength: '', remarks: '' }
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
    showsampleids() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const samples = gfk.getSamplesByBoringId.call(this, projectid, boringid);
    
        if (!Array.isArray(samples) || samples.length === 0) return [];

        return samples.map(sample => this.showsampleid(sample));
    }

    validateremovesample(sample) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const sieveanalysis = gfk.getSieveBySampleId.call(this, projectid, boringid, sample.sampleid);
        const unconfined = gfk.getUnconfinedTestById.call(this, projectid, boringid, sample.sampleid)
        let validate = {};
        validate.validate = true;
        if (sieveanalysis) {
            validate.validate = false;
            validate.message += `Could not delete Sample ${sample.depth}ft delete Sieve Analysis first`
        }
        if (unconfined) {
            validate.validate = false
            validate.message += `Could not delete Sample ${sample.depth}ft delete Unconfined first`
        }
        return validate;

    }
    removeSampleId(sample) {
        if (!window.confirm(`Are you sure you want to delete Sample at ${sample.depth} ft?`)) {
            return;
        }

        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const validation = this.validateremovesample(sample);
        if (!validation.validate) {
            this.setState({ message: validation.message });
            return;
        }

        const sampleIndex = gfk.getSampleKeyById.call(this, projectid, boringid, sample.sampleid);
        if (sampleIndex < 0) return;

        // Remove sample
        boring.samples.splice(sampleIndex, 1);

        // Update Redux + UI
        this.props.reduxProjects(projects);
        this.setState({ activesampleid: false });
    }


    makeSampleActive(sampleId) {
        this.setState({
            activesampleid: this.state.activesampleid === sampleId ? false : sampleId
        });
    }

    showsampleid(sample) {
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const styles = MyStylesheet();
        const removeIcon = gfk.getremoveicon.call(this);
        const projectid = this.props.match.params.projectid;
        const boringid = this.props.match.params.boringid;
        const myuser = gfk.getuser.call(this);
        const headerFont = gfk.getHeaderFont.call(this)


        const engineerid = myuser.engineerid;

        const activeBackground = () =>
            this.state.activesampleid === sample.sampleid ? styles.activefieldreport : undefined;

        const moist = () => {
            let wgtwater = 0;
            let netweight = Number(sample.drywgt) - Number(sample.tarewgt)

            if (Number(sample.wetwgt_2) > 0) {
                wgtwater = Number(sample.wetwgt_2) - Number(sample.drywgt)

            } else {
                wgtwater = Number(sample.wetwgt) - Number(sample.drywgt);

            }
            if ((wgtwater / netweight) > 0) {
                return (wgtwater / netweight)
            } else {
                return 0;
            }

        }
        const netwgt_1 = () => {
            if (Number(sample.wetwgt_2) > 0) {
                let netwgt_1 = (Number(sample.wetwgt) - Number(sample.tarewgt)) / (1 + moist())
                return netwgt_1;
            }
        }
        const netwgt = () => {
            if (Number(sample.drywgt) && Number(sample.tarewgt) > 0) {
                return (Number(sample.drywgt) - Number(sample.tarewgt));
            } else {
                return 0;
            }


        }
        const wgtwater_1 = () => {

            if (Number(sample.wetwgt_2) > 0) {
                return (netwgt_1() * moist())
            } else {
                return (Number(sample.wetwgt) - Number(sample.drywgt))
            }

        }
        const wgtwater = () => {
            if (Number(sample.wetwgt_2) > 0) {
                if (Number(sample.wetwgt_2) > 0 && Number(sample.drywgt) > 0) {
                    return (Number(sample.wetwgt_2) - Number(sample.drywgt))
                } else {
                    return 0;
                }

            } else {
                if (Number(sample.wetwgt) > 0 && Number(sample.drywgt) > 0) {
                    return (Number(sample.wetwgt) - Number(sample.drywgt))
                } else {
                    return 0;
                }

            }



        }
        const showwgtwater = () => {
            if (Number(sample.wetwgt_2) > 0) {
                if (Number(wgtwater_1()) > 0 && Number(wgtwater()) > 0) {
                    return (`${Number(wgtwater_1()).toFixed(1)}g/${Number(wgtwater()).toFixed(1)}g`)
                } else {
                    return 0;
                }

            } else {
                if (wgtwater() > 0) {
                    return (`${Number(wgtwater()).toFixed(1)}g`)
                } else {
                    return 0;
                }

            }
        }
        const shownetwgt = () => {
            if (Number(sample.wetwgt_2) > 0) {
                return (`${Number(netwgt_1()).toFixed(1)}/${Number(netwgt()).toFixed(1)}g`)
            } else {
                return (`${Number(netwgt()).toFixed(1)}g`);
            }
        }
        const dryden = () => {
            let netweight = 0;
            if (Number(sample.wetwgt_2) > 0) {
                netweight = netwgt_1()
            } else {
                netweight = netwgt();
            }
            if (netweight > 0 && sample.diameter > 0 && sample.samplelength > 0) {
                return (netweight / (.25 * Math.pow(Number(sample.diameter), 2) * Math.PI * Number(sample.samplelength))) * (1 / 453.592) * (144 * 12)
            } else {
                return 0;
            }
        }
        const showdryden = () => {
            return (`${Math.round(Number(dryden()))}`)
        }
        return (
            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }} key={sample.sampleid}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont }} >
                            <span style={{ ...activeBackground() }} onClick={() => { this.makeSampleActive(sample.sampleid) }}>{sample.sampleset}-({sample.samplenumber}) SampleDepth:{sample.sampledepth} Depth:{sample.depth}ft Diameter:{sample.diameter} in. Length {sample.samplelength} in. Description {sample.description}  SPT: {sample.spt} WetWgt: {sample.wetwgt}g  Wet Wgt 2: {sample.wetwgt_2}g Dry Wgt:{sample.drywgt}g Tare Wgt {sample.tarewgt}g  WgtWater:{showwgtwater()} NetWgt:{shownetwgt()} Moist: {Number(moist() * 100).toFixed(1)}% DryDen:{showdryden()}pcf Tare No: {sample.tareno} LL: {sample.ll} PI: {sample.pi}</span>
                            <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.makeSampleActive(sample) }}>
                                {removeIconSmall()}
                            </button>
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...activeBackground(), ...styles.addLeftMargin }}>
                            <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                                to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sample.sampleid}/sieve`}>
                                Sieve Analysis
                            </Link>
                        </div>
                        <div style={{ ...styles.flex1, ...activeBackground() }}>
                            <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.addLeftMargin }}
                                to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sample.sampleid}/unconfined`}>
                                Unconfined
                            </Link>
                        </div>
                    </div>

                </div>
            </div>


        )



    }
    handleSampleSet(sampleset) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get full project list
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project + boring
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].sampleset = sampleset;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }
            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            sampleset: "",
        });
    }

    getSampleSet() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const activeId = this.state.activesampleid;
        if (!activeId) return this.state.sampleset;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return this.state.sampleset;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activeId);
        return sample?.sampleset ?? this.state.sampleset;
    }

    handleSampleNumber(samplenumber) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get full project list
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project + boring
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].samplenumber = samplenumber;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }
            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            samplenumber: "",
        });
    }

    getSampleNumber() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const activeId = this.state.activesampleid;
        if (!activeId) return this.state.samplenumber;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return this.state.samplenumber;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activeId);
        return sample?.samplenumber ?? this.state.samplenumber;
    }
    handleSampleDepth(sampledepth) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get full project list
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project + boring
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].sampledepth = sampledepth;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }
            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            samplenumber,
            depth,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            sampledepth: "",
        });
    }

    getSampleDepth() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const activeId = this.state.activesampleid;
        if (!activeId) return this.state.sampledepth;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return this.state.sampledepth;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activeId);
        return sample?.sampledepth ?? this.state.sampledepth;
    }


    handleDepth(depth) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Locate current project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Locate current boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].depth = depth;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE A NEW SAMPLE (NO ACTIVE SAMPLE)
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,              // <<--- this is the property we are handling
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

 

       // this.props.reduxProjects(projects);

        // Reset state + activate the new sample
        this.setState({
            activesampleid: sampleid,
            depth: ""
        });
    }


    getDepth() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, depth } = this.state;

        // No active sample → return what’s in state
        if (!activesampleid) return depth;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return depth;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.depth ?? depth;
    }


    handleDiameter(diameter) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].diameter = diameter;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,          // <<--- assigning handled property
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            diameter: "",
        });
    }

    getDiameter() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, diameter } = this.state;

        // No active sample → use state
        if (!activesampleid) return diameter;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return diameter;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.diameter ?? diameter;
    }


    handleSampleLength(samplelength) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].samplelength = samplelength;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,      // <<--- handled value
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            samplelength: "",
        });
    }

    getSampleLength() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, samplelength } = this.state;

        // No active sample → use state
        if (!activesampleid) return samplelength;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return samplelength;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.samplelength ?? samplelength;
    }


    handleTareNo(tareno) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].tareno = tareno;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,          // <— handled value
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            tareno: "",
        });
    }

    getTareNo() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, tareno } = this.state;

        // No active sample → use state
        if (!activesampleid) return tareno;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return tareno;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.tareno ?? tareno;
    }


    handleTareWgt(tarewgt) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].tarewgt = tarewgt;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,      // <— handled value
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            tarewgt: "",
        });
    }

    getTareWgt() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, tarewgt } = this.state;

        // No active sample → use state
        if (!activesampleid) return tarewgt;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return tarewgt;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.tarewgt ?? tarewgt;
    }



    handleWetWgt(wetwgt) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Load project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Load boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].wetwgt = wetwgt;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,      // <— handled value
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            wetwgt: "",
        });
    }

    getWetWgt() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, wetwgt } = this.state;

        // No active sample → use state
        if (!activesampleid) return wetwgt;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return wetwgt;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.wetwgt ?? wetwgt;
    }

    handleWetWgt_2(wetwgt_2) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Get all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].wetwgt_2 = wetwgt_2;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,   // <— handled value
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            wetwgt_2: "",
        });
    }

    getWetWgt_2() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, wetwgt_2 } = this.state;

        // No active sample → use state
        if (!activesampleid) return wetwgt_2;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return wetwgt_2;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.wetwgt_2 ?? wetwgt_2;
    }


    handleDryWgt(drywgt) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].drywgt = drywgt;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,      // <— handled value
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            drywgt: "",
        });
    }

    getDryWgt() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, drywgt } = this.state;

        if (!activesampleid) return drywgt;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return drywgt;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.drywgt ?? drywgt;
    }


    handleUSCS(uscs) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].uscs = uscs;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs, // <-- handled value
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            uscs: ""
        });
    }


    getUSCS() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, uscs } = this.state;

        if (!activesampleid) return uscs;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return uscs;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.uscs ?? uscs;
    }

    handleSPT(spt) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].spt = spt;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt, // <-- handled field
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            spt: ""
        });
    }

    getSPT() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, spt } = this.state;

        if (!activesampleid) return spt;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return spt;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.spt ?? spt;
    }


    handleSPTLength(sptlength) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].sptlength = sptlength;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength, // <-- handled field
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            sptlength: ""
        });
    }


    getSPTLength() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, sptlength } = this.state;

        if (!activesampleid) return sptlength;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return sptlength;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.sptlength ?? sptlength;
    }


    handleRemarks(remarks) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].remarks = remarks;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks // <-- handled field
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            remarks: ""
        });
    }

    getRemarks() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, remarks } = this.state;

        if (!activesampleid) return remarks;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return remarks;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.remarks ?? remarks;
    }



    handleLL(ll) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].ll = ll;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll, // <-- handled field
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            ll: ""
        });
    }

    getLL() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, ll } = this.state;

        if (!activesampleid) return ll;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return ll;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.ll ?? ll;
    }


    handlePI(pi) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].pi = pi;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,   // <-- handled field
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            pi: ""
        });
    }


    getPI() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, pi } = this.state;

        if (!activesampleid) return pi;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return pi;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.pi ?? pi;
    }


    calcUSCS() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params
        const boring = gfk.getBoringById.call(this, projectid, boringid);
        if (boring) {
            const sampleid = this.state.activesampleid;
            const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid);
            let uscs = ''
            if (sample) {
                const ll = Number(sample.ll);
                const pi = Number(sample.pi);
                if (!ll || !pi) {
                    alert(`No LL or PI found`)
                } else {
                    const sieve = gfk.getSieveBySampleId.call(this, projectid, boringid, sampleid)
                    if (!sieve) {

                        alert(`No Sieve Found`)

                    } else {


                        const netwgt = Number(sample.drywgt) - Number(sample.tarewgt)
                        const ll = Number(sample.ll);
                        const pi = Number(sample.pi)
                        const wgt34 = Number(sieve.wgt34)
                        const wgt38 = Number(sieve.wgt38)
                        const wgt4 = Number(sieve.wgt4)
                        const wgt10 = Number(sieve.wgt10)
                        const wgt30 = Number(sieve.wgt30)
                        const wgt40 = Number(sieve.wgt40)
                        const wgt100 = Number(sieve.wgt100)
                        const wgt200 = Number(sieve.wgt200)

                        const getSoilClassification = new SoilClassification(netwgt, ll, pi, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200)
                        const classification = getSoilClassification.getClassification();
                        uscs = classification.uscs;
                        this.handleUSCS(uscs)


                    }



                }

            } else {
                alert(`Sample Not Found`)
            }

        }

    }
    handleDescription(description) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].description = description;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,   // <-- handled field
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            description: ""
        });
    }
    getDescription() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, description } = this.state;

        if (!activesampleid) return description;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return description;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.description ?? description;
    }

    handleGraphicLog(graphiclog) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const makeid = new MakeID();

        // Load all projects
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        // Get project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const project = projects[projectIndex];
        if (!project) return;

        // Get boring
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boringid);
        const boring = project.borings?.[boringIndex];
        if (!boring) return;

        const activeId = this.state.activesampleid;

        // --------------------------------------------------
        // UPDATE EXISTING SAMPLE
        // --------------------------------------------------
        if (activeId) {
            const sampleIndex = gfk.getSampleKeyById.call(
                this,
                projectid,
                boringid,
                activeId
            );

            if (sampleIndex >= 0) {
                boring.samples[sampleIndex].graphiclog = graphiclog;

                this.props.reduxProjects(projects);
                this.setState({ render: "render" });
            }

            return;
        }

        // --------------------------------------------------
        // CREATE NEW SAMPLE
        // --------------------------------------------------
        const sampleid = makeid.sampleID.call(this, 16);

        const {
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            remarks,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            ll,
            pi
        } = this.state;

        const newSample = Sample(
            sampleid,
            boringid,
            sampledepth,
            depth,
            samplenumber,
            sampleset,
            diameter,
            samplelength,
            description,
            uscs,
            spt,
            sptlength,
            wetwgt,
            wetwgt_2,
            drywgt,
            tarewgt,
            tareno,
            graphiclog,   // <-- handled field
            ll,
            pi,
            remarks
        );

        if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
            projects[projectIndex].borings[boringIndex].samples.push(newSample);
        } else {
            projects[projectIndex].borings[boringIndex].samples = [newSample];
        }

        this.props.reduxProjects(projects);

        this.setState({
            activesampleid: sampleid,
            graphiclog: ""
        });
    }

    getGraphicLog() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;

        const { activesampleid, graphiclog } = this.state;

        if (!activesampleid) return graphiclog;

        const boring = gfk.getBoringById.call(this, projectid, boringid);;
        if (!boring) return graphiclog;

        const sample = gfk.getSampleById.call(this, projectid, boringid, activesampleid);

        return sample?.graphiclog ?? graphiclog;
    }

    generateRemarks() {
        let remarks = '';
        const gfk = new GFK();
        const {projectid, boringid} = this.props.match.params;
        const boring = gfk.getBoringById.call(this, projectid, boringid)
        if (boring) {

            if (this.state.activesampleid) {
                let sampleid = this.state.activesampleid;
                let sample = gfk.getSampleById.call(this, projectid, boringid, sampleid)

                let ll = Number(sample.ll)
                let pi = Number(sample.pi)

                if (ll && pi) {
                    remarks += `LL=${ll}% PI=${pi}`
                }


                const unconfined = gfk.getUnconfinedTestById.call(this, boringid, sampleid)
             
                if (unconfined) {


                    const unconfinedcalcs = new UnconfinedCalcs()
                    const maxstress = unconfinedcalcs.getMaxStress.call(this, boringid, sampleid);
                    const maxstrain = unconfinedcalcs.getMaxStrain.call(this, boringid, sampleid)

                    remarks += `Unconfined Strength=${maxstress}psf Strain=${maxstrain}%`

                }



            }

            if (remarks) {
                this.handleRemarks(remarks)
            }

        }
    }

    getSieveTest() {
        const gfk = new GFK();

        const sampleid = this.state.activesampleid;
        const sample = gfk.getsamplebyid.call(this, sampleid)
        let description = '';
        if (sample) {
            description += sample.description;
            const netwgt = Number(sample.drywgt) - Number(sample.tarewgt);
            const ll = Number(sample.ll)
            const pi = Number(sample.pi);
            const sieve = gfk.getSieveBySampleId.call(this, sampleid)
            if (sieve) {
                description += ` (`
                const wgt34 = Number(sieve.wgt34)
                const wgt38 = Number(sieve.wgt38)
                const wgt4 = Number(sieve.wgt4)
                const wgt10 = Number(sieve.wgt10)
                const wgt30 = Number(sieve.wgt30)
                const wgt40 = Number(sieve.wgt40)
                const wgt100 = Number(sieve.wgt100)
                const wgt200 = Number(sieve.wgt200)
                const getSoilClassification = new SoilClassification(netwgt, ll, pi, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200)
                const gravelfrac = Number(getSoilClassification.getGravFrac())
                const sandfrac = Number(getSoilClassification.getSandFrac())
                const fines = Number(getSoilClassification.getFines())
                if (gravelfrac > 0) {
                    description += ` Gravel ${gravelfrac}%,`
                }
                if (sandfrac > 0) {
                    description += ` Sand ${sandfrac}%,`
                }
                if (fines > 0) {
                    description += ` Fines ${fines}%`
                }

                description += ` )`
            }

            if (description) {
                this.handledescription(description)
            }

        }

    }
    render() {
        const gfk = new GFK();
        const graphiclog = new GraphicLog();
        const { projectid, boringid } = this.props.match.params
        const boring = gfk.getBoringById.call(this, projectid, boringid);
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const samples_1 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Set <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSampleSet()}
                            onChange={event => { this.handleSampleSet(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Number <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSampleNumber()}
                            onChange={event => { this.handleSampleNumber(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Depth <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSampleDepth()}
                            onChange={event => { this.handleSampleDepth(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Depth <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getDepth()}
                            onChange={event => { this.handleDepth(event.target.value) }} />
                    </div>
                </div>)
            } else {

                return (
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Set <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSampleSet()}
                                        onChange={event => { this.handleSampleSet(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Number <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSampleNumber()}
                                        onChange={event => { this.handleSampleNumber(event.target.value) }}
                                    />
                                </div>
                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Depth <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSampleDepth()}
                                        onChange={event => { this.handleSampleDepth(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Depth <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getDepth()}
                                        onChange={event => { this.handleDepth(event.target.value) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            }
        }

        const samples_2 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Dry Wgt <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getDryWgt()}
                            onChange={event => { this.handleDryWgt(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        SPT<br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSPT()}
                            onChange={event => { this.handleSPT(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        LL<br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getLL()}
                            onChange={event => { this.handleLL(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        PI <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getPI()}
                            onChange={event => { this.handlePI(event.target.value) }}
                        />
                    </div>
                </div>)
            } else {

                return (
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>

                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Dry Wgt <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getDryWgt()}
                                        onChange={event => { this.handleDryWgt(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    SPT <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSPT()}
                                        onChange={event => { this.handleSPT(event.target.value) }}
                                    />
                                </div>
                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    LL <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getLL()}
                                        onChange={event => { this.handleLL(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    PI <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getPI()}
                                        onChange={event => { this.handlePI(event.target.value) }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            }
        }

        const calculateUSCS = () => {
            if (this.state.activesampleid) {
                return (<div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...styles.fullWidth }}
                        onClick={() => { this.calcUSCS() }}>
                        {calculateIcon()}
                    </button>
                </div>)
            }
        }
        const remarksWidth = gfk.remarksWidth.call(this)
        const remarksButton = () => {
            if (this.state.activesampleid) {
                return (<div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...remarksWidth }}
                        onClick={() => { this.generateRemarks() }}>{remarksIcon()}</button>
                </div>)
            }
        }

        const samples_3 = () => {
            return (
                <div style={{ ...styles.generalContainer }}>
                    <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalFlex }}>
                                <div style={{ ...styles.flex1 }}>
                                    <span style={{ ...regularFont }}>USCS</span>
                                </div>
                                {calculateUSCS()}
                            </div>

                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...regularFont, ...styles.alignCenter }}
                                    value={this.getUSCS()}
                                    onChange={event => { this.handleUSCS(event.target.value) }}
                                />
                            </div>


                        </div>

                        <div style={{ ...styles.flex1 }}>
                            <span style={{ ...regularFont }}>SPT-Length</span>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...regularFont, ...styles.alignCenter }}
                                    value={this.getSPTLength()}
                                    onChange={event => { this.handleSPTLength(event.target.value) }}
                                />
                            </div>


                        </div>




                    </div>
                    <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.generalContainer }}>
                            <div style={{ ...styles.generalFlex }}>
                                <div style={{ ...styles.flex1 }}>
                                    <span style={{ ...regularFont }}>Remarks</span>

                                </div>
                                {remarksButton()}
                            </div>

                            <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                value={this.getRemarks()}
                                onChange={event => { this.handleRemarks(event.target.value) }}
                            />

                        </div>
                    </div>

                </div>

            )
        }

        const showgraphiclog = () => {
            if (this.state.activesampleid) {
                return (graphiclog.showgraphiclog.call(this))
            } else {
                return
            }
        }

        const showsievebutton = () => {
            if (this.state.activesampleid) {
                return (<div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...remarksWidth }}
                        onClick={() => { this.getSieveTest() }}>{addSieveIcon()}</button>
                </div>)
            }
        }

        const project = gfk.getProjectById.call(this, projectid)

        if (project) {
            const engineerid = 'mazen';
            const goIconWidth = gfk.getgotoicon.call(this)

            return (
                <div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                            <div style={{ ...styles.flex1, ...styles.alignCenter, ...headerFont, ...styles.boldFont }}>
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

                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <Link
                                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                        to={`/${engineerid}/projects/${projectid}/borings`}>
                                        /Borings
                                    </Link>
                                </div>

                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples`}>/Boring Number {boring.boringnumber} - Samples</Link>
                                </div>




                            </div>
                        </div>

                        {samples_1()}
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Sample Diameter <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getDiameter()}
                                    onChange={event => { this.handleDiameter(event.target.value) }} />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Sample Length <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getSampleLength()}
                                    onChange={event => { this.handleSampleLength(event.target.value) }} />
                            </div>

                        </div>
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Tare No <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getTareNo()}
                                    onChange={event => { this.handleTareNo(event.target.value) }}
                                />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Tare Wgt <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getTareWgt()}
                                    onChange={event => { this.handleTareWgt(event.target.value) }}
                                />
                            </div>

                        </div>
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>


                                Wet Wgt <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getWetWgt()}
                                    onChange={event => { this.handleWetWgt(event.target.value) }}
                                />
                            </div>

                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Wet Wgt 2 <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getWetWgt_2()}
                                    onChange={event => { this.handleWetWgt_2(event.target.value) }}
                                />



                            </div>

                        </div>

                        {samples_2()}
                        {samples_3()}

                        <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.generalFlex }}>
                                <div style={{ ...styles.flex1, ...regularFont, }}>
                                    <span style={{ ...regularFont }}>Description</span>
                                </div>
                                {showsievebutton()}
                            </div>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getDescription()}
                                    onChange={event => { this.handleDescription(event.target.value) }}
                                />
                            </div>

                        </div>

                        {showgraphiclog()}

                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                            {this.state.message}
                        </div>

                        {gfk.showsaveboring.call(this)}

                        {this.showsampleids()}

                        <div style={{ ...styles.generalContainer }}>
                            <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                                to={`/${engineerid}/projects/${projectid}/borings/${boringid}/logdraft`}>
                                <button style={{ ...styles.generalButton, ...goIconWidth }}>
                                    {goToIcon()}
                                </button>
                                <span style={{ ...styles.generalFont, ...regularFont }}>View LogDraft</span>
                            </Link>
                        </div>


                    </div>
                </div>
            )

        } else {
            return (<span>&nbsp;</span>)
        }
    }

}

function mapStateToProps(state) {
    return {
        projects: state.projects
    }
}
export default connect(mapStateToProps, actions)(Samples);