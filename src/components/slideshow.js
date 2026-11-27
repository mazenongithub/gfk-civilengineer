
import React, { Component } from 'react';
import GFK from './gfk';
import { MyStylesheet } from './styles';

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

        // Touch gesture tracking
        this.touchStartX = null;
        this.touchStartY = null;
        this.touchStartTime = null;

        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'resize',
            this.updateWindowDimensions
        );

        this.updateWindowDimensions();

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

    // SLIDESHOW TIMER

    clearSlideshow() {
        if (this.slideshowinterval !== null) {
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

    // MANUAL NAVIGATION

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

    // TOUCH SWIPE EVENTS

    handleTouchStart(event) {
        // Only track a single-finger gesture.
        if (event.touches.length !== 1) {
            this.resetTouch();
            return;
        }

        const touch = event.touches[0];

        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
    }

    handleTouchEnd(event) {
        if (
            this.touchStartX === null ||
            this.touchStartY === null
        ) {
            return;
        }

        const touch = event.changedTouches[0];

        if (!touch) {
            this.resetTouch();
            return;
        }

        const deltaX =
            touch.clientX - this.touchStartX;

        const deltaY =
            touch.clientY - this.touchStartY;

        const elapsed =
            Date.now() - this.touchStartTime;

        this.resetTouch();

        const minSwipeDistance = 50;
        const maxSwipeTime = 1000;

        const isHorizontalSwipe =
            Math.abs(deltaX) >
            Math.abs(deltaY) * 1.5;

        // Ignore short, slow, or vertical gestures.
        if (
            Math.abs(deltaX) < minSwipeDistance ||
            elapsed > maxSwipeTime ||
            !isHorizontalSwipe
        ) {
            return;
        }

        if (deltaX < 0) {
            // Swipe left: next slide.
            this.handleNextSlide();
        } else {
            // Swipe right: previous slide.
            this.handlePrevSlide();
        }
    }

    resetTouch() {
        this.touchStartX = null;
        this.touchStartY = null;
        this.touchStartTime = null;
    }

    // SVG ICONS

    renderArrow(direction) {
        return (
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                style={{
                    display: 'block',
                    width: '22px',
                    height: '22px',
                    flexShrink: 0
                }}
            >
                {direction === 'left' ? (
                    <path d="M15 18L9 12L15 6" />
                ) : (
                    <path d="M9 18L15 12L9 6" />
                )}
            </svg>
        );
    }

    renderPlayButton(isplaying) {
        return (
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                style={{
                    display: 'block',
                    width: '22px',
                    height: '22px',
                    flexShrink: 0
                }}
            >
                {isplaying ? (
                    <rect
                        x="6"
                        y="6"
                        width="12"
                        height="12"
                        rx="1"
                        fill="currentColor"
                        stroke="none"
                    />
                ) : (
                    <path
                        d="M8 5L19 12L8 19V5Z"
                        fill="currentColor"
                        stroke="none"
                    />
                )}
            </svg>
        );
    }

    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont =
            gfk.getRegularFont.call(this);

        const headerFont =
            gfk.getHeaderFont.call(this);

        const slides = this.getSlides();

        const {
            activeslide,
            isplaying,
            width
        } = this.state;

        const slide = slides[activeslide];

        const isMobile =
            width > 0 && width < 700;

        const colors = {
            primary: '#6A7EA6',
            dark: '#303845',
            muted: '#657084',
            border: '#DCE3EE',
            white: '#FFFFFF',
            light: '#F1F3F7',
            inactive: '#D2D8E3'
        };

        const controlStyle = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',

            flex: '0 0 auto',

            width: isMobile ? '55px' : '75px',
            minWidth: isMobile ? '55px' : '75px',
            height: '44px',

            padding: '8px',
            boxSizing: 'border-box',

            backgroundColor: colors.primary,
            color: colors.white,

            border: 'none',
            borderRadius: '8px',

            WebkitAppearance: 'none',
            appearance: 'none',

            cursor: 'pointer',
            touchAction: 'manipulation',

            boxShadow:
                '0 2px 6px rgba(0,0,0,0.10)'
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
                {/* MAIN SLIDE - SWIPE AREA */}

                <div
                    onTouchStart={(event) =>
                        this.handleTouchStart(event)
                    }

                    onTouchEnd={(event) =>
                        this.handleTouchEnd(event)
                    }

                    onTouchCancel={() =>
                        this.resetTouch()
                    }

                    style={{
                        background: colors.white,

                        border:
                            `1px solid ${colors.border}`,

                        borderRadius: '12px',
                        overflow: 'hidden',

                        boxShadow:
                            '0 10px 35px rgba(0,0,0,0.08)',

                        // Allows normal vertical scrolling.
                        touchAction: 'pan-y',

                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                    }}
                >
                    {/* SLIDE HEADER */}

                    <div
                        style={{
                            display: 'flex',

                            justifyContent:
                                'space-between',

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
                                color: colors.muted,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {activeslide + 1} / {slides.length}
                        </span>
                    </div>

                    {/* SCREENSHOT */}

                    <div
                        style={{
                            background: colors.light,

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
                            draggable={false}

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
                                    '0 3px 12px rgba(0,0,0,0.08)',

                                pointerEvents: 'none'
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

                        aria-live={
                            isplaying ? 'off' : 'polite'
                        }
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

                    role="group"
                    aria-label="Choose a slideshow image"
                >
                    {slides.map((item, index) => (
                        <button
                            key={index}
                            type="button"

                            aria-label={
                                `Show ${item.title}`
                            }

                            aria-current={
                                activeslide === index
                                    ? 'true'
                                    : undefined
                            }

                            onClick={() =>
                                this.handleSelectSlide(index)
                            }

                            style={{
                                flex: '0 0 auto',

                                width:
                                    activeslide === index
                                        ? '28px'
                                        : '11px',

                                height: '11px',

                                borderRadius: '20px',

                                background:
                                    activeslide === index
                                        ? colors.primary
                                        : colors.inactive,

                                border: 'none',
                                padding: 0,

                                WebkitAppearance: 'none',
                                appearance: 'none',

                                cursor: 'pointer',

                                transition:
                                    'width 0.2s ease'
                            }}
                        />
                    ))}
                </div>

                {/* NAVIGATION CONTROLS */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                        flexWrap: 'nowrap',

                        gap: isMobile
                            ? '12px'
                            : '25px',

                        width: '100%',
                        maxWidth: '100%',

                        boxSizing: 'border-box',

                        marginBottom: '25px'
                    }}
                >
                    {/* PREVIOUS */}

                    <button
                        type="button"
                        aria-label="Previous slide"

                        style={controlStyle}

                        onClick={() =>
                            this.handlePrevSlide()
                        }
                    >
                        {this.renderArrow('left')}
                    </button>

                    {/* PLAY / STOP */}

                    <button
                        type="button"

                        aria-label={
                            isplaying
                                ? 'Stop slideshow'
                                : 'Play slideshow'
                        }

                        style={{
                            ...controlStyle,

                            width: isMobile
                                ? '80px'
                                : '110px',

                            minWidth: isMobile
                                ? '80px'
                                : '110px'
                        }}

                        onClick={() =>
                            this.handlePlaySlideshow()
                        }
                    >
                        {this.renderPlayButton(isplaying)}
                    </button>

                    {/* NEXT */}

                    <button
                        type="button"
                        aria-label="Next slide"

                        style={controlStyle}

                        onClick={() =>
                            this.handleNextSlide()
                        }
                    >
                        {this.renderArrow('right')}
                    </button>
                </div>
            </div>
        );
    }
}

export default SlideShow;
