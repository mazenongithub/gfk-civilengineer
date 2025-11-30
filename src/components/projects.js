
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
import ClientID from './clientid';


class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activeprojectid: false, projectnumber: '', title: '', projectaddress: '', projectcity: '', searchprojectnumber: '', searchcity: '', clientid: '', series: 0, proposedproject: '' }
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
        const myproject = gfk.getProjectById.call(this, projectid);
        const projectnumber = myproject.projectnumber;
        const city = myproject.city
        if (this.state.activeprojectid === projectid) {
            this.setState({ activeprojectid: false, searchprojectnumber: '', searchcity: '' })
        } else {
            this.setState({ activeprojectid: projectid, searchprojectnumber: projectnumber, searchcity: city })
        }

    }

 

    getProjectProp(prop) {
        const gfk = new GFK();
        const { activeprojectid } = this.state;

        if (!activeprojectid) {
            return this.state[prop];
        }

        const project = gfk.getProjectById.call(this, activeprojectid);

        return project ? project[prop] : ""
    }

    setProjectProp(prop, value) {
        const gfk = new GFK();
        const makeid = new MakeID();
        let projects = gfk.getProjects.call(this) || [];
        const { activeprojectid } = this.state;

        // --- If no active project → create new project ---
        if (!activeprojectid) {
            const newProject = {
                projectid: makeid.projectid.call(this),
                // initialize all known project properties to empty strings
                projectnumber: "",
                series: "",
                title: "",
                sow: "",
                clientid: "",
                engineerid: "",
                projectaddress: "",
                projectcity: "",
                projectapn: "",
                // add more props here as needed...
            };

            // Set the requested property
            newProject[prop] = value;

            // Append to projects
            projects.push(newProject);

            // Save and set as active
            this.props.reduxProjects(projects);
            this.setState({ activeprojectid: newProject.projectid });

            return;
        }

        // --- Updating an existing project ---
        const project = gfk.getProjectById.call(this, activeprojectid);
        if (!project) return;

        const projectIndex = gfk.getProjectKeyById.call(this, activeprojectid);

        projects[projectIndex][prop] = value;

        // Push update to redux
        this.props.reduxProjects(projects);
        this.setState({ render: 'render' })
    }


    async saveprojects() {
        try {
            const gfk = new GFK();
            const projects = gfk.getProjects.call(this);

            if (!projects || !projects.length) {
                this.setState({ message: "No projects available to save." });
                return;
            }

            const values = {
                companyid: "gfk",
                projects,
            };

            const response = await SaveProjects(values);

            if (response?.projects?.projects) {
                // extract the actual array from response.projects.projects
                const updatedProjects = response.projects.projects;
                this.props.reduxProjects(updatedProjects);
                this.setState({ message: "Projects saved successfully." });
            } else if (response?.message) {
                this.setState({ message: response.message });
            }
        } catch (err) {
            console.error("❌ Error saving projects:", err);
            this.setState({ message: "An error occurred while saving projects." });
        }
    }


    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const projectid = new ProjectID();
        const headerFont = gfk.getHeaderFont.call(this)
        const saveprojecticon = gfk.getsaveprojecticon.call(this)
        const clientid = new ClientID();
        const showtitle = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont }}>
                        Project Number <br />
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getProjectProp("projectnumber")}
                            onChange={event => { this.setProjectProp("projectnumber",event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex2, ...regularFont, ...styles.generalFont, ...styles.addLeftMargin }}>
                        Title <br />
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getProjectProp("title")}
                            onChange={event => { this.setProjectProp("title",event.target.value) }}
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
                                    value={this.getProjectProp("projectnumber")}
                                    onChange={event => { this.setProjectProp("projectnumber",event.target.value) }}
                                />
                            </div>

                        </div>


                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                                Title <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getProjectProp("title")}
                                    onChange={event => { this.setProjectProp("title",event.target.value) }} />
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
                            value={this.getProjectProp("projectaddress")}
                            onChange={(event) => { this.setProjectProp("projectaddress",event.target.value) }}
                        />
                    </div>
                    <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont, ...styles.addLeftMargin }}>
                        City <br />
                        <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                            value={this.getProjectProp("projectcity")}
                            onChange={event => { this.setProjectProp("projectcity",event.target.value) }}
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
                                    value={this.getProjectProp("projectaddress")}
                                    onChange={(event) => { this.setProjectProp("projectaddress",event.target.value) }} />
                            </div>

                        </div>


                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                                City <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                    value={this.getProjectProp("projectcity")}
                                    onChange={event => { this.setProjectProp("projectcity",event.target.value) }}
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
                                to={`/${engineerid}/profile`}>
                                /{engineerid}
                            </Link>
                            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                                <Link
                                    style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                    to={`/${engineerid}/projects`}>
                                    /projects
                                </Link>
                            </div>
                        </div>
                    </div>

                    {clientid.showClientID.call(this)}



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
        myuser: state.myuser,
        projects: state.projects,
        company:state.company
    }
}
export default connect(mapStateToProps, actions)(Projects);


