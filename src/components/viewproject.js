import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';

class ViewProject extends Component {

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

    getProject() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getprojectbyid.call(this,projectid)
        if(project) {
            return project
        } else {
            return false;
        }
    }
    getProjectKey() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const projectkey = gfk.getprojectkeybyid.call(this,projectid)
        return projectkey;
    }

    getScopeofWork() {
        const project = this.getProject();
        let scopeofwork = '';
        if(project) {
            scopeofwork = project.proposedproject;

        }
        return scopeofwork;

    }

    handleScopeofWork(value) {
        const gfk = new GFK();
        const myuser =gfk.getuser.call(this)
        if(myuser) {
           
            const project = this.getProject();
            if(project) {
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
        const project = gfk.getprojectbyid.call(this, projectid)

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
                    <div style={{ ...styles.generalContainer,...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects`}>
                            /projects
                        </Link>
                    </div>
                    <div style={{ ...styles.generalContainer,...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}`}>
                            /{project.projectnumber} - {project.title}
                        </Link>
                    </div>

                    <div style={{...styles.generalContainer, ...styles.bottomMargin15}}>
                        <textarea style={{...styles.generalField, ...regularFont, ...styles.generalFont, ...styles.minHeight150}}
                        value={this.getScopeofWork()}
                        onChange={event=>{this.handleScopeofWork(event.target.value)}}>

                        </textarea>
                        <div style={{...styles.generalContainer}}>
                            <span style={{...styles.generalFont, ...regularFont}}>Scope of Work</span>
                        </div>
                    </div>

                    <div style={{...styles.generalFlex, ...styles.bottomMargin15}}>
                        <div style={{...styles.flex1, ...styles.alignCenter}}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/borings`}>
                           /Borings
                        </Link>
                        </div>
                        <div style={{...styles.flex1, ...styles.alignCenter}}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/fieldreports`}>
                            /FieldReports
                        </Link>
                        </div>
                    </div>
                    <div style={{...styles.generalFlex, ...styles.bottomMargin15}}>
                        <div style={{...styles.flex1, ...styles.alignCenter}}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/labsummary`}>
                            /Lab Summary
                        </Link>
                        </div>
                        <div style={{...styles.flex1, ...styles.alignCenter}}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                            to={`/${engineerid}/projects/${projectid}/fieldreports`}>
                            &nbsp;
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
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(ViewProject)