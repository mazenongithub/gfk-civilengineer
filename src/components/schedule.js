import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { removeIconSmall, saveSF } from './svg'
import GFK from './gfk';
import { SaveSchedule } from './actions/api'
import MakeID from './makeids'
import { Link } from 'react-router-dom';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";


class Schedule extends Component {
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
            const labor = gfk.getScheduleLaborByID.call(this, projectid, this.state.activelaborid);
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
        project.schedule = project.schedule || { labor: [], costs: [], invoices: [] };
        const laborArr = project.schedule.labor;

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
        activelaborid = makeid.schedulelaborid.call(this, projectid);

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
        project.schedule.labor = laborArr;
        projects[projectIndex] = project;

        this.props.reduxProjects(projects);
        this.setState({ activelaborid });
    }





    showlaborid(labor) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const buttonWidth = { width: '45px' }

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

        return (<div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
            <div style={{ ...styles.flex5, ...activelaborid(labor.laborid) }} onClick={() => { this.makelaboridactive(labor.laborid) }}>
                <span style={{ ...regularFont }}>TimeIn: {formatTime(labor.timein)} </span> <span style={{ ...regularFont }}>Time Out {formatTime(labor.timeout)}</span> <span style={{ ...regularFont }}>{labor.laborrate} </span> <span style={{ ...regularFont }}>{labor.description}</span>
            </div>
            <div style={{ ...styles.flex1 }}>
                <button style={{ ...styles.generalButton, ...buttonWidth }} onClick={() => { this.removeLabor(labor.laborid) }}>{removeIconSmall()}</button>
            </div>
        </div>)
    }


    showlaborids() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const laborids = gfk.getScheduleLaborByProjectID.call(this, projectid)
        console.log(laborids)
        if (Array.isArray(laborids)) {
            return laborids.map(labor => this.showlaborid(labor))
        }

    }

    makecostidactive(costid) {
        this.setState(prevState => {
            // If clicking the same cost, deactivate it
            if (prevState.activecostid === costid) {
                const now = new Date(); // current time
                return {
                    activecostid: false,
                    datein: now
                };
            } else {
                // Otherwise, activate the new costid
                return { activecostid: costid };
            }
        });
    }
    showcostids() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const costids = gfk.getScheduleCostsByProjectID.call(this, projectid)
        if (Array.isArray(costids)) {
            return costids.map(cost => this.showcostid(cost))
        }

    }

    showcostid(cost) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const buttonWidth = { width: '45px' }

        const activecostid = (costid) => {
            if (costid === this.state.activecostid) {
                return (styles.activefieldreport)
            }
        }

        const formatDate = (date) => {
            if (!date) return "";
            const d = date instanceof Date ? date : new Date(date);

            return d.toLocaleDateString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        };

        return (<div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
            <div style={{ ...styles.flex5, ...activecostid(cost.costid) }} onClick={() => { this.makecostidactive(cost.costid) }} >
                <span style={{ ...regularFont }}>Date In: {formatDate(cost.datein)} </span> <span style={{ ...regularFont }}>Quantity {cost.quantity}</span> <span style={{ ...regularFont }}>Unit: {cost.unit} </span> <span style={{ ...regularFont }}>Unit Cost: {cost.unitcost} </span> <span style={{ ...regularFont }}>{cost.description}</span>
            </div>
            <div style={{ ...styles.flex1 }}>
                <button style={{ ...styles.generalButton, ...buttonWidth }} onClick={()=>{this.removeCost(cost.costid)}}>{removeIconSmall()}</button>
            </div>
        </div>)
    }

    removeCost(costid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        const { projectid } = this.props.match.params;

        // Validate project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === -1) return;

        const project = projects[projectIndex];
        const costIndex = gfk.getScheduleCostIndexByID.call(this, projectid, costid);
        if (costIndex === -1) return;

        // Clone for immutability
        const updatedProjects = [...projects];
        const updatedProject = { ...project };
        const updatedSchedule = { ...updatedProject.schedule };
        const updatedCosts = [...updatedSchedule.costs];

        // Remove cost
        updatedCosts.splice(costIndex, 1);

        // Reassign
        updatedSchedule.costs = updatedCosts;
        updatedProject.schedule = updatedSchedule;
        updatedProjects[projectIndex] = updatedProject;

        // Push to Redux
        this.props.reduxProjects(updatedProjects);

        // Reset state
        this.setState({ activecostid: false });
    }



    getCostField(field) {
        const { activecostid } = this.state;
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const costs = gfk.getScheduleCostsByProjectID.call(this, projectid) || [];

        // -------------------------------
        // 1. RETURN EXISTING COST IF ACTIVE
        // -------------------------------
        if (activecostid) {
            const cost = costs.find(c => c.costid === activecostid);
            if (cost) {
                return cost[field] || "";
            }
        }

        // -------------------------------
        // 2. NO ACTIVE COST → DEFAULTS
        // -------------------------------
        if (field === "datein") {
            return this.state.datein || "";
        }

        return "";
    }

    setCostField(field, value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        const { projectid } = this.props.match.params;

        // Clone projects
        const projects = [...this.props.projects];
        const projectIndex = projects.findIndex(p => p.projectid === projectid);

        if (projectIndex === -1) {
            console.error("Project not found:", projectid);
            return;
        }

        const project = { ...projects[projectIndex] };
        const schedule = project.schedule || {};

        // -------------------------------------------------
        // ENSURE costs IS AN ARRAY
        // -------------------------------------------------
        if (!Array.isArray(schedule.costs)) {
            schedule.costs = [];
        }

        let { activecostid } = this.state;

        // Get engineerid
        const user = gfk.getUser.call(this);
        const engineerid = user?.engineerid || "";

        // -------------------------------------------------
        // 1) UPDATE EXISTING COST
        // -------------------------------------------------
        if (activecostid) {
            const costIndex = schedule.costs.findIndex(
                c => c.costid === activecostid
            );

            if (costIndex !== -1) {
                schedule.costs[costIndex][field] = value;

                project.schedule = schedule;
                projects[projectIndex] = project;

                this.props.reduxProjects(projects);
                this.setState({});
                return;
            }
        }

        // -------------------------------------------------
        // 2) CREATE NEW COST ENTRY
        // -------------------------------------------------
        activecostid = makeid.schedulecostid.call(this, projectid);

        const newCost = {
            engineerid,
            costid: activecostid,
            datein: this.state.datein,
            quantity: "",
            unit: "",
            unitcost: "",
            description: ""
        };

        // Apply field being set
        newCost[field] = value;

        // Push into costs array
        schedule.costs.push(newCost);

        // Update redux + state
        project.schedule = schedule;
        projects[projectIndex] = project;

        this.props.reduxProjects(projects);
        this.setState({ activecostid });
    }

    removeLabor(laborid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        const { projectid } = this.props.match.params;

        // Validate project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === -1) return;

        const project = projects[projectIndex];
        const laborIndex = gfk.getScheduleLaborIndexByID.call(this, projectid, laborid);
        if (laborIndex === -1) return;

        // Clone for immutability
        const updatedProjects = [...projects];
        const updatedProject = { ...project };
        const updatedSchedule = { ...updatedProject.schedule };
        const updatedLabor = [...updatedSchedule.labor];

        // Remove labor
        updatedLabor.splice(laborIndex, 1);

        // Reassign
        updatedSchedule.labor = updatedLabor;
        updatedProject.schedule = updatedSchedule;
        updatedProjects[projectIndex] = updatedProject;

        // Push to Redux
        this.props.reduxProjects(updatedProjects);

        // Reset state
        this.setState({ activelaborid: false });
    }




    async saveSchedule() {
        try {
            const gfk = new GFK();
            const { projectid } = this.props.match.params;

            if (!projectid) {
                throw new Error("Project ID is required.");
            }

            const schedule = gfk.getScheduleByProjectID.call(this, projectid);
            const values = { projectid, schedule };

            const projects = gfk.getProjects.call(this);
            const projectIndex = gfk.getProjectKeyById.call(this, projectid);

            if (projectIndex === -1) {
                throw new Error(`Project not found: ${projectid}`);
            }

            const response = await SaveSchedule(values);
            console.log(response)

            if (response.schedule) {
                projects[projectIndex].schedule = response.schedule;
                this.props.reduxProjects(projects);
                this.setState({ message: response.message });
            }

        } catch (err) {
            console.error("Error saving schedule:", err);
            alert(`Error saving schedule: ${err.message}`);
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
        const saveWidth = { width: '20%' }

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
                            to={`/${engineerid}/projects/${projectid}/schedule`}>
                            /schedule
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

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}>{this.state.message} </span>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <button style={{ ...styles.generalButton, ...saveWidth }} onClick={() => { this.saveSchedule() }}>{saveSF()}</button>
                    </div>


                    <div style={{ ...styles.generalContainer }}>
                        {this.showlaborids()}
                    </div>


                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}>Date In</span>
                        </div>
                        <Datetime
                            value={this.getCostField("datein") ? moment(this.getCostField("datein"))
                                : null}
                            onChange={(date) => { this.setCostField("datein", date) }}
                            timeFormat={false}
                            dateFormat="MM/DD/YYYY"
                            inputProps={{
                                style: { ...styles.generalFont, ...regularFont, ...styles.generalField, ...styles.mediumWidth }
                            }} // disables the time picker
                        />
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" value={this.getCostField("quantity")} onChange={(event) => { this.setCostField("quantity", event.target.value) }} style={{ ...styles.generalField, ...regularFont }} />
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                <span style={{ ...regularFont }}>Quantity</span>
                            </div>
                        </div>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" onChange={(event) => { this.setCostField("unit", event.target.value) }} value={this.getCostField("unit")} style={{ ...styles.generalField, ...regularFont }} />
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                <span style={{ ...regularFont }}>Unit</span>
                            </div>
                        </div>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer }}>
                                <input type="text" onChange={(event) => { this.setCostField("unitcost", event.target.value) }} value={this.getCostField("unitcost")} style={{ ...styles.generalField, ...regularFont }} />
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                <span style={{ ...regularFont }}>Unit Cost</span>
                            </div>
                        </div>
                    </div>


                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }} >
                            <input type="text" onChange={(event) => { this.setCostField("description", event.target.value) }} value={this.getCostField("description")} style={{ ...styles.generalField, ...regularFont }} />
                        </div>
                        <div style={{ ...styles.generalContainer, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}>Description</span>
                        </div>
                    </div>

                    {this.showcostids()}

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
export default connect(mapStateToProps, actions)(Schedule);