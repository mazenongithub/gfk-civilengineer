import React from 'react';
import { saveBoringIcon } from './svg'
import { MyStylesheet } from './styles';
import { SaveBorings } from './actions/api'
import { inputUTCStringForLaborID } from './functions'
class GFK {

    remarksWidth() {
        if (this.state.width > 1200) {
            return ({ width: '240px', height: 'auto' })
        } else if (this.state.width > 800) {
            return ({ width: '180px', height: 'auto' })
        } else {
            return ({ width: '120px', height: 'auto' })
        }
    }

    getgotoicon() {
        if (this.state.width > 1200) {
            return ({ width: '180px', height: 'auto' })
        } else if (this.state.width > 800) {
            return ({ width: '135px', height: 'auto' })
        } else {
            return ({ width: '90px', height: 'auto' })
        }
    }
    getsaveprojecticon() {
        if (this.state.width > 1200) {
            return ({ width: '328px', height: '76px' })
        } else if (this.state.width > 800) {
            return ({ width: '265px', height: '61px' })
        } else {
            return ({ width: '199px', height: '46px' })
        }
    }
    getsavetime() {
        if (this.state.width > 1200) {
            return ({ width: '364px', height: '87px' })
        } else if (this.state.width > 800) {
            return ({ width: '281px', height: '67px' })
        } else {
            return ({ width: '209px', height: '51px' })
        }
    }
    getuser() {
        let myuser = false;
        if (this.props.myuser) {
            myuser = this.props.myuser;

        }
        return myuser;
    }
    getPointIDfromStrainID(projectid, strainid) {
        const gfk = new GFK();
        let pointid = false;
        const points = gfk.getPointsByProjectID.call(this, projectid)
        if (points) {
            // eslint-disable-next-line
            points.map(point => {
                if (point.hasOwnProperty("strain")) {
                    // eslint-disable-next-line
                    point.strain.map(strain => {
                        if (strain.strainid === strainid) {
                            pointid = point.pointid;
                        }
                    })
                }
            })

        }
        return pointid;

    }

