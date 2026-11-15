import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { CreateSieve } from './functions';
import { Link } from 'react-router-dom';

// Keep this order consistent with the positional CreateSieve() factory.
const SIEVE_FIELDS = [
    { key: 'wgt34', label: '3/4"' },
    { key: 'wgt38', label: '3/8"' },
    { key: 'wgt4', label: 'No. 4' },
    { key: 'wgt10', label: 'No. 10' },
    { key: 'wgt30', label: 'No. 30' },
    { key: 'wgt40', label: 'No. 40' },
    { key: 'wgt100', label: 'No. 100' },
    { key: 'wgt200', label: 'No. 200' }
];

const BLANK_SIEVE = Object.fromEntries(SIEVE_FIELDS.map(({ key }) => [key, '']));
const isSieveObject = value => value !== null &&
    typeof value === 'object' && !Array.isArray(value);

// A sieve is *absent* once all weight inputs have been cleared.
// The factory can still attach metadata (e.g. sampleid), so Object.keys()
// is not a reliable indication that a sieve test exists.
const hasWeightInput = value => value !== null &&
    value !== undefined && String(value).trim() !== '';
const hasSieveInputs = sieve => isSieveObject(sieve) &&
    SIEVE_FIELDS.some(({ key }) => hasWeightInput(sieve[key]));

