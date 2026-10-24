import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { Link } from 'react-router-dom';
import GFK from './gfk'

class ViewReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,


        }
        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });

    }




    showSection(section, path) {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
        if (!section) return null;

        return (
            <div
                style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}
                key={section.sectionid}


            >
                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...styles.boldFont, ...regularFont }}>


                        {path.join('.')} </span>

                    <span style={{ ...styles.boldFont, ...regularFont }}>   {section.section}</span>
                </div>
                {section.content && (
                    <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.bottomMargin15}}>
                        {section.content}
                    </div>
                )}

                {section.subsections?.length > 0 && (
                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont, ...regularFont }}>
                        {section.subsections.map((subsection, index) => (
                            <React.Fragment
                                key={subsection.sectionid || index}
                            >
                                {this.showSection(subsection, [...path, index + 1])}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    getReport = () => {
        const gfk = new GFK();
        const { projectid, reportid } = this.props.match.params;

        return gfk.getReportByID.call(
            this,
            projectid,
            reportid
        );
    };

    showReport() {
        const report = this.getReport();

        if (!report || !report.sections) {
            return <div>Report not found.</div>;
        }

        return (
            <div className="vr-report">
                {report.sections.map((section, index) => (
                    <React.Fragment key={section.sectionid || index}>
                        {this.showSection(section, [index + 1])}
                    </React.Fragment>
                ))}
            </div>
        );
    }


    render() {



        const styles = MyStylesheet();
        const gfk = new GFK();
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this)
        const user = gfk.getUser.call(this)
        const { projectid, reportid } = this.props.match.params
        const project = gfk.getProjectById.call(this, projectid)
        const report = this.getReport();


        if (!project || !report || !user) {
            return <div>Loading report...</div>;
        }

        return (

            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>


                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

                    <Link
                        style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont }}
                        to={`/${user.engineerid}/projects`}>
                        /projects
                    </Link>
                    <Link
                        style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont }}
                        to={`/${user.engineerid}/projects/${project.projectid}`}>
                        /{project.title}
                    </Link>
                    <Link
                        style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont, ...styles.bottomMargin15 }}
                        to={`/${user.engineerid}/projects/${project.projectid}/reports`}>
                        /reports
                    </Link>
                    <Link
                        style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont, ...styles.bottomMargin15 }}
                        to={`/${user.engineerid}/projects/${project.projectid}/reports/${reportid}`}>
                        /{report.reporttitle}
                    </Link>
                    <Link
                        style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink, ...styles.boldFont, ...styles.bottomMargin15 }}
                        to={`/${user.engineerid}/projects/${project.projectid}/reports/${reportid}/viewreport`}>
                        /viewreport
                    </Link>




                </div>

                {this.showReport()}
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
export default connect(mapStateToProps, actions)(ViewReport)
