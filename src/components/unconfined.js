import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
// import GFK from './gfk';
// import { MyStylesheet } from './styles';
// import { removeIconSmall } from './svg'
// import { makeID, Sample } from './functions';
// import { Link } from 'react-router-dom';

class Unconfined extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activesampleid: false, sampleset: '', samplenumber: '', sampledepth: '', depth: '', diameter: '', length: '', tareno: '', tarewgt: '', wetwgt: '', wgtwgt_2: '', drywgt: '', spt: '', ucsc: '', ll: '', pi: '', description: '' }
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

    render() {
        return (<div>Unconfined</div>)
    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(Unconfined);