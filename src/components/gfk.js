
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

}

export default GFK;