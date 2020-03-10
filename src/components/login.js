import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { gfkLogin } from './svg'
import { LoginUser, LogoutUser } from './actions/api'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, email: '', pass: '' }
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
    async loginuser() {
        const values = { emailaddress: this.state.emailaddress, pass: this.state.pass }
        let response = await LoginUser(values);
        console.log(response)
    }

    async logoutuser() {

        let response = await LogoutUser();
        console.log(response)
    }


    render() {
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this)
        const loginButton = () => {
            if (this.state.width > 1200) {
                return ({ width: '232px', height: '82px' })
            } else if (this.state.width > 800) {
                return ({ width: '158px', height: '57px' })
            } else {
                return ({ width: '111px', height: '41px' })
            }
        }
        const password = () => {
            if (this.state.width > 1200) {
                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter }}>
                            Password
                    </div>
                        <div style={{ ...styles.flex2 }}>
                            <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                                value={this.state.pass}
                                onChange={event => { this.setState({ pass: event.target.value }) }} />
                        </div>
                    </div>
                )

            } else if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                        Password
                </div>
                    <div style={{ ...styles.flex3 }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.state.pass}
                            onChange={event => { this.setState({ pass: event.target.value }) }}
                        />
                    </div>
                </div>)

            } else {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                        Password
                    </div>
                    <div style={{ ...styles.flex2 }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.state.pass}
                            onChange={event => { this.setState({ pass: event.target.value }) }}
                        />
                    </div>
                </div>)
            }
        }
        const email = () => {
            if (this.state.width > 1200) {
                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.alignCenter }}>
                            Email
                    </div>
                        <div style={{ ...styles.flex2 }}>
                            <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                                value={this.state.emailaddress}
                                onChange={event => { this.setState({ emailaddress: event.target.value }) }}
                            />
                        </div>
                    </div>
                )

            } else if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                        Email
                </div>
                    <div style={{ ...styles.flex3 }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.state.emailaddress}
                            onChange={event => { this.setState({ emailaddress: event.target.value }) }} />
                    </div>
                </div>)

            } else {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                        Email
                    </div>
                    <div style={{ ...styles.flex2 }}>
                        <input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.state.emailaddress}
                            onChange={event => { this.setState({ emailaddress: event.target.value }) }} />
                    </div>
                </div>)
            }
        }
        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.alignCenter }}>
                            Login
                        </div>
                    </div>


                    {email()}
                    {password()}

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...styles.alignCenter }}>
                            <button style={{ ...styles.generalButton, ...loginButton() }} onClick={() => { this.loginuser() }}>{gfkLogin()}</button>
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...styles.alignCenter }}>
                            <button style={{ ...styles.generalButton, ...loginButton() }} onClick={() => { this.logoutuser() }}>{gfkLogin()}</button>
                        </div>
                    </div>


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
export default connect(mapStateToProps, actions)(Login);