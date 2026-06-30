import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { addIcon, removeIconSmall, radioIcon, saveSF } from './svg';
import { calculateLaborCost, formatDate, calculateCost, calculateHours } from './functions';
import MakeID from './makeids';
import Datetime from "react-datetime";
import moment from "moment";

class Proposal extends Component {

    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activeproposalid: false, dateproposal: new Date() }
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

    showproposalids() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const proposalids = gfk.getProposalByProjectID.call(this, projectid)

        if (Array.isArray(proposalids)) {
            return proposalids.map(proposal => this.showproposalid(proposal))
        }

    }

    removeProposal(proposalid) {

        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        const { projectid } = this.props.match.params;

        // Validate project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === -1) return;

        const project = projects[projectIndex];
        const proposalIndex = gfk.getProposalIndexByID.call(this, projectid, proposalid);
        if (proposalIndex === -1) return;

        // Clone for immutability
        const updatedProjects = [...projects];
        const updatedProject = { ...project };
        const updatedSchedule = { ...updatedProject.schedule };
        const updatedProposals = [...updatedSchedule.proposals];

        // Remove proposal
        updatedProposals.splice(proposalIndex, 1);

        // Reassign
        updatedSchedule.proposals = updatedProposals;
        updatedProject.schedule = updatedSchedule;
        updatedProjects[projectIndex] = updatedProject;

        // Push to Redux
        this.props.reduxProjects(updatedProjects);

        // Reset state
        this.setState({ activeproposalid: false });


    }

    showproposalid(proposal) {
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const buttonWidth = { width: '45px' }
        const activeBackground = proposalId =>
            this.state.activeproposalid === proposalId ? styles.activefieldreport : null;

        const styles = MyStylesheet();
        return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
            <div style={{ ...styles.flex5, ...activeBackground(proposal.proposalid) }} onClick={() => { this.makeproposalidactive(proposal.proposalid) }}>
                <span style={{ ...regularFont }}>Proposal ID: {proposal.proposalid} {formatDate(proposal.dateproposal)}</span>
            </div>
            <div style={{ ...styles.flex1 }}>
                <button style={{ ...styles.generalButton, ...buttonWidth }} onClick={() => { this.removeProposal(proposal.proposalid) }}>{removeIconSmall()}</button>
            </div>


        </div>)

    }


    makeproposalidactive(proposalid) {
        this.setState(prevState => {
            // If clicking the same proposal, deactivate it
            if (prevState.activeproposalid === proposalid) {
                const now = new Date(); // current time
                return {
                    activeproposalid: false,
                    dateproposal: now
                };
            } else {
                // Otherwise, activate the new proposalid
                return { activeproposalid: proposalid };
            }
        });
    }



    getProposalField(field) {
        const { activeproposalid } = this.state;
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const proposals = gfk.getProposalByProjectID.call(this, projectid) || [];

        // -------------------------------
        // 1. RETURN EXISTING INVOICE IF ACTIVE
        // -------------------------------
        if (activeproposalid) {
            const proposal = proposals.find(c => c.proposalid === activeproposalid);
            if (proposal) {
                return proposal[field] || "";
            }
        }

        // -------------------------------
        // 2. NO ACTIVE INVOICE → DEFAULTS
        // -------------------------------
        if (field === "dateproposal") {
            return this.state.dateproposal || "";
        }

        return "";
    }

    setProposalField(field, value) {

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
        // ENSURE proposals IS AN ARRAY
        // -------------------------------------------------
        if (!Array.isArray(schedule.proposals)) {
            schedule.proposals = [];
        }

        let { activeproposalid } = this.state;



        // -------------------------------------------------
        // 1) UPDATE EXISTING INVOICE
        // -------------------------------------------------
        if (activeproposalid) {
            const proposalIndex = schedule.proposals.findIndex(
                c => c.proposalid === activeproposalid
            );

            if (proposalIndex !== -1) {
                schedule.proposals[proposalIndex][field] = value;

                project.schedule = schedule;
                projects[projectIndex] = project;

                this.props.reduxProjects(projects);
                this.setState({});
                return;
            }
        }

        // -------------------------------------------------
        // 2) CREATE NEW INVOICE ENTRY
        // -------------------------------------------------
        activeproposalid = makeid.proposalid.call(this, projectid);

        const newProposal = {

            proposalid: activeproposalid,
            dateproposal: this.state.dateproposal,
            costs: [],
            labor: [],
            status: "Draft",
            dateapproved: null,
            approvedby: null,
            comments: null,
            proposalnumber: null
        };

        // Apply field being set
        newProposal[field] = value;

        // Push into proposals array
        schedule.proposals.push(newProposal);

        // Update redux + state
        project.schedule = schedule;
        projects[projectIndex] = project;

        this.props.reduxProjects(projects);
        this.setState({ activeproposalid });
    }

    createProposal() {

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
        // ENSURE proposals IS AN ARRAY
        // -------------------------------------------------
        if (!Array.isArray(schedule.proposals)) {
            schedule.proposals = [];
        }


        const activeproposalid = makeid.proposalid.call(this, projectid);

        const newProposal = {

            proposalid: activeproposalid,
            dateproposal: this.state.dateproposal,
            costs: [],
            labor: [],
            status: "Draft",
            dateapproved: null,
            approvedby: null,
            comments: null,
            proposalnumber: null
        };



        // Push into proposals array
        schedule.proposals.push(newProposal);

        // Update redux + state
        project.schedule = schedule;
        projects[projectIndex] = project;

        this.props.reduxProjects(projects);
        this.setState({ activeproposalid });

    }
    updateProposalLabor(laborId) {

        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);

        const proposalId = this.state.activeproposalid;
        const proposal = gfk.getProposalByID.call(this, projectid, proposalId);
        if (!proposal) return;

        const proposalIndex = gfk.getProposalIndexByID.call(this, projectid, proposalId);
        if (!Array.isArray(proposal.labor)) return;

        const laborList = projects[projectIndex].schedule.proposals[proposalIndex].labor;
        const hasLabor = laborList.includes(laborId);

        if (hasLabor) {
            // Safely remove the labor string
            projects[projectIndex].schedule.proposals[proposalIndex].labor =
                laborList.filter(id => id !== laborId);
        } else {
            laborList.push(laborId);
        }


        this.props.reduxProjects(projects);
        this.setState({ render: 'render' });
    }


    updateProposalCost(costId) {

        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);

        const proposalId = this.state.activeproposalid;
        const proposal = gfk.getProposalByID.call(this, projectid, proposalId);
        if (!proposal) return;

        const proposalIndex = gfk.getProposalIndexByID.call(this, projectid, proposalId);
        if (!Array.isArray(proposal.costs)) return;

        const costList = projects[projectIndex].schedule.proposals[proposalIndex].costs;
        const hasCosts = costList.includes(costId);

        if (hasCosts) {
            // Safely remove the cost string
            projects[projectIndex].schedule.proposals[proposalIndex].costs =
                costList.filter(id => id !== costId);
        } else {
            costList.push(costId);
        }


        this.props.reduxProjects(projects);
        this.setState({ render: 'render' });
    }


    getLaborFill(laborId) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const proposalId = this.state.activeproposalid;

        const proposal = gfk.getProposalByID.call(this, projectid, proposalId);

        if (!proposal || !Array.isArray(proposal.labor)) return { fill: "#ffffff" }

        const found = proposal.labor.includes(laborId);

        return { fill: found ? "#aa2036" : "#ffffff" };
    }

    getCostFill(costId) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const proposalId = this.state.activeproposalid;

        const proposal = gfk.getProposalByID.call(this, projectid, proposalId);

        if (!proposal || !Array.isArray(proposal.costs)) return { fill: "#ffffff" }

        const found = proposal.costs.includes(costId);

        return { fill: found ? "#aa2036" : "#ffffff" };
    }



    showlaborid(labor) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const iconWidth = { width: '54px' }



        const formatTime = (date) => {
            if (!date) return "";
            // Ensure it's a Date object
            const d = date instanceof Date ? date : new Date(date);
            // Returns time like "4:30 PM"
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (<div style={{ ...styles.generalFlex, ...styles.generalFont, ...styles.bottomMargin15 }}>
            <div style={{ ...styles.flex1 }}>
                <button onClick={() => { this.updateProposalLabor(labor.laborid) }} style={{ ...styles.generalButton, ...iconWidth, ...this.getLaborFill(labor.laborid) }}>{radioIcon()}</button>
            </div>
            <div style={{ ...styles.flex5 }}>
                <span style={{ ...regularFont }}>TimeIn: {formatTime(labor.timein)} </span> <span style={{ ...regularFont }}>Time Out {formatTime(labor.timeout)}</span> L <span style={{ ...regularFont }}> Labor Rate: ${labor.laborrate}/hour </span> <span style={{ ...regularFont }}> Total Hours: {calculateHours(labor.timein, labor.timeout)}</span> <span style={{ ...regularFont }}>Total: ${calculateLaborCost(labor.timein, labor.timeout, labor.laborrate)}</span> <span style={{ ...regularFont }}>{labor.description}</span>
            </div>
        </div>)
    }


    showlaborids() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const laborids = gfk.getScheduleLaborByProjectID.call(this, projectid)
        if (Array.isArray(laborids)) {
            return laborids.map(labor => this.showlaborid(labor))
        }

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
        const iconWidth = { width: '54px' }



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
            <div style={{ ...styles.flex1 }} >
                <button onClick={() => { this.updateProposalCost(cost.costid) }} style={{ ...styles.generalButton, ...iconWidth, ...this.getCostFill(cost.costid) }}>{radioIcon()}</button>
            </div>
            <div style={{ ...styles.flex5 }}>
                <span style={{ ...regularFont }}>Date In: {formatDate(cost.datein)} </span> <span style={{ ...regularFont }}>Quantity {cost.quantity}</span> <span style={{ ...regularFont }}>Unit: {cost.unit} </span> <span style={{ ...regularFont }}>Unit Cost: {cost.unitcost} </span> <span style={{ ...regularFont }}>Cost: ${calculateCost(cost.quantity, cost.unitcost)} </span> <span style={{ ...regularFont }}>{cost.description}</span>
            </div>
        </div>)
    }

    getProposalTotal() {
        const gfk = new GFK();
        let total = 0;

        const { projectid } = this.props.match.params;
        const proposalId = this.state.activeproposalid;

        const proposal = gfk.getProposalByID.call(this, projectid, proposalId);
        if (!proposal) return total;

        // ---- Labor Costs ----
        if (Array.isArray(proposal.labor)) {
            proposal.labor.forEach(laborId => {
                const labor = gfk.getScheduleLaborByID.call(this, projectid, laborId);
                if (!labor) return;

                // calculateLaborCost should return a number (total cost)
                total += calculateLaborCost(labor.timein, labor.timeout, labor.laborrate);
            });
        }

        // ---- Other Costs ----
        if (Array.isArray(proposal.costs)) {
            proposal.costs.forEach(costId => {
                const cost = gfk.getScheduleCostByID.call(this, projectid, costId);
                if (!cost) return;

                total += calculateCost(cost.quantity, cost.unitcost);
            });
        }

        return total;
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
        const addIconWidth = { width: '54px' }
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
                            to={`/${engineerid}/projects/${projectid}/proposal`}>
                            /proposal
                        </Link>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1 }}>
                            <button style={{ ...styles.generalButton, ...addIconWidth }} onClick={() => { this.createProposal() }}>{addIcon()}</button>
                        </div>

                        <div style={{ ...styles.flex5, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}>Create An Proposal</span>
                        </div>

                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}><u>Proposals </u></span>
                    </div>




                    {this.showproposalids()}


                    <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                        <span style={{ ...regularFont }}>Date Proposal</span>

                    </div>
                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

                        <Datetime
                            value={this.getProposalField("dateproposal") ? moment(this.getProposalField("dateproposal"))
                                : null}
                            onChange={(date) => { this.setProposalField("dateproposal", date) }}
                            timeFormat={false}
                            dateFormat="MM/DD/YYYY"
                            inputProps={{
                                style: { ...styles.generalFont, ...regularFont, ...styles.generalField, ...styles.mediumWidth }
                            }} // disables the time picker
                        />
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>
                            <span style={{ ...regularFont }}><u>Add to Proposal</u></span>
                        </div>

                        <div style={{ ...styles.flex5 }}>

                            <span style={{ ...regularFont }}><u>Labor </u></span>
                        </div>

                    </div>


                    {this.showlaborids()}


                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>
                            <span style={{ ...regularFont }}><u>Add to Proposal</u></span>
                        </div>

                        <div style={{ ...styles.flex5 }}>

                            <span style={{ ...regularFont }}><u>Costs </u></span>
                        </div>

                    </div>

                    {this.showcostids()}

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex4 }}>
                            &nbsp;</div>
                        <div style={{ ...styles.flex1, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}><u>Proposal Total: </u></span>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}><u>${this.getProposalTotal()}</u></span>
                        </div>

                    </div>


                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}>{this.state.message} </span>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <button style={{ ...styles.generalButton, ...saveWidth }} onClick={() => { gfk.saveSchedule.call(this) }}>{saveSF()}</button>
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

export default connect(mapStateToProps, actions)(Proposal);
