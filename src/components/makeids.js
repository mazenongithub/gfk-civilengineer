import GFK from './gfk'
import { makeID } from './functions'

class MakeID {

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
                seismics.map(seismic=> {
                    if(seismic.hasOwnProperty("points")) {
                         // eslint-disable-next-line
                        seismic.points.map(point => {
                            if(pointid === point.pointid) {
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
                myuser.projects.project.map(project => {
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