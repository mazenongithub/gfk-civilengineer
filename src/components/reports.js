import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { Link } from 'react-router-dom';
import { formatDate } from './functions'
import { doneIcon, editIcon, gotoIcon, saveReportIcon } from './svg';
import GFK from './gfk'
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import MakeID from './makeids'

class Reports extends Component {

    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, message: '' }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }

    async componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();

    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getReportProp(prop) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const { activereportid } = this.state;

        const project = gfk.getProjectById.call(this, projectid);

        if (!project || !project.reports || !activereportid) {
            return "";
        }

        const report = project.reports.find(
            report => report.reportid === activereportid
        );

        if (!report) return ""

        return report[prop];
    }

    setReportProp(prop, value) {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;
        const makeid = new MakeID()

        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return;

        if (!project.reports) {
            project.reports = [];
        }

        let { activereportid } = this.state;

        // Create a new report if one is not active
        if (!activereportid) {
            activereportid = makeid.reportid.call(this);

            const report = {
                reportid: activereportid,
                projectid,
                reporttitle: '',
                type: '',
                author: '',
                datereport: new Date(),
                sections: []
            };

            project.reports.push(report);

            this.setState({ activereportid }, () => {
                report[prop] = value;

                this.props.reduxProjects(this.props.projects);
            });

            return;
        }

        // Find the active report
        const report = project.reports.find(
            r => r.reportid === activereportid
        );

        if (!report) return;

        // Update the requested property
        report[prop] = value;

        // Update Redux
        this.props.reduxProjects(this.props.projects);
        this.forceUpdate();
    }

    showReports() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        const reports = gfk.getReportsByProject.call(this, projectid) || [];

        return reports.map(report => this.showReport(report));
    }

    toggleStateActive(reportid) {
        this.setState(prevState => ({
            activereportid:
                prevState.activereportid === reportid
                    ? null
                    : reportid
        }));
    }

    saveReports() {
        console.log("savereports")
    }

    showReport(report) {
        const styles = MyStylesheet();
        const gfk = new GFK();

        const user = gfk.getUser.call(this);
        const { projectid } = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid);




        if (!user || !project || !report) return null;

        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this);

        const gotoIconWidth = { width: '91px' };
        const activebackground = this.state.activereportid === report.reportid ? styles.activefieldreport : ""

        const getIcon = this.state.activereportid === report.reportid ? doneIcon() : editIcon();
        const getIconWidth = { width: '5em' }
        return (
            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>

                <div style={{ ...styles.flex1 }}>

                    <button onClick={() => { this.toggleStateActive(report.reportid) }}
                        style={{ ...getIconWidth, ...styles.generalButton }}>{getIcon}</button>

                </div>

                <div style={{ ...styles.flex5 }}>
                    <Link
                        to={`/${user.engineerid}/projects/${project.projectid}/reports/${report.reportid}`}
                        style={{ ...styles.generalLink, ...styles.generalFont, ...regularFont }}
                    >
                        <span style={{...activebackground}}>
                            {formatDate(report.datereport)}
                        </span>

                        <span style={{ ...styles.marginLeft15, ...activebackground }}>{report.reporttitle}</span>

                        <button style={{ ...styles.generalButton, ...gotoIconWidth, ...activebackground }}>
                            {gotoIcon()}
                        </button>
                    </Link>

                </div>
            </div>
        );
    }




    render() {
        const styles = MyStylesheet();
        const gfk = new GFK();

        const user = gfk.getUser.call(this);
        const { projectid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);
        const saveIconWidth = this.state.width > 900 ? { width: '120px' } : { width: '90px' }

        if (!user || !project) {
            return <div style={styles.generalContainer}>Loading...</div>;
        }

        const headerFont = gfk.getHeaderFont.call(this);
        const regularFont = gfk.getRegularFont.call(this)

        return (
            <div style={{ ...styles.generalContainer, ...styles.marginLeft15 }}>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                    <Link
                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                        to={`/${user.engineerid}/projects`}>
                        /Projects
                    </Link>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter}}>
                    <Link
                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                        to={`/${user.engineerid}/projects/${project.projectid}`}>
                        /{project.title}
                    </Link>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                    <Link
                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont, ...styles.bottomMargin15 }}
                        to={`/${user.engineerid}/projects/${project.projectid}/reports`}>
                        /Reports
                    </Link>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont }}><span style={{ ...regularFont }}>Date Report</span></div>
                            <Datetime
                                value={this.getReportProp("datereport") ? moment(this.getReportProp("datereport"))
                                    : null}
                                onChange={(date) => { this.setReportProp("datereport", date) }}
                                timeFormat={false}
                                dateFormat="MM/DD/YYYY"
                                inputProps={{
                                    style: { ...styles.generalFont, ...regularFont, ...styles.generalField, ...styles.mediumWidth }
                                }} // disables the time picker
                            />
                        </div>
                        <div style={{ ...styles.flex1, ...styles.generalFont }}>

                            <select style={{ ...regularFont, ...styles.generalField }}
                                value={this.getReportProp("type")}
                                onChange={event => { this.setReportProp("type", event.target.value) }}>
                                <option value="">Select Report Type</option>
                                <option value="Geotechnical Investigation Report">Geotechnical Investigation Report </option>
                                <option value="Proposal">Proposal </option>
                                <option value="Grading/Compaction">Grading/Compaction</option>
                                <option value="Other Technical">Other Technical </option>
                            </select>
                        </div>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15, ...styles.generalFont }}>
                        <div style={{ ...styles.generalContainer, ...styles.generalFont }}><span style={{ ...regularFont }}>Report Title</span></div>
                        <input type="text" style={{ ...styles.generalField, ...regularFont }}
                            value={this.getReportProp("reporttitle")}
                            onChange={event => { this.setReportProp("reporttitle", event.target.value) }} />
                    </div>


                </div>

            

                {this.showReports()}



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
export default connect(mapStateToProps, actions)(Reports)