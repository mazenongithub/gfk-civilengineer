
import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles';
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { SaveTables } from './actions/api';

class CompactionTables extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            activetableid: null,
            loading: false,
            saving: false,
            message: '',
            error: ''
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
     
        this.saveTables = this.saveTables.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
      
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    // ============================================
    // PROJECT AND TABLE GETTERS
    // ============================================

    getProject() {
        const { projectid } = this.props.match.params;
        const gfk = new GFK();

        return gfk.getProjectById.call(this, projectid);
    }

    getTables() {
        const project = this.getProject();

        return Array.isArray(project?.tables)
            ? project.tables
            : [];
    }

    getTableByID(tableid) {
        return this.getTables().find(
            table => table.tableid === tableid
        ) || null;
    }

    getTableValue(prop) {
        const table = this.getTableByID(this.state.activetableid);

        return table?.[prop] ?? '';
    }

    // ============================================
    // REDUX UPDATE
    // ============================================

    updateProjectTables(tables) {

        const { projectid } = this.props.match.params;
        const projects = Array.isArray(this.props.projects)
            ? this.props.projects
            : [];

        if (!projects.some(p => p.projectid === projectid)) {
            this.setState({
                error: 'Project is not loaded in Redux.'
            });
            return false;
        }

        const updatedProjects = projects.map(project =>
            project.projectid === projectid
                ? { ...project, tables }
                : project
        );

        this.props.reduxProjects(updatedProjects);

        return true;
    }

   

    // ============================================
    // SAVE TABLES
    // ============================================

    async saveTables() {

        const { projectid } = this.props.match.params;
        const tables = this.getTables();

        this.setState({
            saving: true,
            message: '',
            error: ''
        });

        try {

            const response = await SaveTables(projectid, tables);
            const payload = response?.data ?? response;

            if (payload?.success === false) {
                throw new Error(
                    payload.message || 'Could not save tables.'
                );
            }

            if (this.mounted) {
                this.setState({
                    message: 'Compaction tables saved.'
                });
            }

        } catch (error) {

            if (this.mounted) {
                this.setState({
                    error: error.message || String(error)
                });
            }

        } finally {

            if (this.mounted) {
                this.setState({ saving: false });
            }
        }
    }

    // ============================================
    // CREATE / EDIT / DELETE TABLES
    // ============================================

    makeID() {

        if (window.crypto?.randomUUID) {
            return `TABLE_${window.crypto.randomUUID()
                .replace(/-/g, '')
                .toUpperCase()}`;
        }

        return `TABLE_${Date.now().toString(36).toUpperCase()}_${Math.random()
            .toString(36)
            .slice(2, 10)
            .toUpperCase()}`;
    }

    addTable() {

        const table = {
            tableid: this.makeID(),
            tabletitle: '',
            compactiontests: []
        };

        const tables = [...this.getTables(), table];

        if (this.updateProjectTables(tables)) {
            this.setState({
                activetableid: table.tableid,
                message: '',
                error: ''
            });
        }
    }

    setTableValue(prop, value) {

        const active = this.getTableByID(
            this.state.activetableid
        );

        // Create a table automatically if none is active
        if (!active) {

            const table = {
                tableid: this.makeID(),
                tabletitle: '',
                compactiontests: [],
                [prop]: value
            };

            if (this.updateProjectTables([
                ...this.getTables(),
                table
            ])) {
                this.setState({
                    activetableid: table.tableid,
                    message: '',
                    error: ''
                });
            }

            return;
        }

        const tables = this.getTables().map(table =>
            table.tableid === active.tableid
                ? { ...table, [prop]: value }
                : table
        );

        if (this.updateProjectTables(tables)) {
            this.setState({
                message: '',
                error: ''
            });
        }
    }

    makeTableActive(tableid) {

        this.setState(previous => ({
            activetableid:
                previous.activetableid === tableid
                    ? null
                    : tableid,
            message: '',
            error: ''
        }));
    }

    removeTable() {

        const { activetableid } = this.state;

        if (!activetableid) return;

        if (!window.confirm(
            'Delete the selected compaction table?'
        )) return;

        const tables = this.getTables().filter(
            table => table.tableid !== activetableid
        );

        if (this.updateProjectTables(tables)) {

            this.setState({
                activetableid: tables[0]?.tableid ?? null,
                message: '',
                error: ''
            });
        }
    }

    // ============================================
    // COMPACTION TEST / CURVE GETTERS
    // ============================================

    getTests() {

        const { projectid } = this.props.match.params;
        const gfk = new GFK();

        if (typeof gfk.getCompactionTestbyProjectID === 'function') {
            return gfk.getCompactionTestbyProjectID.call(
                this,
                projectid
            ) || [];
        }

        const project = this.getProject();

        return (project?.fieldreports || []).flatMap(
            report => report.compactiontests || []
        );
    }

    getCurves() {

        const { projectid } = this.props.match.params;
        const gfk = new GFK();

        if (typeof gfk.getcurves === 'function') {
            return gfk.getcurves.call(this, projectid) || [];
        }

        return this.getProject()?.compactioncurves || [];
    }

    getTestID(test) {
        return String(
            test.testid ??
            test.compactiontestid ??
            test.TestID ??
            test.id ??
            ''
        );
    }

    getCurveID(curve) {
        return String(
            curve.curveid ??
            curve.CurveID ??
            ''
        );
    }

    getTestCurveID(test) {
        return String(
            test.curveid ??
            test.CurveID ??
            test.compactioncurveid ??
            ''
        );
    }

    // ============================================
    // COMPACTION CALCULATIONS
    // ============================================

    toNumber(value) {

        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ''
        ) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : null;
    }

    getTestMetrics(test, curves) {

        const curveid = this.getTestCurveID(test);

        const curve = curveid
            ? (Array.isArray(curves) ? curves : []).find(
                item => this.getCurveID(item) === curveid
            )
            : null;

        const wet = this.toNumber(
            test.wetpcf ??
            test.WetDen ??
            test.wetdensity
        );

        const waterDensity = this.toNumber(
            test.moistpcf ??
            test.Moistpcf
        );

        const reportedMoisture = this.toNumber(
            test.moisture ??
            test.moisturecontent
        );

        const measuredDry = this.toNumber(
            test.drypcf ??
            test.drydensity ??
            test.fielddrydensity
        );

        const maxDry = this.toNumber(
            curve?.maxden ??
            curve?.MaxDen ??
            curve?.maximumdrydensity
        );

        // GFK stores water density in moistpcf.
        // Dry density = wetpcf - moistpcf.

        const dry = measuredDry !== null
            ? measuredDry
            : wet !== null &&
              waterDensity !== null &&
              wet > waterDensity &&
              waterDensity >= 0
                ? wet - waterDensity
                : wet !== null &&
                  reportedMoisture !== null &&
                  reportedMoisture >= 0
                    ? wet / (1 + reportedMoisture / 100)
                    : null;

        const moisture = reportedMoisture !== null
            ? reportedMoisture
            : dry !== null &&
              dry > 0 &&
              waterDensity !== null
                ? (waterDensity / dry) * 100
                : null;

        const relative = dry !== null &&
            maxDry !== null &&
            maxDry > 0
                ? (dry / maxDry) * 100
                : null;

        return {
            curve,
            wet,
            moisture,
            dry,
            maxDry,
            relative
        };
    }

    showNumber(value, digits = 1) {

        if (
            value === null ||
            value === undefined ||
            !Number.isFinite(Number(value))
        ) {
            return '—';
        }

        return Number(value).toFixed(digits);
    }

    // ============================================
    // ADD / REMOVE TEST FROM ACTIVE TABLE
    // ============================================

    toggleTest(testid) {

        if (!testid) return;

        const active = this.getTableByID(
            this.state.activetableid
        );

        // Create a table when adding the first test
        if (!active) {

            const table = {
                tableid: this.makeID(),
                tabletitle: 'Compaction Test Results',
                compactiontests: [testid]
            };

            if (this.updateProjectTables([
                ...this.getTables(),
                table
            ])) {

                this.setState({
                    activetableid: table.tableid,
                    error: '',
                    message: ''
                });
            }

            return;
        }

        const ids = Array.isArray(active.compactiontests)
            ? active.compactiontests
            : [];

        const nextIDs = ids.includes(testid)
            ? ids.filter(id => id !== testid)
            : [...ids, testid];

        this.setTableValue('compactiontests', nextIDs);
    }

    // ============================================
    // SHOW TABLE SELECTION
    // ============================================

    showTables() {

        const tables = this.getTables();

        return (
            <div>
                <h3>Compaction Tables</h3>

                <button
                    type="button"
                    onClick={() => this.addTable()}
                >
                    + New Table
                </button>

                {tables.length === 0 && (
                    <p>No tables yet. Create a table or enter a title.</p>
                )}

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 10
                }}>

                    {tables.map(table => {

                        const active =
                            table.tableid === this.state.activetableid;

                        return (
                            <button
                                key={table.tableid}
                                type="button"
                                onClick={() =>
                                    this.makeTableActive(table.tableid)
                                }
                                style={{
                                    padding: '8px 10px',
                                    border: active
                                        ? '2px solid #b91c1c'
                                        : '1px solid #888',
                                    backgroundColor: active
                                        ? '#fff0f0'
                                        : '#fff',
                                    color: '#111',
                                    cursor: 'pointer'
                                }}
                            >
                                {table.tabletitle || table.tableid}
                                {' '}
                                ({(table.compactiontests || []).length})
                            </button>
                        );
                    })}

                </div>
            </div>
        );
    }

    // ============================================
    // SHOW LABORATORY COMPACTION CURVES
    // ============================================

    showCurves() {

        const curves = this.getCurves();

        return (
            <div>
                <h3>Laboratory Compaction Curves</h3>

                {!curves.length ? (
                    <p>No project compaction curves are available.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: 13
                        }}>
                            <thead>
                                <tr>
                                    {[
                                        'Curve',
                                        'Description',
                                        'Max Dry (pcf)',
                                        'Opt. Moisture (%)'
                                    ].map(heading => (
                                        <th
                                            key={heading}
                                            style={{
                                                borderBottom: '1px solid #999',
                                                padding: 6,
                                                textAlign: 'left'
                                            }}
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {curves.map((curve, index) => (
                                    <tr key={this.getCurveID(curve) || index}>
                                        <td style={{ padding: 6 }}>
                                            {curve.curvenumber ??
                                             curve.CurveNumber ??
                                             this.getCurveID(curve)}
                                        </td>

                                        <td style={{ padding: 6 }}>
                                            {curve.description ??
                                             curve.Description ??
                                             ''}
                                        </td>

                                        <td style={{ padding: 6 }}>
                                            {curve.maxden ??
                                             curve.MaxDen ??
                                             '—'}
                                        </td>

                                        <td style={{ padding: 6 }}>
                                            {curve.moist ??
                                             curve.Moist ??
                                             '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    // ============================================
    // SHOW FIELD COMPACTION TESTS
    // ============================================

    showTests() {

        const tests = this.getTests();
        const curves = this.getCurves();

        const active = this.getTableByID(
            this.state.activetableid
        );

        const selected = new Set(
            active?.compactiontests || []
        );

        return (
            <div>
                <h3>Field Compaction Tests</h3>

                {!tests.length ? (
                    <p>
                        No field compaction tests are available
                        for this project.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>

                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: 13,
                            minWidth: 850
                        }}>

                            <thead>
                                <tr>
                                    {[
                                        'Test',
                                        'Location',
                                        'Curve',
                                        'Wet (pcf)',
                                        'Moist. (%)',
                                        'Dry (pcf)',
                                        'Max Dry (pcf)',
                                        'Rel. Comp. (%)',
                                        'Table'
                                    ].map(heading => (
                                        <th
                                            key={heading}
                                            style={{
                                                padding: 6,
                                                borderBottom: '1px solid #999',
                                                textAlign: 'left'
                                            }}
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {tests.map((test, index) => {

                                    const testid = this.getTestID(test);
                                    const isSelected = selected.has(testid);

                                    const metrics = this.getTestMetrics(
                                        test,
                                        curves
                                    );

                                    return (
                                        <tr
                                            key={testid || index}
                                            style={{
                                                backgroundColor: isSelected
                                                    ? '#f1f5f9'
                                                    : 'transparent'
                                            }}
                                        >
                                            <td style={{ padding: 6 }}>
                                                {test.testnum ??
                                                 test.testnumber ??
                                                 test.TestNum ??
                                                 testid}
                                            </td>

                                            <td style={{ padding: 6 }}>
                                                {test.location ??
                                                 test.Location ??
                                                 ''}
                                            </td>

                                            <td style={{ padding: 6 }}>
                                                {metrics.curve?.curvenumber ??
                                                 metrics.curve?.CurveNumber ??
                                                 this.getTestCurveID(test) ??
                                                 '—'}
                                            </td>

                                            <td style={{ padding: 6 }}>
                                                {this.showNumber(metrics.wet)}
                                            </td>

                                            <td style={{ padding: 6 }}>
                                                {this.showNumber(metrics.moisture)}
                                            </td>

                                            <td style={{ padding: 6 }}>
                                                {this.showNumber(metrics.dry)}
                                            </td>

                                            <td style={{ padding: 6 }}>
                                                {this.showNumber(metrics.maxDry)}
                                            </td>

                                            <td style={{
                                                padding: 6,
                                                fontWeight: 'bold'
                                            }}>
                                                {this.showNumber(metrics.relative)}
                                            </td>

                                            <td style={{ padding: 6 }}>
                                                <button
                                                    type="button"
                                                    disabled={!testid}
                                                    onClick={() =>
                                                        this.toggleTest(testid)
                                                    }
                                                >
                                                    {isSelected ? 'Remove' : 'Add'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================

    render() {

        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);
        const headerFont = gfk.getHeaderFont.call(this);

        const { projectid } = this.props.match.params;
        const user = gfk.getUser.call(this);

        if (!user) {
            return (
                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.generalFont
                }}>
                    User Not Found
                </div>
            );
        }

        const project = gfk.getProjectById.call(this, projectid);

        if (!project) {
            return (
                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.generalFont
                }}>
                    Project Not Found
                </div>
            );
        }

        const active = this.getTableByID(
            this.state.activetableid
        );

        return (
            <div style={{
                ...styles.generalContainer,
                ...styles.generalFont,
                ...regularFont
            }}>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter
                }}>
                    <Link
                        style={{
                            ...styles.generalLink,
                            ...headerFont,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects`}
                    >
                        /Projects
                    </Link>
                </div>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter
                }}>
                    <Link
                        style={{
                            ...styles.generalLink,
                            ...headerFont,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects/${project.projectid}`}
                    >
                        /{project.title}
                    </Link>
                </div>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.bottomMargin15
                }}>
                    <Link
                        style={{
                            ...styles.generalLink,
                            ...headerFont,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects/${project.projectid}/compactiontables`}
                    >
                        /Compaction Tables
                    </Link>
                </div>

                {this.state.error && (
                    <p role="alert" style={{ color: '#b91c1c' }}>
                        {this.state.error}
                    </p>
                )}

                {this.state.message && (
                    <p style={{ color: '#166534' }}>
                        {this.state.message}
                    </p>
                )}

                {this.state.loading && (
                    <p>Loading tables...</p>
                )}

                {/* TABLE SELECTION AND EDITOR */}

                <div style={{
                    border: '1px solid #ddd',
                    padding: 15,
                    marginBottom: 15,
                    borderRadius: 5
                }}>

                    {this.showTables()}

                    <div style={{
                        marginTop: 15,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        gap: 10
                    }}>

                        <label style={{ flex: '1 1 320px' }}>
                            <strong>Table Title</strong>

                            <input
                                type="text"
                                placeholder="Enter compaction table title"
                                value={this.getTableValue('tabletitle')}
                                onChange={e =>
                                    this.setTableValue(
                                        'tabletitle',
                                        e.target.value
                                    )
                                }
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    padding: 8,
                                    marginTop: 5
                                }}
                            />
                        </label>

                        <button
                            type="button"
                            disabled={!active}
                            onClick={() => this.removeTable()}
                        >
                            Delete Table
                        </button>

                        <button
                            type="button"
                            disabled={
                                this.state.saving ||
                                this.state.loading
                            }
                            onClick={this.saveTables}
                        >
                            {this.state.saving
                                ? 'Saving...'
                                : 'Save Tables'}
                        </button>

                    </div>

                    {active && (
                        <p style={{
                            fontSize: 12,
                            marginBottom: 0
                        }}>
                            Active Table ID: {active.tableid}
                            {' | '}
                            Selected tests: {
                                (active.compactiontests || []).length
                            }
                        </p>
                    )}

                </div>

                {/* COMPACTION CURVES */}

                <div style={{
                    border: '1px solid #ddd',
                    padding: 15,
                    marginBottom: 15,
                    borderRadius: 5
                }}>
                    {this.showCurves()}
                </div>

                {/* FIELD COMPACTION TESTS */}

                <div style={{
                    border: '1px solid #ddd',
                    padding: 15,
                    borderRadius: 5
                }}>
                    {this.showTests()}
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
    };
}

export default connect(mapStateToProps, actions)(CompactionTables);
