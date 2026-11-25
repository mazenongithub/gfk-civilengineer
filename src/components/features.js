
import React, { Component } from 'react';
import GFK from './gfk';
import { MyStylesheet } from './styles';

class Features extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            expanded: {},
            features: [
                {
                    title: 'Project Management',
                    description:
                        'A centralized workspace for organizing geotechnical engineering projects, clients, project information, and technical documentation.',
                    summary: [
                        'Search projects by location, address, or project number',
                        'Manage project descriptions and scopes of work',
                        'Organize clients and project records',
                        'Access engineering analyses and reports from a single workspace',
                        'Maintain consistent project information across modules'
                    ]
                },
                {
                    title: 'Soil Laboratory Management',
                    description:
                        'Record, organize, and evaluate laboratory soil testing data with integrated engineering calculations and graphical results.',
                    summary: [
                        'Unconfined compression testing',
                        'Moisture content and dry density calculations',
                        'Atterberg limits',
                        'Grain-size distribution and sieve analysis',
                        'Stress-strain relationships and plots',
                        'Project-specific laboratory summaries'
                    ]
                },
                {
                    title: 'Geologic Log Drafting',
                    description:
                        'Prepare professional boring logs combining subsurface observations, sampling information, and graphical soil profiles.',
                    summary: [
                        'Graphic soil profiles using sample photographs',
                        'Soil descriptions and USCS classifications',
                        'Sampling depths and blow counts',
                        'Groundwater observations and drilling information',
                        'Automatic boring log formatting',
                        'Integration with geotechnical investigation reports'
                    ]
                },
                {
                    title: 'Field Reports & Compaction Testing',
                    description:
                        'Document construction observations, field density testing, and earthwork operations within an organized reporting system.',
                    summary: [
                        'Daily field inspection reports',
                        'Field density and moisture testing',
                        'Compaction curves and laboratory reference data',
                        'Compaction test tables organized by project',
                        'Construction progress and site photographs',
                        'Professional field report generation'
                    ]
                },
                {
                    title: 'Liquefaction Analysis',
                    description:
                        'Evaluate seismic liquefaction potential using subsurface investigation data and site-specific seismic parameters.',
                    summary: [
                        'Site-specific seismic input parameters',
                        'Layer-by-layer soil evaluations',
                        'Liquefaction factors of safety',
                        'Graphical and numerical results',
                        'Engineering documentation for technical review'
                    ]
                },
                {
                    title: 'Seismic Design Criteria',
                    description:
                        'Organize seismic design parameters and generate consistent seismic design criteria for engineering reports.',
                    summary: [
                        'Mapped spectral acceleration parameters',
                        'Site class and site coefficients',
                        'SMS and SM1 calculations',
                        'SDS and SD1 design parameters',
                        'Seismic design criteria tables',
                        'Integration with engineering reports'
                    ]
                },
                {
                    title: 'Post-Tensioned Slab Design',
                    description:
                        'Evaluate and document post-tensioned slab foundation design parameters using project-specific geotechnical information.',
                    summary: [
                        'Project-specific soil parameters',
                        'Foundation design calculations',
                        'Integration with geotechnical information',
                        'Organized engineering calculations',
                        'Design summaries for technical review'
                    ]
                },
                {
                    title: 'Slope Stability Analysis',
                    description:
                        'Evaluate slope stability using graphical soil profiles, defined geometry, and established limit-equilibrium methods.',
                    summary: [
                        'Graphical slope cross-sections',
                        'User-defined soil layers and properties',
                        'Method of Slices analysis',
                        'Calculated factors of safety',
                        'Graphical and numerical output'
                    ]
                },
                {
                    title: 'Professional Report Writer',
                    description:
                        'Assemble comprehensive geotechnical reports using project data, engineering analyses, figures, and automated document formatting.',
                    summary: [
                        'Geotechnical investigation reports',
                        'Grading and compaction reports',
                        'Proposals for geotechnical services',
                        'Structured sections and subsections',
                        'Automatic inclusion of boring logs and laboratory summaries',
                        'Engineering tables and seismic design criteria',
                        'Figures, appendices, and document references',
                        'Professional PDF report generation'
                    ]
                },
                {
                    title: 'Project Figures & Drawings',
                    description:
                        'Organize engineering figures and drawings for inclusion in professional geotechnical reports.',
                    summary: [
                        'Upload project-specific figures',
                        'Manage figure titles and descriptions',
                        'Portrait and landscape page layouts',
                        'Integration with report appendices',
                        'Consistent document formatting',
                        'Individual figure PDF generation'
                    ]
                },
                {
                    title: 'Proposals & Project Scheduling',
                    description:
                        'Develop engineering proposals, organize project costs, and manage project schedules within the same workspace.',
                    summary: [
                        'Engineering labor estimates',
                        'Cost estimates and project expenses',
                        'Proposal development and revisions',
                        'Project schedules',
                        'Integration with professional proposal documents'
                    ]
                },
                {
                    title: 'Time Tracking & Invoicing',
                    description:
                        'Track engineering labor, project expenses, and billing activity directly within each project.',
                    summary: [
                        'Project-specific timesheets',
                        'Labor rates and time entries',
                        'Task and activity descriptions',
                        'Expense and cost tracking',
                        'Project invoicing'
                    ]
                },
                {
                    title: 'Soil Classification',
                    description:
                        'Maintain consistent soil classification and descriptions throughout laboratory testing, boring logs, and engineering documentation.',
                    summary: [
                        'Unified Soil Classification System (USCS)',
                        'Laboratory classification data',
                        'Consistent soil descriptions',
                        'Graphic log symbols and soil profiles',
                        'Integration with subsurface documentation'
                    ]
                }
            ]
        };

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

    toggleFeature(index) {
        this.setState(prevState => ({
            expanded: {
                ...prevState.expanded,
                [index]: !prevState.expanded[index]
            }
        }));
    }

    getColors() {
        return {
            primary: '#6A7EA6',
            primaryDark: '#4C6088',
            primaryLight: '#91A3C3',
            background: '#F0F3F8',
            white: '#FFFFFF',
            dark: '#303845',
            muted: '#657084',
            border: '#DCE3EE'
        };
    }

    showFeature(feature, index) {
        const gfk = new GFK();

        const headerFont = gfk.getWebHeaderFont.call(this);
        const regularFont = gfk.getWebFont.call(this);

        const colors = this.getColors();

        const expanded = !!this.state.expanded[index];

        return (
            <article
                key={feature.title}
                style={{
                    background: colors.white,
                    border: `1px solid ${colors.border}`,
                    borderTop: `4px solid ${colors.primary}`,
                    borderRadius: '9px',
                    padding: '25px',
                    boxShadow:
                        '0 5px 20px rgba(40,55,80,0.045)',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0
                }}
            >
                {/* FEATURE HEADER */}

                <h3
                    style={{
                        ...headerFont,
                        fontSize: '20px',
                        lineHeight: 1.4,
                        fontWeight: 'bold',
                        color: colors.dark,
                        margin: '0 0 15px'
                    }}
                >
                    {feature.title}
                </h3>

                {/* DESCRIPTION */}

                <p
                    style={{
                        ...regularFont,
                        fontSize: '15px',
                        lineHeight: 1.75,
                        color: colors.muted,
                        margin: '0 0 20px',
                        flexGrow: 1
                    }}
                >
                    {feature.description}
                </p>

                {/* EXPAND BUTTON */}

                <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`feature-details-${index}`}
                    onClick={() => this.toggleFeature(index)}
                    style={{
                        background: expanded
                            ? colors.primary
                            : colors.background,
                        color: expanded
                            ? colors.white
                            : colors.primaryDark,
                        border:
                            `1px solid ${colors.border}`,
                        borderRadius: '6px',
                        padding: '11px 15px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <span>
                        {expanded
                            ? 'Hide Capabilities'
                            : 'Explore Capabilities'}
                    </span>

                    <span
                        aria-hidden="true"
                        style={{
                            fontSize: '18px',
                            fontWeight: 'normal'
                        }}
                    >
                        {expanded ? '−' : '+'}
                    </span>
                </button>

                {/* EXPANDED CAPABILITIES */}

                {expanded && (
                    <div
                        id={`feature-details-${index}`}
                        style={{
                            marginTop: '20px',
                            paddingTop: '15px',
                            borderTop:
                                `1px solid ${colors.border}`
                        }}
                    >
                        <ul
                            style={{
                                paddingLeft: '20px',
                                margin: 0,
                                color: colors.dark
                            }}
                        >
                            {feature.summary.map(
                                (summary, summaryIndex) => (
                                    <li
                                        key={summaryIndex}
                                        style={{
                                            ...regularFont,
                                            fontSize: '14px',
                                            lineHeight: 1.7,
                                            marginBottom: '9px',
                                            paddingLeft: '4px'
                                        }}
                                    >
                                        {summary}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </article>
        );
    }

    showFeatures() {
        const { features, width } = this.state;

        const isMobile = width < 700;
        const isTablet = width >= 700 && width < 1050;

        const columns = isMobile
            ? '1fr'
            : isTablet
                ? 'repeat(2, minmax(0, 1fr))'
                : 'repeat(3, minmax(0, 1fr))';

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: columns,
                    gap: '22px',
                    width: '100%',
                    alignItems: 'stretch'
                }}
            >
                {features.map((feature, index) =>
                    this.showFeature(feature, index)
                )}
            </div>
        );
    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();

        const headerFont = gfk.getWebHeaderFont.call(this);
        const regularFont = gfk.getWebFont.call(this);

        const colors = this.getColors();
        const isMobile = this.state.width < 700;

        return (
            <main
                style={{
                    ...styles.generalContainer,
                    ...styles.generalFont,
                    width: '100%',
                    boxSizing: 'border-box',
                    color: colors.dark
                }}
            >
                {/* PAGE HEADER */}

                <section
                    style={{
                        textAlign: 'center',
                        padding: isMobile
                            ? '40px 18px'
                            : '65px 30px',
                        maxWidth: '1050px',
                        margin: 'auto'
                    }}
                >
                    <div
                        style={{
                            color: colors.primary,
                            fontSize: '13px',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            marginBottom: '18px'
                        }}
                    >
                        CIVILENGINEER.IO | GFK
                    </div>

                    <h1
                        style={{
                            ...headerFont,
                            fontSize: isMobile
                                ? '30px'
                                : '42px',
                            lineHeight: 1.2,
                            color: colors.dark,
                            fontWeight: 'bold',
                            margin: '0 0 22px'
                        }}
                    >
                        Geotechnical Engineering Software
                        Features
                    </h1>

                    <p
                        style={{
                            ...regularFont,
                            fontSize: isMobile
                                ? '16px'
                                : '19px',
                            lineHeight: 1.8,
                            color: colors.muted,
                            maxWidth: '830px',
                            margin: 'auto'
                        }}
                    >
                        An integrated engineering platform
                        designed to streamline geotechnical
                        investigations, laboratory testing,
                        engineering analyses, field
                        documentation, technical reporting,
                        and project management.
                    </p>
                </section>

                {/* FEATURE GRID */}

                <section
                    style={{
                        background: colors.background,
                        padding: isMobile
                            ? '35px 15px 50px'
                            : '55px 30px 75px',
                        borderTop:
                            `1px solid ${colors.border}`,
                        borderBottom:
                            `1px solid ${colors.border}`
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1250px',
                            margin: 'auto'
                        }}
                    >
                        {this.showFeatures()}
                    </div>
                </section>

                {/* BOTTOM MESSAGE */}

                <section
                    style={{
                        padding: isMobile
                            ? '45px 20px'
                            : '75px 30px',
                        textAlign: 'center',
                        maxWidth: '950px',
                        margin: 'auto'
                    }}
                >
                    <h2
                        style={{
                            ...headerFont,
                            fontSize: isMobile
                                ? '25px'
                                : '32px',
                            color: colors.dark,
                            marginBottom: '20px'
                        }}
                    >
                        Designed for Real Engineering Projects
                    </h2>

                    <p
                        style={{
                            ...regularFont,
                            fontSize: '17px',
                            lineHeight: 1.85,
                            color: colors.muted,
                            margin: '0 auto'
                        }}
                    >
                        GFK connects field investigations,
                        laboratory results, engineering
                        analyses, and professional reporting
                        within a centralized project workspace.
                        Project information is organized
                        throughout the engineering workflow,
                        reducing repetitive data entry and
                        helping engineers maintain consistent
                        technical documentation.
                    </p>

                    <div
                        style={{
                            margin: '35px auto 0',
                            width: '90px',
                            height: '4px',
                            background: colors.primary,
                            borderRadius: '4px'
                        }}
                    />
                </section>
            </main>
        );
    }
}

export default Features;