    getStrainbyID(projectid, strainid) {
        const gfk = new GFK();
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid);
        let getstrain = false;
        if (seismic) {
            const points = gfk.getPointsByProjectID.call(this, projectid);
            if (points) {
                // eslint-disable-next-line
                points.map((point, j) => {
                    if (point.hasOwnProperty("strain")) {
                        // eslint-disable-next-line
                        point.strain.map((strain, k) => {

                            if (strain.strainid === strainid) {
                                getstrain = strain;
                            }
                        })
                    }

                })
            }

        }
        return getstrain;

    }

    getStrainKeybyProjectID(projectid, strainid) {
        const gfk = new GFK();
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid);
        let a = false;
        let b = false;
        let c = false;
        if (seismic) {
            a = gfk.getSeismicKeybyProjectID.call(this, projectid)
            const points = gfk.getPointsByProjectID.call(this, projectid);
            if (points) {
                // eslint-disable-next-line
                points.map((point, j) => {
                    if (point.hasOwnProperty("strain")) {
                        // eslint-disable-next-line
                        point.strain.map((strain, k) => {

                            if (strain.strainid === strainid) {
                                b = j
                                c = k
                            }
                        })
                    }

                })
            }

        }
        return { a, b, c }

    }

    getSeismicStrainByProjectID(projectid) {
        const gfk = new GFK();
        let getstrain = false;
        const points = gfk.getPointsByProjectID.call(this, projectid);
        if (points) {
            // eslint-disable-next-line
            points.map(point => {
                if (point.hasOwnProperty("strain")) {
                    getstrain = [];
                    // eslint-disable-next-line
                    point.strain.map(strain => {

                        getstrain.push(strain)
                    })


                }

            })

        }
        return getstrain
    }

    getPointKeybyID(projectid, pointid) {
        const gfk = new GFK();
        const points = gfk.getPointsByProjectID.call(this, projectid)
        let key = false;
        if (points) {
            // eslint-disable-next-line
            points.map((point, i) => {
                if (point.pointid === pointid) {
                    key = i;

                }
            })
        }
        return key;
    }

    getPointbyID(projectid, pointid) {
        const gfk = new GFK();
        const points = gfk.getPointsByProjectID.call(this, projectid)
        let getpoint = false;
        if (points) {
            // eslint-disable-next-line
            points.map(point => {
                if (point.pointid === pointid) {
                    getpoint = point;

                }
            })
        }
        return getpoint;
    }

    getPointsByProjectID(projectid) {
        const gfk = new GFK()
        const seismic = gfk.getSeismicbyProjectID.call(this, projectid)
        let points = false;
        if (seismic) {
            points = seismic.points;

        }
        return points;
    }

    getSeismicKeybyProjectID(projectid) {
        const gfk = new GFK();
        const seismics = gfk.getSeismic.call(this)
        let key = false;
        if (seismics) {
            // eslint-disable-next-line
            seismics.map((seismic, i) => {
                if (seismic.projectid === projectid) {
                    key = i;
                }
            })
        }
        return key;
    }

    getSeismicbyProjectID(projectid) {
        const gfk = new GFK();
        const seismics = gfk.getSeismic.call(this)
        let getseismic = false;
        if (seismics) {
            // eslint-disable-next-line
            seismics.map(seismic => {
                if (seismic.projectid === projectid) {
                    getseismic = seismic;
                }
            })
        }
        return getseismic;
    }

    getSeismic() {
        let seismic = false;
        if (this.props.seismic.hasOwnProperty("length")) {
            seismic = this.props.seismic;
        }
        return seismic;
    }

    getZoneCharts() {
        let zonecharts = false;
        if (this.props.zonecharts.hasOwnProperty("zone_1")) {
            zonecharts = this.props.zonecharts;
        }
        return zonecharts;
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
                fieldreport = myuser.fieldreports;
            }
        }

        return fieldreport;
    }

    getPTSlabkeybyID(sectionid) {

        const gfk = new GFK();
        let key = false;
        const ptslabs = gfk.getPTslabs.call(this)
        // eslint-disable-next-line
        ptslabs.map((ptslab, i) => {
            if (ptslab.sectionid === sectionid) {
                key = i;
            }
        })
        return key;
    }

    getPTSlabbyID(sectionid) {

        const gfk = new GFK();
        let slab = false;
        const ptslabs = gfk.getPTslabs.call(this)
        // eslint-disable-next-line
        ptslabs.map(ptslab => {
            if (ptslab.sectionid === sectionid) {
                slab = ptslab;
            }
        })
        return slab;
    }

    getPTSlabLayerKeybyID(sectionid, layerid) {
        const gfk = new GFK();
        let key = false;
        const layers = gfk.getPTSlabLayersbysectionID.call(this, sectionid)
        if (layers) {
            // eslint-disable-next-line
            layers.map((layer, i) => {
                if (layer.layerid === layerid) {
                    key = i
                }
            })
        }
        return key;

    }

    getPTSlabLayerbyID(sectionid, layerid) {
        const gfk = new GFK();
        let getlayer = false;
        const layers = gfk.getPTSlabLayersbysectionID.call(this, sectionid)
        if (layers) {
            // eslint-disable-next-line
            layers.map(layer => {
                if (layer.layerid === layerid) {
                    getlayer = layer;
                }
            })
        }
        return getlayer;

    }

    getPTSlabLayersbysectionID(sectionid) {
        let layers = false;
        const gfk = new GFK();
        const section = gfk.getPTSlabbyID.call(this, sectionid)
        if (section) {
            if (section.hasOwnProperty("layers")) {
                layers = section.layers;

                layers.sort((a, b) => {
                    if (Number(a.toplayer) >= Number(b.toplayer)) {
                        return 1;
                    } else {
                        return -1
                    }
                })

            }
        }
        return layers;
    }

    getPTslabs() {
        let ptslabs = false;
        if (this.props.ptslab.hasOwnProperty("length")) {
            ptslabs = this.props.ptslab;
        }
        return ptslabs;
    }
    getcurvebyid(curveid) {
        const gfk = new GFK();
        const curves = gfk.getcurves.call(this)
        let getcurve = false;

        if (curves) {
            // eslint-disable-next-line
            curves.map(curve => {
                if (curve.curveid === curveid) {
                    getcurve = curve;
                }
            })
        }

        return getcurve;
    }
    getcompactiontests(fieldid) {
        const gfk = new GFK();
        const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
        let tests = false;
        if (fieldreport) {
            if (fieldreport.hasOwnProperty("compactiontests")) {
                tests = fieldreport.compactiontests;
            }

        }
        return tests;
    }
    getcompactiontestbyid(fieldid, testid) {
        const gfk = new GFK();
        let tests = false;
        const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
        if (fieldreport) {
        

            if (fieldreport.hasOwnProperty("compactiontests")) {

                // eslint-disable-next-line
                fieldreport.compactiontests.map(test => {
                    if (test.testid === testid) {
                        tests = test;
                    }
                })

            }

        }
     
        return tests;
    }

    getcompactiontestkeybyid(fieldid, testid) {
        const gfk = new GFK();
        let key = false;
        const compactiontests = gfk.getcompactiontests.call(this, fieldid)
        if (compactiontests) {
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
        if (reports) {
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
        const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
        let images = [];
        if (fieldreport.hasOwnProperty("images")) {
            // eslint-disable-next-line
            fieldreport.images.map(image => {
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
    getimagesbyfieldid(fieldid) {
        const gfk = new GFK();
        const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)
        let images = false;

        if (fieldreport.hasOwnProperty("images")) {
            images = fieldreport.images;
        }

        return images;
    }
    getimagekeybyid(fieldid, imageid) {
        const gfk = new GFK();
        const images = gfk.getimagesbyfieldid.call(this, fieldid)
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
    getimagebyid(fieldid, imageid) {
        const gfk = new GFK();
        const images = gfk.getimagesbyfieldid.call(this, fieldid)
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

    getsieveanalysisbysampleid(projectid, boringid, sampleid) {
        const gfk = new GFK();
        let sieve = false;
        const sample = gfk.getsamplebyid.call(this, projectid, boringid, sampleid)
        if (sample) {
            sieve = sample.sieve;
        }

        return sieve;
    }
    getcompactiontestsbyfieldid(fieldid) {
        console.log(fieldid)
        const gfk = new GFK();
        const fieldreport = gfk.getfieldreportbyid.call(this, fieldid)

        let compactiontests = false;
        if (fieldreport) {
            if (fieldreport.hasOwnProperty("compactiontests")) {
                compactiontests = [];

                // eslint-disable-next-line
                fieldreport.compactiontests.map(test => {


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


                })

            }

        }

        return compactiontests;
    }
    getfieldkeybyid(fieldid) {
        const gfk = new GFK();
        const fieldreports = gfk.getfieldreports.call(this)
        let key = false;
        if (fieldreports) {

            // eslint-disable-next-line
            fieldreports.map((report, i) => {
                if (report.fieldid === fieldid) {
                    key = i;
                }
            })

        }
        return key;
    }
    getfieldreportbyid(fieldid) {
        let fieldreport = false;
        const gfk = new GFK();
        const fieldreports = gfk.getfieldreports.call(this)
        if (fieldreports) {
            // eslint-disable-next-line
            fieldreports.map((report) => {
                if (report.fieldid === fieldid) {
                    fieldreport = report;
                }
            })

        }

        return fieldreport;
    }
    getprojects() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);

        let projects = false;
        if (myuser.hasOwnProperty("projects")) {
            projects = myuser.projects;
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

    getprojectkeybyid(projectid) {
        const gfk = new GFK();
        const projects = gfk.getprojects.call(this);
        let key = false;
        if (projects) {
            // eslint-disable-next-line
            projects.map((myproject, i) => {
                if (myproject.projectid === projectid) {
                    key = i;

                }
            })
        }
        return key;
    }
    getfieldreportkeybyid(fieldid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let key = false;
        if (myuser) {
            if (myuser.hasOwnProperty("fieldreports")) {
                // eslint-disable-next-line
                myuser.fieldreports.map((report, i) => {
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
                curves = myuser.compactioncurves;
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

    getBoringfromSampleID(sampleid) {
        const gfk = new GFK();
        const borings = gfk.getborings.call(this)
        let getboring = false;
        if (borings) {
            // eslint-disable-next-line
            borings.map(boring => {
                if (boring.hasOwnProperty("samples")) {
                     // eslint-disable-next-line
                    boring.samples.map(sample => {
                        if (sample.sampleid === sampleid) {
                            getboring = boring;
                        }
                    })
                }
            })
        }
        return getboring;

    }
    getsamplebyid(boringid, sampleid) {
        const gfk = new GFK();
        const boring = gfk.getboringbyid.call(this, boringid)
        let samples = false;
        if (boring.hasOwnProperty("samples")) {
            // eslint-disable-next-line
            boring.samples.map(sample => {
                if (sample.sampleid === sampleid) {
                    samples = sample;

                }
            })
        }

        return samples;
    }
    getsamplekeybyid(boringid, sampleid) {

        const gfk = new GFK();
        const boring = gfk.getboringbyid.call(this, boringid)
        let key = false;
        if (boring.hasOwnProperty("samples")) {
            // eslint-disable-next-line
            boring.samples.map((sample, i) => {
                if (sample.sampleid === sampleid) {
                    key = i;
                }
            })
        }

        return key;
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
    getsievebysampleid(boringid, sampleid) {
        const gfk = new GFK();
        const sample = gfk.getsamplebyid.call(this, boringid, sampleid)


        let sieve = false;
        if (sample.hasOwnProperty("sieve")) {
            // eslint-disable-next-line
            sieve = sample.sieve;
        }
        return sieve;

    }
    getactuallaborkeybyid(laborid) {
        const gfk = new GFK();
        const mylabor = gfk.getactuallabor.call(this);
        let key = false;
        if (mylabor) {
            // eslint-disable-next-line
            mylabor.map((labor, i) => {
                if (labor.laborid === laborid) {
                    key = i;
                }
            })
        }
        return key
    }
    getactuallaborbyid(laborid) {
        const gfk = new GFK();
        const mylabor = gfk.getactuallabor.call(this);
        let getlabor = false;
        if (mylabor) {
            // eslint-disable-next-line
            mylabor.map(labor => {
                if (labor.laborid === laborid) {
                    getlabor = labor;
                }
            })
        }
        return getlabor;
    }
    getactuallabor() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        let labor = false;
        if (myuser.hasOwnProperty("actuallabor")) {
            labor = myuser.actuallabor;


        }

        return labor;
    }

    getactuallaborbyproject(projectid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        let labor = [];
        if (myuser.hasOwnProperty("actuallabor")) {
            // eslint-disable-next-line
            myuser.actuallabor.map(mylabor => {
                if (mylabor.projectid === projectid) {
                    labor.push(mylabor)
                }
            })


        }

        return labor;
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
        const boring = gfk.getboringbyid.call(this, boringid)
        let boringsamples = false
        if (boring) {
            if (boring.hasOwnProperty("samples")) {
                // eslint-disable-next-line
                boringsamples = boring.samples;
            }
            boringsamples.sort((a, b) => {
                if (Number(a.depth) >= Number(b.depth)) {
                    return 1;
                } else {
                    return -1
                }
            })

        }
        return boringsamples;
    }
    getborings() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let borings = false;
        if (myuser.hasOwnProperty("borings")) {
            borings = myuser.borings;
        }
        return borings;
    }
    getallsampleimages() {
        const gfk = new GFK();
        let sampleimages = [];

        const newSample = (sampleid, projectnumber, description, graphiclog) => {
            return ({ sampleid, projectnumber, description, graphiclog })
        }
        let projectnumber = ""
        let sampleid = "";
        let description = "";
        let graphiclog = "";

        const borings = gfk.getborings.call(this)
        if (borings) {
            // eslint-disable-next-line
            borings.map(boring => {
                let projectid = boring.projectid;
                const project = gfk.getprojectbyid.call(this, projectid);
                if (project) {
                    projectnumber = project.projectnumber;


                    if (boring.hasOwnProperty("samples")) {
                         // eslint-disable-next-line
                        boring.samples.map(sample => {
                            if (sample.graphiclog) {
                                graphiclog = sample.graphiclog;
                                sampleid = sample.sampleid;
                                description = sample.description;
                                sampleimages.push(newSample(sampleid,projectnumber,description,graphiclog))
                            }


                        })
                    }

                }
            })
        }
        return sampleimages;
    }
    getsamples(boringid) {
        const gfk = new GFK();
        let samples = false;
        const boring = gfk.getboringbyid.call(this, boringid)
        if (boring.hasOwnProperty("samples")) {
            samples = boring.samples;
        }

        return samples;
    }
    getboringbyid(boringid) {
        const gfk = new GFK();
        let getboring = false;
        const borings = gfk.getborings.call(this)

        if (borings) {

            // eslint-disable-next-line
            borings.map(boring => {
                if (boring.boringid === boringid) {
                    getboring = boring;
                }
            })

        }
        return getboring;

    }
    getboringkeybyid(boringid) {
        const gfk = new GFK();

        let key = false;
        const borings = gfk.getborings.call(this)
        if (borings) {

            // eslint-disable-next-line
            borings.map((boring, i) => {
                if (boring.boringid === boringid) {
                    key = i;
                }
            })

        }


        return key;

    }
    getboringsbyprojectid(projectid) {
        const gfk = new GFK();
        const borings = gfk.getborings.call(this);
        let getborings = [];
        if (borings) {
            // eslint-disable-next-line
            borings.map(boring => {
                if (boring.projectid === projectid) {
                    getborings.push(boring)
                }

            })

        }
        getborings.sort((a, b) => {
            if (a.boringnumber > b.boringnumber) {
                return 1
            } else {
                return -1
            }

        })
        return getborings;

    }

    getboringskeybyprojectid(projectid) {
        const gfk = new GFK();
        const borings = gfk.getborings.call(this);
        let key = false;
        if (borings) {
            // eslint-disable-next-line
            borings.map((boring, i) => {
                if (boring.projectid === projectid) {
                    key = i;
                }

            })

        }
        return key;

    }

    getunconfinedtests(projectid, boringid, sampleid) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let tests = false;
        if (myuser.hasOwnProperty("unconfinedtests")) {
            tests = myuser.unconfinedtests.unconfined;
        }
        return tests;
    }
    unconfinedtestdatabyid(boringid, sampleid, unid) {
        const gfk = new GFK();
        const test = gfk.getunconfinedtestbyid.call(this, boringid, sampleid)
        let mydata = false;
        if (test) {
            // eslint-disable-next-line
            test.map(data => {
                if (data.unid === unid) {
                    mydata = data;
                }
            })

        }
        return mydata;
    }
    unconfinedtestdatakeybyid(boringid, sampleid, unid) {
        const gfk = new GFK();
        const test = gfk.getunconfinedtestbyid.call(this, boringid, sampleid)
        let key = false;
        if (test) {

            // eslint-disable-next-line
            test.map((data, i) => {
                if (data.unid === unid) {
                    key = i;
                }
            })

        }
        return key;
    }


    getunconfinedtestbyid(boringid, sampleid) {
        const gfk = new GFK();
        const sample = gfk.getsamplebyid.call(this, boringid, sampleid);
        let mytest = false;
        if (sample.hasOwnProperty("unconfined")) {
            // eslint-disable-next-line
            mytest = sample.unconfined;
        }
        return mytest;

    }
    getunconfinedtestkeybyid(sampleid) {
        const gfk = new GFK();
        const tests = gfk.getunconfinedtests.call(this);
        let key = false;
        if (tests) {
            // eslint-disable-next-line
            tests.map((test, i) => {
                if (test.sampleid === sampleid) {
                    key = i;
                }
            })
        }
        return key;

    }
    async saveallborings() {
        const gfk = new GFK();
        let myuser = gfk.getuser.call(this)
        const projectid = this.props.match.params.projectid;
        if (myuser) {
            let borings = gfk.getboringsbyprojectid.call(this, projectid)
            console.log(borings)

            if (borings) {
                const i = gfk.getboringskeybyprojectid.call(this, projectid)

                try {
                    let engineerid = this.props.match.params.engineerid;
                    let projectid = this.props.match.params.projectid;

                    console.log(borings)
                    let response = await SaveBorings(engineerid, projectid, borings)
                    console.log(response)
                    if (response.hasOwnProperty("boringsdb")) {
                        const getborings = response.boringsdb.borings;

                        const myuser = gfk.getuser.call(this)
                        // eslint-disable-next-line
                        myuser.borings[i] = getborings

                        this.props.reduxUser(myuser)


                    }

                    let message = '';

                    if (response.hasOwnProperty("message")) {
                        message = `${response.message} last updated ${inputUTCStringForLaborID(response.lastupdated)}`

                    }

                    this.setState({ message })

                    // this.props.reduxUser(myuser)


                } catch (err) {
                    alert(err)
                }






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