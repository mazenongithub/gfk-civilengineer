import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import GFK from './gfk';
import { MyStylesheet } from './styles';
// import { removeIconSmall } from './svg'
import { CreateSieve } from './functions';
import { Link } from 'react-router-dom';

class Sieve extends Component {
    constructor(props) {
        super(props);
        this.state = { render: '', width: 0, height: 0, wgt34: '', wgt38: '', wgt4: '', wgt10: '', wgt30: '', wgt40: '', wgt100: '', wgt200: '' }
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
    handlewgt34(wgt34) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt34 = wgt34;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt38 = this.state.wgt38;
                const wgt4 = this.state.wgt4;
                const wgt10 = this.state.wgt10;
                const wgt30 = this.state.wgt30;
                const wgt40 = this.state.wgt40;
                const wgt100 = this.state.wgt100;
                const wgt200 = this.state.wgt200;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }
                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt34: '' })

            }

        }

    }

    getwgt34() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt34
        } else {
            return this.state.wgt34;
        }
    }

    handlewgt38(wgt38) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt38 = wgt38;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt34 = this.state.wgt34;
                const wgt4 = this.state.wgt4;
                const wgt10 = this.state.wgt10;
                const wgt30 = this.state.wgt30;
                const wgt40 = this.state.wgt40;
                const wgt100 = this.state.wgt100;
                const wgt200 = this.state.wgt200;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }
                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt38: '' })

            }

        }

    }

    getwgt38() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt38
        } else {
            return this.state.wgt38;
        }
    }

    handlewgt4(wgt4) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt4 = wgt4;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt34 = this.state.wgt34;
                const wgt38 = this.state.wgt38;
                const wgt10 = this.state.wgt10;
                const wgt30 = this.state.wgt30;
                const wgt40 = this.state.wgt40;
                const wgt100 = this.state.wgt100;
                const wgt200 = this.state.wgt200;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }
                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt4: '' })

            }

        }

    }

    getwgt4() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt4
        } else {
            return this.state.wgt4;
        }
    }
    handlewgt10(wgt10) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt10 = wgt10;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt34 = this.state.wgt34;
                const wgt38 = this.state.wgt30;
                const wgt4 = this.state.wgt4;
                const wgt30 = this.state.wgt30;
                const wgt40 = this.state.wgt40;
                const wgt100 = this.state.wgt100;
                const wgt200 = this.state.wgt200;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }
                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt10: '' })

            }

        }

    }

    getwgt10() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt10
        } else {
            return this.state.wgt10;
        }
    }

    handlewgt30(wgt30) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt30 = wgt30;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt34 = this.state.wgt34;
                const wgt38 = this.state.wgt38;
                const wgt4 = this.state.wgt4;
                const wgt10 = this.state.wgt10;
                const wgt40 = this.state.wgt40;
                const wgt100 = this.state.wgt100;
                const wgt200 = this.state.wgt200;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }
                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt30: '' })

            }

        }

    }

    getwgt30() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt30
        } else {
            return this.state.wgt30;
        }
    }
    handlewgt40(wgt40) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt40 = wgt40;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt34 = this.state.wgt34;
                const wgt38 = this.state.wgt38;
                const wgt4 = this.state.wgt4;
                const wgt10 = this.state.wgt10;
                const wgt30 = this.state.wgt30;
                const wgt100 = this.state.wgt100;
                const wgt200 = this.state.wgt200;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }
                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt40: '' })

            }

        }

    }

    getwgt40() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt40
        } else {
            return this.state.wgt40;
        }
    }

    handlewgt100(wgt100) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt100 = wgt100;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt34 = this.state.wgt34;
                const wgt38 = this.state.wgt38;
                const wgt4 = this.state.wgt4;
                const wgt10 = this.state.wgt10;
                const wgt30 = this.state.wgt30;
                const wgt40 = this.state.wgt40;
                const wgt200 = this.state.wgt200;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }
                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt100: '' })

            }

        }

    }

    getwgt100() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt100
        } else {
            return this.state.wgt100;
        }
    }
    handlewgt200(wgt200) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
            if (sieve) {
                const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
                myuser.sieves.sieve[i].wgt200 = wgt200;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })

            } else {
                const sampleid = this.props.match.params.sampleid;
                const wgt34 = this.state.wgt34;
                const wgt38 = this.state.wgt38;
                const wgt4 = this.state.wgt4;
                const wgt10 = this.state.wgt10;
                const wgt30 = this.state.wgt30;
                const wgt40 = this.state.wgt40;
                const wgt100 = this.state.wgt100;
                const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
                const sieves = gfk.getsieves.call(this);
                if (sieves) {
                    myuser.sieves.sieve.push(newSieve);
                } else {
                    myuser.sieves = { sieve: [newSieve] }
                }

                this.props.reduxUser(myuser);
                this.setState({ render: 'render', wgt200: '' })

            }

        }

    }

    getwgt200() {
        const gfk = new GFK();
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
        console.log(sieve)
        if (sieve) {
            return sieve.wgt200
        } else {
            return this.state.wgt200;
        }
    }
    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const project = gfk.getprojectbyid.call(this, this.props.match.params.projectid)
        const boring = gfk.getboringbyid.call(this, this.props.match.params.boringid)
        const sample = gfk.getsamplebyid.call(this, this.props.match.params.sampleid)
        const headerFont = gfk.getHeaderFont.call(this)
        const regularFont = gfk.getRegularFont.call(this);
        const boringid = this.props.match.params.boringid;
        const myuser = gfk.getuser.call(this);
        const projectid = this.props.match.params.projectid;
        const sampleid = this.props.match.params.sampleid;
        if (myuser) {
            const engineerid = myuser.engineerid;

            return (<div style={{ ...styles.generalFlex }}>
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
                                <Link style={{ ...styles.generalLink, ...styles.boldFont, ...styles.headerFont }} to={`/${engineerid}/projects/${projectid}/borings/${boringid}/samples/${sampleid}/sieve`}> /Depth {sample.depth}ft Sieve Analysis </Link> <br />
                            </div>


                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont }}>&nbsp;</div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>Weight Retained (g)</div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>3/4"</div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt34()}
                            onChange={event => { this.handlewgt34(event.target.value) }}
                        /> </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>3/8"</div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt38()}
                            onChange={event => { this.handlewgt38(event.target.value) }}
                        /> </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>No. 4</div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt4()}
                            onChange={event => { this.handlewgt4(event.target.value) }} /> </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>No. 10 </div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt10()}
                            onChange={event => { this.handlewgt10(event.target.value) }}
                        /> </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>No. 30 </div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt30()}
                            onChange={event => { this.handlewgt30(event.target.value) }}
                        /> </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>No. 40 </div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt40()}
                            onChange={event => { this.handlewgt40(event.target.value) }} /> </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>No. 100 </div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt100()}
                            onChange={event => { this.handlewgt100(event.target.value) }} /> </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...headerFont, ...styles.boldFont, ...styles.alignCenter }}>No. 200 </div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...headerFont, ...styles.boldFont }}><input type="text" style={{ ...styles.generalField, ...regularFont, ...styles.generalFont }}
                            value={this.getwgt200()}
                            onChange={event => { this.handlewgt200(event.target.value) }}
                        /> </div>
                    </div>

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
export default connect(mapStateToProps, actions)(Sieve);