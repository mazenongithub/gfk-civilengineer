import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { removeIconSmall, goToIcon, calculateIcon, remarksIcon, addSieveIcon } from './svg';
import { Sample } from './functions';
import { Link } from 'react-router-dom';
import GraphicLogs from './graphiclogs';
import SoilClassification from './soilclassification';
import UnconfinedCalcs from './unconfinedcalcs';
import MakeID from './makeids';

// Fields edited through Samples; graphicid is managed by GraphicLogs.
const SAMPLE_FIELDS = [
    'sampleset',
    'samplenumber',
    'sampledepth',
    'depth',
    'diameter',
    'samplelength',
    'tareno',
    'tarewgt',
    'wetwgt',
    'wetwgt_2',
    'drywgt',
    'uscs',
    'spt',
    'sptlength',
    'remarks',
    'll',
    'pi',
    'description',
];

const BLANK_SAMPLE = Object.fromEntries(SAMPLE_FIELDS.map(field => [field, '']));

const num = value => {
    const n = Number(value);
    return value === '' || value == null || !Number.isFinite(n) ? 0 : n;
};

const hasNumber = value => value !== '' && value != null && Number.isFinite(Number(value));

/**
 * Geotechnical boring samples editor.
 * - Uses the existing GFK helper API, Redux action, Sample() factory, and route params.
 * - Creates a sample on the first edit when none is selected, as the old UI did.
 * - Updates existing samples without mutating Redux state in place.
 */
