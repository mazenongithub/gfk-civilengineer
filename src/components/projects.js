
import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import MakeID from './makeids';
import ProjectID from './projectid';
import { CreateProject } from './functions'
import { saveProjectIcon } from './svg';
import { SaveProjects } from './actions/api'
import { Link } from 'react-router-dom';


class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activeprojectid: false, projectnumber: '', title: '', address: '', city: '', searchprojectnumber: '', searchcity: '', clientid: 'gus', series: 0, proposedproject: '' }
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
    makeprojectactive(projectid) {
        const gfk = new GFK();
        const myproject = gfk.getprojectbyid.call(this, projectid);
        const projectnumber = myproject.projectnumber;
        const city = myproject.city
        if (this.state.activeprojectid === projectid) {
            this.setState({ activeprojectid: false, searchprojectnumber: '', searchcity: '' })
        } else {
            this.setState({ activeprojectid: projectid, searchprojectnumber: projectnumber, searchcity: city })
        }

    }

    getcity() {
        const gfk = new GFK();

        if (this.state.activeprojectid) {
            const myproject = gfk.getprojectbyid.call(this, this.state.activeprojectid);
            return myproject.city;
        } else {
            return this.state.city;
        }

    }
    handlecity(city) {
        const makeid = new MakeID();
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            const engineerid = myuser.engineerid;
            if (this.state.activeprojectid) {
                const i = gfk.getprojectkeybyid.call(this, this.state.activeprojectid)
                myuser.projects.project[i].city = city;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const projectid = makeid.projectid.call(this);
                const series = this.state.series;
                const projectnumber = '0';
                const title = this.state.title
                const address = this.state.address;
                const proposedproject = this.state.proposedproject;
                const projectapn = this.state.projectapn;
                const clientid = this.state.clientid;
                let newproject = CreateProject(projectid, projectnumber, series, title, address, city, proposedproject, projectapn, engineerid, clientid);
                const projects = gfk.getprojects.call(this);
                if (projects) {
                    myuser.projects.project.push(newproject)
                } else {
                    const project = { project: [newproject] }
                    myuser.projects = project;
                }
                this.props.reduxUser(myuser)
                this.setState({ activeprojectid: projectid })
            }
        }
    }


    getaddress() {
        const gfk = new GFK();

        if (this.state.activeprojectid) {
            const myproject = gfk.getprojectbyid.call(this, this.state.activeprojectid);
            return myproject.address;
        } else {
            return this.state.address;
        }

    }
    handleaddress(address) {
        const makeid = new MakeID();
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            const engineerid = myuser.engineerid;
            if (this.state.activeprojectid) {
                const i = gfk.getprojectkeybyid.call(this, this.state.activeprojectid)
                myuser.projects.project[i].address = address;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const projectid = makeid.projectid.call(this);
                const series = this.state.series;
                const projectnumber = '0';
                const title = this.state.title
                const city = this.state.city;
                const proposedproject = this.state.proposedproject;
                const projectapn = this.state.projectapn;
                const clientid = this.state.clientid;
                let newproject = CreateProject(projectid, projectnumber, series, title, address, city, proposedproject, projectapn, engineerid, clientid);
                const projects = gfk.getprojects.call(this);
                if (projects) {
                    myuser.projects.project.push(newproject)
                } else {
                    const project = { project: [newproject] }
                    myuser.projects = project;
                }
                this.props.reduxUser(myuser)
                this.setState({ activeprojectid: projectid })
            }
        }
    }

    gettitle() {
        const gfk = new GFK();

        if (this.state.activeprojectid) {
            const myproject = gfk.getprojectbyid.call(this, this.state.activeprojectid);
            return myproject.title;
        } else {
            return this.state.title;
        }

    }
    handletitle(title) {
        const makeid = new MakeID();
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            const engineerid = myuser.engineerid;
            if (this.state.activeprojectid) {
                const i = gfk.getprojectkeybyid.call(this, this.state.activeprojectid)
                myuser.projects.project[i].title = title;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const projectid = makeid.projectid.call(this);
                const series = this.state.series;
                const projectnumber = '0';
                const address = this.state.address;
                const city = this.state.city;
                const proposedproject = this.state.proposedproject;
                const projectapn = this.state.projectapn;
                const clientid = this.state.clientid;
                let newproject = CreateProject(projectid, projectnumber, series, title, address, city, proposedproject, projectapn, engineerid, clientid);
                const projects = gfk.getprojects.call(this);
                if (projects) {
                    myuser.projects.project.push(newproject)
                } else {
                    const project = { project: [newproject] }
                    myuser.projects = project;
                }
                this.props.reduxUser(myuser)
                this.setState({ activeprojectid: projectid })
            }
        }
    }

    getprojectnumber() {
        const gfk = new GFK();

        if (this.state.activeprojectid) {
            const myproject = gfk.getprojectbyid.call(this, this.state.activeprojectid);
            return myproject.projectnumber;
        } else {
            return this.state.projectnumber;
        }

    }
    handleprojectnumber(projectnumber) {
        const makeid = new MakeID();
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            const engineerid = myuser.engineerid;
            if (this.state.activeprojectid) {
                const i = gfk.getprojectkeybyid.call(this, this.state.activeprojectid)
                myuser.projects.project[i].projectnumber = projectnumber;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const projectid = makeid.projectid.call(this);
                const series = this.state.series;
                const title = this.state.title;
                const address = this.state.address;
                const city = this.state.city;
                const proposedproject = this.state.proposedproject;
                const projectapn = this.state.projectapn;
                const clientid = this.state.clientid;
                let newproject = CreateProject(projectid, projectnumber, series, title, address, city, proposedproject, projectapn, engineerid, clientid);
                const projects = gfk.getprojects.call(this);
                if (projects) {
                    myuser.projects.project.push(newproject)
                } else {
                    const project = { project: [newproject] }
                    myuser.projects = project;
                }
                this.props.reduxUser(myuser)
                this.setState({ activeprojectid: projectid })
            }
        }
    }

    async saveprojects() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            const projects = gfk.getprojects.call(this);
            const values = { projects }
            let response = await SaveProjects(values);
            if (response.hasOwnProperty("projects")) {
                myuser.projects.project = response.projects;
                this.props.reduxUser(myuser)
            }
            if (this.state.activeprojectid) {
                if (response.hasOwnProperty("replaceids")) {
                    // eslint-disable-next-line
                    response.replaceids.map(myproject => {
                        if (myproject.oldprojectid === this.state.activeprojectid) {
                            this.setState({ activeprojectid: myproject.projectid })
                        }

                    })
                }
            }
            if (response.hasOwnProperty("message")) {
                this.setState({ message: response.message })
            }
        }
    }
    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const projectid = new ProjectID();
        const headerFont = gfk.getHeaderFont.call(this)
        const saveprojecticon = gfk.getsaveprojecticon.call(this)
        const showtitle = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont }}>
                        Project Number <br />
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getprojectnumber()}
                            onChange={event => { this.handleprojectnumber(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex2, ...regularFont, ...styles.generalFont, ...styles.addLeftMargin }}>
                        Title <br />
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.gettitle()}
                            onChange={event => { this.handletitle(event.target.value) }}
                        />

                    </div>
                </div>)
            } else {

                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                                Project Number <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getprojectnumber()}
                                    onChange={event => { this.handleprojectnumber(event.target.value) }}
                                />
                            </div>

                        </div>


                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                                Title <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.gettitle()}
                                    onChange={event => { this.handletitle(event.target.value) }} />
                            </div>

                        </div>

                    </div>

                </div>)

            }
        }

        const location = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex2, ...regularFont, ...styles.generalFont }}>
                        Address <br />
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getaddress()}
                            onChange={(event) => { this.handleaddress(event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont, ...styles.addLeftMargin }}>
                        City <br />
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getcity()}
                            onChange={event => { this.handlecity(event.target.value) }}
                        />

                    </div>
                </div>)
            } else {

                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                                Address <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getaddress()}
                                    onChange={(event) => { this.handleaddress(event.target.value) }} />
                            </div>

                        </div>


                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                                City <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getcity()}
                                    onChange={event => { this.handlecity(event.target.value) }}
                                />
                            </div>

                        </div>

                    </div>

                </div>)

            }
        }
        const engineerid = this.props.match.params.engineerid
        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>

                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}`}>
                                /{engineerid}
                            </Link>
                            <div style={{ ...styles.generalContainer }}>
                                <Link
                                    style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                    to={`/${engineerid}/projects`}>
                                    /projects
                                </Link>
                            </div>
                        </div>
                    </div>

                    {showtitle()}

                    {location()}

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...regularFont, ...styles.alignCenter }}>
                            {this.state.message}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                            <button style={{ ...styles.generalButton, ...saveprojecticon }} onClick={() => { this.saveprojects() }}>{saveProjectIcon()}</button>
                        </div>
                    </div>

                    {projectid.showprojectid.call(this)}
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
export default connect(mapStateToProps, actions)(Projects);


