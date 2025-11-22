import GFK from './gfk'
import { makeID } from './functions'

class MakeID {

    pointID() {
        const gfk = new GFK();
        let pointid = false;
        while (!pointid) {
            pointid = makeID(16)
            const slopestability = gfk.getSlopeStability.call(this)
            if (slopestability) {
                // eslint-disable-next-line
                slopestability.map(section => {
                    if (section.hasOwnProperty("layers")) {
                        // eslint-disable-next-line
                        section.layers.map(layer => {
                            if (layer.hasOwnProperty("points")) {
                                // eslint-disable-next-line
                                layer.points.map(point => {
                                    if (point.pointid === pointid) {
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
        while (!layerid) {
            layerid = makeID(16)
            const slopestability = gfk.getSlopeStability.call(this)
            if (slopestability) {
                // eslint-disable-next-line
                slopestability.map(section => {
                    if (section.hasOwnProperty("layers")) {
                        // eslint-disable-next-line
                        section.layers.map(layer => {
                            if (layer.layerid === layerid) {
                                layerid = false;
                            }
                        })
                    }
                })
            }
        }
        return layerid;

    }

    sectionID(projectid) {
        const gfk = new GFK();
        let sectionid = false;
        while (!sectionid) {
            sectionid = makeID(16)
            const slope = gfk.getSlopeByProjectID.call(this, projectid)
            if (slope.sections) {
                // eslint-disable-next-line
                slope.sections.map(section => {
                    if (section.sectionid === sectionid) {
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
        while (!imageid) {
            imageid = makeID(16)
            const fieldreports = gfk.getfieldreports.call(this)
            if (fieldreports) {
                // eslint-disable-next-line
                fieldreports.map(report => {
                    if (report.hasOwnProperty("images")) {
                        // eslint-disable-next-line
                        report.images.map(image => {
                            if (image.imageid === imageid) {
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
        while (!fieldid) {
            fieldid = makeID(16)
            const fieldreports = gfk.getfieldreports.call(this)
            if (fieldreports) {
                // eslint-disable-next-line
                fieldreports.map(report => {
                    if (report.fieldid === fieldid) {
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
        while (!testid) {
            testid = makeID(16)
            const fieldreports = gfk.getfieldreports.call(this);
            if (fieldreports) {
                // eslint-disable-next-line
                fieldreports.map(fieldreport => {
                    if (fieldreport.hasOwnProperty("compactiontests")) {
                        // eslint-disable-next-line
                        fieldreport.compactiontests.map(test => {
                            if (test.testid === testid) {
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
        const projects = gfk.getProjects.call(this);

        if (!projects) return makeID(16); // fallback

        let unid = false;

        while (!unid) {
            const candidate = makeID(16);

            // Check if this ID exists anywhere in all projects → borings → samples → unconfined
            const exists = projects.some(project =>
                project.borings?.some(boring =>
                    boring.samples?.some(sample =>
                        sample.unconfined?.some(test =>
                            test.unid === candidate
                        )
                    )
                )
            );

            if (!exists) {
                unid = candidate;
            }
        }

        return unid;
    }


    sampleID() {
        const gfk = new GFK();
        let sampleid = null;

        const projects = gfk.getProjects.call(this) || [];

        while (!sampleid) {
            // Generate a candidate ID
            const candidate = makeID(16);
            let exists = false;

            // Check if the candidate already exists
            for (const project of projects) {
                if (!Array.isArray(project.borings)) continue;

                for (const boring of project.borings) {
                    if (!Array.isArray(boring.samples)) continue;

                    for (const sample of boring.samples) {
                        if (sample.sampleid === candidate) {
                            exists = true;
                            break;
                        }
                    }
                    if (exists) break;
                }
                if (exists) break;
            }

            // If it doesn’t exist, use it
            if (!exists) {
                sampleid = candidate;
            }
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

    seismicpointid(projectid) {
    const gfk = new GFK();
    const project = gfk.getProjectById.call(this, projectid);
    if (!project) return false;

    const points = project.seismic?.points || [];
    let pointid = null;

    do {
        pointid = makeID(16);
        // Check if the generated ID already exists
        const exists = points.some(point => point.pointid === pointid);
        if (!exists) break;
        pointid = null;
    } while (!pointid);

    return pointid;
}

  ptslablayerid(projectid, sectionid) {
    const gfk = new GFK();
    const projects = gfk.getProjects.call(this);
    const project = gfk.getProjectById.call(this, projectid);
    if (!project) return false;

    const i = gfk.getProjectKeyById.call(this, projectid);

    // Ensure project.ptslab exists
    if (!projects[i].ptslab) projects[i].ptslab = {};

    // Ensure sections array exists
    if (!Array.isArray(projects[i].ptslab.sections)) {
        projects[i].ptslab.sections = [];
    }

    // Get section index
    const s = gfk.getPTSlabKeyByID.call(this, projectid, sectionid);
    if (s === false) return false;

    // Ensure layers array exists
    if (!Array.isArray(projects[i].ptslab.sections[s].layers)) {
        projects[i].ptslab.sections[s].layers = [];
    }

    const layers = projects[i].ptslab.sections[s].layers;

    let layerid = false;

    // Generate a unique layer id inside this section
    while (!layerid) {
        layerid = makeID(16);

        const exists = layers.some(
            layer => layer.layerid === layerid
        );

        if (exists) {
            layerid = false; // regenerate
        }
    }

    return layerid;
}


   ptslabsectionid(projectid) {
    const gfk = new GFK();
    const projects = gfk.getProjects.call(this);
    const project = gfk.getProjectById.call(this, projectid);
    if (!project) return false;

    const i = gfk.getProjectKeyById.call(this, projectid);

    // Ensure ptslab + sections exist
    if (!projects[i].ptslab) projects[i].ptslab = {};
    if (!Array.isArray(projects[i].ptslab.sections)) {
        projects[i].ptslab.sections = [];
    }

    const sections = projects[i].ptslab.sections;

    let sectionid = false;

    // Generate unique ID
    while (!sectionid) {
        sectionid = makeID(16);

        // Check uniqueness
        const exists = sections.some(sec => sec.sectionid === sectionid);
        if (exists) sectionid = false;
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