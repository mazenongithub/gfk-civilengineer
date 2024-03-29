import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { minus20, plus20, removeIconSmall } from './svg'
import { UnconfinedTestData, sortdisplacement } from './functions';
import { loadChart } from './functions/loadchart';
import { Link } from 'react-router-dom';
import MakeID from './makeids';

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
        const unconfined = this.getUnconfinedTest();
        let loadreading = "";
        if (unconfined) {
            if (this.state.activeunid) {
                const boringid = this.props.match.params.boringid;
                const sampleid = this.props.match.params.sampleid;
                const unid = this.state.activeunid
                const test = gfk.unconfinedtestdatabyid.call(this, boringid, sampleid, unid)
                if (test) {
                    loadreading = (test.loadreading)
                }

            } else {
                loadreading = this.state.loadreading;
            }

        }
        return loadreading;


    }

    handleloadreading(loadreading) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const i = gfk.getboringkeybyid.call(this, boringid)
                const sampleid = this.props.match.params.sampleid;

                const sample = gfk.getsamplebyid.call(this, boringid, sampleid)

                if (sample) {
                    const j = gfk.getsamplekeybyid.call(this, boringid, sampleid)

                    if (sample.hasOwnProperty("unconfined")) {

                        if (this.state.activeunid) {
                            const unid = this.state.activeunid;
                            const k = gfk.unconfinedtestdatakeybyid.call(this, boringid, sampleid, unid);
                            myuser.borings[i].samples[j].unconfined[k].loadreading = loadreading;
                            this.props.reduxUser(myuser);
                            this.setState({ render: 'render' })


                        } else {
                            this.setState({ loadreading })
                        }


                    } else {

                        this.setState({ loadreading })


                    }

                }





            }

        }

    }


    getdisplacement() {
        const gfk = new GFK();
        const unconfined = this.getUnconfinedTest();
        let displacement = "";
        if (unconfined) {
            if (this.state.activeunid) {
                const boringid = this.props.match.params.boringid;
                const sampleid = this.props.match.params.sampleid;
                const unid = this.state.activeunid
                const test = gfk.unconfinedtestdatabyid.call(this, boringid, sampleid, unid)
                if (test) {
                    displacement = (test.displacement)
                }

            } else {
                displacement = this.state.displacement;
            }

        }
        return displacement;


    }
    removetestdata(unid) {
        const gfk = new GFK();
        const sampleid = this.props.match.params.sampleid;

        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const i = gfk.getboringkeybyid.call(this, boringid);
                const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
                if (sample) {
                    const j = gfk.getsamplekeybyid.call(this, boringid, sampleid);
                    if (sample.hasOwnProperty("unconfined")) {
                        const testdata = gfk.unconfinedtestdatabyid.call(this, boringid, sampleid, unid)
                        if (testdata) {
                            if (window.confirm(`Are you sure you want to delete Displacement ${testdata.displacement}?`)) {
                                const k = gfk.unconfinedtestdatakeybyid.call(this, boringid, sampleid, unid)
                                myuser.borings[i].samples[j].unconfined.splice(k, 1);
                                if (myuser.borings[i].samples[j].unconfined.length === 0) {
                                    delete myuser.borings[i].samples[j].unconfined
                                }
                                this.props.reduxUser(myuser)
                                this.setState({ activeunid: false })

                            }

                        }

                    }

                }
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
        const sample = this.getSample();


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
        const unconfined = this.getUnconfinedTest();

        let ids = [];
        if (unconfined) {


            const data = unconfined.sort((testa, testb) => {

                return (sortdisplacement(testa, testb))
            })

            // eslint-disable-next-line
            data.map(testdata => {

                ids.push(this.showtestid(testdata))
            })

        }
        return ids;
    }

    handledisplacement(displacement) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)
            if (boring) {
                const i = gfk.getboringkeybyid.call(this, boringid)
                const sampleid = this.props.match.params.sampleid;

                const sample = gfk.getsamplebyid.call(this, boringid, sampleid)

                if (sample) {
                    const j = gfk.getsamplekeybyid.call(this, boringid, sampleid)

                    if (sample.hasOwnProperty("unconfined")) {

                        if (this.state.activeunid) {
                            const unid = this.state.activeunid;
                            const k = gfk.unconfinedtestdatakeybyid.call(this, boringid, sampleid, unid);
                            myuser.borings[i].samples[j].unconfined[k].displacement = displacement;
                            this.props.reduxUser(myuser);
                            this.setState({ render: 'render' })


                        } else {
                            this.setState({ displacement })
                        }


                    } else {

                        this.setState({ displacement })


                    }

                }





            }

        }

    }

    addtest() {
        const gfk = new GFK();
        const makeid = new MakeID();
        const loadreading = this.state.loadreading;
        const displacement = this.state.displacement;
        const unid = makeid.unconfinedID.call(this)
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const boringid = this.props.match.params.boringid;
            const boring = gfk.getboringbyid.call(this, boringid)

            if (boring) {

                const i = gfk.getboringkeybyid.call(this, boringid)
                const sampleid = this.props.match.params.sampleid;

                const sample = gfk.getsamplebyid.call(this, boringid, sampleid)

                if (sample) {

                    const j = gfk.getsamplekeybyid.call(this, boringid, sampleid)
                    const newData = UnconfinedTestData(unid, loadreading, displacement)

                    if (sample.hasOwnProperty("unconfined")) {


                        myuser.borings[i].samples[j].unconfined.push(newData)

                    } else {
                   
                        myuser.borings[i].samples[j].unconfined =[newData];
                    }

                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render', displacement: Number(this.state.displacement) + 20, loadreading: '' })
                    this.loadReading.focus();


                }

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

    getUnconfinedTest() {
        const sample = this.getSample();
        let unconfined = false;
        if (sample) {
            if (sample.hasOwnProperty("unconfined")) {

                unconfined = sample.unconfined;
            }
        }
        return unconfined;
    }

    getSample() {
        const gfk = new GFK();
        const boringid = this.props.match.params.boringid;
        let getsample = false;
        const boring = gfk.getboringbyid.call(this, boringid)
        if (boring) {
            const sampleid = this.props.match.params.sampleid;
            const sample = gfk.getsamplebyid.call(this, boringid, sampleid)
            if (sample) {
                getsample = sample;
            }
        }
        return getsample;
    }
    showunconfinedchart() {
        const unconfined = this.getUnconfinedTest();
        const sample = this.getSample();
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

                const data = unconfined.sort((testa, testb) => {
                    return (sortdisplacement(testa, testb))
                })


                const samplelength = Number(sample.samplelength);
                let key = unconfined.length - 1;
                let maxstrain = Number(.001 * data[key].displacement) / Number(samplelength);

                return getmaxstrainunit(maxstrain)


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
            if (unconfined) {

                // eslint-disable-next-line
                unconfined.map(testdata => {
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


                const data = unconfined.sort((testa, testb) => {

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
        const regularFont = gfk.getRegularFont.call(this);
        const sampleid = this.props.match.params.sampleid
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
                            <div style={{ ...styles.generalContainer, ...styles.alignRight, ...styles.bottomMargin30 }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }} onClick={() => { this.addtest() }}>
                                    {plus20()}
                                </button>
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight, ...styles.bottomMargin30 }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10 }} onClick={() => { this.handleminus20() }}>
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
                            <div style={{ ...styles.generalContainer, ...styles.alignRight, ...styles.bottomMargin30 }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10, ...styles.bottomMargin15 }} onClick={() => { this.addtest() }}>
                                    {plus20()}
                                </button>
                            </div>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight, ...styles.bottomMargin30 }}>
                                <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.rightMargin10, ...styles.bottomMargin15 }} onClick={() => { this.handleminus20() }}>
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
                                <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.bottomMargin15 }}>
                                    <button style={{ ...styles.generalButton, ...plusIcon(), ...styles.bottomMargin15 }} onClick={() => { this.addtest() }}>
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

                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <Link
                                        style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink, ...styles.boldFont }}
                                        to={`/${engineerid}/projects/${projectid}/borings`}>
                                        /Borings
                                    </Link>
                                </div>

                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples`}>/Boring Number {boring.boringnumber} Samples</Link>
                                </div>

                                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                                    <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sampleid}/unconfined`}>/Depth: {sample.depth}ft  Unconfined </Link> <br />
                                </div>
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