
import React, { Component } from 'react';
import GFK from './gfk';
import Profile from './profile';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles';
import SlideShow from './slideshow';

class Landing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0
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

    showLanding() {
        const styles = MyStylesheet();
        const gfk = new GFK();

        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this);

        const isMobile = this.state.width < 700;

        const features = [
            {
                title: 'Project Management',
                description:
                    'Organize projects, clients, proposals, schedules, timesheets, and engineering documentation.'
            },
            {
                title: 'Boring Logs & Soil Laboratory',
                description:
                    'Manage subsurface investigations, soil classifications, sample data, and laboratory testing.'
            },
            {
                title: 'Engineering Analysis',
                description:
                    'Perform seismic, liquefaction, slope stability, and foundation engineering analyses.'
            },
            {
                title: 'Field Reports & Compaction',
                description:
                    'Document field inspections, density testing, compaction curves, and construction observations.'
            },
            {
                title: 'Professional Report Writer',
                description:
                    'Assemble geotechnical reports with engineering tables, figures, boring logs, and appendices.'
            },
            {
                title: 'Document Delivery',
                description:
                    'Generate professional PDF documents and provide organized online access to project reports.'
            }
        ];

       const colors = {
    primary: '#6A7EA6',
    sand: '#6A7EA6',       // Existing accent references
    dark: '#303845',
    muted: '#657084',
    border: '#DCE3EE',
    background: '#F0F3F8',
    white: '#FFFFFF'
};

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
                {/* HERO */}

                <section
                    style={{
                        textAlign: 'center',
                        padding: isMobile
                            ? '35px 15px 25px'
                            : '65px 25px 35px',
                        maxWidth: '1100px',
                        margin: 'auto'
                    }}
                >
                    <div
                        style={{
                            color: colors.primary,
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            fontSize: '13px',
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
                                : '44px',
                            lineHeight: 1.2,
                            fontWeight: 'bold',
                            color: colors.dark,
                            margin: '0 auto 22px',
                            maxWidth: '950px'
                        }}
                    >
                        Geotechnical Engineering Software
                        Built for Engineers
                    </h1>

                    <p
                        style={{
                            ...regularFont,
                            fontSize: isMobile
                                ? '16px'
                                : '19px',
                            lineHeight: 1.8,
                            color: colors.muted,
                            maxWidth: '820px',
                            margin: '0 auto'
                        }}
                    >
                        Manage geotechnical projects from
                        subsurface investigation through
                        final report delivery. Bring boring
                        logs, laboratory testing, engineering
                        analyses, field documentation, and
                        professional reporting together in
                        one integrated workspace.
                    </p>
                </section>

                {/* SLIDESHOW */}

                <section
                    style={{
                        background: colors.background,
                        borderTop:
                            `1px solid ${colors.border}`,
                        borderBottom:
                            `1px solid ${colors.border}`,
                        padding: isMobile
                            ? '35px 12px'
                            : '55px 30px'
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1200px',
                            margin: 'auto'
                        }}
                    >
                        <h2
                            style={{
                                ...headerFont,
                                fontSize: isMobile
                                    ? '24px'
                                    : '30px',
                                textAlign: 'center',
                                marginBottom: '12px',
                                color: colors.dark
                            }}
                        >
                            One Platform. Every Stage
                            of Your Geotechnical Project.
                        </h2>

                        <p
                            style={{
                                ...regularFont,
                                textAlign: 'center',
                                color: colors.muted,
                                lineHeight: 1.7,
                                maxWidth: '720px',
                                margin: '0 auto 35px'
                            }}
                        >
                            Explore the engineering tools
                            available within GFK.
                        </p>

                        <SlideShow />
                    </div>
                </section>

                {/* FEATURES */}

                <section
                    style={{
                        maxWidth: '1200px',
                        margin: 'auto',
                        padding: isMobile
                            ? '45px 15px'
                            : '75px 30px'
                    }}
                >
                    <h2
                        style={{
                            ...headerFont,
                            textAlign: 'center',
                            fontSize: isMobile
                                ? '25px'
                                : '32px',
                            marginBottom: '12px'
                        }}
                    >
                        Engineering Tools in One Workspace
                    </h2>

                    <p
                        style={{
                            ...regularFont,
                            textAlign: 'center',
                            color: colors.muted,
                            marginBottom: '40px'
                        }}
                    >
                        Designed around the workflow of
                        practicing geotechnical engineers.
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile
                                ? '1fr'
                                : 'repeat(3, minmax(0, 1fr))',
                            gap: '20px'
                        }}
                    >
                        {features.map((feature, index) => (
                            <article
                                key={index}
                                style={{
                                    background: colors.white,
                                    border:
                                        `1px solid ${colors.border}`,
                                    borderTop:
                                        `4px solid ${colors.sand}`,
                                    borderRadius: '8px',
                                    padding: '26px',
                                    boxShadow:
                                        '0 5px 18px rgba(0,0,0,0.035)'
                                }}
                            >
                                <h3
                                    style={{
                                        ...headerFont,
                                        fontSize: '19px',
                                        color: colors.dark,
                                        margin: '0 0 12px'
                                    }}
                                >
                                    {feature.title}
                                </h3>

                                <p
                                    style={{
                                        ...regularFont,
                                        color: colors.muted,
                                        fontSize: '15px',
                                        lineHeight: 1.7,
                                        margin: 0
                                    }}
                                >
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* CLOSING MESSAGE */}

                <section
                    style={{
                        padding: isMobile
                            ? '45px 20px'
                            : '65px 30px',
                        background: colors.background,
                        borderTop:
                            `1px solid ${colors.border}`,
                        textAlign: 'center'
                    }}
                >
                    <h2
                        style={{
                            ...headerFont,
                            fontSize: isMobile
                                ? '25px'
                                : '32px',
                            marginBottom: '18px'
                        }}
                    >
                        Built for the Way Engineers Work
                    </h2>

                    <p
                        style={{
                            ...regularFont,
                            maxWidth: '800px',
                            margin: '0 auto',
                            color: colors.muted,
                            fontSize: '17px',
                            lineHeight: 1.8
                        }}
                    >
                        GFK connects field observations,
                        laboratory results, engineering
                        calculations, and final documentation
                        so project information stays organized
                        and accessible throughout the
                        engineering process.
                    </p>
                </section>
            </main>
        );
    }

    render() {
        const gfk = new GFK();
        const user = gfk.getUser.call(this);

        if (!user) {
            return this.showLanding();
        }

        const profile = new Profile();
        return profile.showprofile.call(this);
    }
}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects
    };
}

export default connect(
    mapStateToProps,
    actions
)(Landing);
