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
        this.loadProgram();



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
        let sectionname = '';
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getPTSlabbyID.call(this, sectionid)

            sectionname = section.sectionname;
        }
        return sectionname;

    }

    handleSectionName(value) {

        const gfk = new GFK();

        if (this.state.activesectionid) {

            const sectionid = this.state.activesectionid;
            let ptslabs = gfk.getPTslabs.call(this)
            if (ptslabs) {

                const ptslab = gfk.getPTSlabbyID.call(this, sectionid)
                if (ptslab) {
                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)

                    ptslabs[i].sectionname = value;
                    this.props.reduxPTSlab(ptslabs)
                    this.setState({ render: 'render' })

                }

            }

        } else {
            const projectid = this.props.match.params.projectid;
            const makeid = new MakeID();
            const sectionid = makeid.ptslabsectionid.call(this);
            const sectionname = value;
            const newSection = PTSlabSection(projectid, sectionid, sectionname)
            const ptslabs = gfk.getPTslabs.call(this)

            if (ptslabs) {
                ptslabs.push(newSection)
                this.props.reduxPTSlab(ptslabs)
                this.setState({ activesectionid: sectionid })
            }

        }

    }


    getlayername() {
        const gfk = new GFK();
        let layername = '';
        if (this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
            if (layer) {
                layername = layer.layername;
            }
        }
        return layername;

    }

    handlelayername(value) {
        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {

            if (this.state.activesectionid) {
                const sectionid = this.state.activesectionid;
                const section = gfk.getPTSlabbyID.call(this, sectionid)

                if (section) {

                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)


                    if (this.state.activelayerid) {

                        const layerid = this.state.activelayerid;

                        const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
                        if (layer) {

                            const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                            ptslabs[i].layers[j].layername = value;
                            this.props.reduxPTSlab(ptslabs)
                            this.setState({ render: 'render' })



                        }



                    } else {

                        const makeid = new MakeID();
                        const layerid = makeid.plslablayerid.call(this, sectionid)
                        const toplayer = this.state.toplayer;
                        const bottomlayer = this.state.bottomlayer;
                        const ll = this.state.ll;
                        const pi = this.state.pi;
                        const fines = this.state.fines;
                        const micro = this.state.micro;
                        const newLayer = PTSlabLayer(layerid, value, toplayer, bottomlayer, ll, pi, fines, micro)
                        
                        if(section.hasOwnProperty("layers")) {
                            ptslabs[i].layers.push(newLayer)

                        } else {
                            ptslabs[i].layers = [];
                            ptslabs[i].layers.push(newLayer)


                        }
                        this.props.reduxPTSlab(ptslabs);
                        this.setState({ activelayerid: layerid })
                        
                       

                    }

                }


            }


        }


    }

    gettoplayer() {

        const gfk = new GFK();
        let toplayer = '';
        if (this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
            if (layer) {
                toplayer = layer.toplayer;
            }
        }
        return toplayer;

    }

    handletoplayer(value) {

        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {

            if (this.state.activesectionid) {
                const sectionid = this.state.activesectionid;
                const section = gfk.getPTSlabbyID.call(this, sectionid)

                if (section) {

                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)


                    if (this.state.activelayerid) {

                        const layerid = this.state.activelayerid;

                        const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
                        if (layer) {

                            const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                            ptslabs[i].layers[j].toplayer = value;
                            this.props.reduxPTSlab(ptslabs)
                            this.setState({ render: 'render' })



                        }



                    } else {
                        const makeid = new MakeID();
                        const layerid = makeid.plslablayerid.call(this, sectionid)
                        const layername = this.state.layername;
                        const bottomlayer = this.state.bottomlayer;
                        const ll = this.state.ll;
                        const pi = this.state.pi;
                        const fines = this.state.fines;
                        const micro = this.state.micro;
                        const newLayer = PTSlabLayer(layerid, layername, value, bottomlayer, ll, pi, fines, micro)
                        
                        if(section.hasOwnProperty("layers")) {
                            ptslabs[i].layers.push(newLayer)

                        } else {
                            ptslabs[i].layers = [];
                            ptslabs[i].layers.push(newLayer)


                        }

                        this.props.reduxPTSlab(ptslabs);
                        this.setState({ activelayerid: layerid })

                    }

                }


            }


        }

    }

    getbottomlayer() {

        const gfk = new GFK();
        let bottomlayer = '';
        if (this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
            if (layer) {
                bottomlayer = layer.bottomlayer;
            }
        }
        return bottomlayer;

    }

    handlebottomlayer(value) {

        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {

            if (this.state.activesectionid) {
                const sectionid = this.state.activesectionid;
                const section = gfk.getPTSlabbyID.call(this, sectionid)

                if (section) {

                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)


                    if (this.state.activelayerid) {

                        const layerid = this.state.activelayerid;

                        const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
                        if (layer) {

                            const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                            ptslabs[i].layers[j].bottomlayer = value;
                            this.props.reduxPTSlab(ptslabs)
                            this.setState({ render: 'render' })



                        }



                    } else {
                        const makeid = new MakeID();
                        const layerid = makeid.plslablayerid.call(this, sectionid)
                        const layername = this.state.layername;
                        const toplayer = this.state.toplayer;
                        const ll = this.state.ll;
                        const pi = this.state.pi;
                        const fines = this.state.fines;
                        const micro = this.state.micro;
                        const newLayer = PTSlabLayer(layerid, layername, toplayer, value, ll, pi, fines, micro)
                         if(section.hasOwnProperty("layers")) {
                            ptslabs[i].layers.push(newLayer)

                        } else {
                            ptslabs[i].layers = [];
                            ptslabs[i].layers.push(newLayer)


                        }
                        this.props.reduxPTSlab(ptslabs);
                        this.setState({ activelayerid: layerid })

                    }

                }


            }


        }

    }

    getll() {

        const gfk = new GFK();
        let ll = '';
        if (this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
            if (layer) {
                ll = layer.ll;
            }
        }
        return ll;

    }

    handlell(value) {

        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {

            if (this.state.activesectionid) {
                const sectionid = this.state.activesectionid;
                const section = gfk.getPTSlabbyID.call(this, sectionid)

                if (section) {

                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)


                    if (this.state.activelayerid) {

                        const layerid = this.state.activelayerid;

                        const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
                        if (layer) {

                            const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                            ptslabs[i].layers[j].ll = value;
                            this.props.reduxPTSlab(ptslabs)
                            this.setState({ render: 'render' })

                        }

                    } else {
                        const makeid = new MakeID();
                        const layerid = makeid.plslablayerid.call(this, sectionid)
                        const layername = this.state.layername;
                        const toplayer = this.state.toplayer;
                        const bottomlayer = this.state.bottomlayer
                        const pi = this.state.pi;
                        const fines = this.state.fines;
                        const micro = this.state.micro;
                        const newLayer = PTSlabLayer(layerid, layername, toplayer, bottomlayer, value, pi, fines, micro)
                        if(section.hasOwnProperty("layers")) {
                            ptslabs[i].layers.push(newLayer)

                        } else {
                            ptslabs[i].layers = [];
                            ptslabs[i].layers.push(newLayer)


                        }
                        this.props.reduxPTSlab(ptslabs);
                        this.setState({ activelayerid: layerid })

                    }

                }


            }


        }

    }

    getpi() {

        const gfk = new GFK();
        let pi = '';
        if (this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
            if (layer) {
                pi = layer.pi;
            }
        }
        return pi;

    }

    handlepi(value) {

        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {

            if (this.state.activesectionid) {
                const sectionid = this.state.activesectionid;
                const section = gfk.getPTSlabbyID.call(this, sectionid)

                if (section) {

                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)


                    if (this.state.activelayerid) {

                        const layerid = this.state.activelayerid;

                        const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
                        if (layer) {

                            const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                            ptslabs[i].layers[j].pi = value;
                            this.props.reduxPTSlab(ptslabs)
                            this.setState({ render: 'render' })

                        }


                    } else {
                        const makeid = new MakeID();
                        const layerid = makeid.plslablayerid.call(this, sectionid)
                        const layername = this.state.layername;
                        const toplayer = this.state.toplayer;
                        const bottomlayer = this.state.bottomlayer
                        const ll = this.state.ll;
                        const fines = this.state.fines;
                        const micro = this.state.micro;
                        const newLayer = PTSlabLayer(layerid, layername, toplayer, bottomlayer, ll, value, fines, micro)
                        
                        if(section.hasOwnProperty("layers")) {
                            ptslabs[i].layers.push(newLayer)

                        } else {
                            ptslabs[i].layers = [];
                            ptslabs[i].layers.push(newLayer)


                        }
                        
                        this.props.reduxPTSlab(ptslabs);
                        this.setState({ activelayerid: layerid })

                    }

                }


            }


        }

    }

    getfines() {

        const gfk = new GFK();
        let fines = '';
        if (this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
            if (layer) {
                fines = layer.fines;
            }
        }
        return fines;

    }

    handlefines(value) {

        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {

            if (this.state.activesectionid) {
                const sectionid = this.state.activesectionid;
                const section = gfk.getPTSlabbyID.call(this, sectionid)

                if (section) {

                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)


                    if (this.state.activelayerid) {

                        const layerid = this.state.activelayerid;

                        const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
                        if (layer) {

                            const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                            ptslabs[i].layers[j].fines = value;
                            this.props.reduxPTSlab(ptslabs)
                            this.setState({ render: 'render' })



                        }



                    } else {
                        const makeid = new MakeID();
                        const layerid = makeid.plslablayerid.call(this, sectionid)
                        const layername = this.state.layername;
                        const toplayer = this.state.toplayer;
                        const bottomlayer = this.state.bottomlayer
                        const ll = this.state.ll;
                        const pi = this.state.pi;
                        const micro = this.state.micro;
                        const newLayer = PTSlabLayer(layerid, layername, toplayer, bottomlayer, ll, pi, value, micro)
                        if(section.hasOwnProperty("layers")) {
                            ptslabs[i].layers.push(newLayer)

                        } else {
                            ptslabs[i].layers = [];
                            ptslabs[i].layers.push(newLayer)


                        }
                        this.props.reduxPTSlab(ptslabs);
                        this.setState({ activelayerid: layerid })

                    }

                }


            }


        }

    }

    getmicro() {

        const gfk = new GFK();
        let micro = '';
        if (this.state.activelayerid) {
            const sectionid = this.state.activesectionid;
            const layerid = this.state.activelayerid;
            const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
            if (layer) {
                micro = layer.micro;
            }
        }
        return micro;

    }

    handlemicro(value) {

        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {

            if (this.state.activesectionid) {
                const sectionid = this.state.activesectionid;
                const section = gfk.getPTSlabbyID.call(this, sectionid)

                if (section) {

                    const i = gfk.getPTSlabkeybyID.call(this, sectionid)


                    if (this.state.activelayerid) {

                        const layerid = this.state.activelayerid;

                        const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)
                        if (layer) {

                            const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                            ptslabs[i].layers[j].micro = value;
                            this.props.reduxPTSlab(ptslabs)
                            this.setState({ render: 'render' })



                        }


                    } else {

                        const makeid = new MakeID();
                        const layerid = makeid.plslablayerid.call(this, sectionid)
                        const layername = this.state.layername;
                        const toplayer = this.state.toplayer;
                        const bottomlayer = this.state.bottomlayer
                        const ll = this.state.ll;
                        const pi = this.state.pi;
                        const fines = this.state.fines;
                        const newLayer = PTSlabLayer(layerid, layername, toplayer, bottomlayer, ll, pi, fines, value)
                        if(section.hasOwnProperty("layers")) {
                            ptslabs[i].layers.push(newLayer)

                        } else {
                            ptslabs[i].layers = [];
                            ptslabs[i].layers.push(newLayer)


                        }
                        this.props.reduxPTSlab(ptslabs);
                        this.setState({ activelayerid: layerid })

                    }

                }


            }


        }

    }

    async saveSection() {
        const gfk = new GFK();
        const ptslab = gfk.getPTslabs.call(this);
        const hello = 'hello'
        const response = await HandlePTSlab({ ptslab, hello })
        if(response.ptslab.hasOwnProperty("sections")) {
            let ptslabdb = response.ptslab.sections
            this.props.reduxPTSlab(ptslabdb)
        } else {
            let ptslabdb = response.ptslab
            this.props.reduxPTSlab(ptslabdb)
        }
        
        this.setState({ message: response.message })



    }

    loadslabids() {
        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        let sectionids = [];
        const projectid = this.props.match.params.projectid;

        if (ptslabs) {
            // eslint-disable-next-line
            ptslabs.map(ptslab => {

                if (ptslab.projectid === projectid) {



                    sectionids.push(this.showslabid(ptslab))

                }

            })
        }
        return sectionids;
    }

    handlesectionid(sectionid) {
        if (!this.state.activesectionid) {
            this.setState({ activesectionid: sectionid })
        } else {
            this.setState({ activesectionid: false })
        }
    }

    showslabid(ptslab) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const removeIcon = gfk.getremoveicon.call(this)

        const highlightactive = () => {

            if (this.state.activesectionid === ptslab.sectionid) {
                return (styles.activefieldreport)
            }
        }



        return (
            <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15, }}>
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handlesectionid(ptslab.sectionid) }}>
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

    async removeSection(slabid) {
        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this);
        if (ptslabs) {
            const ptslab = gfk.getPTSlabbyID.call(this, slabid)
            if (ptslab) {
                const i = gfk.getPTSlabkeybyID.call(this, slabid)
                ptslabs.splice(i, 1)
                this.props.reduxPTSlab(ptslabs)
                const response = await DeletePTSlab(ptslab._id,0)

                this.setState({ activesectionid: false, message:response.message })
            }


        }
    }

    showlayerids() {
        const gfk = new GFK();
        const layerids = [];
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const layers = gfk.getPTSlabLayersbysectionID.call(this, sectionid)
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
                <div style={{ ...styles.flex5, ...highlightactive() }} onClick={() => { this.handlelayerid(layer.layerid) }}>
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

    async removeLayer(layerid) {
        const gfk = new GFK();
        const sectionid = this.state.activesectionid;
        const section = gfk.getPTSlabbyID.call(this, sectionid);
        const ptslabs = gfk.getPTslabs.call(this)
        if (ptslabs) {
            if (section) {
                const i = gfk.getPTSlabkeybyID.call(this, sectionid)

                const layer = gfk.getPTSlabLayerbyID.call(this, sectionid, layerid)

                if (layer) {
                    const j = gfk.getPTSlabLayerKeybyID.call(this, sectionid, layerid)
                    ptslabs[i].layers.splice(j, 1)
                    this.props.reduxPTSlab(ptslabs)
                    const response = await DeletePTSlab(0,layer._id)
                    this.setState({ activelayerid: false, message:response.message })


                }


            }

        }

    }

    handlelayerid(layerid) {
        if (!this.state.activelayerid) {
            this.setState({ activelayerid: layerid })
        } else {
            this.setState({ activelayerid: false })
        }
    }

    getPISamples() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const borings = gfk.getboringsbyprojectid.call(this, projectid)
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
                const samples = gfk.getsamplesbyboringid.call(this, boringid)
                if (samples) {
                    // eslint-disable-next-line
                    samples.map(sample => {
                        if (Number(sample.ll) > 0 && Number(sample.pi) > 0) {

                            let check = checksampleid(sampleids, sample.sampleid)
                            if (!check) {
                                sampleids.push({ sampleid: sample.sampleid })

                            }



                        }
                        const sieve = gfk.getsievekeybysampleid.call(this, sample.sampleid)
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
                    const getsample = gfk.getsamplebyid.call(this, id.sampleid)
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
        if (this.state.activelayerid) {

            let ll = 0
            let pi = 0
            let fines = '';
            const sample = gfk.getsamplebyid.call(this, sampleid)
            if (sample) {

                if (Number(sample.ll) > 0) {
                    ll = Number(sample.ll)
                    this.handlell(ll)
                }
                if (Number(sample.pi) > 0) {
                    pi = Number(sample.pi)
                    this.handlepi(pi)
                }

                const sieve = gfk.getsievebysampleid.call(this, sampleid)
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
                    this.handlefines(fines)
                }

            }

        }

    }

    showOutput() {
        let output = [];
        const gfk = new GFK();
        const ptslabcalcs = new PTSlabCalcs();
        let calculate = [];
        if (this.state.activesectionid) {
            const sectionid = this.state.activesectionid;
            const section = gfk.getPTSlabbyID.call(this, sectionid)
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
        const project = gfk.getprojectbyid.call(this, projectid)
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
                                    value={this.getlayername()}
                                    onChange={event => { this.handlelayername(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> Top of Layer</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.gettoplayer()}
                                    onChange={event => { this.handletoplayer(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> Bottom of Layer</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getbottomlayer()}
                                    onChange={event => { this.handlebottomlayer(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> LL</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getll()}
                                    onChange={event => { this.handlell(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> PI</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getpi()}
                                    onChange={event => { this.handlepi(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> Fines</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getfines()}
                                    onChange={event => { this.handlefines(event.target.value) }}
                                />

                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <div style={{ ...styles.flex1 }}>
                                <span style={{ ...regularFont }}> % Micro</span>
                            </div>
                            <div style={{ ...styles.flex3, ...styles.alignCenter }}>
                                <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                    value={this.getmicro()}
                                    onChange={event => { this.handlemicro(event.target.value) }}
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
        myuser: state.myuser,
        zonecharts: state.zonecharts,
        ptslab: state.ptslab
    }
}
export default connect(mapStateToProps, actions)(PTSlab);