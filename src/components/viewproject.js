import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { LoadProject } from './actions/api';

class ViewProject extends Component {

    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, project: null }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }

    async componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();

        const { projects } = this.props;

        // If projects are already loaded (e.g., navigated from Projects page)
        if (projects && projects.length > 0) {
            await this.loadProjectData();
        }

    }



    async componentDidUpdate(prevProps) {
        const prevProjects = Array.isArray(prevProps.projects)
            ? prevProps.projects
            : prevProps.projects?.projects || [];

        const currentProjects = Array.isArray(this.props.projects)
            ? this.props.projects
            : this.props.projects?.projects || [];

        // Debug what’s really happening
        console.log("Prev projects:", prevProjects.length);
        console.log("Current projects:", currentProjects.length);

        // Run when projects just became available
        if (prevProjects.length === 0 && currentProjects.length > 0 && !this.state.project) {
            console.log("✅ Detected projects loaded — calling loadProjectData()");
            await this.loadProjectData();
        }
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    async loadProjectData() {
        const { match, projects, reduxProjects } = this.props;
        const projectid = match.params.projectid;

        try {
            const result = await LoadProject(projectid);
            if (!result || !result.borings) return;

            // Normalize projects list in case it’s wrapped in an object
            const allProjects = Array.isArray(projects)
                ? [...projects]
                : projects?.projects
                    ? [...projects.projects]
                    : [];

            // Find the project to update
            const index = allProjects.findIndex(p => p.projectid === projectid);
            if (index === -1) {
                console.warn(`⚠️ Project ${projectid} not found in store`);
                return;
            }

            // Attach borings (already sorted)
            allProjects[index] = {
                ...allProjects[index],
                borings: result.borings,
                fieldreports:result.fieldreports,
                compactioncurves:result.compactioncurves,
                seismic:result.seismic,
                ptslab:result.ptslab,
                slope:result.slope
            };

            // Update Redux store or local state
            if (reduxProjects) {
                reduxProjects(allProjects);
            }

            this.setState({
                project: allProjects[index],
                render: 'render',
            });

        } catch (err) {
            console.error("❌ Error loading project:", err);
        }
    }



    getProject() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getProjectById.call(this, projectid)
        if (project) {
            return project
        } else {
            return false;
        }
    }
    getProjectKey() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const projectkey = gfk.getProjectKeyById.call(this, projectid)
        return projectkey;
    }

    getScopeofWork() {
        const project = this.getProject();
        let scopeofwork = '';
        if (project) {
            scopeofwork = project.proposedproject;

        }
        return scopeofwork;

    }

    handleScopeofWork(value) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        if (myuser) {

            const project = this.getProject();
            if (project) {
                const key = this.getProjectKey();
                myuser.projects.project[key].proposedproject = value
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })
            }

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

        if (project) {

            return (
                <div style={{ ...styles.generalContainer }}>
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}`}>
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

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                        <textarea style={{ ...styles.generalField, ...regularFont, ...styles.generalFont, ...styles.minHeight150 }}
                            value={this.getScopeofWork()}
                            onChange={event => { this.handleScopeofWork(event.target.value) }}>

                        </textarea>
                        <div style={{ ...styles.generalContainer }}>
                            <span style={{ ...styles.generalFont, ...regularFont }}>Scope of Work</span>
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}/borings`}>
                                /Borings
                            </Link>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}/fieldreports`}>
                                /FieldReports
                            </Link>
                        </div>
                    </div>
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}/labsummary`}>
                                /Lab Summary
                            </Link>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}/ptslab`}>
                                /PTSlab
                            </Link>
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}/seismic`}>
                                /Seismic
                            </Link>
                        </div>
                        <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                            <Link
                                style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                to={`/${engineerid}/projects/${projectid}/slopestability`}>
                                /Slope Stability
                            </Link>
                        </div>
                    </div>




                </div>



            )

        } else {
            return (
                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>

                    <span style={{ ...styles.generalFont, ...regularFont }}>Project Not Found</span>

                </div>
            )
        }

    }


}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects
    }
}
export default connect(mapStateToProps, actions)(ViewProject)