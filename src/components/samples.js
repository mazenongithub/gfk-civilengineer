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
        const samples = gfk.getsamplesbyboringid.call(this, this.props.match.params.boringid);
        let ids = [];
        if (samples.length > 0) {
            // eslint-disable-next-line
            samples.map(sample => {
                ids.push(this.showsampleid(sample))
            })
        }
        return ids;

    }
    validateremovesample(sample) {
        const gfk = new GFK();
        const sieveanalysis = gfk.getsievebysampleid.call(this, sample.sampleid);
        const unconfined = gfk.getunconfinedtestbyid.call(this, sample.sampleid)
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
    removesampleid(sample) {
        if (window.confirm(`Are you sure you want to delete Sample at ${sample.depth} ft?`)) {
            const gfk = new GFK();
            const myuser = gfk.getuser.call(this);
            if (myuser) {
                const boringid = this.props.match.params.boringid;
                const boring = gfk.getboringbyid.call(this, boringid)
                if (boring) {
                    const i = gfk.getboringkeybyid.call(this, boringid)
                    const validate = this.validateremovesample(sample);

                    if (validate.validate) {
                        const getsample = gfk.getsamplebyid.call(this, boringid, sample.sampleid)
                        if (getsample) {
                            const j = gfk.getsamplekeybyid.call(this, boringid, sample.sampleid);
                            myuser.borings[i].samples.splice(j, 1);
                            this.props.reduxUser(myuser);
                            this.setState({ activesampleid: false })
                        }


                    } else {
                        this.setState({ message: validate.message })
                    }

                }


            }

        }


    }
    makesampleactive(sampleid) {
        if (this.state.activesampleid === sampleid) {
            this.setState({ activesampleid: false })
        } else {
            this.setState({ activesampleid: sampleid })
        }
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

        if (myuser) {
            const engineerid = myuser.engineerid;

            const activebackground = () => {
                if (this.state.activesampleid === sample.sampleid) {
                    return (styles.activefieldreport)
                } else {
                    return;
                }
            }
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
                                <span style={{ ...activebackground() }} onClick={() => { this.makesampleactive(sample.sampleid) }}>{sample.sampleset}-({sample.samplenumber}) SampleDepth:{sample.sampledepth} Depth:{sample.depth}ft Diameter:{sample.diameter} in. Length {sample.samplelength} in. Description {sample.description}  SPT: {sample.spt} WetWgt: {sample.wetwgt}g  Wet Wgt 2: {sample.wetwgt_2}g Dry Wgt:{sample.drywgt}g Tare Wgt {sample.tarewgt}g  WgtWater:{showwgtwater()} NetWgt:{shownetwgt()} Moist: {Number(moist() * 100).toFixed(1)}% DryDen:{showdryden()}pcf Tare No: {sample.tareno} LL: {sample.ll} PI: {sample.pi}</span>
                                <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removesampleid(sample) }}>
                                    {removeIconSmall()}
                                </button>
                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...activebackground(), ...styles.addLeftMargin }}>
                                <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                                    to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sample.sampleid}/sieve`}>
                                    Sieve Analysis
                                </Link>
                            </div>
                            <div style={{ ...styles.flex1, ...activebackground() }}>
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

    }
    handlesampleset(sampleset) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {

                if (this.state.activesampleid) {
                    let sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const sampleid = this.state.activesampleid;
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].sampleset = sampleset;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }

                } else {
                    const sampleid = makeid.sampleID.call(this, 16);
                    const boringid = this.props.match.params.boringid;
                    const sampledepth = this.state.sampledepth;
                    const depth = this.state.depth;
                    const samplenumber = this.state.samplenumber;
                    const diameter = this.state.diameter;
                    const samplelength = this.state.samplelength;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const remarks = this.state.remarks;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const tareno = this.state.tareno;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, sampleset: '' })

                }

            }
        }


    }
    getsampleset() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let sampleset = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    sampleset = sample.sampleset;
                }

            } else {
                sampleset = this.state.sampleset;
            }


        } else {
            sampleset = this.state.sampleset;
        }

        return sampleset;
    }

    handlesamplenumber(samplenumber) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {

                if (this.state.activesampleid) {

                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].samplenumber = samplenumber;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const sampledepth = this.state.sampledepth;
                    const depth = this.state.depth;
                    const sampleset = this.state.sampleset;
                    const diameter = this.state.diameter;
                    const samplelength = this.state.samplelength;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const tareno = this.state.tareno;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, samplenumber: '' })

                }
            }
        }


    }
    getsamplenumber() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let samplenumber = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    samplenumber = sample.samplenumber;
                }

            } else {
                samplenumber = this.state.samplenumber;
            }


        } else {
            samplenumber = this.state.samplenumber;
        }

        return samplenumber;
    }
    handlesampledepth(sampledepth) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].sampledepth = sampledepth;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const depth = this.state.depth;
                    const sampleset = this.state.sampleset;
                    const diameter = this.state.diameter;
                    const samplelength = this.state.samplelength;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const tareno = this.state.tareno;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, sampledepth: '' })

                }
            }
        }


    }
    getsampledepth() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let sampledepth = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    sampledepth = sample.sampledepth;
                }

            } else {
                sampledepth = this.state.sampledepth;
            }


        } else {
            sampledepth = this.state.sampledepth;
        }

        return sampledepth;
    }


    handledepth(depth) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].depth = depth;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const diameter = this.state.diameter;
                    const samplelength = this.state.samplelength;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const tareno = this.state.tareno;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, depth: '' })

                }
            }
        }


    }

    getdepth() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let depth = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    depth = sample.depth;
                }

            } else {
                depth = this.state.depth;
            }


        } else {
            depth = this.state.depth;
        }

        return depth;
    }

    handlediameter(diameter) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].diameter = diameter;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const samplelength = this.state.samplelength;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const tareno = this.state.tareno;
                    const graphiclog = this.state.graphiclog;
                    const remarks = this.state.remarks;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, diameter: '' })

                }
            }

        }


    }
    getdiameter() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let diameter = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    diameter = sample.diameter;
                }

            } else {
                diameter = this.state.diameter;
            }


        } else {
            diameter = this.state.diameter;
        }

        return diameter;
    }

    handlelength(samplelength) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].samplelength = samplelength;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const tareno = this.state.tareno;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, samplelength: '' })

                }
            }

        }


    }
    getlength() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let samplelength = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    samplelength = sample.samplelength;
                }

            } else {
                samplelength = this.state.samplelength;
            }


        } else {
            samplelength = this.state.samplelength;
        }

        return samplelength;
    }

    handletareno(tareno) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].tareno = tareno;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, tareno: '' })

                }
            }

        }


    }
    gettareno() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let tareno = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    tareno = sample.tareno;
                }

            } else {
                tareno = this.state.tareno;
            }


        } else {
            tareno = this.state.tareno;
        }

        return tareno;
    }

    handletarewgt(tarewgt) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            if (this.state.activesampleid) {
                const boringid = this.props.match.params.boringid;
                const boring = gfk.getboringbyid.call(this, boringid)
                const i = gfk.getboringkeybyid.call(this, boringid)
                if (boring) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].tarewgt = tarewgt;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const wetwgt = this.state.wetwgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const remarks = this.state.remarks;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, tarewgt: '' })

                }
            }

        }


    }

    gettarewgt() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let tarewgt = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    tarewgt = sample.tarewgt;
                }

            } else {
                tarewgt = this.state.tarewgt;
            }


        } else {
            tarewgt = this.state.tarewgt;
        }

        return tarewgt;
    }


    handlewetwgt(wetwgt) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].wetwgt = wetwgt;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt_2 = this.state.wgtwgt_2;
                    const drywgt = this.state.drywgt;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, wetwgt: '' })

                }
            }
        }

    }
    getwetwgt() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let wetwgt = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    wetwgt = sample.wetwgt;
                }

            } else {
                wetwgt = this.state.wetwgt;
            }


        } else {
            wetwgt = this.state.wetwgt;
        }

        return wetwgt;
    }

    handlewetwgt_2(wetwgt_2) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                        myuser.borings[i].samples[j].wetwgt_2 = wetwgt_2;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const drywgt = this.state.drywgt;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, wetwgt_2: '' })

                }
            }

        }


    }
    getwetwgt_2() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let wetwgt_2 = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    wetwgt_2 = sample.wetwgt_2;
                }

            } else {
                wetwgt_2 = this.state.wetwgt_2;
            }


        } else {
            wetwgt_2 = this.state.wetwgt_2;
        }

        return wetwgt_2;
    }

    handledrywgt(drywgt) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].drywgt = drywgt;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, drywgt: '' })

                }
            }

        }


    }
    getdrywgt() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let drywgt = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    drywgt = sample.drywgt;
                }

            } else {
                drywgt = this.state.drywgt;
            }


        } else {
            drywgt = this.state.drywgt;
        }

        return drywgt;
    }

    handleuscs(uscs) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].uscs = uscs;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, uscs: '' })

                }
            }

        }


    }

    getuscs() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let uscs = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    uscs = sample.uscs;
                }

            } else {
                uscs = this.state.uscs;
            }


        } else {
            uscs = this.state.uscs;
        }

        return uscs;
    }
    handlespt(spt) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].spt = spt;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const sptlength = this.state.sptlength;
                    const graphiclog = this.state.graphiclog;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, spt: '' })

                }
            }

        }


    }

    getspt() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let spt = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    spt = sample.spt;
                }

            } else {
                spt = this.state.spt;
            }


        } else {
            spt = this.state.spt;
        }

        return spt;
    }


    handlesptlength(sptlength) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].sptlength = sptlength;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const remarks = this.state.remarks;
                    const spt = this.state.spt;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, sptlength: '' })

                }
            }

        }


    }

    getsptlength() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let sptlength = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    sptlength = sample.sptlength;
                }

            } else {
                sptlength = this.state.sptlength;
            }


        } else {
            sptlength = this.state.sptlength;
        }

        return sptlength;
    }

    handleremarks(remarks) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].remarks = remarks;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const ll = this.state.ll;
                    const pi = this.state.pi;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, remarks: '' })

                }
            }

        }


    }

    getremarks() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let remarks = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    remarks = sample.remarks;
                }

            } else {
                remarks = this.state.remarks;
            }


        } else {
            remarks = this.state.remarks;
        }

        return remarks;
    }


    handlell(ll) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].ll = ll;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const pi = this.state.pi;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, ll: '' })

                }
            }

        }


    }

    getll() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let ll = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    ll = sample.ll;
                }

            } else {
                ll = this.state.ll;
            }


        } else {
            ll = this.state.ll;
        }

        return ll;
    }

    handlepi(pi) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                    if (sample) {
                        const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                        myuser.borings[i].samples[j].pi = pi;
                        this.props.reduxUser(myuser)
                        this.setState({ render: 'render' })
                    }
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const description = this.state.description;
                    const uscs = this.state.uscs;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const spt = this.state.spt;
                    const sptlength = this.state.sptlength;
                    const ll = this.state.ll;
                    const remarks = this.state.remarks;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, sptlength, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi, remarks)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, pi: '' })

                }
            }

        }


    }

    getpi() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let pi = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    pi = sample.pi;
                }

            } else {
                pi = this.state.pi;
            }


        } else {
            pi = this.state.pi;
        }

        return pi;
    }

    calcUSCS() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        const boring = gfk.getboringbyid.call(this,boringid)
        if(boring) {
        const sampleid = this.state.activesampleid;
        const sample = gfk.getsamplebyid.call(this, boringid, sampleid);
        let uscs = ''
        if (sample) {
            const ll = Number(sample.ll);
            const pi = Number(sample.pi);
            if (!ll || !pi) {
                alert(`No LL or PI found`)
            } else {
                const sieve = gfk.getsievebysampleid.call(this, boringid, sampleid)
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
                    this.handleuscs(uscs)


                }



            }

        } else {
            alert(`Sample Not Found`)
        }

    }

    }
    handledescription(description) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                    myuser.borings[i].samples[j].description = description;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const pi = this.state.pi;
                    const uscs = this.state.uscs;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const graphiclog = this.state.graphiclog;
                    const spt = this.state.spt;
                    const ll = this.state.ll;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, description: '' })

                }
            }

        }


    }

    getdescription() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let description = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    description = sample.description;
                }

            } else {
                description = this.state.description;
            }


        } else {
            description = this.state.description;
        }

        return description;
    }
    handlegraphiclog(graphiclog) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const makeid = new MakeID();
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            const i = gfk.getboringkeybyid.call(this, boringid)
            if (boring) {
                if (this.state.activesampleid) {
                    const sampleid = this.state.activesampleid;
                    const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);;
                    myuser.borings[i].samples[j].graphiclog = graphiclog;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })
                } else {
                    const sampleid = makeid.sampleID.call(this, 16);;
                    const boringid = this.props.match.params.boringid;
                    const samplenumber = this.state.samplenumber;
                    const sampledepth = this.state.sampledepth;
                    const sampleset = this.state.sampleset;
                    const depth = this.state.depth;
                    const diameter = this.state.diameter;
                    const pi = this.state.pi;
                    const uscs = this.state.uscs;
                    const drywgt = this.state.drywgt;
                    const tarewgt = this.state.tarewgt;
                    const wetwgt = this.state.wgtwgt;
                    const wetwgt_2 = this.state.wetwgt_2;
                    const tareno = this.state.tareno;
                    const samplelength = this.state.samplelength;
                    const description = this.state.description;
                    const spt = this.state.spt;
                    const ll = this.state.ll;
                    const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi)
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        myuser.borings[i].samples.push(newSample)

                    } else {
                        myuser.borings[i].samples = { sample: [newSample] }

                    }
                    this.props.reduxUser(myuser)
                    this.setState({ activesampleid: sampleid, graphiclog: '' })

                }
            }

        }


    }
    getgraphiclog() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let graphiclog = "";
        if (this.state.activesampleid) {
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const sample = gfk.getsamplebyid.call(this, boringid, this.state.activesampleid);
                if (sample) {
                    graphiclog = sample.graphiclog;
                }

            } else {
                graphiclog = this.state.graphiclog;
            }


        } else {
            graphiclog = this.state.graphiclog;
        }

        return graphiclog;
    }

    generateRemarks() {
        let remarks = '';
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        const boring = gfk.getboringbyid.call(this)
        if (boring) {
            
            if (this.state.activesampleid) {
                let sampleid = this.state.activesampleid;
                let sample = gfk.getsamplebyid.call(this, boringid,sampleid)

                let ll = Number(sample.ll)
                let pi = Number(sample.pi)

                if (ll && pi) {
                    remarks += `LL=${ll}% PI=${pi}`
                }


                const unconfined = gfk.getunconfinedtestbyid.call(this, boringid, sampleid)
                console.log(unconfined)
                if (unconfined) {
                

                    const unconfinedcalcs = new UnconfinedCalcs()
                    const maxstress = unconfinedcalcs.getMaxStress.call(this, boringid, sampleid);
                    const maxstrain = unconfinedcalcs.getMaxStrain.call(this, boringid, sampleid)

                    remarks += `Unconfined Strength=${maxstress}psf Strain=${maxstrain}%`

                }



            }

            if (remarks) {
                this.handleremarks(remarks)
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
            const sieve = gfk.getsievebysampleid.call(this, sampleid)
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

        const boring = gfk.getboringbyid.call(this, this.props.match.params.boringid);
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const samples_1 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Set <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getsampleset()}
                            onChange={event => { this.handlesampleset(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Number <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getsamplenumber()}
                            onChange={event => { this.handlesamplenumber(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Depth <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getsampledepth()}
                            onChange={event => { this.handlesampledepth(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Depth <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getdepth()}
                            onChange={event => { this.handledepth(event.target.value) }} />
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
                                        value={this.getsampleset()}
                                        onChange={event => { this.handlesampleset(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Number <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getsamplenumber()}
                                        onChange={event => { this.handlesamplenumber(event.target.value) }}
                                    />
                                </div>
                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Depth <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getsampledepth()}
                                        onChange={event => { this.handlesampledepth(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Depth <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getdepth()}
                                        onChange={event => { this.handledepth(event.target.value) }}
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
                            value={this.getdrywgt()}
                            onChange={event => { this.handledrywgt(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        SPT<br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getspt()}
                            onChange={event => { this.handlespt(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        LL<br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getll()}
                            onChange={event => { this.handlell(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        PI <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getpi()}
                            onChange={event => { this.handlepi(event.target.value) }}
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
                                        value={this.getdrywgt()}
                                        onChange={event => { this.handledrywgt(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    SPT <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getspt()}
                                        onChange={event => { this.handlespt(event.target.value) }}
                                    />
                                </div>
                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    LL <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getll()}
                                        onChange={event => { this.handlell(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    PI <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getpi()}
                                        onChange={event => { this.handlepi(event.target.value) }} />
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
                                    value={this.getuscs()}
                                    onChange={event => { this.handleuscs(event.target.value) }}
                                />
                            </div>


                        </div>

                        <div style={{ ...styles.flex1 }}>
                            <span style={{ ...regularFont }}>SPT-Length</span>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...regularFont, ...styles.alignCenter }}
                                    value={this.getsptlength()}
                                    onChange={event => { this.handlesptlength(event.target.value) }}
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
                                value={this.getremarks()}
                                onChange={event => { this.handleremarks(event.target.value) }}
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

        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const engineerid = myuser.engineerid;
            const projectid = this.props.match.params.projectid;
            const project = gfk.getprojectbyid.call(this, projectid)
            const boringid = this.props.match.params.boringid;
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
                                    value={this.getdiameter()}
                                    onChange={event => { this.handlediameter(event.target.value) }} />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Sample Length <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getlength()}
                                    onChange={event => { this.handlelength(event.target.value) }} />
                            </div>

                        </div>
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Tare No <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.gettareno()}
                                    onChange={event => { this.handletareno(event.target.value) }}
                                />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Tare Wgt <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.gettarewgt()}
                                    onChange={event => { this.handletarewgt(event.target.value) }}
                                />
                            </div>

                        </div>
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>


                                Wet Wgt <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getwetwgt()}
                                    onChange={event => { this.handlewetwgt(event.target.value) }}
                                />
                            </div>

                            <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                Wet Wgt 2 <br />
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getwetwgt_2()}
                                    onChange={event => { this.handlewetwgt_2(event.target.value) }}
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
                                    value={this.getdescription()}
                                    onChange={event => { this.handledescription(event.target.value) }}
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
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(Samples);