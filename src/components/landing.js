import React, { Component } from 'react';
import GFK from './gfk'
import Profile from './profile';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles';


class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, open: false }
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

    showLanding() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        return (

            <div style={{ ...styles.generalContainer }}>

              
                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                    <h1 style={{ ...styles.generalFont, ...headerFont, ...styles.boldFont }}>Geotechnical Engineering Software | Reports, Logs, & Analysis | CivilEngineer.io</h1>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

                    <p style={{ ...styles.generalFont, ...regularFont }}>Comprehensive geotechnical engineering software for California projects. Manage borings, lab data, soil logs, analysis, and professional reports online—secure, fast, and built by licensed engineers.</p>

                </div>
            </div>
        )
    }

    render() {
        const gfk = new GFK();
        const user = gfk.getUser.call(this)
        const profile = new Profile()
        if (!user) {

            return (this.showLanding())

        } else {

            return (profile.showprofile.call(this))

        }
    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects
    }
}

export default connect(mapStateToProps, actions)(Landing);