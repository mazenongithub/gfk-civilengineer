import React from 'react'
import { MyStylesheet } from './styles'
import GFK from './gfk';

class ClientID {

    showOptions() {
        const gfk = new GFK();
        const clients = gfk.getClients.call(this) || [];

        return [
            <option key="default" value="">
                Select A Client
            </option>,
            ...clients.map(client => (
                <option key={client.clientid} value={client.clientid}>
                    {client.firstname} {client.lastname}
                </option>
            ))
        ];
    }



    showClientID() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const clientid = new ClientID();

        return (<div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
            <select style={{ ...regularFont, ...styles.generalField }} onChange={(event) => { this.setProjectProp("clientid", event.target.value) }} value={this.getProjectProp("clientid")}>
                {clientid.showOptions.call(this)}

            </select>

        </div>)
    }





}

export default ClientID