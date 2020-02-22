import React from 'react';
import { saveBoringIcon } from './svg'
import { MyStylesheet } from './styles';
import { SaveBorings } from './actions/api'
import { inputUTCStringForLaborID, Boring, Sample, CreateSieve } from './functions'
class GFK {

    getuser() {
        let myuser = false;
        if (this.props.myuser) {
            myuser = this.props.myuser;

        }
        return myuser;
    }
    getSmallFont() {

        if (this.state.width > 800) {
            return ({ fontSize: '20px' })
        } else {
            return ({ fontSize: '18px' })
        }

    }
    getremoveicon() {
        if (this.state.width > 800) {
            return ({ width: '47px', height: '47px' })
        } else {
            return ({ width: '36px', height: '36px' })
        }
    }
    getfieldreports() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let fieldreport = false;
        if (myuser) {
            if (myuser.hasOwnProperty("fieldreports")) {
                // eslint-disable-next-line
                fieldreport = myuser.fieldreports.fieldreport;
            }
        }

        return fieldreport;
    }
    getcurvebyid(curveid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let curves = false;
        if (myuser) {
            if (myuser.hasOwnProperty("compactioncurves")) {
                // eslint-disable-next-line
                myuser.compactioncurves.compactioncurve.map(curve => {
                    if (curve.curveid === curveid) {
                        curves = curve;
                    }
                })
            }
        }
        return curves;
    }
    getcompactiontests() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let tests = false;
        if (myuser.hasOwnProperty("compactiontests")) {
            tests = myuser.compactiontests.compactiontest;
        }
        return tests;
    }
    getcompactiontestbyid(testid) {
        const gfk = new GFK();
        let tests = false;
        const compactiontests = gfk.getcompactiontests.call(this)
        if (compactiontests.hasOwnProperty("length")) {
            // eslint-disable-next-line
            compactiontests.map(test => {
                if (test.testid === testid) {
                    tests = test;
                }
            })
        }
        return tests;
    }
    getcompactiontestkeybyid(testid) {
        const gfk = new GFK();
        let key = false;
        const compactiontests = gfk.getcompactiontests.call(this)
        if (compactiontests.hasOwnProperty("length")) {
            // eslint-disable-next-line
            compactiontests.map((test, i) => {
                if (test.testid === testid) {
                    key = i;
                }
            })
        }
        return key;

    }
    getreporticon() {
        if (this.state.width > 1200) {
            return ({ width: '364px', height: '87px' })
        } else if (this.state.width > 800) {
            return ({ width: '300px', height: '75px' })
        } else {
            return ({ width: '229px', height: '64px' })
        }
    }
    getfieldreportbyprojectid(projectid) {
        const gfk = new GFK();
        const reports = gfk.getfieldreports.call(this);
        let myreports = [];
        if (reports.length > 0) {
            // eslint-disable-next-line
            reports.map(report => {
                if (report.projectid === projectid) {
                    myreports.push(report)
                }
            })
        }
        return myreports;
    }
    getfieldimagesbyid(fieldid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let images = [];
        if (myuser.hasOwnProperty("images")) {
            // eslint-disable-next-line
            myuser.images.image.map(image => {
                if (image.fieldid === fieldid) {
                    images.push(image)
                }
            })
        }
        return images;
    }
    getuploadbutton() {
        if (this.state.width > 1200) {
            return ({ width: '364px', height: '77px' })
        } else if (this.state.width > 800) {
            return ({ width: '241px', height: '53px' })
        } else {
            return ({ width: '155px', height: '44px' })
        }
    }
    getthumbimage() {
        if (this.state.width > 1200) {
            return ({ width: '468px', height: '253px' })
        } else if (this.state.width > 800) {
            return ({ width: '310px', height: '175px' })
        } else {
            return ({ width: '155px', height: '134px' })
        }
    }
    getimages() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let images = false;
        if (myuser) {
            if (myuser.hasOwnProperty("images")) {
                images = myuser.images.image;
            }
        }
        return images;
    }
    getimagekeybyid(imageid) {
        const gfk = new GFK();
        const images = gfk.getimages.call(this)
        let key = false;
        if (images) {
            // eslint-disable-next-line
            images.map((image, i) => {
                if (image.imageid === imageid) {
                    key = i;

                }
            })
        }
        return key;

    }
    getimagebyid(imageid) {
        const gfk = new GFK();
        const images = gfk.getimages.call(this)
        let myimage = false;
        if (images) {
            // eslint-disable-next-line
            images.map((image) => {
                if (image.imageid === imageid) {
                    myimage = image;

                }
            })
        }
        return myimage;

    }
    getcompactiontestsbyfieldid(fieldid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let compactiontests = [];
        if (myuser) {
            if (myuser.hasOwnProperty("compactiontests")) {
                // eslint-disable-next-line
                myuser.compactiontests.compactiontest.map(test => {
                    if (test.fieldid === fieldid) {
                        const testid = test.testid;
                        const testnum = test.testnum;
                        const elevation = test.elevation;
                        const location = test.location;
                        const wetpcf = test.wetpcf;
                        const moistpcf = test.moistpcf;
                        const timetest = test.timetest;


                        const curve = gfk.getcurvebyid.call(this, test.curveid);
                        const dryden = () => {

                            if (wetpcf && moistpcf) {
                                return (Number(Number(wetpcf) - Number(moistpcf)).toFixed(1));
                            } else {
                                return 0;
                            }
                        }
                        const moist = () => {

                            if (test.moistpcf && test.wetpcf) {
                                let dryden = Number(test.wetpcf) - Number(test.moistpcf);

                                return (Number((Number(test.moistpcf) / Number(dryden)) * 100).toFixed(1));
                            } else {
                                return 0;
                            }
                        }
                        const maxden = () => {
                            if (curve.maxden) {
                                return (Number(curve.maxden));
                            } else {
                                return (0)
                            }
                        }

                        const relative = () => {


                            if (curve.maxden && test.wetpcf && test.moistpcf) {
                                let maxden = Number(curve.maxden)
                                let dryden = Number(test.wetpcf) - Number(test.moistpcf);

                                return (Math.round((dryden / maxden) * 100))
                            } else {
                                return 0;
                            }

                        }
                        const calcrelative = relative();
                        const calcdryden = dryden();
                        const calcmoist = moist()
                        const calcmaxden = maxden();
                        const curveid = curve.curveid;
                        compactiontests.push({ testid, testnum, timetest, elevation, location, wetpcf, moistpcf, dryden: calcdryden, moist: calcmoist, maxden: calcmaxden, relative: calcrelative, curveid })

                    }
                })

            }

        }

        return compactiontests;
    }
    getfieldkeybyid(fieldid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let key = false;
        if (myuser) {
            if (myuser.hasOwnProperty("fieldreports")) {
                // eslint-disable-next-line
                myuser.fieldreports.fieldreport.map((report, i) => {
                    if (report.fieldid === fieldid) {
                        key = i;
                    }
                })
            }
        }
        return key;
    }
    getfieldreportbyid(fieldid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let fieldreport = false;
        if (myuser) {
            if (myuser.hasOwnProperty("fieldreports")) {
                // eslint-disable-next-line
                myuser.fieldreports.fieldreport.map((report) => {
                    if (report.fieldid === fieldid) {
                        fieldreport = report;
                    }
                })
            }
        }
        return fieldreport;
    }
    getprojects() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let projects = false;
        if (myuser.hasOwnProperty("projects")) {
            projects = myuser.projects.project;
        }
        return projects;
    }
    getprojectbyid(projectid) {
        const gfk = new GFK();
        const projects = gfk.getprojects.call(this);
        let project = false;
        if (projects) {
            // eslint-disable-next-line
            projects.map(myproject => {
                if (myproject.projectid === projectid) {
                    project = myproject;

                }
            })
        }
        return project;
    }
    getfieldreportkeybyid(fieldid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let key = false;
        if (myuser) {
            if (myuser.hasOwnProperty("fieldreports")) {
                // eslint-disable-next-line
                myuser.fieldreports.fieldreport.map((report, i) => {
                    if (report.fieldid === fieldid) {
                        key = i;
                    }
                })
            }
        }
        return key;
    }
    getcurves() {
        const gfk = new GFK();
        let curves = false;
        const myuser = gfk.getuser.call(this)
        if (myuser) {
            if (myuser.hasOwnProperty("compactioncurves")) {
                curves = myuser.compactioncurves.compactioncurve;
            }
        }
        return curves;
    }

    getprojectidfromfieldid(fieldid) {
        const gfk = new GFK();
        const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
        let projectid = "";
        if (projectid) {
            projectid = fieldreport.projectid;
        }
        return projectid;
    }
    getRegularFont() {

        if (this.state.width > 800) {
            return ({ fontSize: '30px' })
        } else {
            return ({ fontSize: '24px' })
        }

    }
    getHeaderFont() {

        if (this.state.width > 800) {
            return ({ fontSize: '40px' })
        } else {
            return ({ fontSize: '30px' })
        }

    }
    getsamplebyid(sampleid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let samples = false;
        if (myuser.hasOwnProperty("samples")) {
            // eslint-disable-next-line
            myuser.samples.sample.map(sample => {
                if (sample.sampleid === sampleid) {
                    samples = sample;

                }
            })
        }

        return samples;
    }
    getsamplekeybyid(sampleid) {

        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let key = false;
        if (myuser.hasOwnProperty("samples")) {
            // eslint-disable-next-line
            myuser.samples.sample.map((sample, i) => {
                if (sample.sampleid === sampleid) {
                    key = i;

                }
            })
        }

        return key;
    }
    getsieveanalysisbysampleid(sampleid) {
        return false;
    }
    getunconfinedbysampleid(sampleid) {
        return false;
    }
    getsieves() {
        const gfk = new GFK();
        let sieves = false;
        const myuser = gfk.getuser.call(this)

        if (myuser.hasOwnProperty("sieves")) {
            sieves = myuser.sieves.sieve;
        }
        return sieves;
    }
    getsievebysampleid(sampleid) {
        const gfk = new GFK();
        const sieves = gfk.getsieves.call(this);

        let sieve = false;
        if (sieves.length > 0) {
            // eslint-disable-next-line
            sieves.map(samplesieve => {
                if (samplesieve.sampleid === sampleid) {
                    sieve = samplesieve;
                }
            })
        }
        return sieve;

    }
    getsievekeybysampleid(sampleid) {
        const gfk = new GFK();
        const sieves = gfk.getsieves.call(this);
        let key = false;
        if (sieves.length) {
            // eslint-disable-next-line
            sieves.map((samplesieve, i) => {
                if (samplesieve.sampleid === sampleid) {
                    key = i;
                }
            })
        }
        return key;

    }
    getsamplesbyboringid(boringid) {
        const gfk = new GFK();
        const samples = gfk.getsamples.call(this);
        let boringsamples = [];
        if (samples.length > 0) {
            // eslint-disable-next-line
            samples.map(sample => {
                if (sample.boringid === boringid) {
                    boringsamples.push(sample);
                }
            })
        }
        boringsamples.sort((a, b) => {
            if (Number(a.depth) >= Number(b.depth)) {
                return 1;
            } else {
                return -1
            }
        })
        return boringsamples;
    }
    getborings() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let borings = false;
        if (myuser.hasOwnProperty("borings")) {
            borings = myuser.borings.boring;
        }
        return borings;
    }
    getsamples() {
        const gfk = new GFK();
        let samples = false;
        const myuser = gfk.getuser.call(this);
        if (myuser.hasOwnProperty("samples")) {
            samples = myuser.samples.sample;
        }

        return samples;
    }
    getboringbyid(boringid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let borings = false;
        if (myuser) {
            if (myuser.hasOwnProperty("borings")) {
                // eslint-disable-next-line
                myuser.borings.boring.map(boring => {
                    if (boring.boringid === boringid) {
                        borings = boring;
                    }
                })
            }
        }
        return borings;

    }
    getboringkeybyid(boringid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let key = false;
        if (myuser) {
            if (myuser.hasOwnProperty("borings")) {
                // eslint-disable-next-line
                myuser.borings.boring.map((boring, i) => {
                    if (boring.boringid === boringid) {
                        key = i;
                    }
                })
            }
        }
        return key;

    }
    getboringsbyprojectid(projectid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let borings = [];
        if (myuser.hasOwnProperty("borings")) {
            // eslint-disable-next-line
            myuser.borings.boring.map(boring => {
                if (boring.projectid === projectid) {
                    borings.push(boring)

                }
            })
        }
        borings.sort((a, b) => {
            if (a.boringnumber > b.boringnumber) {
                return 1
            } else {
                return -1
            }

        })
        return borings;

    }
    getboringparams() {
        const projectid = this.props.match.params.projectid;
        const gfk = new GFK();
        const borings = gfk.getboringsbyprojectid.call(this, projectid)
        if (borings.length > 0) {
            let myborings = borings;
            // eslint-disable-next-line
            borings.map((boring, i) => {

                const samples = gfk.getsamplesbyboringid.call(this, boring.boringid);
                if (samples.length > 0) {
                    myborings[i].samples = { sample: samples }
                    // eslint-disable-next-line
                    samples.map((sample, j) => {

                        let sieve = gfk.getsievebysampleid.call(this, sample.sampleid);
                        if (sieve) {
                            myborings[i].samples.sample[j].sieve = sieve
                        }

                    })
                }



            })

            return (myborings)
        }

    }
    async saveallborings() {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        if (myuser) {
            try {
                let engineerid = this.props.match.params.engineerid;
                let projectid = this.props.match.params.projectid;
                let borings = gfk.getboringparams.call(this)
                console.log(borings)
                let response = await SaveBorings(engineerid, projectid, borings)
                console.log(response)
                if (response.hasOwnProperty("message")) {
                    let message = `${response.message} last updated ${inputUTCStringForLaborID(response.lastsaved)}`
                    this.setState({ message })
                }
                if (response.hasOwnProperty("boringids")) {
                    // eslint-disable-next-line
                    response.boringids.boring.map(boring => {
                        let i = gfk.getboringkeybyid.call(this, boring.oldboringid)
                        myuser.borings.boring[i].boringid = boring.boringid;

                        if (boring.oldboringid === this.state.activeboringid && this.state.activeboringid) {
                            this.setState({ activeboringid: boring.boringid })
                        }

                    })
                }

                if (response.hasOwnProperty("sampleids")) {
                    // eslint-disable-next-line
                    response.sampleids.sample.map(sample => {
                        let j = gfk.getsamplekeybyid.call(this, sample.oldsampleid)
                        myuser.samples.sample[j].sampleid = sample.sampleid;

                        if (sample.oldsampleid === this.state.activesampleid && this.state.activesampleid) {
                            this.setState({ activesampleid: sample.sampleid })
                        }
                    })
                }
                this.props.reduxUser(myuser)

                if (response.hasOwnProperty("borings")) {
                    // eslint-disable-next-line
                    response.borings.boring.map(boring => {
                        let myboring = Boring(boring.boringid, projectid, boring.boringnumber, boring.datedrilled, boring.gwdepth, boring.elevation, boring.drillrig, boring.loggedby, boring.latitude, boring.longitude, boring.diameter)
                        let k = gfk.getboringkeybyid.call(this, boring.boringid);
                        myuser.borings.boring[k] = myboring;
                        if (boring.hasOwnProperty("samples")) {
                            // eslint-disable-next-line
                            boring.samples.sample.map(sample => {
                                let mysample = Sample(sample.sampleid, boring.boringid, sample.sampledepth, sample.depth, sample.samplenumber, sample.sampleset, sample.diameter, sample.samplelength, sample.description, sample.uscs, sample.spt, sample.wetwgt, sample.wetwgt_2, sample.drywgt, sample.tarewgt, sample.tareno, sample.graphiclog, sample.ll, sample.pi)
                                let l = gfk.getsamplekeybyid.call(this, sample.sampleid)

                                myuser.samples.sample[l] = mysample;

                                if (sample.hasOwnProperty("sieve")) {
                                    let m = gfk.getsievekeybysampleid.call(this, sample.sampleid);
                                    let mysieve = CreateSieve(sample.sampleid, sample.sieve.wgt34, sample.sieve.wgt38, sample.sieve.wgt4, sample.sieve.wgt10, sample.sieve.wgt30, sample.sieve.wgt40, sample.sieve.wgt100, sample.sieve.wgt200)
                                    myuser.sieves.sieve[m] = mysieve
                                }
                            })
                        }
                    })
                }
                this.props.reduxUser(myuser)


            } catch (err) {
                alert(err)
            }

        }

    }
    showsaveboring() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const saveIcon = () => {
            if (this.state.width > 1200) {
                return ({ width: '377px', height: '88px' })
            } else if (this.state.width > 800) {
                return ({ width: '311px', height: '72px' })
            } else {
                return ({ width: '241px', height: '55px' })
            }
        }
        return (
            <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.flex1, ...styles.alignCenter }}>
                    <button style={{ ...styles.generalButton, ...saveIcon() }} onClick={() => { gfk.saveallborings.call(this) }}>{saveBoringIcon()}</button>
                </div>
            </div>
        )
    }


}

export default GFK;