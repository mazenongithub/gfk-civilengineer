import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import { Link } from 'react-router-dom';
import GFK from './gfk';
import { milestoneformatdatestring } from './functions'
class ViewFieldReport extends Component {
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
    getFieldReport() {
        const gfk = new GFK();
        const fieldid = this.props.match.params.fieldid;

        let getfieldreport = false;
        const fieldreport = gfk.getfieldreportbyid.call(this,fieldid)
        if(fieldreport) {
            getfieldreport = fieldreport;
        }
        return getfieldreport;


    }

    compactionReport() {
        let compactionreport = false;
        const gfk = new GFK();
        const fieldid = this.props.match.params.fieldid;
        const fieldreport = gfk.getfieldreportbyid.call(this,fieldid)
        if(fieldreport.hasOwnProperty("compactiontests")) {
            compactionreport = true;
        }
        return compactionreport;
       
    }

    showcompactioncurves() {
        let curves = this.getcompactioncurves();
        let showcurves = [];
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
        const compactiontests = this.getCompactionTests()
        const title = () => {
            return (
                <div style={{ ...styles.generalFlex, ...styles.generalFont }}>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                            Curve No.
                        </span>
                    </div>
                    <div style={{...styles.flex3, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                            Description
                        </span>
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                            Max. Density (p.c.f)
                        </span>
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                            Moisture %
                        </span>
                    </div>

                </div>
            )

        }
        if (compactiontests.length>0) {
            showcurves.push(title())
            // eslint-disable-next-line
            curves.map(curve=> {
                showcurves.push(

                    <div style={{ ...styles.generalFlex, ...styles.generalFont }}>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                           {curve.curvenumber}
                        </span>
                    </div>
                    <div style={{...styles.flex3, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                           {curve.description}
                        </span>
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                            {curve.maxden}
                        </span>
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...styles.showBorder}}>
                        <span style={{...regularFont}}>
                            {curve.moist}%
                        </span>
                    </div>

                </div>

                )
            })


        }
        return showcurves;

    }

    getcompactioncurves() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getprojectbyid.call(this, projectid)
        let curves = [];
        if (project) {
            if (this.compactionReport()) {
                const compactioncurves = gfk.getcurves.call(this)
                // eslint-disable-next-line
                compactioncurves.map(curve => {
                    if (curve.projectid === projectid) {
                        curves.push(curve)
                    }
                })
            }

        }
        curves.sort((a, b) => {
            if (Number(a.curvenumber) >= Number(b.curvenumber)) {
                return 1;
            } else {
                return -1
            }
        })
        return curves;
    }



    getCompactionTests() {
        const gfk = new GFK();
        const fieldid = this.props.match.params.fieldid;
    
        const compactiontests = gfk.getcompactiontestsbyfieldid.call(this,fieldid)
        console.log(compactiontests)
        if(compactiontests) {
        compactiontests.sort((a, b) => {
            if (Number(a.testnum) >= Number(b.testnum)) {
                return 1;
            } else {
                return -1
            }
        })

    }
    
       return compactiontests;
    }

    getcurvenumber(curveid) {
        const gfk = new GFK();
        let curvenumber = '';
        let curve = gfk.getcurvebyid.call(this,curveid)
        if(curve) {
            curvenumber = curve.curvenumber;
        }
        return curvenumber;

    }

    showCompactionTests() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        let table = [];
        const regularFont = gfk.getRegularFont.call(this)
        const title = () => {
            return(
                <div style={{...styles.generalFlex, ...styles.generalFont}}>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Test No.
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        El.
                    </div>
                    <div style={{...styles.flex3, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Location
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Wet Den. (p.c.f)
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Moisture (p.c.f)
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Dry Den. (p.c.f)
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Moisture %
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Max Den. (p.c.f)
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Relative %
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        Curve No.
                    </div>
                </div>
            )


        }
        const tests = this.getCompactionTests();
        if(tests.length>0) {
     
            table.push(title())
            // eslint-disable-next-line
            tests.map(test=> {
              
                table.push(
                  

                    <div style={{...styles.generalFlex, ...styles.generalFont}}>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.testnum}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.elevation}
                    </div>
                    <div style={{...styles.flex3, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.location}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.wetpcf}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.moistpcf}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.dryden}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.moist}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.maxden}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                        {test.relative}
                    </div>
                    <div style={{...styles.flex1, ...styles.alignCenter, ...regularFont,...styles.showBorder}}>
                       {this.getcurvenumber(test.curveid)}
                    </div>
                </div>

                )
            })

        }
        return table;
    }

    getReport() {
        const gfk = new GFK();
        const fieldid = this.props.match.params.fieldid
        let report = false;
        report = gfk.getfieldreportbyid.call(this, fieldid);
        return report;
    }

    getfieldimages() {
        const fieldid = this.props.match.params.fieldid;
        const gfk = new GFK();
        const fieldimages = gfk.getimagesbyfieldid.call(this,fieldid);
       
        return fieldimages;

    }

    showfieldimages() {
        const fieldimages = this.getfieldimages()
        let images = [];
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        
        if(fieldimages.length>0) {
           
            // eslint-disable-next-line
            fieldimages.map(fieldimage=> {
                images.push(
                    <div style={{...styles.generalContainer, ...styles.generalFont, ...styles.bottomMargin15}} key={fieldimage.imageid}>
                        <div style={{...styles.generalContainer, ...styles.alignCenter}}>
                            <img src={fieldimage.image} alt={fieldimage.caption} />
                        </div>
                        <div style={{...styles.generalContainer, ...styles.alignCenter}}>
                            <span style={{...regularFont}}>{fieldimage.caption}</span>
                        </div>
                    </div>


                )
            })
        }
        return images;
        
    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getprojectbyid.call(this, projectid)
        const engineerid = this.props.match.params.engineerid;
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this);
        const fieldid = this.props.match.params.fieldid;
        const report = this.getFieldReport();

        if (project) {

            if (report) {

                const datereport = milestoneformatdatestring(report.datereport)

                return (<div style={{ ...styles.generalContainer }}>
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
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}`}>
                            /{project.projectnumber} - {project.title} {project.address} {project.city}
                        </Link>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/fieldreports`}>
                            /fieldreports
                        </Link>
                    </div>
                    <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                        <Link
                            style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                            to={`/${engineerid}/projects/${projectid}/fieldreports/${fieldid}`}>
                            /{datereport}
                        </Link>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                        <span style={{ ...styles.generalFont, ...regularFont }}>
                            {report.content}
                        </span>
                    </div>

                    <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                        {this.showcompactioncurves()}
                    </div>

                    <div style={{ ...styles.generalContainer,...styles.bottomMargin15 }}>
                        {this.showCompactionTests()}
                    </div>

                    <div style={{...styles.generalContainer, ...styles.bottomMargin15}}>
                        {this.showfieldimages()}
                    </div>

                </div>)

            } else {
                return (<div style={{ ...styles.generalContainer }}>
                    <span style={{ ...styles.generalFont, ...regularFont }}>Report Not Found</span>
                </div>)
            }

        } else {
            return (<div style={{ ...styles.generalContainer }}>
                <span style={{ ...styles.generalFont, ...regularFont }}>Project Not Found</span>
            </div>)
        }
    }


}

function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(ViewFieldReport);