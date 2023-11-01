
import { loadChart } from './functions/loadchart';
import GFK from './gfk';

class UnconfinedCalcs {


    loadlbs(dial) {
        let lbs = 0;
        const loadchart = loadChart();
        // eslint-disable-next-line
        loadchart.map(chart => {
            if (dial === chart.dial) {
                lbs = chart.loadlbs;
            }
        })
        return lbs;
    }

    calcstrain (displacement,samplelength) {
        return (Number(Number(displacement * .001) / Number(samplelength)).toFixed(4))
    }
    calcarea (diameter,strain)  {
     
        return (Number(.25 * Math.PI * Math.pow(diameter, 2) / (1 - strain)).toFixed(4))
    }
    calcstress (lbs,area)  {
        return (Math.round((144 * lbs) / area))
    }

    getStressCurve(sampleid) {

        const gfk = new GFK();
        const unconfinedcalcs = new UnconfinedCalcs();
        const unconfinedtest = gfk.getunconfinedtestbyid.call(this,sampleid)
        const sample = gfk.getsamplebyid.call(this,sampleid)
        let stresscurve = [];
        if(sample) {
        const samplelength = Number(sample.samplelength);
        const diameter = Number(sample.diameter);
       
        if(unconfinedtest) {
            // eslint-disable-next-line
            unconfinedtest.testdata.data.map(data=> {
                const lbs = unconfinedcalcs.loadlbs.call(this,data.loadreading);
                const strain = unconfinedcalcs.calcstrain.call(this,data.displacement,samplelength)
                const area = unconfinedcalcs.calcarea.call(this,diameter,strain)
                const stress = unconfinedcalcs.calcstress.call(this,lbs,area)
                const value = {lbs, area,stress,strain}
                stresscurve.push(value)
            })


        }

    }
    return stresscurve;

    }

 

    getMaxStress(sampleid) {
        const unconfinedcalcs = new UnconfinedCalcs();
        const stresscurve = unconfinedcalcs.getStressCurve.call(this,sampleid)
        let maxstress = 0;
        if(stresscurve.length>0) {
            // eslint-disable-next-line
            stresscurve.map(value=> {
                const stress =Number(value.stress);
                if(stress > maxstress) {
                    maxstress = stress;
                }

            })
        }
       
       
        return maxstress;
    }

    getMaxStrain(sampleid) {
        const unconfinedcalcs = new UnconfinedCalcs();
        const maxstress = unconfinedcalcs.getMaxStress.call(this,sampleid)
        const stresscurve = unconfinedcalcs.getStressCurve.call(this,sampleid)
        let maxstrain = 0;
        if(maxstress > 0 && stresscurve.length > 0) {
            // eslint-disable-next-line
            stresscurve.map(value => {
                if(maxstress ===  Number(value.stress)) {
                    maxstrain = value.strain;
                }
            })

        }
        maxstrain = Number(maxstrain*100).toFixed(1)
        return maxstrain;
    }



}

export default UnconfinedCalcs;