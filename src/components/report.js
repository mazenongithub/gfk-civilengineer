
import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { Link } from 'react-router-dom';
import './report.css';
import GFK from './gfk'
import { removeSectionIcon, scrollIconDown, scrollIconUp, subSectionIcon, nextSectionIcon, saveReportIcon, gfkLogin } from './svg'
import { SaveReport } from './actions/api';
import { formatDateTime } from './functions'


class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            mobileMenuOpen: false,
            activePath: [0],
            message: ""
        };

        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'resize',
            this.updateWindowDimensions
        );
    }

    componentDidUpdate(prevProps) {
        const current = this.props.match.params;
        const previous = prevProps.match.params;

        if (
            current.projectid !== previous.projectid ||
            current.reportid !== previous.reportid
        ) {
            const report = this.getReport();

            this.setState({
                activePath: report?.sections?.length ? [0] : [],
                mobileMenuOpen: false
            });
        }
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

    getReport = () => {
        const gfk = new GFK();
        const { projectid, reportid } = this.props.match.params;

        return gfk.getReportByID.call(
            this,
            projectid,
            reportid
        );
    };

    showToolBar = (path) => {
        return (
            <div className="vr-section-toolbar">

                <button
                    type="button"
                    className="vr-tool-button"
                    onClick={() => this.addNextSection(path)}
                    title="Next Section"
                    aria-label="Next Section"
                >
                    {nextSectionIcon()}
                    <span>Next</span>
                </button>

                <button
                    type="button"
                    className="vr-tool-button"
                    onClick={() => this.addSubSection(path)}
                    title="Add Subsection"
                    aria-label="Add Subsection"
                >
                    {subSectionIcon()}
                    <span>Subsection</span>
                </button>

                <button
                    type="button"
                    className="vr-tool-button"
                    onClick={() => this.removeSection(path)}
                    title="Delete Section"
                    aria-label="Delete Section"
                >
                    {removeSectionIcon()}
                    <span>Delete</span>
                </button>

                <button
                    type="button"
                    className="vr-tool-button"
                    onClick={() => this.moveSectionUp(path)}
                    title="Move Section Up"
                    aria-label="Move Section Up"
                >
                    {scrollIconUp()}
                    <span>Move Up</span>
                </button>

                <button
                    type="button"
                    className="vr-tool-button"
                    onClick={() => this.moveSectionDown(path)}
                    title="Move Section Down"
                    aria-label="Move Section Down"
                >
                    {scrollIconDown()}
                    <span>Move Down</span>
                </button>

            </div>
        );
    };

    setActiveSection = (property, value) => {
        const { projectid, reportid } = this.props.match.params;
        const { activePath } = this.state;

        const project = this.props.projects.find(
            p => p.projectid === projectid
        );

        if (!project) return;

        const report = project.reports?.find(
            r => r.reportid === reportid
        );

        if (!report || !activePath.length) return;

        let sections = report.sections;
        let section;

        for (let i = 0; i < activePath.length; i++) {
            section = sections?.[activePath[i]];

            if (!section) return;

            if (i < activePath.length - 1) {
                sections = section.subsections;
            }
        }

        section[property] = value;
        this.props.reduxProjects(this.props.projects)

        this.forceUpdate();
    };

    getActiveSection = () => {
        const report = this.getReport();
        const { activePath } = this.state;

        if (!report || !activePath.length) {
            return null;
        }

        let section = report.sections?.[activePath[0]];

        for (let i = 1; i < activePath.length; i++) {
            section = section?.subsections?.[activePath[i]];
        }

        return section || null;
    };

    selectSection = path => {
        this.setState({
            activePath: path,
            mobileMenuOpen: false
        });
    };

    toggleMobileMenu = () => {
        this.setState(prevState => ({
            mobileMenuOpen: !prevState.mobileMenuOpen
        }));
    };

    renderSectionMenu = (sections, parentPath = []) => {
        if (!sections?.length) {
            return null;
        }

        return sections.map((section, index) => {
            const path = [...parentPath, index];

            const selected =
                JSON.stringify(path) ===
                JSON.stringify(this.state.activePath);

            return (
                <React.Fragment key={path.join('-')}>
                    <button
                        type="button"
                        className={`vr-nav-item ${selected ? 'active' : ''
                            }`}
                        title={section.section || 'Untitled section'}
                        onClick={() => this.selectSection(path)}
                    >
                        <span className="vr-nav-number">
                            {path.map(index => index + 1).join('.')}
                        </span>

                        <span className="vr-nav-label">
                            {section.section || 'Untitled section'}
                        </span>
                    </button>

                    {section.subsections?.length > 0 &&
                        this.renderSectionMenu(
                            section.subsections,
                            path
                        )}
                </React.Fragment>
            );
        });
    };

    renderBreadcrumb = report => {
        const { activePath } = this.state;

        if (!report || !activePath.length) {
            return null;
        }

        const breadcrumbs = [];
        let sections = report.sections;

        for (const index of activePath) {
            const section = sections?.[index];

            if (!section) {
                break;
            }

            breadcrumbs.push(
                section.section || 'Untitled section'
            );

            sections = section.subsections;
        }

        return (
            <div className="vr-breadcrumb">
                {report.reporttitle}
                {' / '}
                {breadcrumbs.join(' / ')}
            </div>
        );
    };

    addNextSection = () => {
        const { projectid, reportid } = this.props.match.params;
        const { activePath } = this.state;

        const project = this.props.projects.find(
            p => p.projectid === projectid
        );

        const report = project?.reports?.find(
            r => r.reportid === reportid
        );

        if (!report || !activePath.length) return;

        // Find the active section's parent array
        let sections = report.sections;
        let section;

        for (let i = 0; i < activePath.length; i++) {
            section = sections?.[activePath[i]];
            if (!section) return;

            if (i < activePath.length - 1) {
                sections = section.subsections;
            }
        }

        // Insert after the active section at the same level
        const insertIndex = activePath[activePath.length - 1] + 1;

        sections.splice(insertIndex, 0, {
            sectionid: `section_${Date.now()}`,
            section: 'New Section',
            content: '',
            subsections: []
        });

        // Select the newly inserted section
        this.setState({
            activePath: [
                ...activePath.slice(0, -1),
                insertIndex
            ]
        });

        this.forceUpdate();
    };

    addSubSection = (path) => {
        const { projectid, reportid } = this.props.match.params;

        const project = this.props.projects.find(
            p => p.projectid === projectid
        );

        const report = project?.reports?.find(
            r => r.reportid === reportid
        );

        if (!report || !path?.length) return;

        // Locate the selected section
        let sections = report.sections;
        let section;

        for (let i = 0; i < path.length; i++) {
            section = sections?.[path[i]];

            if (!section) return;

            if (i < path.length - 1) {
                sections = section.subsections;
            }
        }

        // Initialize subsections if needed
        if (!section.subsections) {
            section.subsections = [];
        }

        // Add a blank subsection
        section.subsections.push({
            sectionid: `section_${Date.now()}`,
            section: '',
            content: '',
            subsections: []
        });

        // Select the newly created subsection
        this.setState({
            activePath: [...path, section.subsections.length - 1]
        });

        this.forceUpdate();
    };

    moveSectionUp = (path) => {
        const { projectid, reportid } = this.props.match.params;

        const project = this.props.projects.find(
            p => p.projectid === projectid
        );

        const report = project?.reports?.find(
            r => r.reportid === reportid
        );

        if (!report || !path?.length) return;

        // Find the array containing this section
        let sections = report.sections;

        for (let i = 0; i < path.length - 1; i++) {
            const parent = sections?.[path[i]];

            if (!parent) return;

            sections = parent.subsections;
        }

        const index = path[path.length - 1];

        // Can't move up if already first at this level
        if (!sections || index <= 0 || !sections[index]) return;

        // Swap with the preceding sibling
        [sections[index - 1], sections[index]] = [
            sections[index],
            sections[index - 1]
        ];

        // Update selection to follow the moved section
        this.setState({
            activePath: [
                ...path.slice(0, -1),
                index - 1
            ]
        });

        this.forceUpdate();
    };


    moveSectionDown = (path) => {
        const { projectid, reportid } = this.props.match.params;

        const project = this.props.projects.find(
            p => p.projectid === projectid
        );

        const report = project?.reports?.find(
            r => r.reportid === reportid
        );

        if (!report || !path?.length) return;

        // Find the array containing the selected section
        let sections = report.sections;

        for (let i = 0; i < path.length - 1; i++) {
            const parent = sections?.[path[i]];

            if (!parent) return;

            sections = parent.subsections;
        }

        const index = path[path.length - 1];

        // Can't move down if already last at this level
        if (
            !sections ||
            index < 0 ||
            index >= sections.length - 1 ||
            !sections[index]
        ) {
            return;
        }

        // Swap with the next sibling
        [sections[index], sections[index + 1]] = [
            sections[index + 1],
            sections[index]
        ];

        // Keep the moved section selected
        this.setState({
            activePath: [
                ...path.slice(0, -1),
                index + 1
            ]
        });

        this.forceUpdate();
    };

    addSection = () => {
        const { projectid, reportid } = this.props.match.params;

        const project = this.props.projects.find(
            p => p.projectid === projectid
        );

        const report = project?.reports?.find(
            r => r.reportid === reportid
        );

        if (!report) return;

        if (!report.sections) {
            report.sections = [];
        }

        report.sections.push({
            sectionid: `section_${Date.now()}`,
            section: 'New Section',
            content: '',
            subsections: []
        });

        this.setState({
            activePath: [report.sections.length - 1]
        });

        this.forceUpdate();
    };

    async saveReport() {
        try {
            const report = this.getReport();

            if (!report) {
                throw new Error('Report not found.');
            }

            const response = await SaveReport(report);
            const savedReport = response.savedreport

            const { projectid } = this.props.match.params;

            const project = this.props.projects.find(
                p => p.projectid === projectid
            );

            if (!project) {
                throw new Error('Project not found in memory.');
            }

            const reportIndex = project.reports.findIndex(
                r => r.reportid === savedReport.reportid
            );

            if (reportIndex === -1) {
                throw new Error('Report not found in project.');
            }

            project.reports[reportIndex] = savedReport;



            this.setState({ message: `Report saved ${formatDateTime(response.timestamp)} ` })

            console.log('Report saved and updated in memory:', savedReport);

            return savedReport;

        } catch (err) {
            console.error('Error saving report:', err);
            alert(`Could not save report: ${err.message || err}`);
        }
    }

    removeSection = (path) => {
        const { projectid, reportid } = this.props.match.params;

        const project = this.props.projects.find(
            p => p.projectid === projectid
        );

        const report = project?.reports?.find(
            r => r.reportid === reportid
        );

        if (!report || !path?.length) return;

        // Find the array containing the selected section
        let sections = report.sections;
        let section;

        for (let i = 0; i < path.length - 1; i++) {
            section = sections?.[path[i]];

            if (!section) return;

            sections = section.subsections;
        }

        const index = path[path.length - 1];

        if (!sections || !sections[index]) return;

        // Remove the selected section
        sections.splice(index, 1);

        // Select the previous sibling, or the parent if necessary
        let nextPath;

        if (sections.length > 0) {
            nextPath = [
                ...path.slice(0, -1),
                Math.min(index, sections.length - 1)
            ];
        } else {
            nextPath = path.length > 1
                ? path.slice(0, -1)
                : [];
        }

        this.setState({
            activePath: nextPath
        });

        this.forceUpdate();
    };

    showTopLinks() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const user = gfk.getUser.call(this)
        const { projectid, reportid } = this.props.match.params
        const project = gfk.getProjectById.call(this, projectid)
        const report = this.getReport();


        if (!project || !report || !user) {
            return <div>Loading report...</div>;
        }

        return (


            <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>

                <Link
                    style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont }}
                    to={`/${user.engineerid}/projects`}>
                    /projects
                </Link>
                <Link
                    style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont }}
                    to={`/${user.engineerid}/projects/${project.projectid}`}>
                    /{project.title}
                </Link>
                <Link
                    style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont, ...styles.bottomMargin15 }}
                    to={`/${user.engineerid}/projects/${project.projectid}/reports`}>
                    /reports
                </Link>
                <Link
                    style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont, ...styles.bottomMargin15 }}
                    to={`/${user.engineerid}/projects/${project.projectid}/reports/${reportid}`}>
                    /{report.reporttitle}
                </Link>
                <Link
                    style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont, ...styles.bottomMargin15 }}
                    to={`/${user.engineerid}/projects/${project.projectid}/reports/${reportid}/viewreport`}>
                    /viewreport
                </Link>

            </div>)
    }

    render() {
        const report = this.getReport();
        const styles = MyStylesheet();
        const saveIconWidth = this.state.width > 900 ? { width: '120px' } : { width: '90px' }
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const {
            mobileMenuOpen,
            activePath
        } = this.state;

        const section = this.getActiveSection();

        if (!report) {
            return (
                <div className="vr-empty">
                    No report selected.
                </div>
            );
        }

        return (
            <div style={{ ...styles.generalContainer }}>

                {this.showTopLinks()}

                <div className="vr-layout">

                    {mobileMenuOpen && (
                        <button
                            type="button"
                            className="vr-backdrop"
                            aria-label="Close section menu"
                            onClick={this.toggleMobileMenu}
                        />
                    )}

                    <aside
                        className={`vr-sidebar ${mobileMenuOpen ? 'mobile-open' : ''
                            }`}
                    >
                        <div className="vr-sidebar-header">
                            <div className="vr-sidebar-title">
                                Report outline
                            </div>

                            <div className="vr-report-name">
                                {report.reporttitle}
                            </div>
                        </div>





                        <nav className="vr-navigation">
                            {this.renderSectionMenu(report.sections)}
                        </nav>

                        {section && (
                            <div className="vr-sidebar-controls">
                                {this.showToolBar(activePath)}
                            </div>
                        )}

                    </aside>

                    <main className="vr-main">
                        <header className="vr-toolbar">
                            <button
                                type="button"
                                className="vr-menu-toggle"
                                onClick={this.toggleMobileMenu}
                                aria-label={
                                    mobileMenuOpen
                                        ? 'Close report outline'
                                        : 'Open report outline'
                                }
                                aria-expanded={mobileMenuOpen}
                            >
                                <span className="vr-menu-icon">
                                    {mobileMenuOpen ? '✕' : '☰'}
                                </span>
                            </button>

                            <div className="vr-toolbar-title">
                                {report.reporttitle}
                            </div>
                        </header>

                        <div className="vr-editor">
                            {section ? (
                                <>
                                    {this.renderBreadcrumb(report)}

                                    <label className="vr-field-label">
                                        Section number
                                    </label>

                                    <input
                                        className="vr-section-number"
                                        value={activePath.map(index => index + 1).join('.')}
                                        readOnly
                                    />
                                    <label className="vr-field-label">
                                        Section title
                                    </label>

                                    <input
                                        className="vr-section-title"
                                        value={section.section || ''}
                                        onChange={e =>
                                            this.setActiveSection('section', e.target.value)
                                        }

                                        placeholder="Section title"
                                    />

                                    <label className="vr-field-label">
                                        Content
                                    </label>

                                    <textarea
                                        style={{ ...styles.bottomMargin15 }}
                                        className="vr-content"
                                        value={section.content || ''}
                                        onChange={e =>
                                            this.setActiveSection('content', e.target.value)
                                        }

                                        placeholder="Report content"
                                    />

                                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter, ...styles.generalFont }}>
                                        <span style={{ ...regularFont }}>{this.state.message} </span>
                                    </div>

                                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter }}>
                                        <button className={`generalButton`} style={{ ...saveIconWidth }} onClick={() => { this.saveReport() }}>{saveReportIcon()}</button>
                                    </div>

                                    {section.subsections?.length > 0 && (
                                        <div className="vr-children">
                                            <h3>Subsections</h3>

                                            {section.subsections.map(
                                                (subsection, index) => (
                                                    <button
                                                        type="button"
                                                        key={
                                                            subsection.sectionid ||
                                                            index
                                                        }
                                                        className="vr-child-link"
                                                        onClick={() =>
                                                            this.selectSection([
                                                                ...activePath,
                                                                index
                                                            ])
                                                        }
                                                    >
                                                        <span>
                                                            {subsection.sectionid}{' '}
                                                            {subsection.section}
                                                        </span>

                                                        <span>›</span>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="vr-empty">
                                    {report.sections?.length ? (
                                        'Select a section from the report outline.'
                                    ) : (
                                        <>
                                            <p>This report has no sections yet.</p>
                                            <button
                                                type="button"
                                                onClick={this.addSection}
                                            >
                                                + Add Section
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects,
        company: state.company
    }
}
export default connect(mapStateToProps, actions)(Report)
