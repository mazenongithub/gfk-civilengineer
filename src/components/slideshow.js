import React, { Component } from 'react';
import GFK from './gfk'
import { MyStylesheet } from './styles';
import { pressPlay, slideLeft, slideRight, stopButton } from './svg';

class SlideShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '', width: 0, height: 0, activeslide: 0, isplaying: false,
            slideshowinterval: null
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

    handlePrevSlide() {
        const slides = this.getSlides()

        if (this.state.slideshowinterval) {
            clearInterval(this.state.slideshowinterval);
        }

        this.setState(prevState => {

            const lastIndex = slides.length - 1;
            return {
                isplaying: false,
                slideshowinterval: null,
                activeslide:
                    prevState.activeslide === 0
                        ? lastIndex
                        : prevState.activeslide - 1
            };
        });
    };

    handleNextSlide() {
        const slides = this.getSlides()

        if (this.state.slideshowinterval) {
            clearInterval(this.state.slideshowinterval);
        }

        this.setState(prevState => ({
            isplaying: false,
            slideshowinterval: null,
            activeslide:
                prevState.activeslide === slides.length - 1
                    ? 0
                    : prevState.activeslide + 1
        }));
    };

    getSlides() {

        const newSlide = (caption, url) => {
            return ({ caption, url })

        }



        const slide_1 = newSlide("Complete boring log data paired with a graphic soil profile created from real sample photos, making subsurface conditions easier to understand at a glance.", "/images/logdraft.jpeg")
        const slide_2 = newSlide("Define your cross-section and soil layers, and the application performs a full Method of Slices analysis to calculate the factor of safety. Results are presented graphically and numerically, enabling fast, transparent, and defensible slope stability evaluations.", "/images/slope.jpeg")
        const slide_3 = newSlide("Laboratory unconfined compression testing visualized with stress–strain plots, demonstrating material behavior and strength through clear, professional graphics.", "/images/unconfined.jpeg")
        const slide_4 = newSlide("Daily field reports that consolidate compaction test results, inspection summaries, and site photos into a single, organized record for clear documentation and accountability.", "/images/fieldreport.jpeg")
        const slide_5 = newSlide("A single project workspace connecting every phase of work—from borings and lab data to seismic analysis, slope stability, timesheets, and billing—with reports and proposals coming soon.", "/images/projects.jpeg")
        const slides = [slide_1, slide_2, slide_3, slide_4, slide_5];
        return slides;

    }

    handlePlaySlideshow() {

        const { isplaying, slideshowinterval } = this.state;

        // Pause if already playing
        if (isplaying) {
            clearInterval(slideshowinterval);
            this.setState({
                isplaying: false,
                slideshowinterval: null
            });
            return;
        }

        // Start slideshow
        const interval = setInterval(() => {
            this.setState(prevState => ({
                activeslide:
                    prevState.activeslide === 4
                        ? 0
                        : prevState.activeslide + 1
            }));
        }, 3000); // 3 seconds per slide

        this.setState({
            isplaying: true,
            slideshowinterval: interval
        });
    };



    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this)

        const mainslide = this.state.width > 900 ? { width: '100%', maxWidth: '720px' } : { width: '100%', maxWidth: '440px' }
        const buttonWidth = { width: '100%', maxWidth: '81px' }
        const slides = this.getSlides();
        const playButton = { width: '100%', maxWidth: '140px', }

        const { activeslide } = this.state;

        const getButton = this.state.isplaying ? stopButton() : pressPlay()


        return (
            <div style={{ ...styles.generalContainer, ...styles.generalFont }}>
                <div style={{ ...styles.generalContainer, ...mainslide, ...styles.marginAuto, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                    <img style={{ ...styles.width99 }} src={slides[activeslide].url} alt={slides[activeslide].caption} />

                </div>

                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15, ...styles.alignCenter }}>
                    <span style={{ ...regularFont }}>{slides[activeslide].caption}</span>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                        <button style={{ ...styles.generalButton, ...buttonWidth }} onClick={() => { this.handlePrevSlide() }}>
                            {slideLeft()}
                        </button>
                    </div>
                    <div style={{ ...styles.flex2, ...styles.alignCenter }}>
                        <button style={{ ...styles.generalButton, ...playButton }} onClick={() => { this.handlePlaySlideshow() }}>
                            {getButton}
                        </button>
                    </div>
                    <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                        <button style={{ ...styles.generalButton, ...buttonWidth }} onClick={() => { this.handleNextSlide() }}>
                            {slideRight()}
                        </button>
                    </div>
                </div>



            </div>)


    }

}

export default SlideShow