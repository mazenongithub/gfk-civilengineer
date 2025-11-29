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

class Invoice extends Component {

    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activeinvoiceid: false, dateinvoice: new Date() }
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

    showinvoiceids() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const invoiceids = gfk.getInvoiceByProjectID.call(this, projectid)

        if (Array.isArray(invoiceids)) {
            return invoiceids.map(invoice => this.showinvoiceid(invoice))
        }

    }

    removeInvoice(invoiceid) {

        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        const { projectid } = this.props.match.params;

        // Validate project
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        if (projectIndex === -1) return;

        const project = projects[projectIndex];
        const invoiceIndex = gfk.getInvoiceIndexByID.call(this, projectid, invoiceid);
        if (invoiceIndex === -1) return;

        // Clone for immutability
        const updatedProjects = [...projects];
        const updatedProject = { ...project };
        const updatedTimesheet = { ...updatedProject.timesheet };
        const updatedInvoices = [...updatedTimesheet.invoices];

        // Remove invoice
        updatedInvoices.splice(invoiceIndex, 1);

        // Reassign
        updatedTimesheet.invoices = updatedInvoices;
        updatedProject.timesheet = updatedTimesheet;
        updatedProjects[projectIndex] = updatedProject;

        // Push to Redux
        this.props.reduxProjects(updatedProjects);

        // Reset state
        this.setState({ activeinvoiceid: false });


    }

    showinvoiceid(invoice) {
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const buttonWidth = { width: '45px' }
        const activeBackground = invoiceId =>
            this.state.activeinvoiceid === invoiceId ? styles.activefieldreport : null;

        const styles = MyStylesheet();
        return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
            <div style={{ ...styles.flex5, ...activeBackground(invoice.invoiceid) }} onClick={() => { this.makeinvoiceidactive(invoice.invoiceid) }}>
                <span style={{ ...regularFont }}>Invoice ID: {invoice.invoiceid} {formatDate(invoice.dateinvoice)}</span>
            </div>
            <div style={{ ...styles.flex1 }}>
                <button style={{ ...styles.generalButton, ...buttonWidth }} onClick={() => { this.removeInvoice(invoice.invoiceid) }}>{removeIconSmall()}</button>
            </div>


        </div>)

    }


    makeinvoiceidactive(invoiceid) {
        this.setState(prevState => {
            // If clicking the same invoice, deactivate it
            if (prevState.activeinvoiceid === invoiceid) {
                const now = new Date(); // current time
                return {
                    activeinvoiceid: false,
                    dateinvoice: now
                };
            } else {
                // Otherwise, activate the new invoiceid
                return { activeinvoiceid: invoiceid };
            }
        });
    }



    getInvoiceField(field) {
        const { activeinvoiceid } = this.state;
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const invoices = gfk.getInvoiceByProjectID.call(this, projectid) || [];

        // -------------------------------
        // 1. RETURN EXISTING INVOICE IF ACTIVE
        // -------------------------------
        if (activeinvoiceid) {
            const invoice = invoices.find(c => c.invoiceid === activeinvoiceid);
            if (invoice) {
                return invoice[field] || "";
            }
        }

        // -------------------------------
        // 2. NO ACTIVE INVOICE → DEFAULTS
        // -------------------------------
        if (field === "dateinvoice") {
            return this.state.dateinvoice || "";
        }

        return "";
    }

    setInvoiceField(field, value) {

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
        const timesheet = project.timesheet || {};

        // -------------------------------------------------
        // ENSURE invoices IS AN ARRAY
        // -------------------------------------------------
        if (!Array.isArray(timesheet.invoices)) {
            timesheet.invoices = [];
        }

        let { activeinvoiceid } = this.state;



        // -------------------------------------------------
        // 1) UPDATE EXISTING INVOICE
        // -------------------------------------------------
        if (activeinvoiceid) {
            const invoiceIndex = timesheet.invoices.findIndex(
                c => c.invoiceid === activeinvoiceid
            );

            if (invoiceIndex !== -1) {
                timesheet.invoices[invoiceIndex][field] = value;

                project.timesheet = timesheet;
                projects[projectIndex] = project;

                this.props.reduxProjects(projects);
                this.setState({});
                return;
            }
        }

        // -------------------------------------------------
        // 2) CREATE NEW INVOICE ENTRY
        // -------------------------------------------------
        activeinvoiceid = makeid.invoiceid.call(this, projectid);

        const newInvoice = {

            invoiceid: activeinvoiceid,
            dateinvoice: this.state.dateinvoice,
            costs: [],
            labor: [],
            transactionid: ""
        };

        // Apply field being set
        newInvoice[field] = value;

        // Push into invoices array
        timesheet.invoices.push(newInvoice);

        // Update redux + state
        project.timesheet = timesheet;
        projects[projectIndex] = project;

        this.props.reduxProjects(projects);
        this.setState({ activeinvoiceid });
    }

    createInvoice() {

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
        const timesheet = project.timesheet || {};

        // -------------------------------------------------
        // ENSURE invoices IS AN ARRAY
        // -------------------------------------------------
        if (!Array.isArray(timesheet.invoices)) {
            timesheet.invoices = [];
        }


        const activeinvoiceid = makeid.invoiceid.call(this, projectid);

        const newInvoice = {

            invoiceid: activeinvoiceid,
            dateinvoice: this.state.dateinvoice,
            costs: [],
            labor: [],
            transactionid: ""
        };



        // Push into invoices array
        timesheet.invoices.push(newInvoice);

        // Update redux + state
        project.timesheet = timesheet;
        projects[projectIndex] = project;

        this.props.reduxProjects(projects);
        this.setState({ activeinvoiceid });

    }
    updateInvoiceLabor(laborId) {

        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);

        const invoiceId = this.state.activeinvoiceid;
        const invoice = gfk.getInvoiceByID.call(this, projectid, invoiceId);
        if (!invoice) return;

        const invoiceIndex = gfk.getInvoiceIndexByID.call(this, projectid, invoiceId);
        if (!Array.isArray(invoice.labor)) return;

        const laborList = projects[projectIndex].timesheet.invoices[invoiceIndex].labor;
        const hasLabor = laborList.includes(laborId);

        if (hasLabor) {
            // Safely remove the labor string
            projects[projectIndex].timesheet.invoices[invoiceIndex].labor =
                laborList.filter(id => id !== laborId);
        } else {
            laborList.push(laborId);
        }


        this.props.reduxProjects(projects);
        this.setState({ render: 'render' });
    }


    updateInvoiceCost(costId) {

        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const projects = gfk.getProjects.call(this);
        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, projectid);

        const invoiceId = this.state.activeinvoiceid;
        const invoice = gfk.getInvoiceByID.call(this, projectid, invoiceId);
        if (!invoice) return;

        const invoiceIndex = gfk.getInvoiceIndexByID.call(this, projectid, invoiceId);
        if (!Array.isArray(invoice.costs)) return;

        const costList = projects[projectIndex].timesheet.invoices[invoiceIndex].costs;
        const hasCosts = costList.includes(costId);

        if (hasCosts) {
            // Safely remove the cost string
            projects[projectIndex].timesheet.invoices[invoiceIndex].costs =
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
        const invoiceId = this.state.activeinvoiceid;

        const invoice = gfk.getInvoiceByID.call(this, projectid, invoiceId);

        if (!invoice || !Array.isArray(invoice.labor)) return { fill: "#ffffff" }

        const found = invoice.labor.includes(laborId);

        return { fill: found ? "#aa2036" : "#ffffff" };
    }

    getCostFill(costId) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const invoiceId = this.state.activeinvoiceid;

        const invoice = gfk.getInvoiceByID.call(this, projectid, invoiceId);

        if (!invoice || !Array.isArray(invoice.costs)) return { fill: "#ffffff" }

        const found = invoice.costs.includes(costId);

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
                <button onClick={() => { this.updateInvoiceLabor(labor.laborid) }} style={{ ...styles.generalButton, ...iconWidth, ...this.getLaborFill(labor.laborid) }}>{radioIcon()}</button>
            </div>
            <div style={{ ...styles.flex5 }}>
                <span style={{ ...regularFont }}>TimeIn: {formatTime(labor.timein)} </span> <span style={{ ...regularFont }}>Time Out {formatTime(labor.timeout)}</span> L <span style={{ ...regularFont }}> Labor Rate: ${labor.laborrate}/hour </span> <span style={{ ...regularFont }}> Total Hours: {calculateHours(labor.timein, labor.timeout)}</span> <span style={{ ...regularFont }}>Total: ${calculateLaborCost(labor.timein, labor.timeout, labor.laborrate)}</span> <span style={{ ...regularFont }}>{labor.description}</span>
            </div>
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

    showcostids() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const costids = gfk.getCostsByProjectID.call(this, projectid)
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
                <button onClick={() => { this.updateInvoiceCost(cost.costid) }} style={{ ...styles.generalButton, ...iconWidth, ...this.getCostFill(cost.costid) }}>{radioIcon()}</button>
            </div>
            <div style={{ ...styles.flex5 }}>
                <span style={{ ...regularFont }}>Date In: {formatDate(cost.datein)} </span> <span style={{ ...regularFont }}>Quantity {cost.quantity}</span> <span style={{ ...regularFont }}>Unit: {cost.unit} </span> <span style={{ ...regularFont }}>Unit Cost: {cost.unitcost} </span> <span style={{ ...regularFont }}>Cost: ${calculateCost(cost.quantity, cost.unitcost)} </span> <span style={{ ...regularFont }}>{cost.description}</span>
            </div>
        </div>)
    }

    getInvoiceTotal() {
        const gfk = new GFK();
        let total = 0;

        const { projectid } = this.props.match.params;
        const invoiceId = this.state.activeinvoiceid;

        const invoice = gfk.getInvoiceByID.call(this, projectid, invoiceId);
        if (!invoice) return total;

        // ---- Labor Costs ----
        if (Array.isArray(invoice.labor)) {
            invoice.labor.forEach(laborId => {
                const labor = gfk.getLaborByID.call(this, projectid, laborId);
                if (!labor) return;

                // calculateLaborCost should return a number (total cost)
                total += calculateLaborCost(labor.timein, labor.timeout, labor.laborrate);
            });
        }

        // ---- Other Costs ----
        if (Array.isArray(invoice.costs)) {
            invoice.costs.forEach(costId => {
                const cost = gfk.getCostByID.call(this, projectid, costId);
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
                            to={`/${engineerid}/projects/${projectid}/invoice`}>
                            /invoice
                        </Link>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1 }}>
                            <button style={{ ...styles.generalButton, ...addIconWidth }} onClick={() => { this.createInvoice() }}>{addIcon()}</button>
                        </div>

                        <div style={{ ...styles.flex5, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}>Create An Invoice</span>
                        </div>

                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}><u>Invoices </u></span>
                    </div>




                    {this.showinvoiceids()}


                    <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                        <span style={{ ...regularFont }}>Date Invoice</span>

                    </div>
                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

                        <Datetime
                            value={this.getInvoiceField("dateinvoice") ? moment(this.getInvoiceField("dateinvoice"))
                                : null}
                            onChange={(date) => { this.setInvoiceField("dateinvoice", date) }}
                            timeFormat={false}
                            dateFormat="MM/DD/YYYY"
                            inputProps={{
                                style: { ...styles.generalFont, ...regularFont, ...styles.generalField, ...styles.mediumWidth }
                            }} // disables the time picker
                        />
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>
                            <span style={{ ...regularFont }}><u>Add to Invoice</u></span>
                        </div>

                        <div style={{ ...styles.flex5 }}>

                            <span style={{ ...regularFont }}><u>Labor </u></span>
                        </div>

                    </div>


                    {this.showlaborids()}


                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.flex1 }}>
                            <span style={{ ...regularFont }}><u>Add to Invoice</u></span>
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
                            <span style={{ ...regularFont }}><u>Invoice Total: </u></span>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.generalFont }}>
                            <span style={{ ...regularFont }}><u>${this.getInvoiceTotal()}</u></span>
                        </div>

                    </div>


                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}>{this.state.message} </span>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <button style={{ ...styles.generalButton, ...saveWidth }} onClick={() => { gfk.saveTimesheet.call(this) }}>{saveSF()}</button>
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

export default connect(mapStateToProps, actions)(Invoice);
