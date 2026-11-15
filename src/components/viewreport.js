import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { Link } from 'react-router-dom';
import GFK from './gfk'
import { plusIcon, minusIcon } from './svg';

class ViewReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            showTOC: true


        }
        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });

    }

    showCompactionTable(section) {
        const gfk = new GFK();
        const { referenceid, sectionid } = section;
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const { projectid } = this.props.match.params;

        const allTests = gfk.getCompactionTestbyProjectID.call(
            this,
            projectid
        ) || [];

        const allCurves = gfk.getcurves.call(
            this,
            projectid
        ) || [];

        const tableid = section.referenceid;

        const table = gfk.getTableByID.call(
            this,
            projectid,
            tableid
        );

        if (!table || !Array.isArray(allTests)) return null;

        // Retrieve only tests belonging to this compaction table.
        // Preserve the order of test IDs in the table.
        const testsByID = new Map(
            allTests.map(test => [
                String(test.testid),
                test
            ])
        );

        const tests = (table.compactiontests || [])
            .map(id => testsByID.get(String(id)))
            .filter(Boolean);

        // Find the compaction curves referenced by the tests.
        const curvesByID = new Map(
            (Array.isArray(allCurves) ? allCurves : []).map(curve => [
                String(curve.curveid),
                curve
            ])
        );

        const curveIDs = [
            ...new Set(
                tests
                    .map(test => test.curveid)
                    .filter(Boolean)
                    .map(String)
            )
        ];

        const curves = curveIDs
            .map(id => curvesByID.get(id))
            .filter(Boolean)
            .sort(
                (a, b) =>
                    Number(a.curvenumber) - Number(b.curvenumber)
            );

        // Number helpers
        const num = value => {
            if (value === null || value === undefined || value === '') {
                return null;
            }

            const result = Number(value);
            return Number.isFinite(result) ? result : null;
        };

        const fmt = (value, digits = 1) =>
            value === null || value === undefined
                ? '—'
                : Number(value).toFixed(digits);

        // Calculate test properties using wet and water densities.
        const testRows = tests.map(test => {

            const curve = curvesByID.get(String(test.curveid));

            const wet = num(test.wetpcf);
            const water = num(test.moistpcf);

            const dryDensity =
                wet !== null && water !== null
                    ? wet - water
                    : num(test.drydensity);

            const moisture =
                dryDensity > 0 && water !== null
                    ? water / dryDensity * 100
                    : num(test.moisture);

            const maxDensity = num(curve?.maxden);

            const relativeCompaction =
                dryDensity !== null && maxDensity > 0
                    ? dryDensity / maxDensity * 100
                    : num(test.relativecompaction);

            return {
                testid: test.testid,
                testnum: test.testnum ?? test.testnumber ?? '',
                date: test.timetest ?? test.datetest ?? '',
                elevation: test.elevation ?? '',
                location: test.location ?? '',
                wetDensity: wet,
                dryDensity,
                moisture,
                relativeCompaction,
                curveNumber: curve?.curvenumber ?? '',
                maxDensity
            };
        });

        const cellStyle = {
            border: '1px solid black',
            padding: '5px',
            fontSize: '9pt',
            ...regularFont
        };

        const headerStyle = {
            ...cellStyle,
            fontWeight: 'bold',
            textAlign: 'center'
        };

        const centeredCell = {
            ...cellStyle,
            textAlign: 'center'
        };

        const tableStyle = {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '15px'
        };

        const titleStyle = {
            ...styles.boldFont,
            ...regularFont,
            textAlign: 'center',
            marginBottom: '8px',
            marginTop: '10px'
        };

        return (
            <div style={{ ...styles.generalContainer }}>

                {/* COMPACTION TEST RESULTS */}
                <div style={titleStyle}>
                    {table.tabletitle || 'COMPACTION TEST RESULTS'}
                </div>



                {/* COMPACTION CURVES */}
                {curves.length > 0 && (
                    <>
                        <div style={titleStyle}>
                            COMPACTION CURVES
                        </div>

                        <table style={tableStyle}>

                            <thead>
                                <tr>
                                    <th style={headerStyle}>
                                        Curve No.
                                    </th>
                                    <th style={headerStyle}>
                                        Description
                                    </th>
                                    <th style={headerStyle}>
                                        Max. Dry Density (pcf)
                                    </th>
                                    <th style={headerStyle}>
                                        Opt. Moisture (%)
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {curves.map((curve, index) => (
                                    <tr key={curve.curveid || index}>

                                        <td style={centeredCell}>
                                            {curve.curvenumber}
                                        </td>

                                        <td style={cellStyle}>
                                            {curve.description}
                                        </td>

                                        <td style={centeredCell}>
                                            {fmt(num(curve.maxden))}
                                        </td>

                                        <td style={centeredCell}>
                                            {fmt(num(curve.moist))}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </>
                )}




                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>

                        <thead>
                            <tr>
                                {[
                                    'Test No.',
                                    'Date',
                                    'Elevation',
                                    'Location',
                                    'Wet Density (pcf)',
                                    'Dry Density (pcf)',
                                    'Moisture (%)',
                                    'Relative Comp. (%)',
                                    'Curve No.',
                                    'Max. Den. (pcf)'
                                ].map(heading => (
                                    <th key={heading} style={headerStyle}>
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {testRows.map((test, index) => (
                                <tr key={test.testid || index}>

                                    <td style={centeredCell}>
                                        {test.testnum}
                                    </td>

                                    <td style={centeredCell}>
                                        {test.date}
                                    </td>

                                    <td style={centeredCell}>
                                        {test.elevation}
                                    </td>

                                    <td style={cellStyle}>
                                        {test.location}
                                    </td>

                                    <td style={centeredCell}>
                                        {fmt(test.wetDensity)}
                                    </td>

                                    <td style={centeredCell}>
                                        {fmt(test.dryDensity)}
                                    </td>

                                    <td style={centeredCell}>
                                        {fmt(test.moisture)}
                                    </td>



                                    <td style={centeredCell}>
                                        {fmt(test.maxDensity)}
                                    </td>

                                    <td style={centeredCell}>
                                        {fmt(test.relativeCompaction)}
                                    </td>

                                    <td style={centeredCell}>
                                        {test.curveNumber}
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </div>
        );
    }


    showCostEstimate(section) {
        console.log("showCostEstimate", section)
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const { projectid } = this.props.match.params;
        const proposalid = section.referenceid;
        const schedule = gfk.getScheduleByProjectID.call(this, projectid);

        if (!schedule || !proposalid) return null;

        const proposal = (schedule.proposals || []).find(
            proposal => proposal.proposalid === proposalid
        );
        console.log("Proposal", proposal)

        if (!proposal) return null;

        // Find the costs referenced by the proposal
        const costIDs = new Set(proposal.costs || []);

        const costs = (schedule.costs || []).filter(
            cost => costIDs.has(cost.costid)
        );

        // Find the labor entries referenced by the proposal
        const laborIDs = new Set(proposal.labor || []);

        const labor = (schedule.labor || []).filter(
            item => laborIDs.has(item.laborid)
        );

        // Build cost estimate rows
        const costRows = costs.map(cost => {

            const quantity = Number(cost.quantity ?? 1);
            const unitprice = Number(cost.unitcost ?? 0);

            return {
                description: cost.description || '',
                quantity,
                unit: cost.unit || 'each',
                unitprice,
                amount: quantity * unitprice
            };
        });

        // Build labor estimate rows
        const laborRows = labor.map(item => {

            const timein = new Date(item.timein).getTime();
            const timeout = new Date(item.timeout).getTime();

            const hours =
                Number.isFinite(timein) &&
                    Number.isFinite(timeout) &&
                    timeout > timein
                    ? (timeout - timein) / 3600000
                    : 0;

            const unitprice = Number(item.laborrate ?? 0);

            return {
                description: item.description || 'Engineering Labor',
                quantity: hours,
                unit: 'hr',
                unitprice,
                amount: hours * unitprice
            };
        });

        const items = [...laborRows, ...costRows];

        if (!items.length) return null;

        const total = items.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        const currency = value =>
            Number(value).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });

        const number = value =>
            Number(value).toLocaleString('en-US', {
                maximumFractionDigits: 2
            });

        const cellStyle = {
            border: '1px solid black',
            padding: '5px',
            fontSize: '10pt',
            ...regularFont
        };

        const numericCell = {
            ...cellStyle,
            textAlign: 'right'
        };

        return (
            <div style={{ ...styles.bottomMargin15, ...styles.generalFont }}>

                <div
                    style={{
                        ...styles.boldFont,
                        ...regularFont,
                        ...styles.alignCenter,
                        marginBottom: '8px'
                    }}
                >
                    COST ESTIMATE
                </div>

                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',

                    }}
                >
                    <thead>
                        <tr>
                            {[
                                'No.',
                                'Description',
                                'Qty.',
                                'Unit',
                                'Unit Price',
                                'Amount'
                            ].map(heading => (
                                <th
                                    key={heading}
                                    style={{
                                        ...cellStyle,
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>

                                <td style={{
                                    ...cellStyle,
                                    textAlign: 'center'
                                }}>
                                    {index + 1}
                                </td>

                                <td style={cellStyle}>
                                    {item.description}
                                </td>

                                <td style={numericCell}>
                                    {number(item.quantity)}
                                </td>

                                <td style={{
                                    ...cellStyle,
                                    textAlign: 'center'
                                }}>
                                    {item.unit}
                                </td>

                                <td style={numericCell}>
                                    {currency(item.unitprice)}
                                </td>

                                <td style={numericCell}>
                                    {currency(item.amount)}
                                </td>

                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr>
                            <td
                                colSpan={5}
                                style={{
                                    ...numericCell,
                                    fontWeight: 'bold'
                                }}
                            >
                                TOTAL ESTIMATED COST
                            </td>

                            <td
                                style={{
                                    ...numericCell,
                                    fontWeight: 'bold'
                                }}
                            >
                                {currency(total)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        );

    }

    showSDCTable() {
        const gfk = new GFK();

        const { projectid } = this.props.match.params;
        const sdc = gfk.getSDC.call(this, projectid)

        if (!sdc) return null;

        const fields = [
            ['SS', 'SS'],
            ['S1', 'S1'],
            ['SiteClass', 'Site Class'],
            ['FA', 'FA'],
            ['FV', 'FV'],
            ['SMS', 'SMS'],
            ['SM1', 'SM1'],
            ['SDS', 'SDS'],
            ['SD1', 'SD1']
        ];

        return (
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '15px'
                }}
            >
                <thead>
                    <tr>
                        {fields.map(([key, label]) => (
                            <th
                                key={key}
                                style={{
                                    border: '1px solid black',
                                    padding: '5px',
                                    textAlign: 'center'
                                }}
                            >
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {fields.map(([key]) => (
                            <td
                                key={key}
                                style={{
                                    border: '1px solid black',
                                    padding: '5px',
                                    textAlign: 'center'
                                }}
                            >
                                {sdc[key] ?? ''}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        );
    }

 showSection(section, path) {
    if (!section) return null;

    const gfk = new GFK();
    const styles = MyStylesheet();
    const regularFont = gfk.getRegularFont.call(this);
    const { projectid } = this.props.match.params;

    // Normalize section type
    const type = String(section.type || 'text')
        .trim()
        .toLowerCase();

    // Sections that link to separate documents
    const documentTypes = [
        'figure',
        'boringlog',
        'labsummary'
    ];

    const isDocument = documentTypes.includes(type);
    const titleOnly = isDocument;

    // Get document URL for applicable section types
    const documentURL = isDocument
        ? this.getSectionDocumentURL(
            { ...section, type },
            projectid
        )
        : null;

    // Render supplemental content for special sections
    const supplementalContent = () => {

        switch (type) {

            case 'spectralresponse':
                return this.showSDCTable();

            case 'costestimate':
            case 'cost estimate':
                return this.showCostEstimate(section);

            case 'grading/compaction':
            case 'compactiontables':
            case 'compactiontable':
                return this.showCompactionTable(section);

            case 'figure':
            case 'boringlog':
            case 'labsummary':
                return null;

            default:
                return null;
        }
    };

    const sectionTitleStyle = {
        ...styles.boldFont,
        ...regularFont
    };

    const documentLinkStyle = {
        ...styles.generalFont,
        ...regularFont,
        ...styles.boldFont,
        color:'black',
        cursor: 'pointer'
    };

    return (
        <div
            id={this.getSectionAnchor(path)}
            key={section.sectionid || path.join('-')}
            style={{
                ...styles.generalContainer,
                ...styles.generalFont,
                ...regularFont,
                scrollMarginTop: '80px'
            }}
        >

            {/* SECTION TITLE */}
            <div
                style={{
                    ...styles.generalContainer,
                    marginBottom: '5px'
                }}
            >

                {/* Section number */}
                <span style={sectionTitleStyle}>
                    {path.join('.')}.{' '}
                </span>

                {/* Section title or document link */}
                {isDocument && documentURL ? (

                    <a
                        href={documentURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${section.section}`}
                        style={documentLinkStyle}
                    >
                        {section.section || 'Untitled Section'}
                    </a>

                ) : (

                    <span style={sectionTitleStyle}>
                        {section.section || 'Untitled Section'}
                    </span>

                )}

            </div>

            {/* SECTION CONTENT */}
            {!titleOnly && section.content && (

                <div
                    style={{
                        ...styles.generalContainer,
                        ...styles.generalFont,
                        ...regularFont,
                        ...styles.bottomMargin15,
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {section.content}
                </div>

            )}

            {/* SUPPLEMENTAL TABLES */}
            {!titleOnly && supplementalContent()}

            {/* RECURSIVE SUBSECTIONS */}
            {Array.isArray(section.subsections) &&
                section.subsections.length > 0 && (

                <div
                    style={{
                        ...styles.generalContainer,
                        ...styles.bottomMargin15,
                        ...styles.generalFont,
                        ...regularFont
                    }}
                >

                    {section.subsections.map((subsection, index) => (

                        <React.Fragment
                            key={subsection.sectionid || index}
                        >
                            {this.showSection(
                                subsection,
                                [...path, index + 1]
                            )}
                        </React.Fragment>

                    ))}

                </div>

            )}

        </div>
    );
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

    getSectionAnchor(path) {
        const report = this.getReport();
        const reportid = report.reportid

        const id = String(reportid || 'report')
            .replace(/[^a-zA-Z0-9_-]/g, '-');

        return `report-${id}-section-${path.join('-')}`;
    }

    showTOC() {
        const report = this.getReport();
        const styles = MyStylesheet();

        if (!report || !Array.isArray(report.sections) ||
            report.sections.length === 0) {
            return null;
        }

        const tocFont = {
            ...styles.generalFont,
            fontSize: '14pt'
        };

        const renderTOCSections = (sections, parentPath = []) => {

            return sections.map((section, index) => {

                const path = [...parentPath, index + 1];
                const sectionNumber = path.join('.');
                const anchor = this.getSectionAnchor(path);

                const hasSubsections =
                    Array.isArray(section.subsections) &&
                    section.subsections.length > 0;

                return (
                    <React.Fragment
                        key={section.sectionid || sectionNumber}
                    >
                        <div
                            style={{
                                ...tocFont,
                                marginLeft: `${parentPath.length * 20}px`,
                                marginBottom: '6px',
                                display: 'flex',
                                alignItems: 'baseline'
                            }}
                        >
                            <a
                                href={`#${anchor}`}
                                style={{
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    width: '100%',
                                    gap: '8px'
                                }}
                            >
                                <span
                                    style={{
                                        minWidth: '40px'
                                    }}
                                >
                                    {sectionNumber}.
                                </span>

                                <span>
                                    {section.section || 'Untitled Section'}
                                </span>
                            </a>
                        </div>

                        {hasSubsections &&
                            renderTOCSections(
                                section.subsections,
                                path
                            )
                        }
                    </React.Fragment>
                );
            });
        };

        return (
            <div
                style={{
                    ...styles.generalContainer,
                    ...styles.generalFont,
                    marginBottom: '30px',
                    paddingBottom: '15px'
                }}
            >
                <div
                    style={{
                        ...styles.generalFont,
                        ...styles.alignCenter,
                        ...styles.boldFont,
                        fontSize: '11pt',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                    }}
                >


                    <button
                        type="button"
                        onClick={() => this.setState(prevState => ({
                            showTOC: !prevState.showTOC
                        }))}
                        title={this.state.showTOC ? 'Hide TOC' : 'Show TOC'}
                        aria-label={this.state.showTOC ? 'Hide TOC' : 'Show TOC'}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '33px',
                            height: '33px',
                            padding: '2px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        {this.state.showTOC ? minusIcon() : plusIcon()}

                    </button>
                    <span >TABLE OF CONTENTS</span>

                </div>

                {this.state.showTOC && (
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '550px',
                            margin: '0 auto'
                        }}
                    >
                        {renderTOCSections(report.sections)}
                    </div>
                )}

            </div>
        );
    }

    getSectionDocumentURL(section, projectid) {

        const gfk = new GFK();



        const project = encodeURIComponent(projectid);
        const referenceid = encodeURIComponent(section.referenceid || '');

        switch (section.type) {

            case 'boringlog':
                return referenceid
                    ? `/mazen/projects/${projectid}/borings/${referenceid}/logdraft`
                    : null;

            case 'labsummary':
                return `/mazen/projects/${projectid}/labsummary`

            case 'figure':
                return referenceid
                    ? `/mazen/projects/${projectid}/figures/${referenceid}`
                    : null;

            default:
                return null;
        }
    }

    showReport() {
        const report = this.getReport();

        if (!report || !report.sections) {
            return <div>Report not found.</div>;
        }

        return (
            <div className="vr-report">
                {report.sections.map((section, index) => (
                    <React.Fragment key={section.sectionid || index}>
                        {this.showSection(section, [index + 1])}
                    </React.Fragment>
                ))}
            </div>
        );
    }


    render() {



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

            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>


                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

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




                </div>


                {this.showTOC()}

                {this.showReport()}
            </div>)
    }

}



function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects,
        company: state.company
    }
}
export default connect(mapStateToProps, actions)(ViewReport)
