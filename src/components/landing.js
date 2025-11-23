import React, { Component } from 'react';
import GFK from './gfk'
import Profile from './profile';
import * as actions from './actions';
import { connect } from 'react-redux';

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
        return (<div className="landing">
            <h1>GeoPro</h1>
            <p>Geotechnical data made simple.</p>
        </div>)
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