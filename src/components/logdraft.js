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
        this.state = { render: '', width: 0, height: 0, graphicLogs: [], graphicLogsError: '' }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
        this.loadCompanyGraphicLogs();
    }
    componentDidUpdate(prevProps) {
        const previous = prevProps.match.params;
        const current = this.props.match.params;
        const oldCompany = prevProps.company && prevProps.company.companyid;
        const newCompany = this.props.company && this.props.company.companyid;
        if (previous.projectid !== current.projectid || oldCompany !== newCompany) {
            this.loadCompanyGraphicLogs();
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getCompanyId() {
        return ("gfk")
    }

    async loadCompanyGraphicLogs() {
        const companyid = this.getCompanyId();
        if (!companyid) return;
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_API}/gfk/${encodeURIComponent(companyid)}/loadgraphiclogs`,
                { credentials: 'include' }
            );
            if (!response.ok) throw new Error(`Graphic logs request failed (${response.status})`);
            const data = await response.json();
            // Accept either the model object, its graphics array, or a wrapped API response.
            const record = data.graphiclogs || data.graphicLogs || data.data || data;
            const graphicLogs = Array.isArray(record) ? record : (record.graphics || []);
            this.setState({ graphicLogs, graphicLogsError: '' });
        } catch (error) {
            console.error('Unable to load company graphic logs:', error);
            this.setState({ graphicLogs: [], graphicLogsError: error.message });
        }
    }

    viewBox() {
        const gfk = new GFK();
        const {projectid, boringid} = this.props.match.params
        const samples = gfk.getSamplesByBoringId.call(this,projectid, boringid)
        
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
        const {projectid, boringid} = this.props.match.params
        const boring = gfk.getBoringById.call(this,projectid, boringid)
        
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
        const {projectid, boringid} = this.props.match.params
        const samples = gfk.getSamplesByBoringId.call(this,projectid, boringid)
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
        console.log(depth, length, diameter)
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

  loadSampleType() {
  const samples = this.getSamples();
  console.log(samples)

  if (!Array.isArray(samples) || samples.length === 0) {
    return [];
  }

  return samples
    .filter(sample => Number(sample.sptlength) > 0)
    .map(sample => {
        console.log(sample)
      const depth = Number(sample.depth);
      const sampleLength = Number(sample.sptlength) / 12;
      const diameter = Number(sample.diameter);

      return this.drawsample(depth, sampleLength, diameter);
    });
}

   showgraphic(y1, y2, url, key) {
    const height = (y2 - y1) * 30;

    if (!url || height <= 0) return null;

    return (
        <g key={key} transform="translate(75.5,131.5)">
            <foreignObject
                x="0"
                y={y1 * 30}
                width="80"
                height={height}
            >
                <div xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url("${url}")`,
                        backgroundRepeat: 'repeat-y',
                        backgroundSize: '100% auto',
                        backgroundPosition: 'top center'
                    }}
                />
            </foreignObject>
        </g>
    );
}

    getGraphicImageUrl(graphic) {
        const companyid = this.getCompanyId();
        if (!companyid || !graphic || !graphic.graphicid || !graphic.graphiclog) return null;
        return `${process.env.REACT_APP_SERVER_API}/gfk/` +
            `${encodeURIComponent(companyid)}/graphiclogs/` +
            `${encodeURIComponent(graphic.graphicid)}/image`;
    }

    loadgraphics() {
        const samples = [...(this.getSamples() || [])]
            // Only samples assigned a graphic define a soil-pattern boundary.
            .filter(sample => sample.graphicid && Number.isFinite(Number(sample.depth)))
            .sort((a, b) => Number(a.depth) - Number(b.depth));
        const graphicById = new Map(this.state.graphicLogs.map(graphic =>
            [String(graphic.graphicid), graphic]
        ));
        let previousDepth = 0;
        return samples.map(sample => {
            const depth = Number(sample.depth);
            const graphic = graphicById.get(String(sample.graphicid));
            const imageUrl = this.getGraphicImageUrl(graphic);
            const element = imageUrl
                ? this.showgraphic(previousDepth, depth, imageUrl, sample.sampleid)
                : null;
            // Advance only at graphic-bearing samples. Samples without
            // graphicid must not interrupt the pattern above this depth.
            previousDepth = depth;
            return element;
        }).filter(Boolean);
    }

    showdescription(description, depth) {


        return (
            <foreignObject x="156" y={`${Math.ceil(115.5 + (30 * depth))}`} width="431" height="700">
                <div className="logdraft-description">
                    {description}
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
                <div className="logdraft-description">{remarks}</div></foreignObject>)
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

 getBoringReportDate(project, boringid) {

    const { projects } = this.props;

    const projectid = project.projectid;

    // Find the project in Redux if projects is an array.
    const reduxProject = Array.isArray(projects)
        ? projects.find(p => p.projectid === projectid)
        : projects;

    // Retrieve the reports associated with this project.
    const reports =
        reduxProject?.reports ||
        project?.reports ||
        [];

    if (!Array.isArray(reports)) {
        console.log("Reports not found:", reports);
        return null;
    }

    // Recursively search report sections and subsections.
    const containsBoring = (sections = []) => {

        if (!Array.isArray(sections)) return false;

        return sections.some(section => {

            if (
                section.type === 'boringlog' &&
                String(section.referenceid) === String(boringid)
            ) {
                return true;
            }

            return containsBoring(section.subsections);
        });
    };

    // Find reports containing this boring.
    const matchingReports = reports.filter(report =>
        report.datereport &&
        containsBoring(report.sections)
    );

    if (!matchingReports.length) {
        console.log("No report references boring:", boringid);
        return null;
    }

    // Select the latest report containing this boring.
    matchingReports.sort((a, b) =>
        new Date(b.datereport) - new Date(a.datereport)
    );

    const report = matchingReports[0];

    console.log("Matching report:", report);

    return report.datereport;
}

    showBoringFooter(y, project, datereport, figure) {
        const x = 28;
        const width = 944;
        const footerHeight = 176;
        const titleCell = 374;
        const numberCell = 190;
        const title = project?.title || '';
        const cells = [
            { label: 'PROJECT NO.', value: project?.projectnumber || '' },
            { label: 'DATE', value: datereport ? formatDateReport(datereport) : '' },
            { label: 'FIGURE', value: figure || '' }
        ];
        return (
            <g key={`boring-footer-${y}`} fontFamily="Arial, Helvetica, sans-serif">
                <rect x={x} y={y} width={width} height={footerHeight}
                    fill="white" stroke="#222" strokeWidth="1" />
                <line x1={x + titleCell} y1={y} x2={x + titleCell} y2={y + footerHeight}
                    stroke="#222" />
                <line x1={x + titleCell} y1={y + 104} x2={x + width} y2={y + 104}
                    stroke="#222" />
                <line x1={x + titleCell + numberCell} y1={y + 104}
                    x2={x + titleCell + numberCell} y2={y + footerHeight} stroke="#222" />
                <line x1={x + titleCell + numberCell * 2} y1={y + 104}
                    x2={x + titleCell + numberCell * 2} y2={y + footerHeight} stroke="#222" />

                {/* Left cell is reserved for the company logo. */}
                <foreignObject x={x + titleCell + 12} y={y + 8}
                    width={numberCell * 3 - 24} height="88">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                        gap: '5px', fontFamily: 'Arial, Helvetica, sans-serif'
                    }}>
                        <div style={{ fontSize: '22px', lineHeight: 1.1, fontWeight: 700 }}>
                            EXPLORATORY BORING LOG
                        </div>
                        <div style={{ fontSize: '18px', lineHeight: 1.1, fontWeight: 600 }}>
                            {title}
                        </div>
                    </div>
                </foreignObject>

                {cells.map((cell, index) => {
                    const cellX = x + titleCell + index * numberCell;
                    return (
                        <g key={cell.label}>
                            <text x={cellX + numberCell / 2} y={y + 125}
                                fontSize="15" fontWeight="bold" textAnchor="middle">
                                {cell.label}
                            </text>
                            <text x={cellX + numberCell / 2} y={y + 158}
                                fontSize="18" textAnchor="middle">
                                {cell.value}
                            </text>
                        </g>
                    );
                })}
            </g>
        );
    }

    getBoringFigureNumber(project, boringid) {

    const { projects } = this.props;

    const projectid = project.projectid;

    const reduxProject = Array.isArray(projects)
        ? projects.find(p => p.projectid === projectid)
        : projects;

    const reports =
        reduxProject?.reports ||
        project?.reports ||
        [];

    if (!Array.isArray(reports)) return "";

    const findBoringInSections = (sections, appendixLetter, pageNumber = 0) => {

        if (!Array.isArray(sections)) {
            return null;
        }

        let currentPage = pageNumber;

        for (const section of sections) {

            if (section.type === "boringlog") {

                currentPage++;

                if (String(section.referenceid) === String(boringid)) {
                    return `${appendixLetter}${currentPage}`;
                }
            }

            if (Array.isArray(section.subsections)) {

                const result = findBoringInSections(
                    section.subsections,
                    appendixLetter,
                    currentPage
                );

                if (result) return result;
            }
        }

        return null;
    };

    for (const report of reports) {

        let appendixIndex = 0;

        for (const section of report.sections || []) {

            if (section.type !== "appendix") continue;

            const appendixLetter = String.fromCharCode(
                65 + appendixIndex
            );

            appendixIndex++;

            const figureNumber = findBoringInSections(
                section.subsections,
                appendixLetter
            );

            if (figureNumber) {
                return figureNumber;
            }
        }
    }

    return "";
}

    completeblock() {
        const gfk = new GFK();
        let {projectid, boringid}= this.props.match.params;
        let completeblock = [];
        let bottomdepth = 0;
        let datereport = null;
        const project = gfk.getProjectById.call(this, projectid)
        if (!project) return completeblock;
        datereport = this.getBoringReportDate(project, boringid);
        const figure = this.getBoringFigureNumber(project, boringid);
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
            completeblock.push(<line className="logdraft-2" x1="23.5" y1="1091.5" x2="23.5" y2="1095.5" />)
            completeblock.push(<rect className="logdraft-1" x="1" y="1" width="1000" height="1293" />)
            completeblock.push(this.showBoringFooter(1095.5, project, datereport, figure))

            //add ft labels
            for (let i = 5; i <= 32; i += 5) {
                completeblock.push(this.drawfootlabel(i));
            }
        }
        else {

            completeblock.push(<rect className="logdraft-1" x="1" y="1" width="1000" height={1289.5 + (30 * (Math.ceil(bottomdepth) - 32))} />)
            completeblock.push(this.showBoringFooter(
                1091.5 + (30 * (Math.ceil(bottomdepth) - 32)),
                project, datereport, figure
            ))



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
        const regularFont = gfk.getRegularFont.call(this);
        const {projectid, boringid} = this.props.match.params
        const project = gfk.getProjectById.call(this,projectid)
        const boring = gfk.getBoringById.call(this,projectid, boringid);


        if (project) {

            if (boring) {

                return (
                    <div style={{ ...styles.generalContainer }}>

                        <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/profile`}>
                                /{engineerid}
                            </Link>
                      
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects`}>
                                /projects
                            </Link>
                       
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}`}>
                                /{project.projectnumber} - {project.title}
                            </Link>
         
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}/borings`}>
                                /Borings
                            </Link>
                   
                            <Link style={{ ...styles.generalLink, ...styles.boldFont, ...headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples`}>/Boring Number {boring.boringnumber} </Link>
                 
                            <Link style={{ ...styles.generalLink, ...styles.boldFont, ...headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/logdraft`}>/LogDraft</Link>
                        </div>

                        <div style={{ ...styles.generalContainer }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox={this.viewBox()} style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                                <defs><style>{`
                                    .logdraft-label { font-family: Arial, Helvetica, sans-serif; font-size: 14px; fill: #111; }
                                    .logdraft-7 { font-family: Arial, Helvetica, sans-serif; fill: #111; }
                                    .logdraft-description { font: 14px/1.25 Arial, Helvetica, sans-serif; color: #111; overflow-wrap: break-word; }
                                    .logdraft-title { font: 17px/1.2 Arial, Helvetica, sans-serif; color: #111; }
                                    text { font-family: Arial, Helvetica, sans-serif; }
                                `}</style></defs><title>logdraftblock</title>
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
                                    {this.loadSampleType()}
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
        myuser: state.myuser,
        projects:state.projects,
        company:state.company
    }
}
export default connect(mapStateToProps, actions)(LogDraft);
