import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { calcdryden, moist } from './functions';
import UnconfinedCalcs from './unconfinedcalcs';
import SoilClassification from './soilclassification';


class LabSummary extends Component {

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 }
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

    showrows() {
        const gfk = new GFK();
        const projectid = this.props.match.params.projectid;
        const project = gfk.getprojectbyid.call(this, projectid)
        const unconfinedcalcs = new UnconfinedCalcs();
        let sampleno = '';
        let depth = '';
        let dryden = '';
        let moisturecontent = '';
        let ll = '';
        let pi = '';
        let maxstress = '';
        let maxstrain = '';
        let sieveresult = '';
        let rows = [];

        if (project) {
            const borings = gfk.getboringsbyprojectid.call(this, projectid)
            if (borings) {
                // eslint-disable-next-line 
                borings.map(boring => {
                    const boringid = boring.boringid;
                    const boringnumber = boring.boringnumber;
                    const samples = gfk.getsamplesbyboringid.call(this, boringid)
                    if (samples) {
                        // eslint-disable-next-line 
                        samples.map(sample => {

                            console.log(sample)
                            const sampleid = sample.sampleid;
                            sampleno = `${boringnumber}-${sample.sampleset}(${sample.samplenumber})`
                            depth = sample.depth;
                            dryden = calcdryden(sample.wetwgt_2, sample.wetwgt, sample.tarewgt, sample.drywgt, sample.diameter, sample.samplelength)
                            moisturecontent = Number(moist(sample.drywgt, sample.tarewgt, sample.wetwgt, sample.wetwgt_2) * 100).toFixed(1)
                            if (Number(sample.ll) > 0) {
                                ll = Number(sample.ll);
                            } else {
                                ll = '';
                            }
                            if (Number(sample.pi) > 0) {
                                pi = Number(sample.pi);
                            } else {
                                pi = '';
                            }

                            const unconfined = gfk.getunconfinedtestbyid.call(this, sampleid);
                            if (unconfined) {
                                maxstress = unconfinedcalcs.getMaxStress.call(this, sampleid)
                                maxstrain = unconfinedcalcs.getMaxStrain.call(this, sampleid)

                            } else {
                                maxstress = '';
                                maxstrain = '';
                            }

                            const sieve = gfk.getsievebysampleid.call(this, sampleid)

                            if (sieve) {
                                const netwgt = Number(sample.drywgt) - Number(sample.tarewgt);
                                const wgt34 = Number(sieve.wgt34)
                                const wgt38 = Number(sieve.wgt38)
                                const wgt4 = Number(sieve.wgt4)
                                const wgt10 = Number(sieve.wgt10)
                                const wgt30 = Number(sieve.wgt30)
                                const wgt40 = Number(sieve.wgt40)
                                const wgt100 = Number(sieve.wgt100)
                                const wgt200 = Number(sieve.wgt200)
                                const getSoilClassification = new SoilClassification(netwgt, ll, pi, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200)
                                const gravelfrac = Number(getSoilClassification.getGravFrac())
                                const sandfrac = Number(getSoilClassification.getSandFrac())
                                const fines = Number(getSoilClassification.getFines())

                                if (gravelfrac > 0) {
                                    sieveresult += ` Gravel ${gravelfrac}%,`
                                }
                                if (sandfrac > 0) {
                                    sieveresult += ` Sand ${sandfrac}%,`
                                }
                                if (fines > 0) {
                                    sieveresult += ` Fines ${fines}%`
                                }
                                

                            } else {
                                sieveresult=''
                            }


                            rows.push(this.showrow(sampleid, sampleno, depth, dryden, moisturecontent, ll, pi, maxstress, maxstrain, sieveresult))

                        })


                    }

                })



            }

        }
        return rows;



    }

    showrow(sampleid, sampleno, depth, dryden, moist, ll, pi, unconfined, strain, sieve) {
        const styles = MyStylesheet();
        return (<tr key={sampleid}>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{sampleno}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{depth}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{dryden}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{moist}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{ll}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{pi}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{unconfined}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{strain}</td>
            <td style={{ ...styles.showBorder, ...styles.alignCenter }}>{sieve}</td>
        </tr>)
    }


    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this)
        const engineerid = this.props.match.params.engineerid;
        const projectid = this.props.match.params.projectid;
        const regularFont = gfk.getRegularFont.call(this)
        const project = gfk.getprojectbyid.call(this, projectid)

        if (project) {

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
                        /{project.projectnumber} - {project.title}
                    </Link>
                </div>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                    <Link
                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                        to={`/${engineerid}/projects/${projectid}/labsummary`}>
                        /labsummary
                    </Link>
                </div>


                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>

                    <table width="99%" border="0" cellPadding="3">
                        <tbody>
                            <tr>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }} rowSpan="2">Sample No.</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }} rowSpan="2">Depth(ft)</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }} rowSpan="2">Dry Density (pcf)</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }} rowSpan="2">Moisture Content %</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }} colSpan="2">Atterberg Limits</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }} colSpan="2">Unconfined Compression</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }} rowSpan="2">Sieve Analysis</td>
                            </tr>
                            <tr>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }}>Liquid Limit%</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }}>Plastic Index</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }}>Strength (pcf)</td>
                                <td style={{ ...styles.showBorder, ...styles.alignCenter }}>Strain %</td>
                            </tr>
                            {this.showrows()}
                        </tbody>
                    </table>
                </div>


            </div>)

        } else {
            return (<div style={{ ...styles.generalContainer }}>
                <span style={{ ...regularFont }}>Project Not Found</span>
            </div>)
        }
    }
}

function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(LabSummary);