import GFK from "./gfk";
class SlopeStabilityCalcs {

    getScale(projectid,sectionid) {
        const gfk = new GFK();
        const calcs = new SlopeStabilityCalcs();
        let  criticalvalue = 0;
        const extents = calcs.getExtents.call(this,projectid,sectionid)
        const section = gfk.getSlopebySectionID.call(this,projectid,sectionid)
        let scale = 0;
        if(section) {
            if(section.hasOwnProperty("layers")) {
                // eslint-disable-next-line
                section.layers.map(layer=> {
                    if(layer.hasOwnProperty("failuresurface")) {
                        const cx = layer.failuresurface.cx;
                        const rx = layer.failuresurface.rx;
                        const ry = layer.failuresurface.ry;
                        const cy = layer.failuresurface.cy;
                        const checkx = Number(cx)+ Number(rx)
                        const checky = Number(cy) + Number(ry)
                       
                        if(checkx > extents) {
                            criticalvalue = checkx

                        } else if(checky > extents) {
                            criticalvalue = checky
                        } else {
                            criticalvalue = extents;
                        }
                        
                    }
                })
            }
        }
        if(criticalvalue <= 100) {
            scale = 10;
        } else {
            scale = 10 * Math.ceil((criticalvalue/100))
        }
        return scale;


        
    }

    getExtents(projectid, sectionid) {
        const gfk = new GFK();
        const subsurfaces = gfk.getSubsurfaces.call(this, projectid, sectionid)
        let extents = 0;
        if (subsurfaces) {
            // eslint-disable-next-line
            subsurfaces.map(subsurface => {
                if (subsurface.hasOwnProperty("points")) {
                     // eslint-disable-next-line
                    subsurface.points.map(point => {
                        if (Number(point.xcoord) > extents) {
                            extents = Number(point.xcoord)
                        }
                    })

                }
            })
        }
        return extents;
    }

    getellispey(rx, ry, cx, cy, x) {
        let c = x - cx;
        let a = Math.pow(rx, 2) - Math.pow(c, 2);
        let b = (Math.sqrt(a));
        c = ry * b - (cy * rx);
        let d = -(c / rx);
        return d;
    }

    getYsurface(points, x) {
   
        const calcs = new SlopeStabilityCalcs();
        let y = 0;
        if(points) {
         // eslint-disable-next-line
        points.map((point, i) => {

            const xcoord = point.xcoord;
           
            if (xcoord > x && y === 0 && i>0) {
              
                y = calcs.interpolatey(points[i - 1].xcoord, points[i].xcoord, points[i - 1].ycoord, points[i].ycoord, x)
            }

        })

    }

        return y;

    }


    interpolatey(x1, x2, y1, y2, x) {

        let m = (y2 - y1) / (x2 - x1);
        let y = (m * x) + (y1 - (m * x1));

        return y;
    }



    xyEllipse(x, a, b, h, k) {


        let y = (-b * Math.sqrt(Math.pow(a, 2) - Math.pow(x, 2))) / a

        return ({ x: x + h, y: y + k })


    }


    getarea(deltax, y1, y2, y3, y4) {
        let base = Math.abs(deltax);
        let height = Math.abs(y4 - y2) + Math.abs(y2 - y1);
        let tri_1 = 0.5 * base * Math.abs(y2 - y1);
        let tri_2 = 0.5 * base * Math.abs(y4 - y3);
        let area = base * height - (tri_1) - (tri_2);
        return area;

    }

    getalpha(y2, y1, deltax) {
        let alpha = Math.atan((y2 - y1) / (deltax));
        return alpha;
    }

    degreesToRadians(degrees) {
        return (degrees % 360) * (Math.PI / 180);
    }

    calcfsnum(c, n, phi, alpha, deltax) {
        const calcs = new SlopeStabilityCalcs();
        phi = calcs.degreesToRadians(phi);

        let num = ((c * deltax) + n * Math.tan(phi)) * Math.cos(alpha);

        return num;

    }

    calcfsden(n, alpha) {
       let den = n * Math.sin(alpha)
        return den;

    }





}

export default SlopeStabilityCalcs;