import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { removeIconSmall, savetimeicon } from './svg'
import GFK from './gfk';
import { SaveTime } from './actions/api'
import MakeID from './makeids'
import { Link } from 'react-router-dom';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

class Timesheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '', width: 0, height: 0, activelaborid: false, description: '', traveltimein: 0, traveltimeout: 0, timein: new Date(),
            timeout: new Date(new Date().getTime() + (1000 * 60 * 60)),
            datetime: new Date()
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


    handleChange(date) {

        if (!date) {
            // User cleared the field
            this.setState({ datetime: null });
            if (this.props.onChange) this.props.onChange(null);
            return;
        }

        let jsDate;

        // Check if date is a Moment object
        if (date._isAMomentObject) {
            // Convert to JS Date in UTC
            jsDate = date.toDate();
        } else if (typeof date === "string") {
            // Parse string manually
            const parsed = moment(date, "YYYY-MM-DD HH:mm", true);
            if (!parsed.isValid()) {
                console.warn("Invalid date entered:", date);
                return;
            }
            jsDate = parsed.toDate();
        } else {
            console.warn("Unexpected value:", date);
            return;
        }

        // Save in local state
        this.setState({ datetime: jsDate });

        // Call optional parent callback
        if (this.props.onChange) this.props.onChange(jsDate);

        console.log("Selected JS Date:", jsDate);
    };

    makelaboridactive(laborid) {
        this.setState(prevState => {
            // If clicking the same labor, deactivate it
            if (prevState.activelaborid === laborid) {
                const now = new Date(); // current time
                return {
                    activelaborid: false,
                    timein: now,
                    timeout: now
                };
            } else {
                // Otherwise, activate the new laborid
                return { activelaborid: laborid };
            }
        });
    }


    // GETTER FUNCTION
    getLaborField(field) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        // If there is an active labor, get its value
        if (this.state.activelaborid) {
            const labor = gfk.getLaborByID.call(this, projectid, this.state.activelaborid);
            if (labor) return labor[field] || "";
        }

        // No active labor — return current state value for timein/timeout
        if (field === "timein" && this.state.timein) return this.state.timein;
        if (field === "timeout" && this.state.timeout) return this.state.timeout;

        // Other fields default to blank
        return "";
    }


    // SETTER FUNCTION
    setLaborField(field, value) {
        const { projectid } = this.props.match.params;
        const gfk = new GFK();
        const makeid = new MakeID();

        const projects = [...this.props.projects];
        const projectIndex = projects.findIndex(p => p.projectid === projectid);
        if (projectIndex === -1) return console.error("Project not found:", projectid);

        const project = { ...projects[projectIndex] };
        project.timesheet = project.timesheet || { labor: [], costs: [], invoices: [] };
        const laborArr = project.timesheet.labor;

        let { activelaborid } = this.state;
        const engineerid = gfk.getUser.call(this)?.engineerid || "";



        // 1) Update existing labor
        if (activelaborid) {
            const laborIndex = laborArr.findIndex(l => l.laborid === activelaborid);
            if (laborIndex !== -1) {
                laborArr[laborIndex][field] = value;
                projects[projectIndex] = project;
                this.props.reduxProjects(projects);
                this.setState({});
                return;
            }
        }

        // 2) Create new labor
        activelaborid = makeid.laborid.call(this, projectid);

        const newLabor = {
            laborid: activelaborid,
            engineerid,
            timein: this.state.timein || new Date(),
            timeout: this.state.timeout || new Date(),
            laborrate: "",
            description: ""
        };

        newLabor[field] = value;

        laborArr.push(newLabor);
        project.timesheet.labor = laborArr;
        projects[projectIndex] = project;

        this.props.reduxProjects(projects);
        this.setState({ activelaborid });
    }





    showlaborid(labor) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)

        const activelaborid = (laborid) => {
            if (laborid === this.state.activelaborid) {
                return (styles.activefieldreport)
            }
        }

        const formatTime = (date) => {
            if (!date) return "";
            // Ensure it's a Date object
            const d = date instanceof Date ? date : new Date(date);
            // Returns time like "4:30 PM"
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (<div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15, ...activelaborid(labor.laborid) }} onClick={() => { this.makelaboridactive(labor.laborid) }}>
            <span style={{ ...regularFont }}>TimeIn: {formatTime(labor.timein)} </span> <span style={{ ...regularFont }}>Time Out {formatTime(labor.timeout)}</span> <span style={{ ...regularFont }}>{labor.laborrate} </span> <span style={{ ...regularFont }}>{labor.description}</span>
        </div>)
    }


    showlaborids() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const laborids = gfk.getLaborByProjectID.call(this, projectid)
        if (Array.isArray(laborids)) {
            return laborids.map(labor => this.showlaborid(labor))
        }

    }



    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;
        const regularFont = gfk.getRegularFont.call(this)
        const headerFont = gfk.getHeaderFont.call(this)
        const project = gfk.getProjectById.call(this, projectid)

        if (project) {

            return (
                <div style={{ ...styles.generalContainer }}>
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/profile`}>
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
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}`}>
                            /{project.projectnumber} - {project.title}
                        </Link>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/timesheet`}>
                            /timesheet
                        </Link>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                                <span style={{ ...regularFont }}>Time In</span>
                            </div>
                            <Datetime
                                value={this.getLaborField("timein")
                                    ? moment(this.getLaborField("timein"))
                                    : null}
                                onChange={(date) => this.setLaborField("timein", date)}
                                dateFormat="MM/DD/YYYY"
                                timeFormat="hh:mm A"
                                inputProps={{
                                    style: { ...styles.generalFont, ...regularFont, ...styles.generalField }
                                }}
                            />
                        </div>
                        <div style={{ ...styles.flex1 }}>

                            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                                <span style={{ ...regularFont }}>Time Out</span>
                            </div>

                            <Datetime
                                value={this.getLaborField("timeout")
                                    ? moment(this.getLaborField("timeout"))
                                    : null}
                                onChange={(date) => this.setLaborField("timeout", date)}
                                dateFormat="MM/DD/YYYY"
                                timeFormat="hh:mm A"
                                inputProps={{
                                    style: { ...styles.generalFont, ...regularFont, ...styles.generalField }
                                }}
                            /></div>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <input type="text" style={{ ...styles.mediumWidth, ...regularFont }}
                            value={this.getLaborField("laborrate")}
                            onChange={(event) => { this.setLaborField("laborrate", event.target.value) }} />
                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Labor Rate</span>
                        </div>
                    </div>


                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <input type="text" style={{ ...styles.mediumWidth, ...regularFont }}
                            value={this.getLaborField("description")}
                            onChange={(event) => { this.setLaborField("description", event.target.value) }} />
                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...regularFont }}>Description</span>
                        </div>
                    </div>

                    <div style={{ ...styles.generalContainer }}>
                        {this.showlaborids()}
                    </div>

                </div>)

        } else {
            return (<div style={{ ...styles.generalContainer, ...styles.generalFont }}>
                <span style={{ ...regularFont }}>Project Not Found</span>
            </div>)
        }


    }
}
function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects,
        company: state.company
    }
}
export default connect(mapStateToProps, actions)(Timesheet);