import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles';
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { calcdryden, moist } from './functions';
import UnconfinedCalcs from './unconfinedcalcs';
import SoilClassification from './soilclassification';
import { GetSummary } from './actions/api';
import { downloadIcon } from './svg';

const SIEVE_FIELDS = [
    'wgt34', 'wgt38', 'wgt4', 'wgt10',
    'wgt30', 'wgt40', 'wgt100', 'wgt200'
];

// Empty strings, null, and undefined are missing readings, NOT zero measurements.
const isRecordedNumber = value =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== '' &&
    Number.isFinite(Number(value));

class LabSummary extends Component {

      constructor(props) {
        super(props);
        this.state = {
            width: typeof window !== 'undefined' ? window.innerWidth : 0,
            height: typeof window !== 'undefined' ? window.innerHeight : 0
           
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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

    // A leftover sieve: {} / [] / { wgt200: '' } must not be treated as a test.
    // Requiring a positive retained weight also prevents placeholder all-zero
    // values from generating an unsupported "100% Fines" result.
    // A genuine all-passing/100%-fines test needs an explicit completion flag.
    hasSieveData(sieve) {
        if (!sieve || Array.isArray(sieve) || typeof sieve !== 'object') {
            return false;
        }

        const entries = SIEVE_FIELDS
            .filter(field => isRecordedNumber(sieve[field]))
            .map(field => Number(sieve[field]));

        if (entries.length === 0 || entries.some(value => value < 0)) {
            return false;
        }

        return entries.some(value => value > 0) || sieve.isComplete === true;
    }

    getSieveResult(sample, sieve) {
        if (!this.hasSieveData(sieve)) return '';

        const netWeight = Number(sample.drywgt) - Number(sample.tarewgt);
        if (!isRecordedNumber(sample.drywgt) ||
            !isRecordedNumber(sample.tarewgt) ||
            !Number.isFinite(netWeight) || netWeight <= 0) {
            return '';
        }

        const weights = SIEVE_FIELDS.map(field =>
            isRecordedNumber(sieve[field]) ? Number(sieve[field]) : 0
        );

        const classifier = new SoilClassification(
            netWeight,
            isRecordedNumber(sample.ll) ? Number(sample.ll) : 0,
            isRecordedNumber(sample.pi) ? Number(sample.pi) : 0,
            ...weights
        );

        const fractions = [
            ['Gravel', classifier.getGravFrac()],
            ['Sand', classifier.getSandFrac()],
            ['Fines', classifier.getFines()]
        ];

        return fractions
            .filter(([, value]) =>
                Number.isFinite(Number(value)) && Number(value) > 0
            )
            .map(([name, value]) => `${name} ${Number(value)}%`)
            .join(', ');
    }

    getUnconfinedResult(gfk, unconfinedcalcs, projectid, boringid, sampleid) {
        const test = gfk.getUnconfinedTestById.call(
            this, projectid, boringid, sampleid
        );

        const hasTest = Array.isArray(test)
            ? test.length > 0
            : test && typeof test === 'object' && Object.keys(test).length > 0;

        if (!hasTest) return { strength: '', strain: '' };

        const strength = unconfinedcalcs.getMaxStress.call(
            this, projectid, boringid, sampleid
        );
        const strain = unconfinedcalcs.getMaxStrain.call(
            this, projectid, boringid, sampleid
        );

        // Do not show numeric defaults for an incomplete unconfined test.
        if (!isRecordedNumber(strength) || Number(strength) <= 0 ||
            !isRecordedNumber(strain) || Number(strain) < 0) {
            return { strength: '', strain: '' };
        }

        return { strength, strain };
    }

    getDensityAndMoisture(sample) {
        const validDryWeight = isRecordedNumber(sample.drywgt);
        const validTareWeight = isRecordedNumber(sample.tarewgt);
        const validWetWeight = isRecordedNumber(sample.wetwgt) ||
            isRecordedNumber(sample.wetwgt_2);
        const netDryWeight = Number(sample.drywgt) - Number(sample.tarewgt);

        if (!validDryWeight || !validTareWeight || !validWetWeight ||
            netDryWeight <= 0) {
            return { dryDensity: '', moistureContent: '' };
        }

        const moisture = Number(moist(
            sample.drywgt, sample.tarewgt, sample.wetwgt, sample.wetwgt_2
        ));

        const moistureContent = Number.isFinite(moisture) && moisture >= 0
            ? (moisture * 100).toFixed(1)
            : '';

        const hasDimensions = isRecordedNumber(sample.diameter) &&
            Number(sample.diameter) > 0 &&
            isRecordedNumber(sample.samplelength) &&
            Number(sample.samplelength) > 0;

        let dryDensity = '';
        if (hasDimensions) {
            const density = calcdryden(
                sample.wetwgt_2, sample.wetwgt,
                sample.tarewgt, sample.drywgt,
                sample.diameter, sample.samplelength
            );
            dryDensity = Number.isFinite(Number(density)) && Number(density) > 0
                ? density
                : '';
        }

        return { dryDensity, moistureContent };
    }

    showrows() {
        const gfk = new GFK();
        const unconfinedcalcs = new UnconfinedCalcs();
        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return [];

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (!Array.isArray(borings)) return [];

        const rows = [];

        borings.forEach(boring => {
            const { boringid, boringnumber } = boring;
            const samples = gfk.getSamplesByBoringId.call(this, projectid, boringid);
            if (!Array.isArray(samples)) return;

            samples.forEach(sample => {
                const sampleid = sample.sampleid;
                const sampleno = `${boringnumber}-${sample.sampleset ?? ''}(${sample.samplenumber ?? ''})`;
                const depth = sample.depth ?? '';
                const ll = isRecordedNumber(sample.ll) && Number(sample.ll) > 0
                    ? Number(sample.ll) : '';
                const pi = isRecordedNumber(sample.pi) && Number(sample.pi) > 0
                    ? Number(sample.pi) : '';

                const { dryDensity, moistureContent } =
                    this.getDensityAndMoisture(sample);

                const { strength, strain } = this.getUnconfinedResult(
                    gfk, unconfinedcalcs, projectid, boringid, sampleid
                );

                // Do not trust truthiness here: {} and [] are truthy in JS.
                const sieve = gfk.getSieveBySampleId.call(
                    this, projectid, boringid, sampleid
                );
                const sieveresult = this.getSieveResult(sample, sieve);

                rows.push(this.showrow(
                    `${boringid}-${sampleid}`,
                    sampleno, depth, dryDensity, moistureContent,
                    ll, pi, strength, strain, sieveresult
                ));
            });
        });

        return rows;
    }

    showrow(rowKey, sampleno, depth, dryden, moisture, ll, pi, strength, strain, sieve) {
        const styles = MyStylesheet();
        const cellStyle = { ...styles.showBorder, ...styles.alignCenter };

        return (
            <tr key={rowKey}>
                <td style={cellStyle}>{sampleno}</td>
                <td style={cellStyle}>{depth}</td>
                <td style={cellStyle}>{dryden}</td>
                <td style={cellStyle}>{moisture}</td>
                <td style={cellStyle}>{ll}</td>
                <td style={cellStyle}>{pi}</td>
                <td style={cellStyle}>{strength}</td>
                <td style={cellStyle}>{strain}</td>
                <td style={cellStyle}>{sieve}</td>
            </tr>
        );
    }

    async getSummary() {
        try {
            const { projectid } = this.props.match.params;
            const pdfBlob = await GetSummary(projectid);
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
            // Allow the new tab time to load the blob URL before cleanup.
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (err) {
            console.error('Error loading summary:', err);
            window.alert(err.message || 'Failed to load summary.');
        }
    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this);
        const { engineerid, projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) {
            return (
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>Project Not Found</span>
                </div>
            );
        }

        const linkStyle = {
            ...styles.generalFont,
            ...headerFont,
            ...styles.generalLink,
            ...styles.boldFont
        };
        const navItems = [
            { to: `/${engineerid}/profile`, label: `/${engineerid}` },
            { to: `/${engineerid}/projects`, label: '/projects' },
            {
                to: `/${engineerid}/projects/${projectid}`,
                label: `/${project.projectnumber} - ${project.title}`
            },
            {
                to: `/${engineerid}/projects/${projectid}/labsummary`,
                label: '/labsummary'
            }
        ];

        const headerCell = { ...styles.showBorder, ...styles.alignCenter };

        return (
            <div style={{ ...styles.generalContainer }}>
                {navItems.map(({ to, label }) => (
                    <div
                        key={to}
                        style={{
                            ...styles.generalContainer,
                            ...styles.alignCenter,
                            ...(label === '/labsummary' ? styles.bottomMargin15 : {})
                        }}
                    >
                        <Link style={linkStyle} to={to}>{label}</Link>
                    </div>
                ))}

                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                    <table width="99%" border="0" cellPadding="3">
                        <tbody>
                            <tr>
                                <td style={headerCell} rowSpan="2">Sample No.</td>
                                <td style={headerCell} rowSpan="2">Depth(ft)</td>
                                <td style={headerCell} rowSpan="2">Dry Density (pcf)</td>
                                <td style={headerCell} rowSpan="2">Moisture Content %</td>
                                <td style={headerCell} colSpan="2">Atterberg Limits</td>
                                <td style={headerCell} colSpan="2">Unconfined Compression</td>
                                <td style={headerCell} rowSpan="2">Sieve Analysis</td>
                            </tr>
                            <tr>
                                <td style={headerCell}>Liquid Limit%</td>
                                <td style={headerCell}>Plastic Index</td>
                                <td style={headerCell}>Strength (pcf)</td>
                                <td style={headerCell}>Strain %</td>
                            </tr>
                            {this.showrows()}
                        </tbody>
                    </table>
                </div>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.bottomMargin15,
                    ...styles.alignCenter,
                    ...styles.topMargin15
                }}>
                    <button
                        style={{ ...styles.generalButton, width: '200px' }}
                        onClick={() => this.getSummary()}
                    >
                        {downloadIcon()}
                    </button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        projects: state.projects,
        myuser: state.myuser
    };
}

export default connect(mapStateToProps, actions)(LabSummary);
