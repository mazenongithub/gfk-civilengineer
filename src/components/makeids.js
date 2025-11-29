import GFK from './gfk'
import { makeID } from './functions'

class MakeID {

    pointID(projectid) {
        const gfk = new GFK();
        const slope = gfk.getSlopeByProjectID.call(this, projectid);

        // If no slope, just return a new ID
        if (!slope) {
            return makeID(16);
        }

        let pointid = false;

        while (!pointid) {
            const candidate = makeID(16);
            let exists = false;

            // Search all sections → layers → points
            for (const section of slope.sections) {
                if (!section.layers) continue;

                for (const layer of section.layers) {
                    if (!layer.points) continue;

                    for (const point of layer.points) {
                        if (point.pointid === candidate) {
                            exists = true;
                            break;
                        }
                    }

                    if (exists) break;
                }

                if (exists) break;
            }

            if (!exists) {
                pointid = candidate;
            }
        }

        return pointid;
    }


    layerID(projectid) {
        const gfk = new GFK();
        const slopeStability = gfk.getSlopeByProjectID.call(this, projectid) || [];
        let id;

        const idExists = (candidate) =>
            slopeStability.sections.some(section =>
                Array.isArray(section.layers) &&
                section.layers.some(layer => layer.layerid === candidate)
            );

        do {
            id = makeID(16);
        } while (idExists(id));

        return id;
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

    makeClientID() {
   
        const gfk = new GFK();

        const clients = gfk.getClients.call(this) || [];

        let newID;
        let exists = true;

        // keep generating until it's unique
        while (exists) {
            newID = makeID(16);
            exists = clients.some(client => client.clientid === newID);
        }

        return newID;
    }


    curveID(projectid) {
        const gfk = new GFK();
        const curves = gfk.getcurves.call(this, projectid) || [];

        let id;
        let exists = true;

        while (exists) {
            id = makeID(16);                      // generate a random ID
            exists = curves.some(c => c.curveid === id);  // check if it already exists
        }

        return id;
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
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this) || [];
        let id;

        do {
            id = makeID(16);
        } while (projects.some(project => project.projectid === id));

        return id;
    }

    laborid(projectid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        const projectIndex = projects.findIndex(p => p.projectid === projectid);
        if (projectIndex === -1) throw new Error('Project not found');

        // Get all existing labor IDs for this project
        const laborIds = projects[projectIndex]?.timesheet?.labor?.map(l => l.laborid) || [];

        let id;
        do {
            id = makeID(16);  // Use your makeID function
        } while (laborIds.includes(id));

        return id;
    }

    costid(projectid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);

        // Find project
        const project = projects.find(p => p.projectid === projectid);
        if (!project) throw new Error("Project not found");

        // Extract existing cost IDs (safe even if undefined)
        const costIds =
            project?.timesheet?.costs?.map(c => c.costid) || [];

        // Generate unique cost ID
        let id;
        do {
            id = makeID(16);
        } while (costIds.includes(id));

        return id;
    }




    invoiceid(projectid) {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);

        // Find project
        const project = projects.find(p => p.projectid === projectid);
        if (!project) throw new Error("Project not found");

        // Extract existing invoice IDs (safe even if undefined)
        const invoiceIds =
            project?.timesheet?.invoices?.map(c => c.invoiceid) || [];

        // Generate unique invoice ID
        let id;
        do {
            id = makeID(16);
        } while (invoiceIds.includes(id));

        return id;
    }

}

export default MakeID;