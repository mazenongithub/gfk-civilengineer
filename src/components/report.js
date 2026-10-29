
import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { Link } from 'react-router-dom';
import './report.css';
import GFK from './gfk'
import { removeSectionIcon, saveReportIcon, scrollIconDown, scrollIconUp, subSectionIcon, nextSectionIcon } from './svg'
import { SaveReport, GenerateReport, GenerateReportSection } from './actions/api';
import { formatDateTime } from './functions'
import OpenAI from './openai';




class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            mobileMenuOpen: false,
            activePath: [0],
            message: "",
            question: "",
            parameters: {},
            instructions: "",
            answer: "",
            loading: false,
            error: '',
            showOpenAI: false
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

    createReportSection() {

    }



    createGradingReport() {

        const report = this.getReport();

        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const openai = new OpenAI();


        if (report.type === 'Grading/Compaction' && !this.state.loading) {



            return (openai.createGradingReport.call(this))



        } else if (this.state.loading) {
            return (<div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>loading ...</span></div>)
        }
    }

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

    replaceActiveSection = (newSection) => {
        const { projectid, reportid } = this.props.match.params;
        const activePath = this.state.activePath;

        if (!Array.isArray(activePath) || activePath.length === 0) {
            throw new Error('Active section path not found.');
        }

        const replaceSection = (sections, path) => {
            const [index, ...remainingPath] = path;

            if (!Array.isArray(sections) || !sections[index]) {
                throw new Error('Section not found at active path.');
            }

            return sections.map((section, i) => {
                if (i !== index) return section;

                if (remainingPath.length === 0) {
                    return { ...newSection };
                }

                return {
                    ...section,
                    subsections: replaceSection(
                        section.subsections,
                        remainingPath
                    )
                };
            });
        };

        const updatedProjects = this.props.projects.map(project => {
            if (project.projectid !== projectid) return project;

            return {
                ...project,
                reports: (project.reports || []).map(report => {
                    if (report.reportid !== reportid) return report;

                    return {
                        ...report,
                        sections: replaceSection(
                            report.sections,
                            activePath
                        )
                    };
                })
            };
        });

        this.props.reduxProjects(updatedProjects);
    };

    generateReportSection = async () => {
        if (this.state.loading) {
            return;
        }

        this.setState({
            loading: true,
            error: ''
        });

        try {
            const gfk = new GFK();

            // Get the active section.
            const activeSection = this.getActiveSection();

            if (!activeSection) {
                throw new Error('No active section was selected.');
            }

            const sectionTitle = activeSection.section || '';

            // Get the project.
            const { projectid } = this.props.match.params;

            const project = gfk.getProjectById.call(
                this,
                projectid
            );

            if (!project) {
                throw new Error('Project not found.');
            }

            // Project and section parameters.
            const parameters = {
                projectTitle:
                    project.projecttitle || project.title || '',

                projectAddress:
                    project.projectaddress || project.address || '',

                projectCity:
                    project.projectcity || '',

                section: sectionTitle,

                currentSection: activeSection
            };

            // Instructions for generating the section.
            const instructions = `
You are a professional geotechnical engineering report-writing
assistant for CivilEngineer.io.

Generate content for the active section of a geotechnical report.

REQUIREMENTS:
- Follow the supplied report section and project parameters.
- Keep the existing section title unchanged.
- Generate content specifically for this section.
- Use professional engineering language.
- Do not repeat the entire report or generate unrelated sections.
- Do not invent project information, field observations,
  laboratory results, measurements, or engineering conclusions.
- Preserve placeholders for missing project-specific information.
- Use the current section as context when improving or expanding it.
- Return a JSON object with exactly these properties:
  "section": the existing section title
  "content": the generated section text
- Return valid JSON only.
`;

            const question = `
Generate the content for the following geotechnical report section:

Section title: ${sectionTitle}

Existing section content:
${activeSection.content || '[No existing content]'}

Use the supplied project parameters to populate known information.
Improve or expand the existing content as appropriate for this section.
Preserve placeholders for missing information.

Return the section title and generated content in the required JSON format.
`;

            // Generate the section.
            const result = await GenerateReportSection(
                question,
                parameters,
                instructions
            );


            if (!result?.success) {
                throw new Error(
                    result?.error || 'Failed to generate the report section.'
                );
            }

            // Accept an object or a JSON string.
            const candidate = result.specification ?? result.answer;

            const specification =
                typeof candidate === 'string'
                    ? JSON.parse(candidate)
                    : candidate;

            // Replace the entire active section.
            this.replaceActiveSection(specification);

            this.setState({
                loading: false,
                error: ''
            });

        } catch (err) {
            console.error('Report section generation failed:', err);

            this.setState({
                loading: false,
                error: err.message ||
                    'Unable to generate the report section.'
            });
        }
    };

    generateGradingReport = async () => {
        if (this.state.loading) {
            return;
        }

        this.setState({
            loading: true,
            error: ''
        });

        try {
            const gfk = new GFK();
            const { projectid, reportid } = this.props.match.params;

            // Get the project.
            const project = gfk.getProjectById.call(this, projectid);

            if (!project) {
                throw new Error('Project not found.');
            }

            // Get the active report being edited.
            const report = project.reports?.find(
                r => r.reportid === reportid
            );

            if (!report) {
                throw new Error('Active report not found.');
            }


            // Get the Geotechnical Investigation Report.
            const soilReport = gfk.getProjectSoilsReport.call(
                this,
                projectid
            );

            // Get the client.
            const client = gfk.getClientBy_Id.call(
                this,
                project.clientid
            );

            // Get all project compaction tests.
            const compactionTests =
                gfk.getCompactionTestbyProjectID.call(
                    this,
                    projectid
                ) || [];

            // Get the project's laboratory compaction curves.
            const compactionCurves =
                gfk.getcurves.call(
                    this,
                    projectid
                ) || [];

            // Project-specific parameters supplied to OpenAI.
            const parameters = {
                consultant: 'GFK & Associates',

                projectAddress:
                    project.projectaddress ||
                    project.address ||
                    '',

                projectTitle: project.title || '',
                projectCity: project.projectcity || '',

                clientName: client
                    ? `${client.firstname || ''} ${client.lastname || ''}`.trim()
                    : '',

                // Geotechnical Investigation Report.
                soilReportTitle: soilReport?.reporttitle || '',
                soilReportDate: soilReport?.datereport || '',

                geotechnicalInvestigationReport: soilReport
                    ? {
                        reporttitle: soilReport.reporttitle || '',
                        datereport: soilReport.datereport || '',
                        sections: soilReport.sections || []
                    }
                    : null,

                // Laboratory compaction curves.
                laboratoryCompactionCurves: compactionCurves,

                // Field compaction tests.
                fieldCompactionTests: compactionTests,

                // Reference methods. Confirm applicability against
                // the actual project specifications and test records.
                labCompactionMethod:
                    'ASTM D1557, Modified Effort, if specified by the project',

                fieldCompactionMethod:
                    'ASTM D6938, In-Place Density and Water Content of Soil ' +
                    'and Soil-Aggregate by Nuclear Methods (Shallow Depth), ' +
                    'if confirmed by the field test records'
            };

            // General instructions for generating engineering reports.
            const instructions = `
You generate professional engineering report specifications
for CivilEngineer.io.

OUTPUT REQUIREMENTS:
- Follow the supplied JSON schema exactly.
- Return structured JSON, not a prose explanation.
- Follow the user's requested report type and scope.
- Use projectParameters to populate applicable report content.
- Use the supplied field compaction tests and laboratory
  compaction curves when preparing the report.

PARAMETER SUBSTITUTION:
- Replace matching placeholders with supplied, non-empty values.
- Use the project information consistently.
- Preserve placeholders for required missing information.
- Do not include the projectParameters object as report content.

ENGINEERING ACCURACY:
- Base technical statements on supplied project data and records.
- Do not invent testing dates, test locations, density values,
  moisture contents, maximum dry densities, specifications,
  or engineering conclusions.
- Do not claim that compaction requirements have been met unless
  the supplied evidence supports that conclusion.
- Do not treat an absent test record as a passing result.
- Identify missing records or information needed to support
  an actual certification.
- Use testing methods only when applicable to the supplied records
  and project specifications.
- Include suitable scope limitations and signature placeholders.
- Do not invent a professional's identity, license number,
  signature, or approval.

Follow the supplied JSON schema exactly.
`;

            const question =
                'Generate a professional building pad compaction ' +
                'certification letter using the supplied project parameters, ' +
                'Geotechnical Investigation Report, field compaction test ' +
                'records, laboratory compaction curves, and applicable ' +
                'project specifications. Identify the project, testing dates, ' +
                'test locations, test methods, applicable laboratory maximum ' +
                'dry density and optimum moisture content, specified minimum ' +
                'relative compaction, and field test results wherever ' +
                'documented. Evaluate whether the documented test results ' +
                'meet the applicable criteria. Include the conclusion, ' +
                'scope limitations, and signature and credential placeholders. ' +
                'Replace available placeholders with supplied project ' +
                'information. Preserve placeholders for missing information. ' +
                'If required records are unavailable, identify the missing ' +
                'information rather than inventing results or asserting ' +
                'compliance. Return the complete letter as structured report ' +
                'sections matching the required JSON schema.';

            // Request the generated specification.
            const result = await GenerateReport(
                question,
                parameters,
                instructions
            );

            // Support either an object or a JSON-string response.
            if (!result?.success) {
                throw new Error(
                    result?.error || 'OpenAI failed to generate the report.'
                );
            }

            const candidate =
                result.specification ?? result.answer;

            const specification =
                typeof candidate === 'string'
                    ? JSON.parse(candidate)
                    : candidate;

            if (
                !specification ||
                typeof specification.reporttitle !== 'string' ||
                !Array.isArray(specification.sections)
            ) {
                throw new Error(
                    'OpenAI returned an invalid report specification.'
                );
            }

            let reportFound = false;

            const updatedProjects = this.props.projects.map(project => {
                if (project.projectid !== projectid) {
                    return project;
                }

                return {
                    ...project,
                    reports: (project.reports || []).map(report => {
                        if (report.reportid !== reportid) {
                            return report;
                        }

                        reportFound = true;

                        return {
                            ...report,
                            reporttitle: specification.reporttitle,
                            sections: specification.sections
                        };
                    })
                };
            });

            if (!reportFound) {
                throw new Error('Report not found.');
            }

            this.props.reduxProjects(updatedProjects);

            this.setState({
                answer: specification,
                loading: false,
                error: ''
            });

        } catch (err) {
            console.error('OpenAI request failed:', err);

            this.setState({
                loading: false,
                error: err.message ||
                    'Unable to generate the grading report.'
            });
        }
    };

    showTopLinks() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const user = gfk.getUser.call(this)
        const { projectid, reportid } = this.props.match.params
        const project = gfk.getProjectById.call(this, projectid)
        const report = this.getReport();


        if (!project || !report || !user) {
            return <div>Loading report...</div>;
        }

        return (


            <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>

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
        const openai = new OpenAI();
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

                {openai.showOpenAI.call(this)}

                {this.createGradingReport()}


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
                                        Content    {openai.generateReportSection.call(this)}
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
