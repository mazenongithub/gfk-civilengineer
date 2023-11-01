import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { Link } from 'react-router-dom';
import GFK from './gfk';
import { milestoneformatdatestring, calcdryden, moist, formatDateReport } from './functions'
import '../logdraft.css';


class LogDraft extends Component {

    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0 }
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

    viewBox() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        const samples = gfk.getsamplesbyboringid.call(this, boringid)
        let viewBox = "0 0 1002 1295"
        if (samples.length > 0) {

            let bottomdepth = Math.ceil(Number(samples[samples.length - 1].depth));

            if (bottomdepth > 32) {
                viewBox = `0 0 1002 ${1291 + 30 * (bottomdepth - 32)}`
            }

        }
        return viewBox;


    }
    getBoring() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        const boring = gfk.getboringbyid.call(this, boringid)
        return boring

    }

    showloginfo() {
        const loginfo = [];
        const boring = this.getBoring();
        if (boring) {

            loginfo.push(<text className="logdraft-label" transform="translate(2,16)">Logged By: {boring.loggedby}</text>)
            loginfo.push(<text className="logdraft-label" transform="translate(335,16)">Boring Diameter: {boring.diameter}</text>)
            loginfo.push(<text className="logdraft-label" transform="translate(668,16)">Boring Number: {boring.boringnumber}</text>)

            loginfo.push(<text className="logdraft-label" transform="translate(2,46)">Drill Rig: {boring.drillrig}</text>)
            loginfo.push(<text className="logdraft-label" transform="translate(335,46)">Surface Elevation: {boring.elevation}</text>)
            loginfo.push(<text className="logdraft-label" transform="translate(668,46)">Date Drilled: {milestoneformatdatestring(boring.datedrilled)}</text>)
        }
        return loginfo;

    }
    getSamples() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        const samples = gfk.getsamplesbyboringid.call(this, boringid)
        return samples;
    }

    showsamplenumber(samplenos, depth) {
        return (<text className="logdraft-7" width="26" text-anchor="middle" transform={`translate(36.5 ${131.5 + (30 * depth)}) scale(0.7 0.65)`}>{samplenos}</text>)
    }

    loadsamplenumber() {
        let samplenos = [];
        const samples = this.getSamples();
        const boring = this.getBoring();
        if (boring) {
            if (samples.length > 0) {
                // eslint-disable-next-line
                samples.map(sample => {
                    let sampleset = `${boring.boringnumber}-${sample.sampleset}`
                    samplenos.push(this.showsamplenumber(sampleset, sample.depth))
                })
            }
        }
        return samplenos;

    }

    drawsample(depth, length, diameter) {
        let style = { stroke: "black", strokeWidth: 1, fill: "none" }
        let style_1 = { stroke: "black" }
        let style_2 = { stroke: "black", strokeWidth: 1 };

     

            if (diameter === 1.9375) {
                return (<g transform={`translate(50,${131.5 + (30 * depth)})`}>
                    <line x1="0" x2="25" y1="0" y2={length * 30} style={style_1}></line>
                    <rect x="0" y="0" height={length * 30} width="25" style={style}></rect>
                    <line x1="25" x2="0" y1="0" y2={length * 30} style={style_1}></line></g>);
            } else if (diameter === 1.375) {

                return (
                    <g transform={`translate(50,${131.5 + (30 * depth)})`}>
                        <path d={`M 25 0 L 0 ${length * 30} L 25 ${length * 30} Z`}></path>
                        <rect x="0" y="0" height={length * 30} width="25" style={style}> </rect>
                        <line x1="25" x2="0" y1="0" y2={length * 30} style={style_1}></line></g>)
            } else {

                return (<g transform={`translate(50,${131.5 + (30 * depth)})`}>
                    <rect x="0" y="0" height={length * 30} width="25" style={style_2}></rect>
                    <line x1="25" x2="0" y1="0" y2={length * 30} style={style_1}></line>
                </g>)

            }

        

    }

    loadsampletype() {
        let sampletype = [];
        const samples = this.getSamples();
        if (samples.length > 0) {
            // eslint-disable-next-line
            samples.map(sample => {
                if(Number(sample.sptlength)>0) {
                    const depth = Number(sample.depth)
                    const samplelength = Number(sample.sptlength)/12
                    const diameter = Number(sample.diameter)
                    sampletype.push(this.drawsample(depth,samplelength,diameter))
                }

            })


        }
        return sampletype;

    }
    showgraphic(y1, y2, url) {
        let graphic = url;

        let style = {
            backgroundImage: `url(${graphic}`,
            width: "100%",
            height: "100%"
        }
        return (
            <g transform="translate(75.5,131.5)">
                <foreignObject width="80" height={(y2 - y1) * 30} x="0" y={y1 * 30}>
                    <div style={style}>
                        &nbsp;
                    </div>
                </foreignObject>
            </g>)

    }

    loadgraphics() {
        const makeGraphic = (url, depth) => {
            return ({ url, depth })
        }
        let graphics = [];
        let graphicArray = []
        const samples = this.getSamples();
        if (samples.length > 0) {
            // eslint-disable-next-line
            samples.map(sample => {
                if (sample.graphiclog) {
                    graphicArray.push(makeGraphic(sample.graphiclog, sample.depth))
                }
            })

            if (graphicArray.length > 0) {
                // eslint-disable-next-line
                graphicArray.map((graphic, i) => {
                    if (i === 0) {

                        graphics.push(this.showgraphic(0, graphic.depth, graphic.url))

                    } else {

                        graphics.push(this.showgraphic(graphicArray[i - 1].depth, graphic.depth, graphic.url))

                    }
                })
            }




            return graphics;
        }





        return graphics;

    }

    showdescription(description, depth) {


        return (
            <foreignObject x="156" y={`${Math.ceil(115.5 + (30 * depth))}`} width="431" height="700">
                <div className="logdraft-description">
                    <text>{description} </text>
                </div>
            </foreignObject>
        )

    }

    loaddescription() {
        const samples = this.getSamples();
        let descriptions = [];
        if (samples) {
            // eslint-disable-next-line
            samples.map(sample => {
                descriptions.push(this.showdescription(sample.description, sample.depth))
            })

        }
        return descriptions;

    }

    showuscs(uscs, depth) {
        if (uscs) {
            return (<text className="logdraft-label" x="616" width="59" y={`${131.5 + (30 * depth)}`} text-anchor="middle">{uscs} </text>)
        }
    }

    loaduscs() {
        const samples = this.getSamples();
        let uscs = [];
        if (samples.length > 0) {
            // eslint-disable-next-line
            samples.map(sample => {
                if (sample.uscs) {
                    uscs.push(this.showuscs(sample.uscs, sample.depth))

                }
            })
        }
        return uscs;

    }
    showspt(spt, depth) {
        if (spt) {
            return (<text width="59" className="logdraft-label" text-anchor="middle" x="675" y={`${131.5 + (30 * depth)}`}>{spt} </text>)
        }
    }


    loadspt() {

        const samples = this.getSamples();
        let spt = [];
        if (samples) {
            // eslint-disable-next-line
            samples.map(sample => {
                spt.push(this.showspt(sample.spt, sample.depth))
            })
        }
        return spt;

    }

    showdryden(dryden, depth) {
        if (Number(dryden > 0)) {
            return (<text width="59" className="logdraft-label" text-anchor="middle" x="735" y={`${131.5 + (30 * depth)}`}>{dryden} </text>)
        }
    }
    loaddryden() {
        const samples = this.getSamples();
        let drydens = [];
        // eslint-disable-next-line
        samples.map(sample => {
            let dryden = calcdryden(sample.wetwgt_2, sample.wetwgt, sample.tarewgt, sample.drywgt, sample.diameter, sample.samplelength)
            drydens.push(this.showdryden(dryden, sample.depth))
        })
        return drydens;

    }

    loadmoisturecontent() {
        const samples = this.getSamples();
        let moisturecontent = ""
        let moisture = [];
        // eslint-disable-next-line
        samples.map(sample => {
            moisturecontent = Number(moist(sample.drywgt, sample.tarewgt, sample.wetwgt, sample.wetwgt_2) * 100).toFixed(1)
            moisture.push(this.showmoisturecontent(moisturecontent, sample.depth))

        })
        return moisture;


    }

    showmoisturecontent(moisturecontent, depth) {
        if (Number(moisturecontent > 0)) {
            return (<text x="778" className="logdraft-label" y={`${131.5 + (30 * depth)}`}>{moisturecontent} </text>)
        }

    }

    showremarks(remarks, depth) {
        if (remarks) {
            return (<foreignObject x="824" y={`${115.5 + (30 * depth)}`} width="176" height="600">
                <div className="logdraft-description"><text>{remarks} </text></div></foreignObject>)
        }

    }


    loadremarks() {
        const samples = this.getSamples();
        let remarks = [];
        if (samples.length > 0) {
            // eslint-disable-next-line
            samples.map(sample => {
                remarks.push(this.showremarks(sample.remarks, sample.depth))
            })
        }

        return remarks;

    }

    drawfootlabel(depth) {
        return (<text className="logdraft-7" width="22" text-anchor="middle" transform={`translate(12.5 ${130.5 + (30 * depth)}) scale(1 1)`}>{depth}</text>)
    }

    completeblock() {
        const gfk = new GFK();
        let projectid = this.props.match.params.projectid;
        let completeblock = [];
        let bottomdepth = 0;
        let title = "";
        let projectnumber = "";
        let figure = "";
        let datereport = "";
        let address = ""
        let city = "";
        const project = gfk.getprojectbyid.call(this, projectid)
        if (project) {


            address = project.address;
            projectnumber = project.projectnumber;
            city = project.city;
            title = project.title;



        }



        const boring = this.getBoring();
        if (boring) {

            // datereport = boring.datereport;
            //  figure = boring.figure;

        }
        const samples = this.getSamples();
        if (samples.length > 0) {

            bottomdepth = Number(samples[samples.length - 1].depth);


        }


        if (bottomdepth > 0) {
            completeblock.push(<line className="logdraft-2" x1="49.5" y1="131.5" x2="49.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="75.5" y1="131.5" x2="75.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="155.5" y1="131.5" x2="155.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="586.5" y1="131.5" x2="586.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="646.5" y1="131.5" x2="646.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="705.5" y1="131.5" x2="705.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="764.5" y1="131.5" x2="764.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="823.5" y1="131.5" x2="823.5" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)
            completeblock.push(<line className="logdraft-2" x1="23.5" y1={`${131.5 + (30 * Number(bottomdepth))}`} x2="1000" y2={`${131.5 + (30 * Number(bottomdepth))}`} />)

        }

        if (Math.ceil(bottomdepth) < 32) {
            completeblock.push(<rect className="logdraft-2" x="1.5" y="1095.5" width="416" height="198.5" />)
            completeblock.push(<rect className="logdraft-2" x="417.5" y="1095.5" width="584" height="50" />)
            completeblock.push(<rect className="logdraft-2" x="417.5" y="1244.5" width="194.33" height="49" />)
            completeblock.push(<rect className="logdraft-2" x="611.83" y="1244.5" width="194.33" height="49" />)
            completeblock.push(<rect className="logdraft-2" x="806.17" y="1244.5" width="194.33" height="49" />)
            completeblock.push(<line className="logdraft-2" x1="23.5" y1="1091.5" x2="23.5" y2="1095.5" />)
            completeblock.push(<rect className="logdraft-1" x="1" y="1" width="1000" height="1293" />)

            completeblock.push(<text className="logdraft-16" transform="translate(441.9 1131)">
                EXP<tspan className="logdraft-17" x="77.27" y="0">L</tspan>
                <tspan x="99.33" y="0">OR</tspan><tspan className="logdraft-18" x="154.07" y="0">A</tspan>
                <tspan className="logdraft-19" x="179.62" y="0">T</tspan><tspan x="204.69" y="0">O</tspan>
                <tspan className="logdraft-20" x="233.25" y="0">R</tspan><tspan x="258.58" y="0">Y BORING </tspan>
                <tspan className="logdraft-17" x="462.08" y="0">L</tspan><tspan x="484.13" y="0">OG</tspan></text>)


            completeblock.push(<text className="logdraft-21" transform="translate(462.54 1263)">P
                <tspan className="logdraft-22" x="13.3" y="0">r</tspan>
                <tspan x="20.37" y="0">oject No.</tspan></text>)
            completeblock.push(<text className="logdraft-21" transform="translate(687.24 1263)">Date</text>)
            completeblock.push(<text className="logdraft-21" transform="translate(868.08 1263)">FIGURE</text>)

            completeblock.push(<foreignObject x="418" y="1141" width="582" height="140">
                <div className="logdraft-title"><text>{title} </text></div></foreignObject>)
            completeblock.push(<foreignObject x="418" y="1191" width="582" height="140">
                <div className="logdraft-title"><text>{address} {city}, CA </text></div></foreignObject>)
            completeblock.push(<text x="510" y="1290" text-anchor="middle" className="logdraft-title">{projectnumber} </text>)
            completeblock.push(<text className="logdraft-title" x="710" y="1290" text-anchor="middle">{formatDateReport(datereport)} </text>)
            completeblock.push(<text className="logdraft-title" x="904" y="1290" text-anchor="middle">{figure} </text>)

            //add ft labels
            for (let i = 5; i <= 32; i += 5) {
                completeblock.push(this.drawfootlabel(i));
            }
        }
        else {

            completeblock.push(<rect className="logdraft-2" x="1.5" y={1091.5 + (30 * (Math.ceil(bottomdepth) - 32))} width="416" height="198.5" />)
            completeblock.push(<rect className="logdraft-2" x="417.5" y={1091.5 + (30 * (Math.ceil(bottomdepth) - 32))} width="584" height="50" />)
            completeblock.push(<rect className="logdraft-2" x="417.5" y={1240.5 + (30 * (Math.ceil(bottomdepth) - 32))} width="194.33" height="49" />)
            completeblock.push(<rect className="logdraft-2" x="611.83" y={1240.5 + (30 * (Math.ceil(bottomdepth) - 32))} width="194.33" height="49" />)
            completeblock.push(<rect className="logdraft-2" x="806.17" y={1240.5 + (30 * (Math.ceil(bottomdepth) - 32))} width="194.33" height="49" />)
            completeblock.push(<rect className="logdraft-1" x="1" y="1" width="1000" height={1289.5 + (30 * (Math.ceil(bottomdepth) - 32))} />)


            completeblock.push(<text className="logdraft-16" transform={`translate(441.9 ${1127 + (30 * (Math.ceil(bottomdepth) - 32))})`}>
                EXP<tspan className="logdraft-17" x="77.27" y="0">L</tspan>
                <tspan x="99.33" y="0">OR</tspan><tspan className="logdraft-18" x="154.07" y="0">A</tspan>
                <tspan className="logdraft-19" x="179.62" y="0">T</tspan><tspan x="204.69" y="0">O</tspan>
                <tspan className="logdraft-20" x="233.25" y="0">R</tspan><tspan x="258.58" y="0">Y BORING </tspan>
                <tspan className="logdraft-17" x="462.08" y="0">L</tspan><tspan x="484.13" y="0">OG</tspan></text>)


            completeblock.push(<text className="logdraft-21" transform={`translate(462.54 ${1259 + + (30 * (Math.ceil(bottomdepth) - 32))})`}>P
                <tspan className="logdraft-22" x="13.3" y="0">r</tspan>
                <tspan x="20.37" y="0">oject No.</tspan></text>)
            completeblock.push(<text className="logdraft-21" transform={`translate(687.24 ${1259 + + (30 * (Math.ceil(bottomdepth) - 32))})`}>Date</text>)
            completeblock.push(<text className="logdraft-21" transform={`translate(868.08 ${1259 + + (30 * (Math.ceil(bottomdepth) - 32))})`}>FIGURE</text>)

            completeblock.push(<foreignObject x="418" y={1137 + (30 * (Math.ceil(bottomdepth) - 32))} width="582" height="140">
                <div className="logdraft-title"><text>{title} </text></div></foreignObject>)
            completeblock.push(<foreignObject x="418" y={1187 + (30 * (Math.ceil(bottomdepth) - 32))} width="582" height="140">
                <div className="logdraft-title"><text>{address} {city}, CA </text></div></foreignObject>)
            completeblock.push(<text x="510" y={1286 + (30 * (Math.ceil(bottomdepth) - 32))} text-anchor="middle" className="logdraft-title">{projectnumber} </text>)
            completeblock.push(<text className="logdraft-title" x="710" y={1286 + (30 * (Math.ceil(bottomdepth) - 32))} text-anchor="middle">{formatDateReport(datereport)} </text>)
            completeblock.push(<text className="logdraft-title" x="904" y={1286 + (30 * (Math.ceil(bottomdepth) - 32))} text-anchor="middle">{figure} </text>)



            let limit = Math.ceil(bottomdepth) - 32
            let maxlabel = Math.ceil(bottomdepth);
            for (let i = 0; i <= limit; i++) {
                completeblock.push(<rect className="logdraft-2" x="0.5" y={1061.5 + (30 * i)} width="23" height="30" />)
            }
            for (let i = 5; i <= maxlabel; i += 5) {
                completeblock.push(this.drawfootlabel(i));
            }

        }
        return completeblock;

    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const engineerid = this.props.match.params.engineerid;
        const headerFont = gfk.getHeaderFont.call(this)
        const projectid = this.props.match.params.projectid;
        const project = gfk.getprojectbyid.call(this, projectid)
        const regularFont = gfk.getRegularFont.call(this);
        const boringid = this.props.match.params.boringid;
        const boring = gfk.getboringbyid.call(this, boringid);


        if (project) {

            if (boring) {

                return (
                    <div style={{ ...styles.generalContainer }}>

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
                            <Link style={{ ...styles.generalLink, ...styles.boldFont, ...headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples`}>/Boring Number {boring.boringnumber} </Link>
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                            <Link style={{ ...styles.generalLink, ...styles.boldFont, ...headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/logdraft`}>/LogDraft</Link>
                        </div>

                        <div style={{ ...styles.generalContainer }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox={this.viewBox()}><defs><style></style></defs><title>logdraftblock</title>
                                <g id="Layer_2" data-name="Layer 2"><g id="Frame">

                                    <rect className="logdraft-2" x="0.5" y="0.5" width="1000.5" height="61.5" />
                                    <rect className="logdraft-2" x="0.5" y="1.5" width="333.33" height="30" />

                                    {this.showloginfo()}
                                    <rect className="logdraft-2" x="333.83" y="1.5" width="333.33" height="30" />

                                    <rect className="logdraft-2" x="667.17" y="1.5" width="333.33" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="31.5" width="333.33" height="30" />
                                    <rect className="logdraft-2" x="333.83" y="31.5" width="333.33" height="30" />
                                    <rect className="logdraft-2" x="667.17" y="31.5" width="333.33" height="30" />

                                    <text className="logdraft-3" transform="translate(41.27 71.15) scale(1 0.65)">Sample<tspan x="0" y="79.2"> </tspan><tspan x="-12" y="19.8">No.</tspan></text>
                                    <text className="logdraft-3" transform="translate(69.27 71.15) scale(1 0.65)">Sample<tspan x="0" y="79.2"> </tspan><tspan x="-12" y="13.2">Type</tspan></text><text className="logdraft-4" transform="translate(12.69 64) scale(0.99 0.58)">D<tspan className="logdraft-5" x="0" y="16">epth</tspan></text>
                                    <text className="logdraft-6" transform="translate(12.69 111.51) scale(1 0.65)"> </text><text className="logdraft-7" transform="translate(3.85 124) scale(0.7 0.65)">(ft)</text>
                                    <text className="logdraft-8" transform="translate(79.46 99.5) scale(0.7 0.79)">G<tspan className="logdraft-9" x="12.43" y="0">r</tspan><tspan x="19.36" y="0">aphic Log</tspan></text>
                                    <text className="logdraft-8" transform="translate(336.89 99.5) scale(0.7 0.79)">Description</text>
                                    <text className="logdraft-8" transform="translate(600.97 99.5) scale(0.7 0.79)">USCS</text>
                                    <text className="logdraft-8" transform="translate(665.33 99.5) scale(0.7 0.79)">SP<tspan className="logdraft-10" x="22.9" y="0">T</tspan></text>
                                    <text className="logdraft-11" transform="translate(706.99 99.5) scale(0.56 0.79)">D<tspan className="logdraft-12" x="12.09" y="0">r</tspan><tspan x="19.54" y="0">y Density</tspan><tspan x="28.27" y="24.05">(pc</tspan><tspan className="logdraft-13" x="56.57" y="24.05">f</tspan><tspan x="64.26" y="24.05">)</tspan></text>
                                    <text className="logdraft-11" transform="translate(773.38 99.5) scale(0.56 0.79)">Moistu<tspan className="logdraft-14" x="59.88" y="0">r</tspan>

                                        <tspan className="logdraft-15" x="67.01" y="0">e</tspan><tspan x="32.02" y="24.05">%</tspan></text>
                                    <text className="logdraft-11" transform="translate(891.6 99.5) scale(0.56 0.79)">Remarks</text>

                                    <rect className="logdraft-2" x="0.5" y="61.5" width="1000" height="70" />
                                    <rect className="logdraft-2" x="1.5" y="61.5" width="22" height="70" />

                                    <rect className="logdraft-2" x="23.5" y="61.5" width="26" height="70" />

                                    {this.loadsamplenumber()}
                                    <rect className="logdraft-2" x="49.5" y="61.5" width="26" height="70" />
                                    {this.loadsampletype()}
                                    <rect className="logdraft-2" x="75.5" y="61.5" width="80" height="70" />
                                    {this.loadgraphics()}
                                    <rect className="logdraft-2" x="155.5" y="61.5" width="431" height="70" />
                                    {this.loaddescription()}
                                    <rect className="logdraft-2" x="586.5" y="61.5" width="60" height="70" />
                                    {this.loaduscs()}
                                    <rect className="logdraft-2" x="646.5" y="61.5" width="59" height="70" />
                                    {this.loadspt()}
                                    <rect className="logdraft-2" x="705.5" y="61.5" width="59" height="70" />
                                    {this.loaddryden()}
                                    <rect className="logdraft-2" x="764.5" y="61.5" width="59" height="70" />
                                    {this.loadmoisturecontent()}
                                    {this.loadremarks()}
                                    <rect className="logdraft-2" x="0.5" y="131.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="161.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="191.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="221.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="251.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="281.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="311.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="341.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="371.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="401.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="431.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="461.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="491.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="521.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="551.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="581.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="611.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="641.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="671.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="701.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="731.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="761.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="791.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="821.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="851.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="881.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="911.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="941.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="971.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="1001.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="1031.5" width="23" height="30" />
                                    <rect className="logdraft-2" x="0.5" y="1061.5" width="23" height="30" />
                                    {this.completeblock()}
                                </g></g>
                            </svg>

                        </div>

                    </div>)

            } else {

                return (<div style={{ ...styles.generalContainer }}>
                    <span style={{ ...styles.generalFont, ...regularFont }}>Boring Not Found</span>
                </div>)

            }

        } else {
            return (<div style={{ ...styles.generalContainer }}>
                <span style={{ ...styles.generalFont, ...regularFont }}>Project Not Found</span>
            </div>)
        }
    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(LogDraft);