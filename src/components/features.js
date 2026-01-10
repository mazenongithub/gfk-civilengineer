import React, { Component } from 'react';
import GFK from './gfk'
import { MyStylesheet } from './styles';
import { triangleBullet } from './svg';

class Features extends Component {

    constructor(props) {
        super(props);
        this.state = {
            render: '', width: 0, height: 0,
            features: [{
                title: 'Soil Labratory Management',
                description: 'Manage lab testing with structured workflows and clear results.',
                summary: [
                    'Unconfined compression',
                    'Moisture Densities',
                    'Atterberg limits',
                    'Grain size analysis',
                    'Stress–strain plots and summaries',
                    'Centralized lab summaries by project'
                ]
            },
            {
                title: 'Geologic Log Drafting',
                description: 'Create professional boring logs with integrated graphics and data.',
                summary: [
                    'Visual boring logs with photos of dried samples',
                    'Stratigraphy, groundwater, and sampling data',
                    'Blow counts and classifications',
                    'Automatic formatting for reports'
                ]
            },

            {
                title: 'Field Reports',
                description: 'Capture and manage field data in real time.',
                summary: [
                    'Daily field reports',
                    'Compaction and density testing',
                    'Photo uploads tied to each report',
                    'Daily summaries ready for review or download',
                    'Automatic formatting for reports'
                ]
            },
            {
                title: 'Liquefaction Analysis',
                description: 'Perform seismic and liquefaction evaluations with confidence.',
                summary: [
                    'Site-specific seismic input',
                    'Factor of safety calculations',
                    'Layer-by-layer analysis',
                    'Clear outputs for reports and review'
                ]
            },
            {
                title: 'PT Slab Design',
                description: 'Design and document post-tensioned slabs efficiently.',
                summary: [
                    'Input soil parameters directly from lab and field data',
                    'Automated calculations',
                    'Clear design summaries for review'
                ]
            },
            {
                title: 'Slope Stability Analysis',
                description: 'Evaluate slope performance using established engineering methods.',
                summary: [
                    'Method of slices analysis',
                    'Graphical cross-sections',
                    'Calculated factors of safety'
                ]
            },
            {
                title: 'Time Tracking & Invoicing',
                description: 'Keep engineering and billing in sync.',
                summary: [
                    'Timesheets tied to projects',
                    'Invoice generation',
                    'Transparent labor and task tracking'
                ]
            },
            {
                title: 'Soil Classification',
                description: 'Standardized classification built into every workflow.',
                summary: [
                    'USCS soil classification',
                    'Automatic classification from lab data',
                    'Consistent symbols across logs, reports, and analyses'
                ]
            }


            ]
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
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

    showFeature(feature) {
        const gfk = new GFK();
        const styles = MyStylesheet();

        const bulletStyle = { width: '50px' };
        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this);

        const summaries = Array.isArray(feature.summary)
            ? feature.summary.map((summary, index) => (
                <div
                    key={index}
                    style={{ ...styles.generalContainer, ...styles.marginLeft25 }}
                >
                    <span style={regularFont}>{summary}</span>
                </div>
            ))
            : null;

        return (
            <div
                style={{
                    ...styles.generalContainer,
                    ...styles.bottomMargin15,
                    ...styles.generalFont,
                    ...styles.marginLeft50
                }}
            >
                <button
                    style={{ ...styles.generalButton, ...bulletStyle }}
                >
                    {triangleBullet()}
                </button>

                <span style={{ ...headerFont, ...styles.boldFont }}>
                    {feature.title}
                </span>

                <div
                    style={{
                        ...styles.generalContainer,
                        ...styles.marginLeft25,
                        ...styles.bottomMargin15
                    }}
                >
                    <span style={regularFont}>{feature.description}</span>
                    {summaries}
                </div>
            </div>
        );
    }


    showFeatures() {
        const { features } = this.state;
        return features.map(feature => this.showFeature(feature));
    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const bullet = { width: '50px' }
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        return (
            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont, ...styles.topMargin15 }}>
                    <button style={{ ...styles.generalButton, ...bullet }}>{triangleBullet()}</button>
                    <span style={{ ...headerFont, ...styles.boldFont }}>App Features</span>
                </div>

                <div style={{ ...styles.generalFont, ...styles.marginLeft50, ...styles.bottomMargin15 }}>
                    <span style={{ ...regularFont }}>A comprehensive, end-to-end platform designed to manage geotechnical engineering work—from field data collection to final technical reports and billing.</span>
                </div>



                {this.showFeatures()}

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont, ...styles.topMargin15 }}>

                    <span style={{ ...headerFont, ...styles.boldFont }}>Designed for Real Projects</span>
                </div>

                <div style={{ ...styles.generalFont, ...styles.marginLeft50, ...styles.bottomMargin15 }}>
                    <span style={{ ...regularFont }}>Every feature is built to work together—field data flows into lab results, analyses feed reports, and time tracking ties directly to invoicing. No duplicate entry. No disconnected tools.</span>
                </div>



            </div>
        )
    }

}

export default Features;