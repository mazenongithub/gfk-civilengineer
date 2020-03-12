import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { minus20, plus20, removeIconSmall } from './svg'
import { makeID, UnconfinedTest, UnconfinedTestData, sortdisplacement } from './functions';
import { loadChart } from './functions/loadchart';
import { Link } from 'react-router-dom';

class Unconfined extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, activeunid: false, loadreading: '', displacement: '' }
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

    getloadreading() {
        const gfk = new GFK();
        if (this.state.activeunid) {
            const sampleid = this.props.match.params.sampleid;
            const test = gfk.unconfinedtestdatabyid.call(this, sampleid, this.state.activeunid)
            if (test) {
                return (test.loadreading)
            }

        } else {
            return this.state.loadreading;
        }


    }

    handleloadreading(loadreading) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activeunid) {
                const unid = this.state.activeunid;
                const sampleid = this.props.match.params.sampleid;
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid);
                const j = gfk.unconfinedtestdatakeybyid.call(this, sampleid, unid);
                myuser.unconfinedtests.unconfined[i].testdata.data[j].loadreading = loadreading;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })


            } else {
                this.setState({ loadreading })
            }
        }
    }

    getdisplacement() {
        const gfk = new GFK();
        if (this.state.activeunid) {
            const sampleid = this.props.match.params.sampleid;
            const test = gfk.unconfinedtestdatabyid.call(this, sampleid, this.state.activeunid)
            if (test) {
                return (test.displacement)
            }

        } else {
            return this.state.displacement;
        }


    }
    removetestdata(unid) {
        const gfk = new GFK();
        const sampleid = this.props.match.params.sampleid;
        const data = gfk.unconfinedtestdatabyid.call(this, sampleid, unid);
        if (window.confirm(`Are you sure you want to delete Displacement ${data.displacement}?`)) {
            const myuser = gfk.getuser.call(this);
            if (myuser) {
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid);
                const j = gfk.unconfinedtestdatakeybyid.call(this, sampleid, unid);
                myuser.unconfinedtests.unconfined[i].testdata.data.splice(j, 1);
                if (myuser.unconfinedtests.unconfined[i].testdata.data.length === 0) {
                    delete myuser.unconfinedtests.unconfined[i].testdata.data;
                    delete myuser.unconfinedtests.unconfined[i].testdata;
                }
                this.props.reduxUser(myuser)
                this.setState({ activeunid: false })
            }


        }

    }
    maketestidactive(unid) {
        if (this.state.activeunid === unid) {
            this.setState({ activeunid: false })
        } else {
            this.setState({ activeunid: unid })
        }

    }
    loadlbs(dial) {
        let lbs = 0;
        const loadchart = loadChart();
        // eslint-disable-next-line
        loadchart.map(chart => {
            if (dial === chart.dial) {
                lbs = chart.loadlbs;
            }
        })
        return lbs;
    }

    showtestid(data) {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const removeIcon = gfk.getremoveicon.call(this);
        const sample = gfk.getsamplebyid.call(this, this.props.match.params.sampleid)


        const strain = () => {
            return (Number(data.displacement * .001) / Number(sample.samplelength))
        }
        const area = () => {
            return (.25 * Math.PI * Math.pow(sample.diameter, 2) / (1 - strain()))
        }
        const stress = () => {
            return (144 * (this.loadlbs(data.loadreading) / area()))
        }
        const activeid = () => {
            if (this.state.activeunid === data.unid) {
                return (styles.activefieldreport)
            } else {
                return;
            }
        }
        return (<div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }} key={data.unid}>
            <span style={{ ...activeid() }}
                onClick={() => { this.maketestidactive(data.unid) }}> Displacement {data.displacement} Loading Reading:{data.loadreading} Lbs:{this.loadlbs(data.loadreading)}lbs Stress: {Math.round(stress())}psf Strain: {Number(strain()).toFixed(3)}</span>
            <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removetestdata(data.unid) }}>
                {removeIconSmall()}
            </button>
        </div>)

    }

    showtestids() {
        const gfk = new GFK();
        const sampleid = this.props.match.params.sampleid;
        const unconfined = gfk.getunconfinedtestbyid.call(this, sampleid);

        let ids = [];
        if (unconfined) {
            if (unconfined.hasOwnProperty("testdata")) {

                const data = unconfined.testdata.data.sort((testa, testb) => {

                    return (sortdisplacement(testa, testb))
                })

                // eslint-disable-next-line
                data.map(testdata => {

                    ids.push(this.showtestid(testdata))
                })
            }
        }
        return ids;
    }

    handledisplacement(displacement) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activeunid) {
                const unid = this.state.activeunid;
                const sampleid = this.props.match.params.sampleid;
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid);
                const j = gfk.unconfinedtestdatakeybyid.call(this, sampleid, unid);
                myuser.unconfinedtests.unconfined[i].testdata.data[j].displacement = displacement;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })


            } else {
                this.setState({ displacement })
            }
        }
    }
    addtest() {
        const gfk = new GFK();
        const sampleid = this.props.match.params.sampleid;
        const unconfined = gfk.getunconfinedtestbyid.call(this, sampleid);
        const loadreading = this.state.loadreading;
        const displacement = this.state.displacement;
        const unid = makeID(16)
        const myuser = gfk.getuser.call(this);
        if (myuser) {
        
            if (unconfined) {
                const i = gfk.getunconfinedtestkeybyid.call(this, sampleid)
                const newData = UnconfinedTestData(unid, loadreading, displacement)
                if (unconfined.hasOwnProperty("testdata")) {

                    myuser.unconfinedtests.unconfined[i].testdata.data.push(newData)

                } else {
                    const testdata = { data: [newData] }
                    myuser.unconfinedtests.unconfined[i].testdata = testdata;
                }
                this.props.reduxUser(myuser)
                this.setState({ render: 'render', displacement: Number(this.state.displacement) + 20, loadreading: '' })
                this.loadReading.focus();
            } else {
                const sampleid = this.props.match.params.sampleid;
                const newTest = UnconfinedTest(unid, sampleid, loadreading, displacement)
                const tests = gfk.getunconfinedtests.call(this);
                if (tests) {
                    myuser.unconfinedtests.unconfined.push(newTest)
                } else {
                    const unconfinedtests = { unconfined: [newTest] }
                    myuser.unconfinedtests = unconfinedtests;
                }
                this.props.reduxUser(myuser)
                this.setState({ render: 'render', displacement: Number(this.state.displacement) + 20, loadreading: '' })
                this.loadReading.focus();
            }

        }
    }
    handleminus20() {
        if (this.state.displacement) {
            let displacement = Number(this.state.displacement);
            if (displacement >= 20) {
                displacement = displacement - 20;
                this.setState({ displacement, loadreading: '' })
                this.loadReading.focus();
            }

        }

    }
    showunconfinedchart() {
        const gfk = new GFK();
        const unconfined = gfk.getunconfinedtestbyid.call(this, this.props.match.params.sampleid)
        const sample = gfk.getsamplebyid.call(this, this.props.match.params.sampleid)
        const getmaxstrainunit = (maxstrain) => {

            let unit = 0.01
            if (maxstrain > .2) {
                unit = 0.06;
            } else if (maxstrain > .16) {
                unit = 0.05;
            } else if (maxstrain > .12) {
                unit = 0.04;
            } else if (maxstrain > .08) {
                unit = 0.03
            } else if (maxstrain > .04) {
                unit = 0.02
            }
            return unit;

        }
        const strainunit = () => {
            if (unconfined) {
                if (unconfined.hasOwnProperty("testdata")) {
                    const data = unconfined.testdata.data.sort((testa, testb) => {
                        return (sortdisplacement(testa, testb))
                    })


                    const samplelength = Number(sample.samplelength);
                    let key = unconfined.testdata.data.length - 1;
                    let maxstrain = Number(.001 * data[key].displacement) / Number(samplelength);

                    return getmaxstrainunit(maxstrain)

                }
            } else {
                return getmaxstrainunit(0)
            }

        }
        const getmaxstressunit = (stress) => {
            let unit = 125;
            if (stress > 15000) {
                unit = 5000;
            } else if (stress > 12000) {
                unit = 4000;
            } else if (stress > 8000) {
                unit = 3000;
            } else if (stress > 4000) {
                unit = 2000;
            } else if (stress > 2000) {
                unit = 1000;
            } else if (stress > 1000) {
                unit = 500;
            } else if (stress > 500) {
                unit = 250;
            }

            return unit;
        }
        const stress = (testdata) => {
            return (144 * (this.loadlbs(testdata.loadreading) / area(testdata)))
        }
        const strain = (testdata) => {
            return (Number(testdata.displacement * .001) / Number(sample.samplelength))
        }
        const area = (testdata) => {
            return (.25 * Math.PI * Math.pow(sample.diameter, 2) / (1 - strain(testdata)))
        }
        const stressunit = () => {
            let maxstress = 0;
            if (unconfined.hasOwnProperty("testdata")) {

                // eslint-disable-next-line
                unconfined.testdata.data.map(testdata => {
                    let calcstress = stress(testdata)
                    if (calcstress > maxstress) {
                        maxstress = calcstress;
                    }
                })
            }

            return getmaxstressunit(maxstress)


        }

        const getstresscurve = () => {
            let points = "0,0 ";
            if (unconfined) {

                if (unconfined.hasOwnProperty("testdata")) {
                    const data = unconfined.testdata.data.sort((testa, testb) => {

                        return (sortdisplacement(testa, testb))
                    })


                    // eslint-disable-next-line
                    data.map(testdata => {

                        let getstress = stress(testdata);
                        let getstrain = strain(testdata);

                        let x = (getstrain / strainunit()) * 200;
                        let y = (getstress / stressunit()) * 200;

                        points += `${x},${y} `
                    })
                }
            }
            return (<g transform="translate(165,803) scale(1,-1)">
                <polyline className="unchart-8" points={points} />
            </g>)
        }






        return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1025.85 903.16" > <defs><style></style></defs> <title>UnChart_1</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <rect className="unchart-1" x="165.11" y="3.16" width="200" height="200" /><rect className="unchart-1" x="365.11" y="3.16" width="200" height="200" /><rect className="unchart-1" x="565.11" y="3.16" width="200" height="200" /><rect className="unchart-1" x="765.11" y="3.16" width="200" height="200" /><rect className="unchart-1" x="165.11" y="203.16" width="200" height="200" /><rect className="unchart-1" x="365.11" y="203.16" width="200" height="200" /><rect className="unchart-1" x="565.11" y="203.16" width="200" height="200" /><rect className="unchart-1" x="765.11" y="203.16" width="200" height="200" /><rect className="unchart-1" x="165.11" y="403.16" width="200" height="200" /><rect className="unchart-1" x="365.11" y="403.16" width="200" height="200" /><rect className="unchart-1" x="565.11" y="403.16" width="200" height="200" /><rect className="unchart-1" x="765.11" y="403.16" width="200" height="200" /><rect className="unchart-1" x="165.11" y="603.16" width="200" height="200" /><rect className="unchart-1" x="365.11" y="603.16" width="200" height="200" /><rect className="unchart-1" x="565.11" y="603.16" width="200" height="200" /><rect className="unchart-1" x="765.11" y="603.16" width="200" height="200" />
                </g>
                <g id="grid">
                    <g id="Layer_3" data-name="Layer 3"><text className="unchart-2" transform="translate(491.08 878.9)">Strain</text><text className="unchart-2" transform="translate(18.51 323.64)">St<tspan className="unchart-3" x="38.11" y="0">r</tspan><tspan x="52.32" y="0">ess </tspan><tspan x="14.56" y="48">(ps</tspan>
                        <tspan className="unchart-4" x="71.69" y="48">f</tspan><tspan x="86.42" y="48">)</tspan></text>
                        <text className="unchart-5" transform="translate(46.17 25.66)">{4 * stressunit()}</text>
                        <text className="unchart-5" transform="translate(49.46 225.66)">{3 * stressunit()}</text>
                        <text className="unchart-5" transform="translate(50.74 425.66)">{2 * stressunit()}</text>
                        <text className="unchart-5" transform="translate(50.96 625.66)">{stressunit()}</text>
                        <text className="unchart-5" transform="translate(305.41 830.92)">{strainunit()}</text>
                        <text className="unchart-5" transform="translate(518.88 830.92)">{Number(2 * strainunit()).toFixed(2)}</text>
                        <text className="unchart-5" transform="translate(713.92 830.92)">{Number(3 * strainunit()).toFixed(2)}</text>
                        <text className="unchart-5" transform="translate(904.73 830.92)">{Number(4 * strainunit()).toFixed(2)}</text>
                        <rect className="unchart-7" x="165.11" y="3.16" width="800" height="800" />

                    </g>
                    {getstresscurve()}

                </g>
            </g>

        </svg>)
    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const headerFont = gfk.getHeaderFont.call(this);
        const project = gfk.getprojectbyid.call(this, this.props.match.params.projectid)
        const boring = gfk.getboringbyid.call(this, this.props.match.params.boringid)
        const sample = gfk.getsamplebyid.call(this, this.props.match.params.sampleid)
        const myuser = gfk.getuser.call(this);
        const projectid = this.props.match.params.projectid;
        const boringid = this.props.match.params.boringid;
        const regularFont = gfk.getRegularFont.call(this)
        const plusIcon = () => {
            if (this.state.width > 1200) {
                return ({ width: '101px', height: '66px' })
            } else if (this.state.width > 800) {
                return ({ width: '92px', height: '62px' })
            } else {
                return ({ width: '67px', height: '42px' })
            }
        }
        const fieldWidth = () => {
            if (this.state.width > 1200) {
                return ({ width: '190px' })
            } else if (this.state.width > 800) {
                return ({ width: '175px' })
            } else {
                return ({ width: '93px' })
            }
        }
        const fieldGap = () => {
            if (this.state.width > 1200) {
                return ({ marginLeft: '25px' })
            } else if (this.state.width > 800) {
                return ({ marginLeft: '20px' })
            } else {
                return;
            }
        }
        const showForm = () => {
            if (this.state.width > 1200) {

                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {plus20()}
                                </button>
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {minus20()}
                                </button>
                            </div>
                        </div>
                        <div style={{ ...styles.flex2 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldWidth() }}>
                                Displacement <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getdisplacement()}
                                    onChange={event => { this.handledisplacement(event.target.value) }}
                                />
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldGap() }}>
                                Load Reading <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getloadreading()}
                                    onChange={event => { this.handleloadreading(event.target.value) }}
                                    ref={(input) => { this.loadReading = input; }}
                                />
                            </div>

                        </div>
                    </div>
                )

            } else if (this.state.width > 800) {

                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {plus20()}
                                </button>
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }}>
                                    {minus20()}
                                </button>
                            </div>
                        </div>
                        <div style={{ ...styles.flex3 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldWidth() }}>
                                Displacement <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getdisplacement()}
                                    onChange={event => { this.handledisplacement(event.target.value) }}
                                />
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.floatLeft, ...fieldGap() }}>
                                Load Reading <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getloadreading()}
                                    onChange={event => { this.handleloadreading(event.target.value) }}
                                    ref={(input) => { this.loadReading = input; }}
                                />
                            </div>
                        </div>
                    </div>
                )

            } else {
                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <button style={{ ...styles.generalButton, ...plusIcon() }} onClick={() => { this.addtest() }}>
                                        {plus20()}
                                    </button>
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <button style={{ ...styles.generalButton, ...plusIcon() }} onClick={() => { this.handleminus20() }}>
                                        {minus20()}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                                Displacement <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getdisplacement()}
                                    onChange={event => { this.handledisplacement(event.target.value) }}
                                />
                            </div>

                        </div>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                                Load Reading <br />
                                <input type="text" style={{ ...styles.generalFont, ...regularFont, ...fieldWidth() }}
                                    value={this.getloadreading()}
                                    onChange={event => { this.handleloadreading(event.target.value) }}
                                    ref={(input) => { this.loadReading = input; }}
                                />
                            </div>
                        </div>
                    </div>
                )

            }
        }
        if (myuser) {
            const engineerid = myuser.engineerid;
            return (
                <div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15, }}>
                            <div style={{ ...styles.flex1, ...styles.alignCenter, ...headerFont, ...styles.boldFont }}>
                                Project Number {project.projectnumber} /{project.title} <br />
                                {project.address} {project.city} <br />
                                <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/gfk/projects/${projectid}/borings`}>Boring Number {boring.boringnumber}</Link> <br />
                                <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/gfk/projects/${projectid}/borings/${boringid}/samples`}> Depth {sample.depth} ft </Link> <br />
                                Unconfined
                            </div>
                        </div>
                        {showForm()}
                        {this.showtestids()}
                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1, ...regularFont, ...styles.generalFont, ...styles.alignCenter }}>
                                {this.state.message}
                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1 }}>
                                {gfk.showsaveboring.call(this)}
                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                            <div style={{ ...styles.flex1 }}>
                                {this.showunconfinedchart()}
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<span>&nbsp;</span>)
        }

    }

}

function mapStateToProps(state) {
    return {
        myuser: state.myuser
    }
}
export default connect(mapStateToProps, actions)(Unconfined);