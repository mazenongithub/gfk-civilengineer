import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { formatDateReport } from './functions';

/**
 * Standalone figure sheet. Both orientations use the same SVG coordinate
 * system, with separate dimensions for landscape and portrait pages.
 */
class ViewFigure extends Component {
        constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            render: 'render'
        };

        this.fileInput = null;

        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'resize',
            this.updateWindowDimensions
        );

        this.updateWindowDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener(
            'resize',
            this.updateWindowDimensions
        );
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }



    getProject() {
        const { projectid } = this.props.match.params;
        return new GFK().getProjectById.call(this, projectid);
    }

    getFigure(project) {
        const { projectid, figureid } = this.props.match.params;
        const gfk = new GFK();
        const figures = project?.figures ||
            gfk.getFiguresByProjectID.call(this, projectid) || [];
        return Array.isArray(figures)
            ? figures.find(item => String(item.figureid) === String(figureid))
            : null;
    }

    getReports(project) {
        const reduxProjects = this.props.projects;
        const reduxProject = Array.isArray(reduxProjects)
            ? reduxProjects.find(item => String(item.projectid) === String(project?.projectid))
            : reduxProjects;
        const candidates = [reduxProject?.reports, project?.reports, this.props.reports];
        return candidates.find(Array.isArray) || [];
    }

    getReportInfo(project, figureid) {
        const reports = this.getReports(project);
        const matches = [];
        const pageTypes = new Set([
            'figure', 'boringlog', 'labsummary', 'seismic',
            'spectralresponse', 'compactiontables'
        ]);

        const scanAppendix = (sections, letter, state) => {
            for (const section of sections || []) {
                if (pageTypes.has(section.type)) state.page++;
                if (section.type === 'figure' && String(section.referenceid) === String(figureid)) {
                    state.label = `${letter}${state.page}`;
                    return true;
                }
                if (scanAppendix(section.subsections, letter, state)) return true;
            }
            return false;
        };

        for (const report of reports) {
            let appendixIndex = 0;
            for (const section of report.sections || []) {
                if (section.type !== 'appendix') continue;
                // A, B, ... Z, AA, AB ...
                let number = appendixIndex++;
                let letter = '';
                do {
                    letter = String.fromCharCode(65 + number % 26) + letter;
                    number = Math.floor(number / 26) - 1;
                } while (number >= 0);
                const state = { page: 0, label: '' };
                if (scanAppendix(section.subsections, letter, state)) {
                    matches.push({ date: report.datereport, label: state.label });
                    break;
                }
            }
        }

        matches.sort((a, b) =>
            (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0)
        );
        return matches[0] || { date: null, label: '' };
    }

    getFigureImageUrl() {
        const { projectid, figureid } = this.props.match.params;
        return `${process.env.REACT_APP_SERVER_API}/gfk/` +
            `${encodeURIComponent(projectid)}/figures/` +
            `${encodeURIComponent(figureid)}/image`;
    }

    renderSheet(project, figure) {
        const landscape = String(figure.orientation || '').toLowerCase() === 'landscape';
        const width = landscape ? 1294 : 1000;
        const height = landscape ? 1000 : 1294;
        const margin = 28;
        const footerHeight = 176;
        const footerY = height - margin - footerHeight;
        const imageY = margin + 18;
        const imageHeight = footerY - imageY - 20;
        const { figureid } = this.props.match.params;
        const { date, label } = this.getReportInfo(project, figureid);
        const caption = figure.figurecaption || '';
        const numberCell = 190;
        const titleCell = width - 2 * margin - numberCell * 3;

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={`${figure.figuretitle || 'Figure'} (${landscape ? 'landscape' : 'portrait'})`}
                style={{ display: 'block', width: '100%', height: 'auto', background: 'white',
                    fontFamily: 'Arial, Helvetica, sans-serif', color: '#111' }}
            >
                <rect x="1" y="1" width={width - 2} height={height - 2}
                    fill="white" stroke="#222" strokeWidth="1.5" />

                {/* Main image: fully contained and centered; never stretched or cropped. */}
                <image
                    href={this.getFigureImageUrl()}
                    x={margin + 12}
                    y={imageY}
                    width={width - 2 * (margin + 12)}
                    height={imageHeight}
                    preserveAspectRatio="xMidYMid meet"
                />

                {/* Bottom title block */}
                <rect x={margin} y={footerY} width={width - 2 * margin}
                    height={footerHeight} fill="none" stroke="#222" />
                <rect x={margin} y={footerY} width={titleCell}
                    height={footerHeight} fill="none" stroke="#222" />
                <line x1={margin + titleCell} y1={footerY + 104}
                    x2={width - margin} y2={footerY + 104} stroke="#222" />
                <line x1={margin + titleCell + numberCell} y1={footerY + 104}
                    x2={margin + titleCell + numberCell} y2={footerY + footerHeight} stroke="#222" />
                <line x1={margin + titleCell + 2 * numberCell} y1={footerY + 104}
                    x2={margin + titleCell + 2 * numberCell} y2={footerY + footerHeight} stroke="#222" />

                {/* Left footer cell intentionally reserved for the company logo. */}

                <foreignObject x={margin + titleCell + 12} y={footerY + 8}
                    width={numberCell * 3 - 24} height="88">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{
                        height: '100%', display: 'flex', flexDirection: 'column', gap: '4px',
                        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                    }}>
                        <div style={{ fontSize: '22px', lineHeight: 1.1, fontWeight: 700, textTransform: 'uppercase' }}>
                            {figure.figuretitle || 'Figure'}
                        </div>
                        <div style={{ fontSize: '18px', lineHeight: 1.1, fontWeight: 600 }}>
                            {project.title}
                        </div>
                        {caption && <div style={{ fontSize: '12px', lineHeight: 1.1 }}>{caption}</div>}
                    </div>
                </foreignObject>

                {[
                    { x: margin + titleCell, label: 'PROJECT NO.', value: project.projectnumber },
                    { x: margin + titleCell + numberCell, label: 'DATE',
                        value: date ? formatDateReport(date) : '' },
                    { x: margin + titleCell + 2 * numberCell, label: 'FIGURE', value: label }
                ].map(cell => (
                    <g key={cell.label}>
                        <text x={cell.x + numberCell / 2} y={footerY + 125}
                            fontSize="15" fontWeight="bold" textAnchor="middle">{cell.label}</text>
                        <text x={cell.x + numberCell / 2} y={footerY + 158}
                            fontSize="18" textAnchor="middle">{cell.value || ''}</text>
                    </g>
                ))}
            </svg>
        );
    }

    render() {
        const styles = MyStylesheet();
        const { engineerid, projectid, figureid } = this.props.match.params;
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const headerFont = gfk.getHeaderFont.call(this);
        const user = gfk.getUser.call(this);

        const messageStyle = {
            ...styles.generalContainer,
            ...styles.alignCenter,
            ...styles.generalFont,
            ...regularFont
        };

        if (!user) return <div style={messageStyle}>User Not Found</div>;

        const project = this.getProject();
        if (!project) return <div style={messageStyle}>Project Not Found</div>;

        const figure = this.getFigure(project);
        if (!figure) return <div style={messageStyle}>Figure Not Found</div>;

        const owner = user.engineerid || engineerid;
        const linkStyle = {
            ...styles.generalFont,
            ...headerFont,
            ...styles.generalLink,
            ...styles.boldFont
        };

        return (
            <div style={{ ...styles.generalContainer, maxWidth: 1400, margin: '0 auto' }}>
                <nav aria-label="Figure navigation" style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.bottomMargin15,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    flexWrap: 'wrap', gap: '5px'
                }}>
                    <Link style={linkStyle} to={`/${owner}/projects`}>/Projects</Link>
                    <Link style={linkStyle} to={`/${owner}/projects/${projectid}`}>
                        /{project.title}
                    </Link>
                    <Link style={linkStyle} to={`/${owner}/projects/${projectid}/figures`}>
                        /Figures
                    </Link>
                    <span style={{ ...styles.generalFont, ...headerFont, ...styles.boldFont }}>
                        /{figure.figuretitle || figureid}
                    </span>
                </nav>
                {this.renderSheet(project, figure)}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { myuser: state.myuser, projects: state.projects, company: state.company,
        reports: state.reports };
}

export default connect(mapStateToProps)(ViewFigure);
