import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { removeIconSmall } from './svg'
import { makeID, makeDatefromObj, Boring } from './functions';
import { Link } from 'react-router-dom';
import GFK from './gfk';

class Borings extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, datedrilled: new Date(), activeboringid: false, calender: 'open', loggedby: '', drillrig: '', gwdepth: '', elevation: '', latitude: '', longitude: '', boringnumber: '', diameter: '', message: '' }
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
    showBoringsByProject() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const borings = gfk.getBoringsByProjectId.call(this, projectid) || [];

        return borings.map(boring => this.showBoringId(boring));
    }

    makeBoringActive(boringId) {
        this.setState(prevState => ({
            activeboringid: prevState.activeboringid === boringId ? false : boringId
        }));
    }

    validateRemoveBoring(boring) {
        if (Array.isArray(boring.samples) && boring.samples.length > 0) {
            return {
                valid: false,
                message: `Cannot delete Boring ${boring.boringnumber}: delete samples first.`
            };
        }

        return { valid: true };
    }
    removeBoringId(boring) {
        if (!boring) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete boring number ${boring.boringnumber}?`
        );

        if (!confirmDelete) return;

        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const projects = gfk.getProjects.call(this);

        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const boringIndex = gfk.getBoringKeyById.call(this, projectid, boring.boringid);
        if (boringIndex === null) return;

        const validate = this.validateRemoveBoring(boring);

        if (validate.valid) {
            projects[projectIndex].borings.splice(boringIndex, 1);
            this.props.reduxProjects(projects);
            this.setState({ render: 'render', activeboringid:false });
        } else {
            this.setState({ message: validate.message });
        }
    }


    showBoringId(boring) {
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const styles = MyStylesheet();
        const removeIcon = gfk.getremoveicon.call(this)


        const activebackground = () => {
            if (boring.boringid === this.state.activeboringid) {
                return (styles.activefieldreport)
            }
        }
        return (
            <div style={{ ...styles.generalContainer, ...styles.generalFont }}>
                <div style={{ ...styles.generalFont, ...styles.generalContainer, ...styles.bottomMargin15 }} key={boring.boringid}>
                    <span onClick={() => { this.makeBoringActive(boring.boringid) }} style={{ ...activebackground(), ...regularFont }}>BoringID: {boring.boringid} DateDrilled:{boring.datedrilled} Number:{boring.boringnumber} Diameter:{boring.diameter} Elevation: {boring.elevation} Drill Rig:{boring.drillrig} LoggedBy: {boring.loggedby} Latitude: {boring.latitude} Longitude: {boring.longitude}</span>
                    <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removeBoringId(boring) }}>
                        {removeIconSmall()}
                    </button>
                </div>


            </div>
        )

    }

    getBoringNumber() {
        const gfk = new GFK();
        const { activeboringid, boringnumber } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.boringnumber || boringnumber;
        }

        return boringnumber;
    }

    handleBoringNumber(boringnumber) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].boringnumber = boringnumber;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, boringnumber: '' });
    }


    getDiameter() {
        const gfk = new GFK();
        const { activeboringid, diameter } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.diameter || diameter;
        }

        return diameter;
    }

    handleDiameter(diameter) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].diameter = diameter;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, diameter: '' });
    }


    getGWDepth() {
        const gfk = new GFK();
        const { activeboringid, gwdepth } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.gwdepth || gwdepth;
        }

        return gwdepth;
    }

    handleGWDepth(gwdepth) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, boringnumber, datedrilled, diameter, elevation, drillrig, loggedby, latitude, longitude } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].gwdepth = gwdepth;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, gwdepth: '' });
    }


    getElevation() {
        const gfk = new GFK();
        const { activeboringid, elevation } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.elevation || elevation;
        }

        return elevation;
    }

    handleElevation(elevation) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, datedrilled, boringnumber, diameter, gwdepth, drillrig, loggedby, latitude, longitude } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].elevation = elevation;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, elevation: '' });
    }

    getDrillRig() {
        const gfk = new GFK();
        const { activeboringid, drillrig } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.drillrig || drillrig;
        }

        return drillrig;
    }

    handleDrillRig(drillrig) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, boringnumber, datedrilled, diameter, gwdepth, elevation, loggedby, latitude, longitude } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].drillrig = drillrig;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, drillrig: '' });
    }

     getLoggedBy() {
        const gfk = new GFK();
        const { activeboringid, loggedby } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.loggedby || loggedby;
        }

        return loggedby;
    }

    handleLoggedBy(loggedby) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, boringnumber, datedrilled, diameter, gwdepth, elevation, drillrig, latitude, longitude } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].loggedby = loggedby;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, loggedby: '' });
    }

    
      getLatitude() {
        const gfk = new GFK();
        const { activeboringid, latitude } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.latitude || latitude;
        }

        return latitude;
    }

    handleLatitude(latitude) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, boringnumber, datedrilled, diameter, gwdepth, elevation, drillrig, loggedby, longitude } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].latitude = latitude;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, latitude: '' });
    }

      getLongitude() {
        const gfk = new GFK();
        const { activeboringid, longitude } = this.state;
        const { projectid } = this.props.match.params;

        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            return boring?.longitude || longitude;
        }

        return longitude;
    }

    handleLongitude(longitude) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activeboringid, boringnumber, datedrilled, diameter, gwdepth, elevation, drillrig, loggedby, latitude } = this.state;

        let projects = gfk.getProjects.call(this);
        if (!projects) return;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === false || projectIndex === null) return;

        // ✅ Update existing boring
        if (activeboringid) {
            const boring = gfk.getBoringById.call(this, projectid, activeboringid);
            if (!boring) return;

            const boringIndex = gfk.getBoringKeyById.call(this, projectid, activeboringid);
            if (boringIndex === false || boringIndex === null) return;

            projects[projectIndex].borings[boringIndex].longitude = longitude;
            this.props.reduxProjects(projects);
            this.setState({ render: 'render' });
            return;
        }

        // ✅ Create new boring
        const boringid = makeID(8);
        const newBoring = Boring(
            boringid,
            projectid,
            boringnumber,
            makeDatefromObj(datedrilled),
            gwdepth,
            elevation,
            drillrig,
            loggedby,
            latitude,
            longitude,
            diameter
        );

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (Array.isArray(borings)) {
            projects[projectIndex].borings.push(newBoring);
        } else {
            projects[projectIndex].borings = [newBoring];
        }

        this.props.reduxProjects(projects);
        this.setState({ activeboringid: boringid, longitude: '' });
    }

    handlesamplelink() {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this)
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this)
        const myuser = { userid: 'mazen', engineerid: 'mazen' }
        if (myuser) {
            const engineerid = myuser.engineerid;
            if (this.state.activeboringid) {
                const projectid = this.props.match.params.projectid;
                const boringid = this.state.activeboringid;
                const boring = gfk.getBoringById.call(this, projectid, this.state.activeboringid)

                return (<Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                    to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples`}>
                    Boring {boring.boringnumber} Samples
                </Link>)
            } else {
                return;
            }
        } else {
            return;
        }
    }

    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this);
        const project = gfk.getProjectById.call(this, this.props.match.params.projectid);
        const regularFont = gfk.getRegularFont.call(this)
        const Fields_1 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Boring Number
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getBoringNumber()}
                            onChange={event => { this.handleBoringNumber(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Boring Diameter
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getDiameter()}
                            onChange={event => this.handleDiameter(event.target.value)}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        GW Depth
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getGWDepth()}
                            onChange={event => { this.handleGWDepth(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Surface Elevation
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getElevation()}
                            onChange={event => { this.handleElevation(event.target.value) }}
                        />
                    </div>
                </div>)

            } else {
                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                    Boring Number
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getBoringNumber()}
                                        onChange={event => { this.handleBoringNumber(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                    Boring Diameter
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getDiameter()}
                                        onChange={event => this.handleDiameter(event.target.value)} />
                                </div>
                            </div>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                    GW Depth
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getGWDepth()}
                                        onChange={event => { this.handleGWDepth(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                    Surface Elevation
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getElevation()}
                                        onChange={event => { this.handleElevation(event.target.value) }} />
                                </div>
                            </div>

                        </div>
                    </div>
                )

            }
        }
        const Fields_2 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Drill Rig
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getDrillRig()}
                            onChange={event => { this.handleDrillRig(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Logged By
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getLoggedBy()}
                            onChange={event => { this.handleLoggedBy(event.target.value) }}
                        />
                    </div>

                </div>)
            } else {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                Drill Rig
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getDrillRig()}
                                    onChange={event => { this.handleDrillRig(event.target.value) }} />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                Logged By
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getLoggedBy()}
                                    onChange={event => { this.handleLoggedBy(event.target.value) }}
                                />
                            </div>
                        </div>


                    </div>
                </div>)

            }
        }

        const Fields_3 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Latitude
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getLatitude()}
                            onChange={event => { this.handleLatitude(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Longitude
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getLongitude()}
                            onChange={event => { this.handleLongitude(event.target.value) }} />
                    </div>

                </div>)
            } else {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                Latitude
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getLatitude()}
                                    onChange={event => { this.handleLatitude(event.target.value) }} />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                Longitude
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getLongitude()}
                                    onChange={event => { this.handleLongitude(event.target.value) }}
                                />
                            </div>
                        </div>


                    </div>
                </div>)

            }
        }
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;

        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

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

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/borings`}>
                            /Borings
                        </Link>
                    </div>

                    {Fields_1()}
                    {Fields_2()}
                    {Fields_3()}



                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                        <div style={{ ...styles.flex1, ...regularFont, ...styles.bottomMargin15, ...styles.alignCenter, ...styles.generalFont }}>
                            {this.state.message}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                        <div style={{ ...styles.flex1, ...headerFont, ...styles.bottomMargin15, ...styles.alignCenter, ...styles.boldFont }}>
                            {this.handlesamplelink()}
                        </div>
                    </div>

                    {gfk.showsaveboring.call(this)}

                    {this.showBoringsByProject()}





                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects
    }
}
export default connect(mapStateToProps, actions)(Borings);