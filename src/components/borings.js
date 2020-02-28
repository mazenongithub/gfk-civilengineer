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
    showboringsbyproject() {
        const gfk = new GFK();
        const borings = gfk.getboringsbyprojectid.call(this, this.props.match.params.projectid)
        let boringids = [];
        if (borings.length > 0) {
            // eslint-disable-next-line
            borings.map(boring => {
                boringids.push(this.showboringid(boring))
            })
        }
        return boringids;
    }
    makeboringactive(boringid) {
        console.log(boringid)
        if (this.state.activeboringid === boringid) {
            this.setState({ activeboringid: false })
        } else {
            this.setState({ activeboringid: boringid })
        }
    }
    validateremoveboring(boring) {
        const gfk = new GFK();
        const samples = gfk.getsamples.call(this);
        let validate = {};
        validate.validate = true;
        validate.message = "";
        if (samples.length > 0) {
            // eslint-disable-next-line
            samples.map(sample => {
                if (sample.boringid === boring.boringid) {
                    validate.validate = false;
                    validate.message = `Could not Delete Boring ${boring.boringnumber} Delete Samples First`
                }
            })
        }
        return validate;
    }
    removeboringid(boring) {
        if (window.confirm(`Are you sure you want to delete boring number ${boring.boringnumber}?`)) {
            const gfk = new GFK();
            const myuser = gfk.getuser.call(this)
            const validate = this.validateremoveboring(boring);
            if (validate.validate) {
                const i = gfk.getboringkeybyid.call(this, boring.boringid);
                myuser.borings.boring.splice(i, 1);
                this.props.reduxUser(myuser);
                this.setState({ activeboringid: false })

            } else {
                this.setState({ message: validate.message })
            }
        }

    }
    showboringid(boring) {
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
            <div style={{ ...styles.generalFont, ...styles.generalContainer, ...regularFont, ...styles.bottomMargin15 }} key={boring.boringid}>
                <span onClick={() => { this.makeboringactive(boring.boringid) }} style={{ ...activebackground() }}>BoringID: {boring.boringid} DateDrilled:{boring.datedrilled} Number:{boring.boringnumber} Diameter:{boring.diameter} Elevation: {boring.elevation} Drill Rig:{boring.drillrig} LoggedBy: {boring.loggedby} Latitude: {boring.latitude} Longitude: {boring.longitude}</span>
                <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removeboringid(boring) }}>
                    {removeIconSmall()}
                </button>
            </div>
        )

    }
    getboringnumber() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.boringnumber;
        } else {
            return this.state.boringnumber;

        }
    }
    handleboringnumber(boringnumber) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].boringnumber = boringnumber;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const gwdepth = this.state.gwdepth;
                const elevation = this.state.elevation;
                const drillrig = this.state.drillrig;
                const loggedby = this.state.loggedby;
                const latitude = this.state.latitude;
                const longitude = this.state.longitude;
                const diameter = this.state.diameter;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, boringnumber: '' })

            }
        }
    }

    getdiameter() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.diameter;
        } else {
            return this.state.diameter;

        }
    }
    handlediameter(diameter) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].diameter = diameter;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const gwdepth = this.state.gwdepth;
                const elevation = this.state.elevation;
                const drillrig = this.state.drillrig;
                const loggedby = this.state.loggedby;
                const latitude = this.state.latitude;
                const longitude = this.state.longitude;
                const boringnumber = this.state.boringnumber;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, diameter: '' })

            }
        }
    }

    getgwdepth() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.gwdepth;
        } else {
            return this.state.gwdepth;

        }
    }
    handlegwdepth(gwdepth) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].gwdepth = gwdepth;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const diameter = this.state.diameter;
                const elevation = this.state.elevation;
                const drillrig = this.state.drillrig;
                const loggedby = this.state.loggedby;
                const latitude = this.state.latitude;
                const longitude = this.state.longitude;
                const boringnumber = this.state.boringnumber;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, gwdepth: '' })

            }
        }
    }

    getelevation() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.elevation;
        } else {
            return this.state.elevation;

        }
    }
    handleelevation(elevation) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].elevation = elevation;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const diameter = this.state.diameter;
                const gwdepth = this.state.gwdepth;
                const drillrig = this.state.drillrig;
                const loggedby = this.state.loggedby;
                const latitude = this.state.latitude;
                const longitude = this.state.longitude;
                const boringnumber = this.state.boringnumber;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, elevation: '' })

            }
        }
    }

    getdrillrig() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.drillrig;
        } else {
            return this.state.drillrig;

        }
    }
    handledrillrig(drillrig) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].drillrig = drillrig;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const diameter = this.state.diameter;
                const gwdepth = this.state.gwdepth;
                const elevation = this.state.elevation;
                const loggedby = this.state.loggedby;
                const latitude = this.state.latitude;
                const longitude = this.state.longitude;
                const boringnumber = this.state.boringnumber;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, drillrig: '' })

            }
        }
    }
    getloggedby() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.loggedby;
        } else {
            return this.state.loggedby;

        }
    }
    handleloggedby(loggedby) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].loggedby = loggedby;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const diameter = this.state.diameter;
                const gwdepth = this.state.gwdepth;
                const elevation = this.state.elevation;
                const drillrig = this.state.drillrig;
                const latitude = this.state.latitude;
                const longitude = this.state.longitude;
                const boringnumber = this.state.boringnumber;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, loggedby: '' })

            }
        }
    }
    getlatitude() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.latitude;
        } else {
            return this.state.latitude;

        }
    }
    handlelatitude(latitude) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].latitude = latitude;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const diameter = this.state.diameter;
                const gwdepth = this.state.gwdepth;
                const elevation = this.state.elevation;
                const drillrig = this.state.drillrig;
                const loggedby = this.state.loggedby;
                const longitude = this.state.longitude;
                const boringnumber = this.state.boringnumber;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, latitude: '' })

            }
        }
    }
    getlongitude() {
        const gfk = new GFK();
        if (this.state.activeboringid) {
            const boring = gfk.getboringbyid.call(this, this.state.activeboringid)
            return boring.longitude;
        } else {
            return this.state.longitude;

        }
    }
    handlelongitude(longitude) {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {

            if (this.state.activeboringid) {
                const i = gfk.getboringkeybyid.call(this, this.state.activeboringid);
                myuser.borings.boring[i].longitude = longitude;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const boringid = makeID(8);
                const datedrilled = makeDatefromObj(this.state.datedrilled);
                const diameter = this.state.diameter;
                const gwdepth = this.state.gwdepth;
                const elevation = this.state.elevation;
                const drillrig = this.state.drillrig;
                const loggedby = this.state.loggedby;
                const latitude = this.state.latitude;
                const boringnumber = this.state.boringnumber;
                const projectid = this.props.match.params.projectid;
                const newBoring = Boring(boringid, projectid, boringnumber, datedrilled, gwdepth, elevation, drillrig, loggedby, latitude, longitude, diameter)
                const borings = gfk.getborings.call(this)
                if (borings) {
                    myuser.borings.boring.push(newBoring)
                } else {
                    myuser.borings = { boring: [newBoring] }
                }
                this.props.reduxUser(myuser)
                this.setState({ activeboringid: boringid, longitude: '' })

            }
        }
    }
    handlesamplelink() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this)
        if (myuser) {
            const engineerid = myuser.engineerid;
            if (this.state.activeboringid) {
                const projectid = this.props.match.params.projectid;
                const boringid = this.state.activeboringid;
                const boring = gfk.getboringbyid.call(this, this.state.activeboringid)

                return (<Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                    to={`/${engineerid}/gfk/projects/${projectid}/borings/${boringid}/samples`}>
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
        const project = gfk.getprojectbyid.call(this, this.props.match.params.projectid);
        const regularFont = gfk.getRegularFont.call(this)
        const Fields_1 = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}
                        value={this.getboringnumber()}
                        onChange={event => { this.handleboringnumber(event.target.value) }}>
                        Boring Number
                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Boring Diameter
                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getdiameter()}
                            onChange={event => this.handlediameter(event.target.value)}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        GW Depth
                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getgwdepth()}
                            onChange={event => { this.handlegwdepth(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Surface Elevation
                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getelevation()}
                            onChange={event => { this.handleelevation(event.target.value) }}
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
                                        value={this.getboringnumber()}
                                        onChange={event => { this.handleboringnumber(event.target.value) }}
                                    />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                    Boring Diameter
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getdiameter()}
                                        onChange={event => this.handlediameter(event.target.value)} />
                                </div>
                            </div>

                            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                    GW Depth
                                    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getgwdepth()}
                                        onChange={event => { this.handlegwdepth(event.target.value) }} />
                                </div>
                                <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                    Surface Elevation
                                     <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                        value={this.getelevation()}
                                        onChange={event => { this.handleelevation(event.target.value) }} />
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
                            value={this.getdrillrig()}
                            onChange={event => { this.handledrillrig(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Logged By
    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getloggedby()}
                            onChange={event => { this.handleloggedby(event.target.value) }}
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
                                    value={this.getdrillrig()}
                                    onChange={event => { this.handledrillrig(event.target.value) }} />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                Logged By
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getloggedby()}
                                    onChange={event => { this.handleloggedby(event.target.value) }}
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
                            value={this.getlatitude()}
                            onChange={event => { this.handlelatitude(event.target.value) }} />
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                        Longitude
    <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                            value={this.getlongitude()}
                            onChange={event => { this.handlelongitude(event.target.value) }} />
                    </div>

                </div>)
            } else {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                Latitude
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getlatitude()}
                                    onChange={event => { this.handlelatitude(event.target.value) }} />
                            </div>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter, ...styles.addLeftMargin }}>
                                Longitude
                                <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.alignCenter }}
                                    value={this.getlongitude()}
                                    onChange={event => { this.handlelongitude(event.target.value) }}
                                />
                            </div>
                        </div>


                    </div>
                </div>)

            }
        }

        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter, ...headerFont, ...styles.boldFont }}>
                            Project Number {project.projectnumber} /{project.title} <br />
                            {project.address} {project.city} <br />
                            Borings
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                        <div style={{ ...styles.flex1, ...regularFont, ...styles.bottomMargin15 }}>
                            Date
                        </div>
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

                    {this.showboringsbyproject()}





                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(Borings);