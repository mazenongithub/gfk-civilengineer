import React, { Component } from 'react';
import { MyStylesheet } from './styles';
import GFK from './gfk'
import { Link } from 'react-router-dom';
import * as actions from './actions';
import { connect } from 'react-redux';
import { radioIcon, saveSF } from './svg';
import MakeID from './makeids';
import { SaveClients } from './actions/api';

class Clients extends Component {

    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0 }
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

    loadClients() {
        const gfk = new GFK();
        const clients = gfk.getClients.call(this);


        if (!clients || !Array.isArray(clients)) return null;

        return clients.map(client => this.showClients(client));
    }


    showClients(client) {
        return (<option value={client.clientid}>{client.firstname} {client.lastname}</option>)
    }


    getFillMr() {
        return this.getClientProperty("prefix") === "Mr."
            ? { fill: "#aa2036" }
            : { fill: "#ffffff" };
    }


    getFillMs() {
        return this.getClientProperty("prefix") === "Ms."
            ? { fill: "#aa2036" }
            : { fill: "#ffffff" };
    }

    setClientProperty(prop, value) {
        const gfk = new GFK();
        const makeid = new MakeID();

        const clients = gfk.getClients.call(this) || [];
        const activeid = this.state.activeclientid;

        // --- CASE 1: Update existing client ---
        if (activeid) {
            const index = gfk.getClientIndexById.call(this, activeid);
            if (index === null) return;

            const updatedClients = [...clients];
            updatedClients[index] = {
                ...updatedClients[index],
                [prop]: value
            };

            this.props.reduxCompany({ ...this.props.company, clients: updatedClients });
            this.setState({ render: 'render' });
            return;
        }

        // --- CASE 2: Create new client ---
        const newClientId = makeid.makeClientID.call(this);
        const newClient = {
            clientid: newClientId,
            prefix: "",
            firstname: "",
            lastname: "",
            company: "",
            address: "",
            city: "",
            contactstate: "",
            zipcode: "",
            emailaddress: "",
            phonenumber: "",
            [prop]: value
        };

        const updatedClients = [...clients, newClient];

        this.props.reduxCompany({ ...this.props.company, clients: updatedClients });

        // Make new client active
        this.setState({ activeclientid: newClientId });
    }

    getClientProperty(prop) {
        const gfk = new GFK();
        const clientid = this.state.activeclientid;

        if (!clientid) return "";

        const client = gfk.getClientById.call(this, clientid);
        if (!client) return "";

        return client[prop] ?? "";
    }

    async saveClients() {

        try {
            const gfk = new GFK();
            let clients = gfk.getClients.call(this)
            const company = gfk.getCompany.call(this)

            let response = await SaveClients({ clients })
            if (Array.isArray(response.clients)) {

                company.clients = response.clients

                this.props.reduxCompany(company)
                this.setState({ message: response.message })
            }

        } catch (err) {
            console.error("Error saving clients:", err);
            alert(err);

        }

    }


    render() {
        const styles = MyStylesheet()
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const iconWidth = { width: '54px' }
        const iconFill = { fill: 'none' }
        const saveWidth = { width: '20%' }
        return (
            <div style={{ ...styles.generalContainer }}>

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                    <Link
                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                        to={`/gfk/clients`}>
                        /clients
                    </Link>

                </div>

                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                    <select style={{ ...regularFont, ...styles.mediumWidth }}
                        value={this.state.activeclientid}
                        onChange={event => { this.setState({ activeclientid: event.target.value }) }}>
                        <option value="">Create A New Client/ or Select A Client</option>
                        {this.loadClients()}
                    </select>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                    <div style={{ ...styles.flex1 }}>
                        <table>
                            <tr>
                                <td><button onClick={() => { this.setClientProperty("prefix", "Mr.") }} style={{ ...styles.generalButton, ...iconWidth, ...this.getFillMr() }}>{radioIcon()}</button></td>
                                <td><button onClick={() => { this.setClientProperty("prefix", "Ms.") }} style={{ ...styles.generalButton, ...iconWidth, ...this.getFillMs() }}>{radioIcon()}</button></td>
                            </tr>
                            <tr>
                                <td style={{ ...styles.alignCenter }}><span style={{ ...regularFont }}>Mr.</span></td>
                                <td style={{ ...styles.alignCenter }}><span style={{ ...regularFont }}>Ms.</span></td>
                            </tr>
                        </table>

                    </div>
                    <div style={{ ...styles.flex2, ...styles.generalFont, ...styles.alignLeft }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }}
                            onChange={event => { this.setClientProperty("firstname", event.target.value) }}
                            value={this.getClientProperty("firstname")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>First Name</span></div>

                    </div>
                    <div style={{ ...styles.flex3 }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("lastname")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>Last Name</span></div>
                    </div>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("company")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>Company</span></div>
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("address")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>Address</span></div>
                    </div>

                </div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex3, ...styles.generalFont, ...styles.addMargin }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("city")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>City</span></div>
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...styles.addMargin }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("contactstate")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>State</span></div>
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...styles.addMargin }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("zipcode")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>Zipcode</span></div>
                    </div>

                </div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("emailaddress")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>Email Address</span></div>
                    </div>
                    <div style={{ ...styles.flex1, ...styles.generalFont }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }} value={this.getClientProperty("phonenumber")} />
                        <div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>Phone Number</span></div>
                    </div>

                </div>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15, ...styles.generalFont }}>
                    <span style={{ ...regularFont }}>{this.state.message} </span>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                    <button style={{ ...styles.generalButton, ...saveWidth }} onClick={() => { this.saveClients() }}>{saveSF()}</button>
                </div>


            </div>)
    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects,
        company: state.company
    }
}

export default connect(mapStateToProps, actions)(Clients);