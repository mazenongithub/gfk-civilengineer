import GFK from './gfk';
class PTSlabCalcs {

    calcEdgeLiftym(gammahswellavg) {
        gammahswellavg = Number(gammahswellavg)
       let edgelift = gammahswellavg*40.2
       edgelift = Number(edgelift).toFixed(2)
       return edgelift;
    }
    calcCenterLiftym(gammahshrinkavg) {
       let centerlift =gammahshrinkavg*29.
       centerlift = Number(centerlift).toFixed(2)
       return centerlift;
    }


    calcEdgeLiftem(alphahswellavg) {
        let edgelift = -45118*Math.pow(alphahswellavg,2)+(1395.5*alphahswellavg)-0.7712
        edgelift = Number(edgelift).toFixed(1)
        return edgelift;
    }

    calcCenterLiftem(alphahshrinkavg) {
        alphahshrinkavg = Number(alphahshrinkavg)
        let centerlift = 50102*(Math.pow(alphahshrinkavg,1.5909));
        centerlift = Number(centerlift).toFixed(1)
        return centerlift;
    }

    getWeightAvg(calculate) {


        let sectionscore = 0;
        // eslint-disable-next-line
        calculate.map(layer => {
            sectionscore += this.getweightscore(layer.toplayer, layer.bottomlayer)

        })

        let modified = calculate
        // eslint-disable-next-line
        calculate.map((newlayer, i) => {
            let score = Number(this.getweightscore(newlayer.toplayer, newlayer.bottomlayer)) / Number(sectionscore)
            modified[i].weightedavg = score

        })

        let gammahavg = 0;
        let gammahswellavg = 0;
        let gammahshrinkavg = 0;
        let alphahavg = 0;
        let alphahswellavg = 0;
        let alphahshrinkavg = 0
    
        // eslint-disable-next-line
        modified.map(modified => {
            gammahavg += modified.gammah * modified.weightedavg;
            gammahswellavg += modified.gammahswell * modified.weightedavg
            gammahshrinkavg += modified.gammahshrink * modified.weightedavg
            alphahavg += modified.alphah * modified.weightedavg
            alphahswellavg += modified.alphahswell * modified.weightedavg;
            alphahshrinkavg += modified.alphahshrink * modified.weightedavg

        })
        gammahavg = Number(gammahavg).toFixed(4)
        gammahswellavg = Number(gammahswellavg).toFixed(4)
        gammahshrinkavg = Number(gammahshrinkavg).toFixed(4)
        alphahavg = Number(alphahavg).toFixed(6)
        alphahswellavg = Number(alphahswellavg).toFixed(6)
        alphahshrinkavg = Number(alphahshrinkavg).toFixed(6)

        

        return ({ gammahavg, gammahswellavg, gammahshrinkavg, alphahavg, alphahswellavg, alphahshrinkavg })








    }

    getweightscore(topdepth, bottomdepth) {
        let layer = bottomdepth - topdepth;
        let score = 0
        if (topdepth === 0 && layer >= 9) {
            score = 18;
        } else if (topdepth === 0 && layer >= 6) {
            score = 15 + (bottomdepth - 6);
        } else if (topdepth === 0 && layer >= 3) {
            score = 9 + (bottomdepth - 3) * 2;
        } else if (topdepth === 0 && layer > 0 && layer <= 3) {
            score = 3 * layer
        } else if (topdepth < 3 && bottomdepth <= 3) {
            score = 3 * layer;
        } else if (topdepth <= 3 && bottomdepth < 6) {
            score = 3 * (3 - topdepth) + 2 * (bottomdepth - 3);
        } else if (topdepth <= 3 && bottomdepth <= 9) {
            score = 3 * (3 - topdepth) + 6 + (bottomdepth - 6);
        } else if (topdepth <= 3 && bottomdepth >= 9) {
            score = 3 * (3 - topdepth) + 9;
        } else if (topdepth <= 6 && bottomdepth <= 6) {
            score = 2 * layer;
        } else if (topdepth <= 6 && bottomdepth <= 9) {
            score = (6 - topdepth) * 2 + (bottomdepth - 6);
        } else if (topdepth >= 6 && bottomdepth <= 9) {
            score = layer;
        } else if (topdepth >= 6 && bottomdepth >= 9 && topdepth <= 9) {
            score = 9 - topdepth;
        } else if (topdepth > 9) {
            score = 0;
        }
        return score;
    }

    getAlphah(Ss, gammah) {
        const alphah = (0.0029 - (0.000162 * Ss) - (0.0122 * (gammah)))
        return Number(alphah).toFixed(7)
    }

    getGammaShrink(gammah) {
        gammah = Number(gammah);
        const gammashrink = gammah * Math.exp(-gammah);
        return Number(gammashrink).toFixed(4)
    }


    getGammaSwell(gammah) {
        gammah = Number(gammah);
        const gammaswell = gammah * Math.exp(gammah);
        return Number(gammaswell).toFixed(4)
    }

    getGammah(gamma, fc) {
        const gammah = (fc / 100) * gamma;
        return Number(gammah).toFixed(4);
    }

    getGamma(zone, pifc, llfc) {
        const gfk = new GFK();
        const zonecharts = gfk.getZoneCharts.call(this)
        let zonechart = [];
        let gamma = 0;
        switch (zone) {
            case 1:
                zonechart = zonecharts.zone_1;
                break;
            case 2:
                zonechart = zonecharts.zone_2;
                break;
            case 3:
                zonechart = zonecharts.zone_3;
                break;
            case 4:
                zonechart = zonecharts.zone_4;
                break;
            case 5:
                zonechart = zonecharts.zone_5;
                break;
            case 6:
                zonechart = zonecharts.zone_6;
                break;
            default:
                break;
        }

        if (zonechart.length > 0) {
            // eslint-disable-next-line
            zonechart.map(chart => {
                if (Number(chart.ll) === Number(llfc) && Number(chart.pi) === Number(pifc)) {
                    gamma = chart.gamma;
                }


            })
        }


        return gamma;

    }

    getLLFc(ll, fc) {

        const llfc = ll / fc;
        return Number(llfc).toFixed(1)

    }

    getPIFc(pi, fc) {
        const pifc = pi / fc;
        return Number(pifc).toFixed(1);
    }

    getFc(fines, micro) {
        const fc = (micro) / (fines) * 100;
        return Math.round(fc)
    }

    getSs(ll, pi, fines) {

        const ss = -20.29 + (0.1555 * ll) - (0.117 * pi) + (0.0684 * fines);
        return ss;
    }

    getzone(ll, pi) {

        let zone = 0
        if (pi < (0.9 * (ll - 8)) && pi > ((33.5 / 40) * ll) - 8.5) {
            zone = 1;
        } else if (pi < ((33.5 / 40) * ll) - 8.5 && pi > (0.825 * ll) - 12) {
            zone = 2;
        } else if (pi < (((0.825) * ll) - 12) && pi > (0.73 * ((ll) - 20))) {
            zone = 3;
        } else if (pi < (0.73 * ((ll) - 20)) && pi > ((0.7 * ll) - 19)) {
            zone = 4;
        } else if (pi < ((0.68 * ll) - 17) && ll < 50) {
            zone = 5;
        } else if (pi < ((0.68 * ll) - 17) && ll > 50) {
            zone = 6;
        }
        return zone;
    }




}
export default PTSlabCalcs;