class Sieve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...BLANK_SIEVE,
            message: ''
        };
    }

    componentDidUpdate(prevProps) {
        // Avoid carrying unsaved fallback input values into another sample.
        const previous = prevProps.match?.params ?? {};
        const current = this.props.match?.params ?? {};
        if (previous.projectid !== current.projectid ||
            previous.boringid !== current.boringid ||
            previous.sampleid !== current.sampleid) {
            this.setState({ ...BLANK_SIEVE, message: '' });
        }
    }

    /** Get the sieve for the selected sample, ignoring empty arrays/invalid values. */
    getSieve() {
        const gfk = new GFK();
        const { projectid, boringid, sampleid } = this.props.match.params;
        const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid);
        return hasSieveInputs(sample?.sieve) ? sample.sieve : null;
    }

    getSieveField(field) {
        const sieve = this.getSieve();
        return sieve?.[field] ?? this.state[field] ?? '';
    }

    /**
     * Creates the sieve on the first edit, then updates its individual weights.
     * All Redux objects/arrays are copied so Redux can detect the change.
     */
    updateSieveField(field, value) {
        if (!SIEVE_FIELDS.some(item => item.key === field)) return;

        const gfk = new GFK();
        const { projectid, boringid, sampleid } = this.props.match.params;
        const projects = gfk.getProjects.call(this);

        if (!Array.isArray(projects)) {
            this.setState({ [field]: value, message: 'Projects are not loaded.' });
            return;
        }

        const i = gfk.getProjectKeyById.call(this, projectid);
        const j = gfk.getBoringKeyById.call(this, projectid, boringid);
        const k = gfk.getSampleKeyById.call(this, projectid, boringid, sampleid);

        // Index zero is valid; do not use `if (i)` to check these indexes.
        if (![i, j, k].every(index => Number.isInteger(index) && index >= 0)) {
            this.setState({ [field]: value, message: 'Project, boring, or sample not found.' });
            return;
        }

        const project = projects[i];
        const boring = project?.borings?.[j];
        const sample = boring?.samples?.[k];

        if (!sample || String(sample.sampleid) !== String(sampleid) ||
            String(boring.boringid) !== String(boringid) ||
            String(project.projectid) !== String(projectid)) {
            this.setState({ [field]: value, message: 'Project, boring, or sample not found.' });
            return;
        }

        const existingSieve = isSieveObject(sample.sieve) ? sample.sieve : null;
        let updatedSieve;

        if (existingSieve) {
            // Preserve any other properties in the existing sieve object.
            updatedSieve = { ...existingSieve, [field]: value };
        } else {
            const values = { ...BLANK_SIEVE, ...this.state, [field]: value };
            updatedSieve = CreateSieve(
                sampleid,
                values.wgt34,
                values.wgt38,
                values.wgt4,
                values.wgt10,
                values.wgt30,
                values.wgt40,
                values.wgt100,
                values.wgt200
            );
        }

        // When the last value is erased, delete sieve entirely rather than
        // leaving {sampleid, wgt34: '', ...} for downstream reports/XML.
        if (!hasSieveInputs(updatedSieve)) updatedSieve = null;

        // No sieve ever existed and the input is still empty: no Redux write.
        if (!existingSieve && !updatedSieve) {
            this.setState({ [field]: value, message: '' });
            return;
        }

        const updatedSamples = [...boring.samples];
        if (updatedSieve) {
            updatedSamples[k] = { ...sample, sieve: updatedSieve };
        } else {
            const { sieve, ...sampleWithoutSieve } = sample;
            updatedSamples[k] = sampleWithoutSieve;
        }

        const updatedBorings = [...project.borings];
        updatedBorings[j] = { ...boring, samples: updatedSamples };

        const updatedProjects = [...projects];
        updatedProjects[i] = { ...project, borings: updatedBorings };

        this.props.reduxProjects(updatedProjects);
        this.setState(updatedSieve
            ? { [field]: value, message: '' }
            : { ...BLANK_SIEVE, message: 'Sieve removed from sample. Save the boring to persist.' });
    }

    /** Explicit removal also handles old records with empty sieve objects. */
    removeSieve() {
        const gfk = new GFK();
        const { projectid, boringid, sampleid } = this.props.match.params;
        const projects = gfk.getProjects.call(this);
        if (!Array.isArray(projects)) return;
        const i = gfk.getProjectKeyById.call(this, projectid);
        const j = gfk.getBoringKeyById.call(this, projectid, boringid);
        const k = gfk.getSampleKeyById.call(this, projectid, boringid, sampleid);
        if (![i, j, k].every(index => Number.isInteger(index) && index >= 0)) return;
        const project = projects[i];
        const boring = project?.borings?.[j];
        const sample = boring?.samples?.[k];
        if (!sample || !Object.prototype.hasOwnProperty.call(sample, 'sieve')) return;
        if (!window.confirm('Delete this sample\'s sieve analysis?')) return;

        const { sieve, ...sampleWithoutSieve } = sample;
        const samples = [...boring.samples];
        samples[k] = sampleWithoutSieve;
        const borings = [...project.borings];
        borings[j] = { ...boring, samples };
        const nextProjects = [...projects];
        nextProjects[i] = { ...project, borings };
        this.props.reduxProjects(nextProjects);
        this.setState({ ...BLANK_SIEVE, message: 'Sieve deleted. Save the boring to persist.' });
    }

    // Preserve the existing method names used by the original component.
    handlewgt34(value) { this.updateSieveField('wgt34', value); }
    handlewgt38(value) { this.updateSieveField('wgt38', value); }
    handlewgt4(value) { this.updateSieveField('wgt4', value); }
    handlewgt10(value) { this.updateSieveField('wgt10', value); }
    handlewgt30(value) { this.updateSieveField('wgt30', value); }
    handlewgt40(value) { this.updateSieveField('wgt40', value); }
    handlewgt100(value) { this.updateSieveField('wgt100', value); }
    handlewgt200(value) { this.updateSieveField('wgt200', value); }

    getwgt34() { return this.getSieveField('wgt34'); }
    getwgt38() { return this.getSieveField('wgt38'); }
    getwgt4() { return this.getSieveField('wgt4'); }
    getwgt10() { return this.getSieveField('wgt10'); }
    getwgt30() { return this.getSieveField('wgt30'); }
    getwgt40() { return this.getSieveField('wgt40'); }
    getwgt100() { return this.getSieveField('wgt100'); }
    getwgt200() { return this.getSieveField('wgt200'); }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const { projectid, boringid, sampleid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        if (!Array.isArray(projects)) return <span>&nbsp;</span>;

        const project = gfk.getProjectById.call(this, projectid);
        const boring = gfk.getBoringById.call(this, projectid, boringid);
        const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid);

        if (!project || !boring || !sample) {
            return <div style={{ ...styles.generalFont }}>Project, boring, or sample not found.</div>;
        }

        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this);
        const engineerid = gfk.getUser.call(this)?.engineerid ||
            this.props.match.params.engineerid || 'mazen';

        const breadcrumbs = [
            { label: `/${engineerid}`, to: `/${engineerid}` },
            { label: '/projects', to: `/${engineerid}/projects` },
            {
                label: `/${project.projectnumber} - ${project.title}`,
                to: `/${engineerid}/projects/${projectid}`
            },
            {
                label: '/Borings',
                to: `/${engineerid}/projects/${projectid}/borings`
            },
            {
                label: `/Boring Number ${boring.boringnumber} Samples`,
                to: `/${engineerid}/projects/${projectid}/borings/${boringid}/samples`
            },
            {
                label: `/Depth ${sample.depth}ft Sieve Analysis`,
                to: `/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sampleid}/sieve`
            }
        ];

        // Reading the selected sieve once avoids repeating GFK lookups per input.
        const sieve = hasSieveInputs(sample.sieve) ? sample.sieve : null;

        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter, ...headerFont, ...styles.boldFont }}>
                            {breadcrumbs.map(({ label, to }) => (
                                <div key={to} style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <Link
                                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                        to={to}
                                    >
                                        {label}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont }}>&nbsp;</div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>
                            Weight Retained (g)
                        </div>
                    </div>

                    {SIEVE_FIELDS.map(({ key, label }) => (
                        <div key={key} style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>
                                {label}
                            </div>
                            <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}>
                                <input
                                    type="text"
                                    style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                                    value={sieve?.[key] ?? this.state[key] ?? ''}
                                    onChange={event => this.updateSieveField(key, event.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    {Object.prototype.hasOwnProperty.call(sample, 'sieve') && (
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                                <button
                                    type="button"
                                    style={{ ...styles.generalButton, ...regularFont }}
                                    onClick={() => this.removeSieve()}
                                >
                                    Delete Sieve Analysis
                                </button>
                            </div>
                        </div>
                    )}

                    {this.state.message && (
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                                {this.state.message}
                            </div>
                        </div>
                    )}

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1 }}>
                            {gfk.showsaveboring.call(this)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { projects: state.projects };
}

export default connect(mapStateToProps, actions)(Sieve);
