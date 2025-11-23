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
                const { projectid, boringid, sampleid } = this.props.match.params;
                const unid = this.state.activeunid
                const test = gfk.unconfinedTestDataById.call(this, projectid, boringid, sampleid, unid)
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
        const projects = gfk.getProjects.call(this)
        if (projects) {
            const { projectid, boringid, sampleid } = this.props.match.params;
            const project = gfk.getProjectById.call(this, projectid)
            if (project) {
                const i = gfk.getProjectKeyById.call(this, projectid)
                const boring = gfk.getBoringById.call(this, projectid,  boringid)

                if (boring) {
                    const j = gfk.getBoringKeyById.call(this, projectid, boringid)


                    const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid)

                    if (sample) {
                        const k = gfk.getSampleKeyById.call(this, projectid, boringid, sampleid)

                        if (sample.hasOwnProperty("unconfined")) {

                            if (this.state.activeunid) {
                                const unid = this.state.activeunid;
                                const l = gfk.unconfinedTestDataKeyById.call(this, projectid, boringid, sampleid, unid);
                                projects[i].borings[j].samples[k].unconfined[l].loadreading = loadreading;
                                this.props.reduxProjects(projects)
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

    }


    getDisplacement() {
        const gfk = new GFK();
        const unconfined = this.getUnconfinedTest();
        let displacement = "";

        if (unconfined) {
            if (this.state.activeunid) {
                const { projectid, boringid, sampleid } = this.props.match.params;
                const unid = this.state.activeunid;

                const test = gfk.unconfinedTestDataById.call(
                    this,
                    projectid,
                    boringid,
                    sampleid,
                    unid
                );

                if (test) {
                    displacement = test.displacement;
                }
            } else {
                displacement = this.state.displacement;
            }
        }

        return displacement;
    }

    handleDisplacement(displacement) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        if (projects) {
            const { projectid, boringid, sampleid } = this.props.match.params;
            const project = gfk.getProjectById.call(this, projectid);

            if (project) {
                const i = gfk.getProjectKeyById.call(this, projectid);
                const boring = gfk.getBoringById.call(this, projectid, boringid);

                if (boring) {
                    const j = gfk.getBoringKeyById.call(this, projectid, boringid);
                    const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid);

                    if (sample) {
                        const k = gfk.getSampleKeyById.call(this, projectid, boringid, sampleid);

                        if (sample.hasOwnProperty("unconfined")) {

                            if (this.state.activeunid) {
                                const unid = this.state.activeunid;
                                const l = gfk.unconfinedTestDataKeyById.call(
                                    this,
                                    projectid,
                                    boringid,
                                    sampleid,
                                    unid
                                );

                                projects[i]
                                    .borings[j]
                                    .samples[k]
                                    .unconfined[l]
                                    .displacement = displacement;

                                this.props.reduxProjects(projects);
                                this.setState({ render: "render" });
                            } else {
                                this.setState({ displacement });
                            }

                        } else {
                            this.setState({ displacement });
                        }
                    }
                }
            }
        }
    }


    removeTestData(unid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        if (!projects) return;

        const { projectid, boringid, sampleid } = this.props.match.params;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const projectKey = gfk.getProjectKeyById.call(this, projectid);

        const boring = gfk.getBoringById.call(this, projectid, boringid);
        if (!boring) return;

        const boringKey = gfk.getBoringKeyById.call(this, projectid, boringid);

        const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid);
        if (!sample) return;

        const sampleKey = gfk.getSampleKeyById.call(this, projectid, boringid, sampleid);

        // must have unconfined array
        if (!sample.unconfined) return;

        const testData = gfk.unconfinedTestDataById.call(
            this,
            projectid,
            boringid,
            sampleid,
            unid
        );
        if (!testData) return;

        if (!window.confirm(`Are you sure you want to delete Displacement ${testData.displacement}?`)) {
            return;
        }

        const testKey = gfk.unconfinedTestDataKeyById.call(
            this,
            projectid,
            boringid,
            sampleid,
            unid
        );

        if (testKey === false) return;

        // Remove the test entry
        projects[projectKey]
            .borings[boringKey]
            .samples[sampleKey]
            .unconfined
            .splice(testKey, 1);

        // If no tests left, delete the unconfined property
        const updatedSample = projects[projectKey].borings[boringKey].samples[sampleKey];
        if (updatedSample.unconfined.length === 0) {
            delete updatedSample.unconfined;
        }

        // Save changes
        this.props.reduxProjects(projects);
        this.setState({ activeunid: false });
    }


    makeTestIdActive(unid) {
        this.setState({
            activeunid: this.state.activeunid === unid ? false : unid
        });
    }

    loadLbs(dial) {
        const loadchart = loadChart();
        const entry = loadchart.find(chart => chart.dial === dial);
        return entry ? entry.loadlbs : 0;
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
            return (144 * (this.loadLbs(data.loadreading) / area()))
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
                onClick={() => { this.makeTestIdActive(data.unid) }}> Displacement {data.displacement} Loading Reading:{data.loadreading} Lbs:{this.loadLbs(data.loadreading)}lbs Stress: {Math.round(stress())}psf Strain: {Number(strain()).toFixed(3)}</span>
            <button style={{ ...styles.generalButton, ...removeIcon }} onClick={() => { this.removeTestData(data.unid) }}>
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



    addtest() {
        const gfk = new GFK();
        const makeid = new MakeID();
        const loadreading = this.state.loadreading;
        const displacement = this.state.displacement;
        const unid = makeid.unconfinedID.call(this)
        const projects = gfk.getProjects.call(this)
        if (projects) {
            const { projectid, boringid, sampleid } = this.props.match.params;

            const project = gfk.getProjectById.call(this, projectid)
            const i = gfk.getProjectKeyById.call(this, projectid)
            if (project) {
                const boring = gfk.getBoringById.call(this, projectid, boringid)

                if (boring) {

                    const j = gfk.getBoringKeyById.call(this, projectid, boringid)


                    const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid)

                    if (sample) {

                        const k = gfk.getSampleKeyById.call(this, projectid, boringid, sampleid)
                        const newData = UnconfinedTestData(unid, loadreading, displacement)

                        if (sample.hasOwnProperty("unconfined")) {


                            projects[i].borings[j].samples[k].unconfined.push(newData)

                        } else {

                            projects[i].borings[j].samples[k].unconfined = [newData];
                        }

                        this.props.reduxProjects(projects)
                        this.setState({ render: 'render', displacement: Number(this.state.displacement) + 20, loadreading: '' })
                        this.loadReading.focus();


                    }

                }

            }

        }
    }

   handleMinus20() {
    const displacement = Number(this.state.displacement);

    if (displacement >= 20) {
        this.setState({ displacement: displacement - 20, loadreading: "" });
        this.loadReading.focus();
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
        const { projectid, boringid, sampleid } = this.props.match.params;
        let getsample = false;
        const boring = gfk.getBoringById.call(this, projectid, boringid)
        if (boring) {
            const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid)
            if (sample) {
                getsample = sample;
            }
        }
        return getsample;
    }
    showunconfinedchart() {
           const unconfined = this.getUnconfinedTest() || [];
    const sample = this.getSample();

    // If no sample exists, bail out early
    if (!sample || !sample.samplelength || !sample.diameter) {
        return null;
    }

    const getmaxstrainunit = (maxstrain) => {
        if (maxstrain > 0.2) return 0.06;
        if (maxstrain > 0.16) return 0.05;
        if (maxstrain > 0.12) return 0.04;
        if (maxstrain > 0.08) return 0.03;
        if (maxstrain > 0.04) return 0.02;
        return 0.01;
    };

    const strainunit = () => {
        if (unconfined.length === 0) return getmaxstrainunit(0);

        const data = [...unconfined].sort(sortdisplacement);

        const last = data[data.length - 1];
        const samplelength = Number(sample.samplelength);

        if (!last || !last.displacement) return getmaxstrainunit(0);

        const maxstrain = (0.001 * Number(last.displacement)) / samplelength;
        return getmaxstrainunit(maxstrain);
    };

    const getmaxstressunit = (stress) => {
        if (stress > 15000) return 5000;
        if (stress > 12000) return 4000;
        if (stress > 8000) return 3000;
        if (stress > 4000) return 2000;
        if (stress > 2000) return 1000;
        if (stress > 1000) return 500;
        if (stress > 500) return 250;
        return 125;
    };

    const strain = (testdata) =>
        (Number(testdata.displacement) * 0.001) / Number(sample.samplelength);

    const area = (testdata) =>
        (0.25 * Math.PI * Math.pow(sample.diameter, 2)) / (1 - strain(testdata));

    const stress = (testdata) => {
        const lbs = this.loadLbs(testdata.loadreading || 0);
        return 144 * (lbs / area(testdata));
    };

    const stressunit = () => {
        let maxstress = 0;

        for (const t of unconfined) {
            const s = stress(t);
            if (s > maxstress) maxstress = s;
        }

        return getmaxstressunit(maxstress);
    };

    const getstresscurve = () => {
        let points = "0,0 ";

        if (unconfined.length > 0) {
            const data = [...unconfined].sort(sortdisplacement);

            for (const t of data) {
                const s = stress(t);
                const e = strain(t);

                const x = (e / strainunit()) * 200;
                const y = (s / stressunit()) * 200;

                points += `${x},${y} `;
            }
        }

        return (
            <g transform="translate(165,803) scale(1,-1)">
                <polyline className="unchart-8" points={points} />
            </g>
        );
    };






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
        const {projectid, boringid, sampleid} = this.props.match.params;
        const project = gfk.getProjectById.call(this, projectid)
        const boring = gfk.getBoringById.call(this, projectid, boringid)
        const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid)
    
        const regularFont = gfk.getRegularFont.call(this);
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
                                    value={this.getDisplacement()}
                                    onChange={event => { this.handleDisplacement(event.target.value) }}
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
                                    value={this.getDisplacement()}
                                    onChange={event => { this.handleDisplacement(event.target.value) }}
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
                                    value={this.getDisplacement()}
                                    onChange={event => { this.handleDisplacement(event.target.value) }}
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
        if (project) {

            if(boring) {
            
            const engineerid = 'mazen'
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
        } else {
            return (<span>&nbsp;</span>)
        }

    }

}

function mapStateToProps(state) {
    return {
        projects: state.projects,
        myuser:state.myuser
    }
}
export default connect(mapStateToProps, actions)(Unconfined);