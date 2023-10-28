import React from 'react';
import { MyStylesheet } from './styles'
import GFK from './gfk'
import { goToIcon } from './svg';
import { Link } from 'react-router-dom';

class Profile {

    getphoneNumber() {
        const gfk = new GFK();
        let phonenumber = '';
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            phonenumber = myuser.phonenumber;
        }
        return phonenumber;

    }

    handlephoneNumber(phonenumber) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            myuser.phonenumber = phonenumber;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })


        }

    }

    getemailAddress() {
        const gfk = new GFK();
        let emailaddress = '';
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            emailaddress = myuser.emailaddress;
        }
        return emailaddress;

    }

    handleemailAddress(emailaddress) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            myuser.emailaddress = emailaddress;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })


        }

    }

    getlastName() {
        const gfk = new GFK();
        let lastname = '';
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            lastname = myuser.lastname;
        }
        return lastname;

    }

    handlelastName(lastname) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            myuser.lastname = lastname;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })


        }

    }

    getfirstName() {
        const gfk = new GFK();
        let firstname = '';
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            firstname = myuser.firstname;
        }
        return firstname;

    }

    handlefirstName(firstname) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            myuser.firstname = firstname;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })


        }

    }

    getProfile() {
        const gfk = new GFK();
        let profile = '';
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            profile = myuser.engineerid;
        }
        return profile;

    }

    handleProfile(profile) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            myuser.engineerid = profile;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })


        }

    }

    showprofile() {
        const gfk = new GFK()
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
        const headerFont = gfk.getHeaderFont.call(this)
        const goIconWidth = gfk.getgotoicon.call(this)
        const profile = new Profile();
        const engineerid = profile.getProfile.call(this)
        return (<div style={{ ...styles.generalContainer }}>

            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter }}>
                <span style={{ ...styles.generalFont, ...headerFont }}>/</span>
                <input type="text" style={{ ...styles.mediumWidth, ...styles.generalFont, ...headerFont, ...styles.alignCenter }}
                    value={profile.getProfile.call(this)}
                    onChange={event => { profile.handleProfile.call(this, event.target.value) }}
                />
            </div>

            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.flex1 }}>

                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                        value={profile.getfirstName.call(this)}
                        onChange={event => { profile.handlefirstName.call(this, event.target.value) }}
                    />
                    <span style={{ ...styles.generalFont, ...regularFont }}>First Name</span>


                </div>
                <div style={{ ...styles.flex1 }}>

                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                        value={profile.getlastName.call(this)}
                        onChange={event => { profile.handlelastName.call(this, event.target.value) }}
                    />
                    <span style={{ ...styles.generalFont, ...regularFont }}>Last Name</span>


                </div>
            </div>


            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.flex1 }}>

                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                        value={profile.getemailAddress.call(this)}
                        onChange={event => { profile.handleemailAddress.call(this, event.target.value) }}
                    />
                    <span style={{ ...styles.generalFont, ...regularFont }}>Email Address</span>


                </div>
                <div style={{ ...styles.flex1 }}>

                    <input type="text" style={{ ...styles.generalField, ...styles.generalFont, ...regularFont }}
                        value={profile.getphoneNumber.call(this)}
                        onChange={event => { profile.handlephoneNumber.call(this, event.target.value) }}
                    />
                    <span style={{ ...styles.generalFont, ...regularFont }}>Phone Number</span>


                </div>
            </div>

            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.flex1 }}>
                <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                        to={`/${engineerid}/projects`}>
                    <button style={{ ...styles.generalButton, ...goIconWidth }}>
                        {goToIcon()}
                    </button>
                </Link>

                </div>
                <div style={{ ...styles.flex6 }}>
                    <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                        to={`/${engineerid}/projects`}>
                        Projects
                    </Link>

                </div>
            </div>



        </div>)
    }

}
export default Profile