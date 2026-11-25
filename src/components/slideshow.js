
import React, { Component } from 'react';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import {
    pressPlay,
    slideLeft,
    slideRight,
    stopButton
} from './svg';

class SlideShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            activeslide: 0,
            isplaying: false
        };

        this.slideshowinterval = null;

        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'resize',
            this.updateWindowDimensions
        );

        this.updateWindowDimensions();

        // Start automatically unless reduced motion is preferred.
        const reducedMotion =
            window.matchMedia &&
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;

        if (!reducedMotion) {
            this.startSlideshow();
        }
    }

    componentWillUnmount() {
        window.removeEventListener(
            'resize',
            this.updateWindowDimensions
        );

        this.clearSlideshow();
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    getSlides() {
        return [
            {
                title: 'Boring Logs & Soil Profiles',
                caption:
                    'Document subsurface conditions with detailed boring logs, sample information, and graphic soil profiles using actual soil sample photographs.',
                url: '/images/logdraft.jpeg'
            },
            {
                title: 'Slope Stability Analysis',
                caption:
                    'Define cross-sections and soil layers, perform Method of Slices calculations, and evaluate factors of safety using graphical and numerical results.',
                url: '/images/slope.jpeg'
            },
            {
                title: 'Soil Laboratory Testing',
                caption:
                    'Manage laboratory test data and visualize material behavior through stress-strain relationships, strength measurements, and engineering graphics.',
                url: '/images/unconfined.jpeg'
            },
            {
                title: 'Field Reports & Compaction Testing',
                caption:
                    'Combine field density tests, inspection observations, construction progress, and site photographs into organized daily engineering reports.',
                url: '/images/fieldreport.jpeg'
            },
            {
                title: 'Integrated Project Management',
                caption:
                    'Manage project information, borings, laboratory data, seismic analysis, engineering reports, proposals, schedules, timesheets, and billing in one workspace.',
                url: '/images/projects.jpeg'
            }
        ];
    }

    clearSlideshow() {
        if (this.slideshowinterval) {
            clearInterval(this.slideshowinterval);
            this.slideshowinterval = null;
        }
    }

    stopSlideshow() {
        this.clearSlideshow();

        this.setState({
            isplaying: false
        });
    }

    startSlideshow() {
        this.clearSlideshow();

        const slides = this.getSlides();

        if (slides.length <= 1) return;

        this.slideshowinterval = setInterval(() => {
            this.setState(prevState => ({
                activeslide:
                    (prevState.activeslide + 1) %
                    slides.length
            }));
        }, 5000);

        this.setState({
            isplaying: true
        });
    }

    handlePrevSlide() {
        this.stopSlideshow();

        const slides = this.getSlides();

        this.setState(prevState => ({
            activeslide:
                (prevState.activeslide - 1 +
                    slides.length) % slides.length
        }));
    }

    handleNextSlide() {
        this.stopSlideshow();

        const slides = this.getSlides();

        this.setState(prevState => ({
            activeslide:
                (prevState.activeslide + 1) %
                slides.length
        }));
    }

    handleSelectSlide(index) {
        this.stopSlideshow();

        this.setState({
            activeslide: index
        });
    }

    handlePlaySlideshow() {
        if (this.state.isplaying) {
            this.stopSlideshow();
        } else {
            this.startSlideshow();
        }
    }

    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);
        const headerFont = gfk.getHeaderFont.call(this);

        const slides = this.getSlides();
        const { activeslide, isplaying, width } = this.state;

        const slide = slides[activeslide];
        const isMobile = width < 700;

      const colors = {
    primary: '#6A7EA6',
    sand: '#6A7EA6',
    dark: '#303845',
    muted: '#657084',
    border: '#DCE3EE',
    white: '#FFFFFF'
};
        const controlStyle = {
            ...styles.generalButton,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '55px' : '75px',
            height: '42px',
            padding: '8px 12px',
            cursor: 'pointer'
        };

        return (
            <div
                style={{
                    ...styles.generalContainer,
                    maxWidth: '1050px',
                    width: '100%',
                    margin: 'auto',
                    boxSizing: 'border-box'
                }}
            >
                {/* MAIN SLIDE */}

                <div
                    style={{
                        background: colors.white,
                        border:
                            `1px solid ${colors.border}`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow:
                            '0 10px 35px rgba(0,0,0,0.08)'
                    }}
                >
                    {/* SLIDE HEADER */}

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px',
                            padding: isMobile
                                ? '14px'
                                : '18px 25px',
                            borderBottom:
                                `1px solid ${colors.border}`
                        }}
                    >
                        <span
                            style={{
                                ...headerFont,
                                fontSize: isMobile
                                    ? '17px'
                                    : '21px',
                                fontWeight: 'bold',
                                color: colors.dark
                            }}
                        >
                            {slide.title}
                        </span>

                        <span
                            style={{
                                ...regularFont,
                                fontSize: '13px',
                                color: colors.muted
                            }}
                        >
                            {activeslide + 1} / {slides.length}
                        </span>
                    </div>

                    {/* SCREENSHOT */}

                    <div
                        style={{
                            background: '#f1f0ed',
                            padding: isMobile
                                ? '10px'
                                : '22px',
                            textAlign: 'center'
                        }}
                    >
                        <img
                            key={slide.url}
                            src={slide.url}
                            alt={slide.title}
                            style={{
                                display: 'block',
                                width: '100%',
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: isMobile
                                    ? '350px'
                                    : '570px',
                                objectFit: 'contain',
                                margin: 'auto',
                                borderRadius: '5px',
                                boxShadow:
                                    '0 3px 12px rgba(0,0,0,0.08)'
                            }}
                        />
                    </div>

                    {/* CAPTION */}

                    <div
                        style={{
                            padding: isMobile
                                ? '20px 16px'
                                : '25px 35px',
                            textAlign: 'center',
                            minHeight: isMobile
                                ? '105px'
                                : '95px',
                            boxSizing: 'border-box'
                        }}
                        aria-live={isplaying ? 'off' : 'polite'}
                    >
                        <p
                            style={{
                                ...regularFont,
                                fontSize: isMobile
                                    ? '14px'
                                    : '16px',
                                lineHeight: 1.7,
                                color: colors.muted,
                                maxWidth: '850px',
                                margin: 'auto'
                            }}
                        >
                            {slide.caption}
                        </p>
                    </div>
                </div>

                {/* SLIDE INDICATORS */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '22px',
                        marginBottom: '20px'
                    }}
                    aria-label="Choose a slideshow image"
                >
                    {slides.map((item, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Show ${item.title}`}
                            aria-current={
                                activeslide === index
                                    ? 'true'
                                    : undefined
                            }
                            onClick={() =>
                                this.handleSelectSlide(index)
                            }
                            style={{
                                width: activeslide === index
                                    ? '28px'
                                    : '11px',
                                height: '11px',
                                borderRadius: '20px',
                                background:
                                    activeslide === index
                                        ? colors.sand
                                        : '#d2cec6',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                transition:
                                    'width 0.2s ease'
                            }}
                        />
                    ))}
                </div>

                {/* CONTROLS */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: isMobile ? '14px' : '25px',
                        marginBottom: '25px'
                    }}
                >
                    <button
                        type="button"
                        aria-label="Previous slide"
                        style={controlStyle}
                        onClick={() =>
                            this.handlePrevSlide()
                        }
                    >
                        {slideLeft()}
                    </button>

                    <button
                        type="button"
                        aria-label={
                            isplaying
                                ? 'Pause slideshow'
                                : 'Play slideshow'
                        }
                        style={{
                            ...controlStyle,
                            width: isMobile
                                ? '90px'
                                : '120px'
                        }}
                        onClick={() =>
                            this.handlePlaySlideshow()
                        }
                    >
                        {isplaying
                            ? stopButton()
                            : pressPlay()}
                    </button>

                    <button
                        type="button"
                        aria-label="Next slide"
                        style={controlStyle}
                        onClick={() =>
                            this.handleNextSlide()
                        }
                    >
                        {slideRight()}
                    </button>
                </div>
            </div>
        );
    }
}

export default SlideShow;
