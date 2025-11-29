import React from 'react';
import { saveBoringIcon } from './svg'
import { MyStylesheet } from './styles';
import { SaveBorings, SaveTimesheet } from './actions/api'

class GFK {

    getLayerArrow() {
        if (this.state.width > 1200) {
            return ({ width: '53px', height: 'auto' })
        } else if (this.state.width > 800) {
            return ({ width: '43px', height: 'auto' })
        } else {
            return ({ width: '33px', height: 'auto' })
        }
    }


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
    getUser() {
        const user = this.props.myuser;

        // Must exist AND have a valid _id
        if (user && user._id) {
            return user;
        }

        return false;
    }


    getSlices(projectid, sectionid) {
        const gfk = new GFK();
        const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid)
        let slices = false;
        if (section.hasOwnProperty("slices")) {
            slices = section.slices;
        }
        return slices;
    }

    getFailureSurface(projectid, sectionid) {
        const gfk = new GFK();

        // Get the section
        const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid);
        if (!section || !Array.isArray(section.layers)) return false;

        // Find the layer with layertype = "failure"
        const failureLayer = section.layers.find(layer =>
            layer &&
            layer.layertype &&
            layer.layertype.toLowerCase() === "failure"
        );

        return failureLayer || false;
    }


    getTopSurface(projectid, sectionid) {
        const gfk = new GFK();
        const subsurfaces = gfk.getSubsurfaces.call(this, projectid, sectionid)
        let subsurface = false;
        if (subsurfaces) {
            subsurface = subsurfaces[0]
        }
        return subsurface;
    }

    getSubsurfaces(projectid, sectionid) {
        const gfk = new GFK();
        const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid);

        // No section or no layers → return empty array
        if (!section || !Array.isArray(section.layers)) return [];

        // Filter layers with points, then sort points inside each layer
        const layersWithSortedPoints = section.layers
            .filter(layer =>
                layer &&
                Array.isArray(layer.points) &&
                layer.points.length > 0
            )
            .map(layer => {
                // Create a shallow copy so original objects are not mutated
                const sortedLayer = { ...layer };

                sortedLayer.points = [...layer.points].sort((a, b) => {
                    return Number(a.xcoord) - Number(b.xcoord);
                });

                return sortedLayer;
            });

        return layersWithSortedPoints;

    }

    getSlopeKeyBySectionID(projectid, sectionid) {
        const gfk = new GFK();
        const slope = gfk.getSlopeByProjectID.call(this, projectid);

        if (!slope || !Array.isArray(slope.sections)) return false;

        const index = slope.sections.findIndex(sec => sec.sectionid === sectionid);

        return index !== -1 ? index : false;
    }


    getSlopeLayerKeyByID(projectid, sectionid, layerid) {
        const gfk = new GFK();
        const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid);

        if (!section || !Array.isArray(section.layers)) return false;

        const index = section.layers.findIndex(layer => layer.layerid === layerid);

        return index !== -1 ? index : false;
    }


    getSlopePointKeyByID(projectid, sectionid, layerid, pointid) {
        const gfk = new GFK();

        // Get the layer
        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
        if (!layer || !Array.isArray(layer.points)) return false;

        // Find the index
        const index = layer.points.findIndex(pt => pt.pointid === pointid);

        return index >= 0 ? index : false;
    }


    getSlopePointByID(projectid, sectionid, layerid, pointid) {
        const gfk = new GFK();

        // Get the layer first
        const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid);
        if (!layer || !Array.isArray(layer.points)) return false;

        // Find the point
        const point = layer.points.find(pt => pt.pointid === pointid);

        return point || false;
    }


    getSlopeLayerByID(projectid, sectionid, layerid) {
        const gfk = new GFK();

        // Get the section inside the slope object
        const section = gfk.getSlopeBySectionID.call(this, projectid, sectionid);
        if (!section || !Array.isArray(section.layers)) return false;

        // Find the layer with the matching layerid
        const layer = section.layers.find(l => l.layerid === layerid);

        return layer || false;
    }



    getSlopeBySectionID(projectid, sectionid) {
        const gfk = new GFK();

        const slope = gfk.getSlopeByProjectID.call(this, projectid);
        if (!slope || !Array.isArray(slope.sections)) return false;

        return slope.sections.find(section => section.sectionid === sectionid) || false;
    }


    getSlopeByProjectID(projectid) {
        const gfk = new GFK();

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return false;

        // slope is a direct property of project
        return project.slope ? project.slope : false;
    }


    getPointIDfromStrainID(projectid, strainid) {
        const gfk = new GFK();
        const points = gfk.getPointsByProjectID.call(this, projectid);
        if (!Array.isArray(points)) return false;

        // Find the point that contains this strain
        const point = points.find(p =>
            Array.isArray(p.strain) &&
            p.strain.some(s => s.strainid === strainid)
        );

        return point ? point.pointid : false;
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
        const points = gfk.getPointsByProjectID.call(this, projectid);

        if (!Array.isArray(points)) return false;

        const allStrains = [];

        points.forEach(point => {
            if (Array.isArray(point.strain)) {
                allStrains.push(...point.strain);
            }
        });

        return allStrains.length > 0 ? allStrains : false;
    }


    getPointKeybyID(projectid, pointid) {
        const gfk = new GFK();
        const points = gfk.getPointsByProjectID.call(this, projectid);

        if (!Array.isArray(points)) return false;

        const index = points.findIndex(p => p.pointid === pointid);

        return index >= 0 ? index : false;
    }


    getPointbyID(projectid, pointid) {
        const gfk = new GFK();
        const points = gfk.getPointsByProjectID.call(this, projectid);

        if (!Array.isArray(points)) return false;

        return points.find(point => point.pointid === pointid) || false;
    }


    getPointsByProjectID(projectid) {
        const gfk = new GFK();
        const seismic = gfk.getSeismicByProjectID.call(this, projectid);

        return seismic?.points || false;
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

    getSeismicByProjectID(projectid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);

        if (!projects) return false;

        // Find project
        const project = projects.find(p => p.projectid === projectid);
        if (!project) return false;

        // Return seismic section if it exists
        return project.seismic || false;
    }


    getSeismic() {
        let seismic = false;
        if (this.props.seismic.hasOwnProperty("length")) {
            seismic = this.props.seismic;
        }
        return seismic;
    }

    getZoneCharts() {
        let zonecharts = [];

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
    getfieldreports(projectid) {
        const gfk = new GFK();
        const project = gfk.getProjectById.call(this, projectid);

        return project?.fieldreports || false;
    }

    getPTSlabKeyByID(projectid, sectionid) {
        const gfk = new GFK();

        // Get the project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.ptslab) return false;

        const sections = project.ptslab.sections;
        if (!Array.isArray(sections)) return false;

        // Find index of matching section
        const index = sections.findIndex(section => section.sectionid === sectionid);

        return index !== -1 ? index : false;
    }

    getPTSlabByID(projectid, sectionid) {
        const gfk = new GFK();

        // Get the project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.ptslab) return false;

        const sections = project.ptslab.sections;
        if (!Array.isArray(sections)) return false;

        // Find the section with matching ID
        return sections.find(section => section.sectionid === sectionid) || false;
    }

    getPTSlabLayerKeyByID(projectid, sectionid, layerid) {
        const gfk = new GFK();

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.ptslab) return false;

        // Get sections array
        const sections = project.ptslab.sections;
        if (!Array.isArray(sections)) return false;

        // Find section
        const section = sections.find(sec => sec.sectionid === sectionid);
        if (!section || !Array.isArray(section.layers)) return false;

        // Find index of layer
        const index = section.layers.findIndex(lay => lay.layerid === layerid);

        return index >= 0 ? index : false;
    }


    getPTSlabLayerByID(projectid, sectionid, layerid) {
        const gfk = new GFK();

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.ptslab) return false;

        // Get sections
        const sections = project.ptslab.sections;
        if (!Array.isArray(sections)) return false;

        // Find the section
        const section = sections.find(sec => sec.sectionid === sectionid);
        if (!section || !Array.isArray(section.layers)) return false;

        // Find the layer
        const layer = section.layers.find(lay => lay.layerid === layerid);

        return layer || false;
    }


    getPTSlabLayersbysectionID(projectid, sectionid) {
        const gfk = new GFK();

        // Get project
        const project = gfk.getProjectById.call(this, projectid);
        if (!project || !project.ptslab) return [];

        const sections = project.ptslab.sections;
        if (!Array.isArray(sections)) return [];

        // Find the section
        const section = sections.find(sec => sec.sectionid === sectionid);
        if (!section || !Array.isArray(section.layers)) return [];

        // Return layers sorted by numeric value of toplayer
        return [...section.layers].sort((a, b) => Number(a.toplayer) - Number(b.toplayer));
    }

    getPTSlabByProjectID(projectid) {
        const gfk = new GFK();

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return false;

        return project.ptslab || false;
    }

    getcurvebyid(projectid, curveid) {
        const gfk = new GFK();
        const curves = gfk.getcurves.call(this, projectid);

        return curves?.find(curve => curve.curveid === curveid) || false;
    }

    getcurvekeybyid(projectid, curveid) {
        const gfk = new GFK();
        const curves = gfk.getcurves.call(this, projectid);

        if (!curves) return false;

        const index = curves.findIndex(c => c.curveid === curveid);
        return index >= 0 ? index : false;
    }

    getcompactiontests(projectid, fieldid) {
        const gfk = new GFK();
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);

        return fieldreport?.compactiontests || false;
    }

    getcompactiontestbyid(projectid, fieldid, testid) {
        const gfk = new GFK();
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);

        if (!fieldreport || !fieldreport.compactiontests) return false;

        return fieldreport.compactiontests.find(test => test.testid === testid) || false;
    }

    getcompactiontestkeybyid(projectid, fieldid, testid) {
        const gfk = new GFK();
        let key = false;
        const compactiontests = gfk.getcompactiontests.call(this, projectid, fieldid)
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
        const reports = gfk.getfieldreports.call(this, projectid);
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
    getimagesbyfieldid(projectid, fieldid) {
        const gfk = new GFK();
        const fieldreport = gfk.getfieldreportbyid.call(this, projectid, fieldid);
        if (!fieldreport || !Array.isArray(fieldreport.images)) return false;

        return fieldreport.images;
    }
    getimagekeybyid(projectid, fieldid, imageid) {
        const gfk = new GFK();
        const images = gfk.getimagesbyfieldid.call(this, projectid, fieldid);
        if (!images) return false;

        const key = images.findIndex(image => image.imageid === imageid);
        return key !== -1 ? key : false;
    }

    getimagebyid(projectid, fieldid, imageid) {
        const gfk = new GFK();
        const images = gfk.getimagesbyfieldid.call(this, projectid, fieldid);
        if (!images) return false;

        return images.find(image => image.imageid === imageid) || false;
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

    getfieldkeybyid(projectid, fieldid) {
        const gfk = new GFK();
        const fieldreports = gfk.getfieldreports.call(this, projectid);

        if (!fieldreports) return false;

        const index = fieldreports.findIndex(report => report.fieldid === fieldid);

        return index >= 0 ? index : false;
    }
    getfieldreportbyid(projectid, fieldid) {
        const gfk = new GFK();
        const fieldreports = gfk.getfieldreports.call(this, projectid) || [];

        return fieldreports.find(report => report.fieldid === fieldid) || false;
    }


    getProjects() {
        const { projects } = this.props;


        if (Array.isArray(projects) && projects.length > 0) {
            return projects;
        }

        return false;
    }

    getProjectById(projectId) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);

        if (!Array.isArray(projects)) return false;

        return projects.find(project => project.projectid === projectId) || false;
    }

    getProjectKeyById(projectId) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);

        if (!Array.isArray(projects)) return false;

        const index = projects.findIndex(project => project.projectid === projectId);
        return index !== -1 ? index : false;
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
    getcurves(projectid) {
        const gfk = new GFK();
        const project = gfk.getProjectById.call(this, projectid);

        if (!project) return false;

        return project.compactioncurves || false;
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

    getBoringfromSampleID(projectid, sampleid) {
        const gfk = new GFK();
        const borings = gfk.getBoringsByProjectId.call(this, projectid)
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
    getSampleById(projectId, boringId, sampleId) {
        const gfk = new GFK();
        const boring = gfk.getBoringById.call(this, projectId, boringId);

        if (!Array.isArray(boring?.samples)) return false;

        return boring.samples.find(s => s.sampleid === sampleId) || false;
    }
    getSampleKeyById(projectId, boringId, sampleId) {
        const gfk = new GFK();
        const boring = gfk.getBoringById.call(this, projectId, boringId);

        if (!Array.isArray(boring?.samples)) return -1;

        return boring.samples.findIndex(s => s.sampleid === sampleId);
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
    getSieveBySampleId(projectId, boringId, sampleId) {
        const gfk = new GFK();
        const sample = gfk.getSampleById.call(this, projectId, boringId, sampleId);

        return sample?.sieve || false;
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
    getSamplesByBoringId(projectId, boringId) {
        const gfk = new GFK();
        const boring = gfk.getBoringById.call(this, projectId, boringId);

        const samples = Array.isArray(boring?.samples) ? [...boring.samples] : [];

        samples.sort((a, b) => Number(a.depth) - Number(b.depth));
        return samples;
    }

    getTimesheetByProjectID(projectid) {
        const gfk = new GFK();

        // You accidentally wrote "this.projectid" instead of passing the argument
        const project = gfk.getProjectById.call(this, projectid);

        return project?.timesheet || false;
    }

    getLaborByProjectID(projectid) {
        const gfk = new GFK();
        const timesheet = gfk.getTimesheetByProjectID.call(this, projectid);

        return timesheet?.labor ?? false;
    }

    getCostsByProjectID(projectid) {
        const gfk = new GFK();
        const timesheet = gfk.getTimesheetByProjectID.call(this, projectid);

        return timesheet?.costs ?? false;
    }


    getLaborByID(projectid, laborid) {
        const gfk = new GFK();

        // Get labor array for the project
        const labor = gfk.getLaborByProjectID.call(this, projectid);
        if (!Array.isArray(labor)) return false;

        // Find the matching labor entry
        return labor.find(item => item.laborid === laborid) || false;
    }

    getLaborIndexByID(projectid, laborid) {
        const gfk = new GFK();

        // Get labor array for the project
        const labor = gfk.getLaborByProjectID.call(this, projectid);
        if (!Array.isArray(labor)) return false;

        // Find the index
        const index = labor.findIndex(item => item.laborid === laborid);

        return index >= 0 ? index : false;
    }


    getCostByID(projectid, costid) {
        const gfk = new GFK();

        // Get cost array for the project
        const cost = gfk.getCostsByProjectID.call(this, projectid);
        if (!Array.isArray(cost)) return false;

        // Find the matching cost entry
        return cost.find(item => item.costid === costid) || false;
    }

    getCostIndexByID(projectid, costid) {
        const gfk = new GFK();

        // Get cost array for the project
        const cost = gfk.getCostsByProjectID.call(this, projectid);
        if (!Array.isArray(cost)) return false;

        // Find the index
        const index = cost.findIndex(item => item.costid === costid);

        return index >= 0 ? index : false;
    }


    getInvoiceByProjectID(projectid) {
        const gfk = new GFK();
        const timesheet = gfk.getTimesheetByProjectID.call(this, projectid);

        return timesheet?.invoices ?? false;
    }


    getInvoiceByID(projectid, invoiceid) {
        const gfk = new GFK();

        // Get invoice array for the project
        const invoice = gfk.getInvoiceByProjectID.call(this, projectid);
        if (!Array.isArray(invoice)) return false;

        // Find the matching invoice entry
        return invoice.find(item => item.invoiceid === invoiceid) || false;
    }

    getInvoiceIndexByID(projectid, invoiceid) {
        const gfk = new GFK();

        // Get invoice array for the project
        const invoice = gfk.getInvoiceByProjectID.call(this, projectid);
        if (!Array.isArray(invoice)) return false;

        // Find the index
        const index = invoice.findIndex(item => item.invoiceid === invoiceid);

        return index >= 0 ? index : false;
    }

    async saveTimesheet() {
        try {
            const gfk = new GFK();
            const { projectid } = this.props.match.params;

            if (!projectid) {
                throw new Error("Project ID is required.");
            }

            const timesheet = gfk.getTimesheetByProjectID.call(this, projectid);
            const values = { projectid, timesheet };

            const projects = gfk.getProjects.call(this);
            const projectIndex = gfk.getProjectKeyById.call(this, projectid);

            if (projectIndex === -1) {
                throw new Error(`Project not found: ${projectid}`);
            }

            const response = await SaveTimesheet(values);
            console.log(response)

            if (response.timesheet) {
                projects[projectIndex].timesheet = response.timesheet;
                this.props.reduxProjects(projects);
                this.setState({ message: response.message });
            }

        } catch (err) {
            console.error("Error saving timesheet:", err);
            alert(`Error saving timesheet: ${err.message}`);
        }
    }


    getCompany() {
        if (this.props?.company) {
            return this.props.company;
        }
        return false;
    }


    getClients() {
        const clients = this.props.company?.clients || false;
        if (!clients) return false;

        return [...clients].sort((a, b) =>
            a.lastname.localeCompare(b.lastname)
        );
    }

    getClientById(clientid) {
        const gfk = new GFK();
        const clients = gfk.getClients.call(this);

        return clients?.find(client => client.clientid === clientid) || null;
    }

    getClientIndexById(clientid) {
        const gfk = new GFK();
        const clients = gfk.getClients.call(this);

        if (!Array.isArray(clients)) return null;

        const index = clients.findIndex(client => client.clientid === clientid);

        return index !== -1 ? index : null;
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
    getAllSampleImages() {
        const gfk = new GFK();
        const sampleImages = [];

        const projects = gfk.getProjects.call(this);
        if (!projects) return sampleImages;

        for (const project of projects) {
            const projectNumber = project.projectnumber;
            if (!Array.isArray(project.borings)) continue;

            for (const boring of project.borings) {
                if (!Array.isArray(boring.samples)) continue;

                for (const sample of boring.samples) {
                    if (sample.graphiclog) {
                        sampleImages.push({
                            sampleid: sample.sampleid,
                            projectnumber: projectNumber,
                            description: sample.description,
                            graphiclog: sample.graphiclog
                        });
                    }
                }
            }
        }

        return sampleImages;
    }

    getsamples(boringid) {
        const gfk = new GFK();
        let samples = false;
        const boring = gfk.getBoringById.call(this, boringid)
        if (boring.hasOwnProperty("samples")) {
            samples = boring.samples;
        }

        return samples;
    }
    getBoringById(projectid, boringid) {
        const gfk = new GFK();
        const project = gfk.getProjectById.call(this, projectid);

        if (!project || !Array.isArray(project.borings)) return null;

        return project.borings.find(boring => boring.boringid === boringid) || null;
    }


    getBoringKeyById(projectid, boringid) {
        const gfk = new GFK();
        const project = gfk.getProjectById.call(this, projectid);

        if (!project || !Array.isArray(project.borings)) return null;

        const index = project.borings.findIndex(boring => boring.boringid === boringid);
        return index !== -1 ? index : null;
    }


    getBoringsByProjectId(projectid) {
        const gfk = new GFK();
        const project = gfk.getProjectById.call(this, projectid);

        if (project && Array.isArray(project.borings)) {
            return project.borings;
        }

        return [];
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
    unconfinedTestDataById(projectId, boringId, sampleId, unid) {
        const gfk = new GFK();
        const tests = gfk.getUnconfinedTestById.call(this, projectId, boringId, sampleId);

        if (!Array.isArray(tests)) return false;

        const result = tests.find(test => test.unid === unid);
        return result || false;
    }
    unconfinedTestDataKeyById(projectId, boringId, sampleId, unid) {
        const gfk = new GFK();
        const tests = gfk.getUnconfinedTestById.call(this, projectId, boringId, sampleId);

        if (!Array.isArray(tests)) return false;

        const index = tests.findIndex(test => test.unid === unid);
        return index >= 0 ? index : false;
    }

    getUnconfinedTestById(projectId, boringId, sampleId) {
        const gfk = new GFK();
        const sample = gfk.getSampleById.call(this, projectId, boringId, sampleId);

        return sample?.unconfined || false;
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
        const projectid = this.props.match.params.projectid;

        const project = gfk.getProjectById.call(this, projectid);
        if (!project) return;

        const borings = gfk.getBoringsByProjectId.call(this, projectid);
        if (!borings) return;

        try {
            // Send borings to backend
            const values = { projectid, borings };
            const response = await SaveBorings(values);
            console.log(response)
            // Extract response properties safely
            const message = response?.message;
            const returnedBoringsObj = response?.borings.borings;

            if (!returnedBoringsObj) return;

            const returnedProjectId = returnedBoringsObj.projectid;
            const returnedBorings = returnedBoringsObj.borings;

            // Update projects in Redux
            const projects = gfk.getProjects.call(this);
            const index = gfk.getProjectKeyById.call(this, returnedProjectId);

            if (index !== false && projects[index]) {
                projects[index].borings = returnedBorings;
                this.props.reduxProjects(projects);
                this.setState({ message });
            }


        } catch (err) {
            alert(err?.errorMessage || err?.message || String(err));
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