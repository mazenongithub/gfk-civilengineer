import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { HandleSDC } from './actions/api';

class SDC extends Component {

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0, render: 'render' }
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

   async saveSDC() {
    try {
        const { projectid } = this.props.match.params;
        const projects = this.props.projects;

        if (!Array.isArray(projects)) {
            alert("Projects not found!");
            return;
        }

        const project = projects.find(
            project => project.projectid === projectid
        );

        if (!project) {
            alert("Project not found!");
            return;
        }

        const sdc = project.SDC;

        if (!sdc) {
            alert("No Seismic Design Criteria to save!");
            return;
        }

        const response = await HandleSDC(projectid, sdc);

        if (!response.success) {
            throw new Error("Server could not save SDC.");
        }

        switch (response.action) {
            case "inserted":
                this.setState({message: `Seismic Design Criteria created successfully!`});
                break;

            case "updated":
                this.setState({message:"Seismic Design Criteria updated successfully!"});
                break;

            case "deleted":
                // Clear SDC in Redux
                this.props.reduxProjects(
                    projects.map(p =>
                        p.projectid === projectid
                            ? { ...p, SDC: null }
                            : p
                    )
                );

                  this.setState({message:`Seismic Design Criteria deleted successfully!`});
                break;

            default:
                
                break;
        }

        return response;

    } catch (err) {
        console.error("Error saving SDC:", err);
        alert(`Could not save SDC: ${err.message}`);
    }
}


    async deleteSDC() {
        try {
            const { projectid } = this.props.match.params;
            const projects = this.props.projects;

            if (!Array.isArray(projects)) {
                alert("Projects not found!");
                return;
            }

            const findproject = projects.find(
                project => project.projectid === projectid
            );

            if (!findproject) {
                alert("Project not found!");
                return;
            }

            if (!window.confirm("Are you sure you want to delete the Seismic Design Criteria?")) {
                return;
            }

            // Remove SDC from the client
            const updatedProjects = projects.map(project =>
                project.projectid === projectid
                    ? { ...project, SDC: null }
                    : project
            );

            // Update Redux
            this.props.reduxProjects(updatedProjects);

            // Send blank SDC to server for deletion
            const response = await HandleSDC(projectid, null);

            this.setState({message:"Seismic Design Criteria deleted successfully!"});

            return response;

        } catch (err) {
            console.error("Error deleting SDC:", err);
            alert(`Could not delete SDC: ${err.message}`);
        }
    }

    getSDC(prop) {
        const { projectid } = this.props.match.params;
        const projects = this.props.projects;

        if (!Array.isArray(projects)) return "";

        const project = projects.find(
            project => project.projectid === projectid
        );

        return project?.SDC?.[prop] ?? "";
    }

    setSDC(prop, value) {
        const { projectid } = this.props.match.params;
        const projects = this.props.projects;

        if (!Array.isArray(projects)) return;

        const updatedProjects = projects.map(project => {
            if (project.projectid !== projectid) {
                return project;
            }

            return {
                ...project,
                SDC: {
                    ...(project.SDC || {}),
                    [prop]: value
                }
            };
        });

        this.props.reduxProjects(updatedProjects);
    }


    renderSDCInput(field, label) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        return (
            <div style={{ ...styles.flex1, ...styles.addPadding }}>
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>{label}</span>
                </div>

                <input
                    type="text"
                    style={{ ...regularFont }}
                    value={this.getSDC(field) ?? ""}
                    onChange={(e) => this.setSDC(field, e.target.value)}
                />
            </div>
        );
    };








    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);
        const headerFont = gfk.getHeaderFont.call(this);

        const { projectid } = this.props.match.params;

        const user = gfk.getUser.call(this);

        if (!user) {
            return (
                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.generalFont
                }}>
                    <span style={{ ...regularFont }}>User Not Found</span>
                </div>
            );
        }

        const project = gfk.getProjectById.call(this, projectid);

        if (!project) {
            return (
                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.generalFont
                }}>
                    <span style={{ ...regularFont }}>Project Not Found</span>
                </div>
            );
        }


        const renderRow = (field1, label1, field2, label2, row = 0) => (
            <div style={{ ...styles.generalFlex }}>

                {this.renderSDCInput(field1, label1, regularFont, styles)}

                {this.renderSDCInput(field2, label2, regularFont, styles)}

                <div style={{ ...styles.flex4, ...styles.addPadding }}>

                    {row === 1 && (
                        <div style={{ ...styles.generalContainer }}>
                            <div>
                                <span style={{ ...regularFont }}>Site Class</span>
                            </div>
                            <input
                                type="text"
                                style={{ ...regularFont }}
                                value={this.getSDC("SiteClass") ?? ""}
                                onChange={(e) =>
                                    this.setSDC("SiteClass", e.target.value)
                                }
                            />
                        </div>
                    )}

                    {row === 2 && (
                        <button
                            className="generalButton"
                            onClick={() => this.saveSDC()}
                        >
                            Save
                        </button>
                    )}

                    {row === 3 && (
                        <button
                            className="generalButton"
                            onClick={() => this.deleteSDC()}
                        >
                            Delete
                        </button>
                    )}

                </div>

            </div>
        );


        return (
            <div style={{
                ...styles.generalContainer,
                ...styles.generalFont
            }}>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter
                }}>
                    <Link
                        style={{
                            ...styles.generalFont,
                            ...headerFont,
                            ...styles.generalLink,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects`}
                    >
                        /Projects
                    </Link>
                </div>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter
                }}>
                    <Link
                        style={{
                            ...styles.generalFont,
                            ...headerFont,
                            ...styles.generalLink,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects/${project.projectid}`}
                    >
                        /{project.title}
                    </Link>
                </div>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.bottomMargin15
                }}>
                    <Link
                        style={{
                            ...styles.generalFont,
                            ...headerFont,
                            ...styles.generalLink,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects/${project.projectid}/sdc`}
                    >
                        /Seismic Design Criteria
                    </Link>
                </div>

                {renderRow("SS", "Ss", "S1", "S1", 1)}

                {renderRow("FA", "Fa", "FV", "Fv", 2)}

                {renderRow("SMS", "SMS", "SM1", "SM1", 3)}

                {renderRow("SDS", "SDS", "SD1", "SD1", 4)}


                <div style={{...styles.generalContainer, ...styles.bottomMargin15, ...styles.alignCenter}}>
                            <span style={{...regularFont}}>{this.state.message}</span>
                </div>

            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects,
        company: state.company
    }
}
export default connect(mapStateToProps, actions)(SDC)