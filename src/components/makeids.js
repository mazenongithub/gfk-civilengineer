import GFK from './gfk'
import { makeID } from './functions'

class MakeID {
    
    pointID() {
        const gfk = new GFK();
        let pointid= false;
        while(!pointid) {
            pointid = makeID(16)
            const slopestability = gfk.getSlopeStability.call(this)
            if(slopestability) {
                // eslint-disable-next-line
                slopestability.map(section=> {
                    if(section.hasOwnProperty("layers")) {
                        // eslint-disable-next-line
                        section.layers.map(layer=> {
                            if(layer.hasOwnProperty("points")) {
                        // eslint-disable-next-line
                                layer.points.map(point=> {
                                    if(point.pointid === pointid) {
                                        pointid = false;
                                    }
                                })

                            }
                        })
                    }
                })
            }
        }
        return pointid;

    }

    layerID() {
        const gfk = new GFK();
        let layerid = false;
        while(!layerid) {
            layerid = makeID(16)
            const slopestability = gfk.getSlopeStability.call(this)
            if(slopestability) {
                // eslint-disable-next-line
                slopestability.map(section=> {
                    if(section.hasOwnProperty("layers")) {
                        // eslint-disable-next-line
                        section.layers.map(layer=> {
                            if(layer.layerid === layerid) {
                                layerid = false;
                            }
                        })
                    }
                })
            }
        }
        return layerid;

    }

    sectionID() {
        const gfk = new GFK();
        let sectionid = false;
        while(!sectionid) {
            sectionid = makeID(16)
            const sections = gfk.getSlopeStability.call(this)
            if(sections) {
                // eslint-disable-next-line
                sections.map(section=> {
                    if(section.sectionid === sectionid) {
                        sectionid = false;
                    }
                })
            }
        }
        return sectionid;

    }

    imageID() {
        const gfk = new GFK();
        let imageid = false;
        while(!imageid) {
            imageid = makeID(16)
            const fieldreports = gfk.getfieldreports.call(this)
            if(fieldreports) {
                 // eslint-disable-next-line
                fieldreports.map(report=> {
                    if(report.hasOwnProperty("images")) {
                         // eslint-disable-next-line
                        report.images.map(image=> {
                            if(image.imageid === imageid) {
                                imageid = false;
                            }
                        })
                    }
                })
            }
        }

        return imageid;

    }
    
    fieldID() {
        
        const gfk = new GFK();
        let fieldid = false;
        while(!fieldid) {
            fieldid = makeID(16)
            const fieldreports = gfk.getfieldreports.call(this)
            if(fieldreports) {
                 // eslint-disable-next-line
                fieldreports.map(report=> {
                    if(report.fieldid === fieldid) {
                        fieldid = false;
                    }
                })
            }



        }
        return fieldid;
    }

    compactionTest() {
        const gfk = new GFK();
        let testid = false;
        while(!testid) {
            testid = makeID(16)
            const fieldreports = gfk.getfieldreports.call(this);
            if(fieldreports) {
                 // eslint-disable-next-line
                fieldreports.map(fieldreport=> {
                    if(fieldreport.hasOwnProperty("compactiontests")) {
                         // eslint-disable-next-line
                        fieldreport.compactiontests.map(test=> {
                            if(test.testid === testid) {
                                    testid = false;
                            }
                        })
                    }
                })
            }
        }
        return testid;
    }

    unconfinedID() {
        const gfk = new GFK();
        let unid = false;
        while (!unid) {
           unid = makeID(16)
            const borings = gfk.getborings.call(this)
            if (borings) {
                // eslint-disable-next-line
                borings.map(boring => {
                    if (boring.hasOwnProperty("samples")) {
                        // eslint-disable-next-line
                        boring.samples.map(sample => {
                            if (sample.hasOwnProperty("unconfined")) {
                                // eslint-disable-next-line
                                sample.unconfined.map(unconfined => {
                                    if (unconfined.unid === unid) {
                                        unid = false;
                                    }
                                })
                            }
                        })
                    }
                })

            }

        }
        return unid;


    }

    sampleID() {
        let sampleid = false;
        const gfk = new GFK();
        const borings = gfk.getborings.call(this)
        while (!sampleid) {
            sampleid = makeID(16)
             // eslint-disable-next-line
            borings.map(boring => {
                if (borings.hasOwnProperty("samples")) {
                     // eslint-disable-next-line
                    borings.samples.map(sample => {
                        if (sample.sampleid === sampleid) {
                            sampleid = false;
                        }
                    })
                }
            })


        }
        return sampleid;
    }

    seismicstrainid() {
        let strainid = false;
        const gfk = new GFK()
        const seismics = gfk.getSeismic.call(this)
        if (seismics) {
            while (!strainid) {
                strainid = makeID(16)
                // eslint-disable-next-line
                seismics.map(seismic => {
                    if (seismic.hasOwnProperty("points")) {


                        // eslint-disable-next-line
                        seismic.points.map(point => {
                            if (point.hasOwnProperty("strain")) {

                                // eslint-disable-next-line
                                point.strain.map(getstrain => {

                                    if (getstrain === strainid) {
                                        strainid = false;
                                    }




                                })
                            }
                        })

                    }

                })

            }


        } else {
            strainid = makeID(16)
        }
        return strainid
    }

    seismicpointid() {
        const gfk = new GFK();
        const seismics = gfk.getSeismic.call(this)
        let pointid = false;

        if (seismics) {

            while (!pointid) {
                pointid = makeID(16)
                // eslint-disable-next-line
                seismics.map(seismic => {
                    if (seismic.hasOwnProperty("points")) {
                        // eslint-disable-next-line
                        seismic.points.map(point => {
                            if (pointid === point.pointid) {
                                pointid = false;
                            }
                        })
                    }
                })


            }

        } else {
            pointid = makeID(16)
        }


        return pointid;
    }

    plslablayerid() {
        let layerid = false;
        const sectionid = this.state.activesectionid;
        const gfk = new GFK();
        const layers = gfk.getPTSlabLayersbysectionID.call(this, sectionid)
        if (layers) {
            while (!layerid) {
                layerid = makeID(16)
                // eslint-disable-next-line
                layers.map(layer => {

                    if (layer.layerid === layerid) {
                        layerid = false;
                    }

                })

            }
        } else {
            layerid = makeID(16)
        }
        return layerid;

    }

    ptslabsectionid() {
        let sectionid = false;
        const gfk = new GFK();
        const ptslabs = gfk.getPTslabs.call(this)
        while (!sectionid) {
            sectionid = makeID(16)
            if (ptslabs) {
                // eslint-disable-next-line
                ptslabs.map(ptslab => {
                    if (ptslab.sectionid === sectionid) {
                        sectionid = false;
                    }
                })
            }


        }
        return sectionid;
    }

    projectid() {
        let projectid = false;
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        while (!projectid) {
            projectid = makeID(16)
            if (myuser.hasOwnProperty("projects")) {
                // eslint-disable-next-line
                myuser.projects.map(project => {
                    if (project.projectid === projectid) {
                        projectid = false;
                    }
                })
            }


        }
        return projectid;
    }
    laborid() {
        let laborid = false;
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        while (!laborid) {
            laborid = makeID(16)
            if (myuser.hasOwnProperty("actuallabor")) {
                // eslint-disable-next-line
                myuser.actuallabor.mylabor.map(mylabor => {
                    if (mylabor.laborid === laborid) {
                        laborid = false;
                    }
                })
            }


        }
        return laborid;
    }
}

export default MakeID;