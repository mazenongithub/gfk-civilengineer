import React, { Component } from 'react';
import GFK from './gfk'
import { MyStylesheet } from './styles';
import { triangleBullet, checkedBox, submitButton, unCheckedBox } from './svg';
import { SaveContactUs } from './actions/api';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '', width: 0, height: 0, lab: false, fullname: '', company: '', emailaddress: '', phonenumber: '', lab: false, liquefaction: false, logdraft: false, field: false, ptslab: false, slope: false, reports: false, invoice: false, description: ''
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


    setField(field, value) {
        this.setState({
            [field]: value
        });
    };

    getField(field) {
        return this.state[field];
    };

    toggleField(field) {
        this.setState((prevState) => ({
            [field]: !prevState[field]
        }));
    }

    getCheckboxIcon(field) {
        return this.state[field] ? checkedBox() : unCheckedBox();
    }

    async saveContactUs() {
        try {

            const {
                fullname,
                company,
                emailaddress,
                phonenumber,
                lab,
                liquefaction,
                logdraft,
                field,
                ptslab,
                slope,
                reports,
                invoice,
                description
            } = this.state;

            const values = {
                fullname,
                company,
                emailaddress,
                phonenumber,
                lab,
                liquefaction,
                logdraft,
                field,
                ptslab,
                slope,
                reports,
                invoice,
                description
            };

            console.log(values)

            const response = await SaveContactUs(values);
            const created = new Date(response.contactus.created).toLocaleTimeString();
            const message = `${response.message} ${created}`
            this.setState({
                message: message || 'Message sent successfully'
            });

        } catch (err) {
            console.error('save contact us error:', err);
            alert('Unable to send message. Please try again.');
        }
    }

    render() {
        const styles = MyStylesheet()
        const bulletStyle = {
            width: this.state.width > 900 ? '50px' : '35px'
        };
        const gfk = new GFK();
        const headerFont = gfk.getWebHeaderFont.call(this);
        const regularFont = gfk.getWebFont.call(this);
        const buttonWidth = { width: '3rem' }
        const areaHeight = { minHeight: '10rem' }
        const submitWidth = { width: '100%', maxWidth: '10rem' }
        const getFlex = this.state.width > 900 ? styles.flex5 : styles.flex2

        return (<div style={{ ...styles.generalContainer }}>

            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont, ...styles.topMargin15 }}>
                <button style={{ ...styles.generalButton, ...bulletStyle }}>
                    {triangleBullet()}
                </button>
                <span style={{ ...headerFont, ...styles.boldFont }}>
                    Contact Us
                </span>

            </div>


            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <span style={{ ...regularFont }}>Full Name</span>
            </div>

            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <input type="text"
                    value={this.getField("fullname")}
                    onChange={event => { this.setField("fullname", event.target.value) }}
                    style={{ ...regularFont, ...styles.generalField }} />
            </div>




            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <span style={{ ...regularFont }}>Company</span>
            </div>


            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <input type="text" style={{ ...regularFont, ...styles.generalField }}
                    value={this.getField("company")}
                    onChange={event => { this.setField("company", event.target.value) }} />
            </div>


            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <span style={{ ...regularFont }}>Email Address</span>
            </div>



            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <input type="text" style={{ ...regularFont, ...styles.generalField }}
                    value={this.getField("emailaddress")}
                    onChange={event => { this.setField("emailaddress", event.target.value) }} />
            </div>



            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <span style={{ ...regularFont }}>Phone Number</span>
            </div>


            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <input type="text" style={{ ...regularFont, ...styles.generalField }}
                    value={this.getField("phonenumber")}
                    onChange={event => { this.setField("phonenumber", event.target.value) }} />
            </div>




            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <span style={{ ...regularFont }}>What are you interested in?</span>
            </div>


            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                <div style={{ ...styles.flex1 }}>
                    <button onClick={() => { this.toggleField("lab") }}
                        style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("lab")}</button>
                </div>
                <div style={{ ...styles.flex8, ...styles.generalFont }}>
                    <span style={{ ...regularFont }}>Soil Lab Reporting Platform </span>
                </div>
            </div>

            <div style={{ ...styles.generalContainer, ...styles.marginLeft25, ...styles.generalFont }}>
                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}><span style={{ ...regularFont }}>Optional Add Ons</span></div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                    <div style={{ ...styles.flex1 }}>
                        <button onClick={() => { this.toggleField("liquefaction") }}
                            style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("liquefaction")}</button>
                    </div>
                    <div style={{ ...styles.flex8, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}>Liquefaction Analysis </span>
                    </div>
                </div>

                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                    <div style={{ ...styles.flex1 }}>
                        <button onClick={() => { this.toggleField("ptslab") }}
                            style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("ptslab")}</button>
                    </div>
                    <div style={{ ...styles.flex8, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}>PT Slab Design & Reporting </span>
                    </div>
                </div>


                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                    <div style={{ ...styles.flex1 }}>
                        <button onClick={() => { this.toggleField("logdraft") }}
                            style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("logdraft")}</button>
                    </div>
                    <div style={{ ...styles.flex8, ...styles.generalFont }}>
                        <span style={{ ...regularFont }}>Geotechnical Log Drafting </span>
                    </div>
                </div>
            </div>


            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                <div style={{ ...styles.flex1 }}>
                    <button onClick={() => { this.toggleField("field") }}
                        style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("field")}</button>
                </div>
                <div style={{ ...styles.flex8, ...styles.generalFont }}>
                    <span style={{ ...regularFont }}>Field Reports and Reporting </span>
                </div>
            </div>


            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                <div style={{ ...styles.flex1 }}>
                    <button onClick={() => { this.toggleField("slope") }}
                        style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("slope")}</button>
                </div>
                <div style={{ ...styles.flex8, ...styles.generalFont }}>
                    <span style={{ ...regularFont }}>Slope Stability</span>
                </div>
            </div>

            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                <div style={{ ...styles.flex1 }}>
                    <button onClick={() => { this.toggleField("reports") }}
                        style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("reports")}</button>
                </div>
                <div style={{ ...styles.flex8, ...styles.generalFont }}>
                    <span style={{ ...regularFont }}>Geotechnical Proposals and Reports</span>
                </div>
            </div>


            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, ...styles.generalFont }}>
                <div style={{ ...styles.flex1 }}>
                    <button onClick={() => { this.toggleField("invoice") }}
                        style={{ ...styles.generalButton, ...buttonWidth }}>{this.getCheckboxIcon("invoice")}</button>
                </div>
                <div style={{ ...styles.flex8, ...styles.generalFont }}>
                    <span style={{ ...regularFont }}>Time/Invoice</span>
                </div>
            </div>


            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15 }}>
                <span style={{ ...regularFont }}>Brief Description of your needs</span>
            </div>



            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                <textarea style={{ ...regularFont, ...styles.generalFont, ...styles.generalField, ...areaHeight }}
                    value={this.getField("description")}
                    onChange={event => { this.setField("description", event.target.value) }} >

                </textarea>
            </div>



            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...getFlex }}>
                    &nbsp;
                </div>
                <div style={{ ...styles.flex1 }}>
                    <button style={{ ...styles.generalButton, ...submitWidth }} onClick={() => { this.saveContactUs() }}>
                        {submitButton()}
                    </button>
                </div>
            </div>


            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont, ...styles.alignCenter }}>
                <span style={{ ...regularFont }}>{this.state.message}</span>
            </div>





        </div>)
    }
}
export default Contact;