class Samples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...BLANK_SAMPLE,
            width: typeof window !== 'undefined' ? window.innerWidth : 0,
            height: typeof window !== 'undefined' ? window.innerHeight : 0,
            activesampleid: false,
            message: ''
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

 


    /** Returns the GFK-selected project and boring plus their Redux locations. */
    getProjectContext() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const projects = gfk.getProjects.call(this);
        if (!Array.isArray(projects)) return null;

        const projectKey = gfk.getProjectKeyById.call(this, projectid);
        if (projectKey === false || projectKey === null || projectKey === undefined) return null;
        const projectIndex = Number(projectKey);
        if (!Number.isInteger(projectIndex) || projectIndex < 0) return null;
        const project = projects[projectIndex];
        if (!project) return null;

        const boringKey = gfk.getBoringKeyById.call(this, projectid, boringid);
        if (boringKey === false || boringKey === null || boringKey === undefined) return null;
        const boringIndex = Number(boringKey);
        if (!Number.isInteger(boringIndex) || boringIndex < 0) return null;
        const boring = Array.isArray(project.borings) ? project.borings[boringIndex] : null;
        if (!boring) return null;

        return { projects, projectIndex, boringIndex, project, boring, boringid };
    }

    /** Immutable replacement to trigger React Redux updates reliably. */
    saveBoringSamples(context, samples) {
        const { projects, projectIndex, boringIndex, project, boring } = context;
        const updatedBorings = [...project.borings];
        updatedBorings[boringIndex] = { ...boring, samples };
        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = { ...project, borings: updatedBorings };
        this.props.reduxProjects(updatedProjects);
    }

    getActiveSample() {
        const { projectid, boringid } = this.props.match.params;
        const { activesampleid } = this.state;
        if (!activesampleid) return null;
        const gfk = new GFK();
        return gfk.getSampleById.call(this, projectid, boringid, activesampleid) || null;
    }

    /** All form fields use this one controlled getter. */
    getSampleField(field) {
        const sample = this.getActiveSample();
        if (sample && sample[field] !== undefined && sample[field] !== null) {
            return sample[field];
        }
        return this.state[field] !== undefined && this.state[field] !== null
            ? this.state[field]
            : '';
    }

    /**
     * Update selected sample or create the first sample with the typed value.
     * Preserves Sample()'s existing positional argument contract.
     */
    updateSampleField(field, value) {
        if (!SAMPLE_FIELDS.includes(field)) return;
        const context = this.getProjectContext();
        if (!context) return;

        const samples = Array.isArray(context.boring.samples) ? context.boring.samples : [];
        const { activesampleid } = this.state;
        if (activesampleid) {
            const index = samples.findIndex(sample => sample.sampleid === activesampleid);
            if (index === -1) {
                this.setState({ activesampleid: false, message: 'Selected sample was not found.' });
                return;
            }

            const updatedSamples = [...samples];
            updatedSamples[index] = { ...samples[index], [field]: value };
            this.saveBoringSamples(context, updatedSamples);
            if (this.state.message) this.setState({ message: '' });
            return;
        }

        const makeid = new MakeID();
        const sampleid = makeid.sampleID.call(this, 16);
        const values = { ...BLANK_SAMPLE, ...this.state, [field]: value };
        const newSampleData = Sample(
            sampleid,
            context.boringid,
            values.sampledepth,
            values.depth,
            values.samplenumber,
            values.sampleset,
            values.diameter,
            values.samplelength,
            values.description,
            values.uscs,
            values.spt,
            values.sptlength,
            values.wetwgt,
            values.wetwgt_2,
            values.drywgt,
            values.tarewgt,
            values.tareno,
            '', // Legacy positional graphiclog parameter; new samples use graphicid.
            values.ll,
            values.pi,
            values.remarks
        );
        const newSample = { ...newSampleData, graphicid: '' };
        this.saveBoringSamples(context, [...samples, newSample]);
        this.setState({ activesampleid: sampleid, ...BLANK_SAMPLE, message: '' });
    }

    makeSampleActive(sampleid) {
        this.setState(prev => ({
            activesampleid: prev.activesampleid === sampleid ? false : sampleid,
            message: ''
        }));
    }

    showsampleids() {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const samples = gfk.getSamplesByBoringId.call(this, projectid, boringid);
        return Array.isArray(samples) ? samples.map(sample => this.showsampleid(sample)) : null;
    }

    validateremovesample(sample) {
        const gfk = new GFK();
        const { projectid, boringid } = this.props.match.params;
        const messages = [];
        if (gfk.getSieveBySampleId.call(this, projectid, boringid, sample.sampleid)) {
            messages.push(`Cannot delete sample at ${sample.depth} ft: delete its sieve analysis first.`);
        }
        if (gfk.getUnconfinedTestById.call(this, projectid, boringid, sample.sampleid)) {
            messages.push(`Cannot delete sample at ${sample.depth} ft: delete its unconfined test first.`);
        }
        return { validate: messages.length === 0, message: messages.join(' ') };
    }

    removeSampleId(sample) {
        const validation = this.validateremovesample(sample);
        if (!validation.validate) {
            this.setState({ message: validation.message });
            return;
        }
        if (!window.confirm(`Are you sure you want to delete Sample at ${sample.depth} ft?`)) return;

        const context = this.getProjectContext();
        if (!context || !Array.isArray(context.boring.samples)) return;
        const updatedSamples = context.boring.samples.filter(s => s.sampleid !== sample.sampleid);
        if (updatedSamples.length === context.boring.samples.length) return;

        this.saveBoringSamples(context, updatedSamples);
        this.setState(prev => ({
            activesampleid: prev.activesampleid === sample.sampleid ? false : prev.activesampleid,
            message: ''
        }));
    }

    /** Original moisture / dry-density formulas, with division-by-zero guards. */
    getSampleMetrics(sample) {
        const wet = num(sample.wetwgt);
        const wet2 = num(sample.wetwgt_2);
        const dry = num(sample.drywgt);
        const tare = num(sample.tarewgt);
        const secondWetWeightUsed = wet2 > 0;
        const netDryWeight = dry > tare ? dry - tare : 0;
        const measuredWaterWeight = Math.max(0, (secondWetWeightUsed ? wet2 : wet) - dry);
        const validWet = (secondWetWeightUsed ? wet2 : wet) >= dry && dry > 0;
        const moisture = netDryWeight > 0 && validWet ? measuredWaterWeight / netDryWeight : 0;

        const firstDryWeight = secondWetWeightUsed && netDryWeight > 0 && wet > tare
            ? (wet - tare) / (1 + moisture)
            : netDryWeight;
        const estimatedFirstWater = firstDryWeight * moisture;
        const waterDisplay = secondWetWeightUsed
            ? `${estimatedFirstWater.toFixed(1)}g/${measuredWaterWeight.toFixed(1)}g`
            : `${measuredWaterWeight.toFixed(1)}g`;
        const netDisplay = secondWetWeightUsed
            ? `${firstDryWeight.toFixed(1)}/${netDryWeight.toFixed(1)}g`
            : `${netDryWeight.toFixed(1)}g`;

        const diameter = num(sample.diameter); // inches
        const length = num(sample.samplelength); // inches
        const volumeCubicInches = Math.PI * diameter * diameter / 4 * length;
        const dryDensity = firstDryWeight > 0 && volumeCubicInches > 0
            ? (firstDryWeight / 453.59237) * (1728 / volumeCubicInches)
            : 0;
        return {
            moisturePercent: (moisture * 100).toFixed(1),
            waterDisplay,
            netDisplay,
            dryDensityPcf: Math.round(dryDensity)
        };
    }

    showsampleid(sample) {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const headerFont = gfk.getHeaderFont.call(this);
        const removeIcon = gfk.getremoveicon.call(this);
        const { projectid, boringid } = this.props.match.params;
        const user = gfk.getUser.call(this);
        const engineerid = (user && user.engineerid) ||
            (this.props.myuser && this.props.myuser.engineerid) ||
            this.props.match.params.engineerid || 'mazen';
        const activeStyle = this.state.activesampleid === sample.sampleid ? styles.activefieldreport : {};
        const metrics = this.getSampleMetrics(sample);

        return (
            <div key={sample.sampleid} style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.flex1 }}>
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont }}>
                            <span
                                role="button"
                                tabIndex={0}
                                style={{ ...activeStyle, cursor: 'pointer' }}
                                onClick={() => this.makeSampleActive(sample.sampleid)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        this.makeSampleActive(sample.sampleid);
                                    }
                                }}
                            >
                                {sample.sampleset}-({sample.samplenumber}) SampleDepth:{sample.sampledepth} Depth:{sample.depth}ft Diameter:{sample.diameter} in. Length:{sample.samplelength} in. Description:{sample.description} SPT:{sample.spt} WetWgt:{sample.wetwgt}g Wet Wgt 2:{sample.wetwgt_2}g Dry Wgt:{sample.drywgt}g Tare Wgt:{sample.tarewgt}g WgtWater:{metrics.waterDisplay} NetWgt:{metrics.netDisplay} Moist:{metrics.moisturePercent}% DryDen:{metrics.dryDensityPcf}pcf Tare No:{sample.tareno} LL:{sample.ll} PI:{sample.pi}
                            </span>
                            <button
                                type="button"
                                aria-label={`Delete sample at ${sample.depth} feet`}
                                style={{ ...styles.generalButton, ...removeIcon }}
                                onClick={() => this.removeSampleId(sample)}
                            >
                                {removeIconSmall()}
                            </button>
                        </div>
                    </div>
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...activeStyle, ...styles.addLeftMargin }}>
                            <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sample.sampleid}/sieve`}>
                                Sieve Analysis
                            </Link>
                        </div>
                        <div style={{ ...styles.flex1, ...activeStyle }}>
                            <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.addLeftMargin }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sample.sampleid}/unconfined`}>
                                Unconfined
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Existing field methods used by Samples inputs. GraphicLogs manages graphicid separately.
    handleSampleSet(value) { this.updateSampleField('sampleset', value); }
    getSampleSet() { return this.getSampleField('sampleset'); }
    handleSampleNumber(value) { this.updateSampleField('samplenumber', value); }
    getSampleNumber() { return this.getSampleField('samplenumber'); }
    handleSampleDepth(value) { this.updateSampleField('sampledepth', value); }
    getSampleDepth() { return this.getSampleField('sampledepth'); }
    handleDepth(value) { this.updateSampleField('depth', value); }
    getDepth() { return this.getSampleField('depth'); }
    handleDiameter(value) { this.updateSampleField('diameter', value); }
    getDiameter() { return this.getSampleField('diameter'); }
    handleSampleLength(value) { this.updateSampleField('samplelength', value); }
    getSampleLength() { return this.getSampleField('samplelength'); }
    handleTareNo(value) { this.updateSampleField('tareno', value); }
    getTareNo() { return this.getSampleField('tareno'); }
    handleTareWgt(value) { this.updateSampleField('tarewgt', value); }
    getTareWgt() { return this.getSampleField('tarewgt'); }
    handleWetWgt(value) { this.updateSampleField('wetwgt', value); }
    getWetWgt() { return this.getSampleField('wetwgt'); }
    handleWetWgt_2(value) { this.updateSampleField('wetwgt_2', value); }
    getWetWgt_2() { return this.getSampleField('wetwgt_2'); }
    handleDryWgt(value) { this.updateSampleField('drywgt', value); }
    getDryWgt() { return this.getSampleField('drywgt'); }
    handleUSCS(value) { this.updateSampleField('uscs', value); }
    getUSCS() { return this.getSampleField('uscs'); }
    handleSPT(value) { this.updateSampleField('spt', value); }
    getSPT() { return this.getSampleField('spt'); }
    handleSPTLength(value) { this.updateSampleField('sptlength', value); }
    getSPTLength() { return this.getSampleField('sptlength'); }
    handleRemarks(value) { this.updateSampleField('remarks', value); }
    getRemarks() { return this.getSampleField('remarks'); }
    handleLL(value) { this.updateSampleField('ll', value); }
    getLL() { return this.getSampleField('ll'); }
    handlePI(value) { this.updateSampleField('pi', value); }
    getPI() { return this.getSampleField('pi'); }
    handleDescription(value) { this.updateSampleField('description', value); }
    getDescription() { return this.getSampleField('description'); }


    getSoilClassification(sample, sieve) {
        const weights = [
            'wgt34', 'wgt38', 'wgt4', 'wgt10',
            'wgt30', 'wgt40', 'wgt100', 'wgt200'
        ].map(key => num(sieve[key]));
        const netWeight = num(sample.drywgt) - num(sample.tarewgt);
        if (netWeight <= 0) return null;
        return new SoilClassification(netWeight, num(sample.ll), num(sample.pi), ...weights);
    }

    calcUSCS() {
        const sample = this.getActiveSample();
        if (!sample) {
            this.setState({ message: 'Select a sample first.' });
            return;
        }
        // PI = 0 can be valid. Check for missing fields, not falsy numeric values.
        if (!hasNumber(sample.ll) || !hasNumber(sample.pi)) {
            this.setState({ message: 'Enter LL and PI before calculating USCS.' });
            return;
        }
        const { projectid, boringid } = this.props.match.params;
        const gfk = new GFK();
        const sieve = gfk.getSieveBySampleId.call(this, projectid, boringid, sample.sampleid);
        if (!sieve) {
            this.setState({ message: 'No sieve analysis found for this sample.' });
            return;
        }
        const classifier = this.getSoilClassification(sample, sieve);
        if (!classifier) {
            this.setState({ message: 'Dry sample weight must exceed tare weight.' });
            return;
        }
        try {
            const classification = classifier.getClassification();
            if (!classification || !classification.uscs) throw new Error('No classification returned');
            this.handleUSCS(classification.uscs);
            this.setState({ message: '' });
        } catch (error) {
            this.setState({ message: `USCS classification failed: ${error.message}` });
        }
    }

    generateRemarks() {
        const sample = this.getActiveSample();
        if (!sample) return;
        const { projectid, boringid } = this.props.match.params;
        const gfk = new GFK();
        const remarks = [];
        if (hasNumber(sample.ll) && hasNumber(sample.pi)) {
            remarks.push(`LL=${num(sample.ll)}% PI=${num(sample.pi)}`);
        }
        const unconfined = gfk.getUnconfinedTestById.call(this, projectid, boringid, sample.sampleid);
        if (unconfined) {
            const unconfinedcalcs = new UnconfinedCalcs();
            const stress = unconfinedcalcs.getMaxStress.call(this, boringid, sample.sampleid);
            const strain = unconfinedcalcs.getMaxStrain.call(this, boringid, sample.sampleid);
            remarks.push(`Unconfined Strength=${stress}psf Strain=${strain}%`);
        }
        if (remarks.length > 0) this.handleRemarks(remarks.join(' '));
    }

    getSieveTest() {
        const sample = this.getActiveSample();
        if (!sample) {
            this.setState({ message: 'Select a sample first.' });
            return;
        }
        const { projectid, boringid } = this.props.match.params;
        const gfk = new GFK();
        const sieve = gfk.getSieveBySampleId.call(this, projectid, boringid, sample.sampleid);
        if (!sieve) {
            this.setState({ message: 'No sieve analysis found for this sample.' });
            return;
        }
        const classifier = this.getSoilClassification(sample, sieve);
        if (!classifier) {
            this.setState({ message: 'Dry sample weight must exceed tare weight.' });
            return;
        }
        try {
            const fractions = [
                ['Gravel', classifier.getGravFrac()],
                ['Sand', classifier.getSandFrac()],
                ['Fines', classifier.getFines()]
            ]
                .filter(([, value]) => Number.isFinite(Number(value)) && Number(value) > 0)
                .map(([label, value]) => `${label} ${value}%`);
            if (fractions.length === 0) return;
            const addition = `(${fractions.join(', ')})`;
            const current = String(sample.description || '').trim();
            // Avoid adding the identical gradation summary multiple times.
            if (!current.includes(addition)) {
                this.handleDescription([current, addition].filter(Boolean).join(' '));
            }
        } catch (error) {
            this.setState({ message: `Sieve description failed: ${error.message}` });
        }
    }

    render() {
        const gfk = new GFK();
        
        const { projectid, boringid } = this.props.match.params
        const boring = gfk.getBoringById.call(this, projectid, boringid);
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const samples_1 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Set <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSampleSet()}
                            onChange={event => { this.handleSampleSet(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Number <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSampleNumber()}
                            onChange={event => { this.handleSampleNumber(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Sample Depth <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSampleDepth()}
                            onChange={event => { this.handleSampleDepth(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Depth <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getDepth()}
                            onChange={event => { this.handleDepth(event.target.value) }} />
                    </div>
                </div>)
            } else {

                return (
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Set <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSampleSet()}
                                        onChange={event => { this.handleSampleSet(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Number <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSampleNumber()}
                                        onChange={event => { this.handleSampleNumber(event.target.value) }}
                                    />
                                </div>
                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Depth <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSampleDepth()}
                                        onChange={event => { this.handleSampleDepth(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Depth <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getDepth()}
                                        onChange={event => { this.handleDepth(event.target.value) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            }
        }

        const samples_2 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        Dry Wgt <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getDryWgt()}
                            onChange={event => { this.handleDryWgt(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        SPT<br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getSPT()}
                            onChange={event => { this.handleSPT(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        LL<br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getLL()}
                            onChange={event => { this.handleLL(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                        PI <br />
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getPI()}
                            onChange={event => { this.handlePI(event.target.value) }}
                        />
                    </div>
                </div>)
            } else {

                return (
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>

                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Dry Wgt <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getDryWgt()}
                                        onChange={event => { this.handleDryWgt(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    SPT <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSPT()}
                                        onChange={event => { this.handleSPT(event.target.value) }}
                                    />
                                </div>
                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    LL <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getLL()}
                                        onChange={event => { this.handleLL(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    PI <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getPI()}
                                        onChange={event => { this.handlePI(event.target.value) }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            }
        }

        const calculateUSCS = () => {
            if (this.state.activesampleid) {
                return (<div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...styles.fullWidth }}
                        onClick={() => { this.calcUSCS() }}>
                        {calculateIcon()}
                    </button>
                </div>)
            }
        }
        const remarksWidth = gfk.remarksWidth.call(this)
        const remarksButton = () => {
            if (this.state.activesampleid) {
                return (<div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...remarksWidth }}
                        onClick={() => { this.generateRemarks() }}>{remarksIcon()}</button>
                </div>)
            }
        }

        const samples_3 = () => {
            return (
                <div style={{ ...styles.generalContainer }}>
                    <div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalFlex }}>
                                <div style={{ ...styles.flex1 }}>
                                    <span style={{ ...regularFont }}>USCS</span>
                                </div>
                                {calculateUSCS()}
                            </div>

                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...regularFont, ...styles.alignCenter }}
                                    value={this.getUSCS()}
                                    onChange={event => { this.handleUSCS(event.target.value) }}
                                />
                            </div>


                        </div>

                        <div style={{ ...styles.flex1 }}>
                            <span style={{ ...regularFont }}>SPT-Length</span>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" style={{ ...regularFont, ...styles.alignCenter }}
                                    value={this.getSPTLength()}
                                    onChange={event => { this.handleSPTLength(event.target.value) }}
                                />
                            </div>


                        </div>




                    </div>
                    <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.generalContainer }}>
                            <div style={{ ...styles.generalFlex }}>
                                <div style={{ ...styles.flex1 }}>
                                    <span style={{ ...regularFont }}>Remarks</span>

                                </div>
                                {remarksButton()}
                            </div>

                            <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                value={this.getRemarks()}
                                onChange={event => { this.handleRemarks(event.target.value) }}
                            />

                        </div>
                    </div>

                </div>

            )
        }

        const showsievebutton = () => {
            if (this.state.activesampleid) {
                return (<div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...remarksWidth }}
                        onClick={() => { this.getSieveTest() }}>{addSieveIcon()}</button>
                </div>)
            }
        }

        const project = gfk.getProjectById.call(this, projectid)

        if (project) {
            const activeUser = gfk.getUser.call(this);
            const engineerid = (activeUser && activeUser.engineerid) ||
                (this.props.myuser && this.props.myuser.engineerid) ||
                this.props.match.params.engineerid || 'mazen';
            const goIconWidth = gfk.getgotoicon.call(this)
            if (boring) {

                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                                <div style={{ ...styles.flex1, ...styles.alignCenter, ...headerFont, ...styles.boldFont }}>
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
                                        <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples`}>/Boring Number {boring.boringnumber} - Samples</Link>
                                    </div>




                                </div>
                            </div>

                            {samples_1()}
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Diameter <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getDiameter()}
                                        onChange={event => { this.handleDiameter(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Sample Length <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getSampleLength()}
                                        onChange={event => { this.handleSampleLength(event.target.value) }} />
                                </div>

                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Tare No <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getTareNo()}
                                        onChange={event => { this.handleTareNo(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Tare Wgt <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getTareWgt()}
                                        onChange={event => { this.handleTareWgt(event.target.value) }}
                                    />
                                </div>

                            </div>
                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>


                                    Wet Wgt <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getWetWgt()}
                                        onChange={event => { this.handleWetWgt(event.target.value) }}
                                    />
                                </div>

                                <div style={{ ...styles.flex1, ...styles.addLeftMargin }}>
                                    Wet Wgt 2 <br />
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getWetWgt_2()}
                                        onChange={event => { this.handleWetWgt_2(event.target.value) }}
                                    />



                                </div>

                            </div>

                            {samples_2()}
                            {samples_3()}

                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.generalFlex }}>
                                    <div style={{ ...styles.flex1, ...regularFont, }}>
                                        <span style={{ ...regularFont }}>Description</span>
                                    </div>
                                    {showsievebutton()}
                                </div>
                                <div style={{ ...styles.generalContainer }}>
                                    <input type="text" style={{ ...styles.generalField, ...regularFont }}
                                        value={this.getDescription()}
                                        onChange={event => { this.handleDescription(event.target.value) }}
                                    />
                                </div>

                            </div>

                            {this.state.activesampleid && (
                                <GraphicLogs
                                    activesampleid={this.state.activesampleid}
                                />
                            )}

                            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                                {this.state.message}
                            </div>

                            {gfk.showsaveboring.call(this)}

                            {this.showsampleids()}

                            <div style={{ ...styles.generalContainer }}>
                                <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                                    to={`/${engineerid}/projects/${projectid}/borings/${boringid}/logdraft`}>
                                    <button style={{ ...styles.generalButton, ...goIconWidth }}>
                                        {goToIcon()}
                                    </button>
                                    <span style={{ ...styles.generalFont, ...regularFont }}>View LogDraft</span>
                                </Link>
                            </div>


                        </div>
                    </div>
                )

            } else {
                return (<span>&nbsp;</span>)
            }
        } else {
            return (<span>&nbsp;</span>)
        }
    }

}

function mapStateToProps(state) {
  return {
    myuser: state.myuser,
    projects: state.projects,
    company: state.company
  }
}


export default connect(mapStateToProps, actions)(Samples);
