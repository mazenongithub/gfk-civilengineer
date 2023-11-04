import GFK from './gfk'

class SesimicCalcs {

    magnitudeCorrectionFactor(mag) {
        let magcorr = 0.032 * Math.pow(mag, 2) - (0.6311 * mag) + 3.9377;
        return Number(magcorr).toFixed(3);
    }

    allowableStrengthRatio(fines, n60, picorrection, magcorrection) {

        const csr_5 = (n60) => {

            return (0.0004 * Math.pow((n60), 2) + 0.0019 * (n60) + 0.0297);
        }

        const csr_15 = (n60) => {
            return (0.0008 * Math.pow((n60), 2) - 0.0052 * (n60) + 0.1056)

        }

        const csr_35 = (n60) => {

            return (0.001 * Math.pow((n60), 2) - 0.0033 * (n60) + 0.099)

        }

        const calcCSR = (fines, n60) => {
            let interpolcsr = 0;

            if (fines <= 5) {
                interpolcsr = csr_5(n60);

            } else if (5 < fines && fines <= 15) {
                interpolcsr = csr_5(n60) - ((fines - 5) / 10) * (csr_5(n60) - csr_15(n60));

            } else if (15 < fines && fines < 35) {
                interpolcsr = csr_15(n60) - ((fines - 15) / 20) * (csr_15(n60) - csr_35(n60));
            } else {
                interpolcsr = csr_35(n60);
            }
            return interpolcsr;
        }


        let csr = calcCSR(fines, n60) * picorrection * magcorrection
        csr = Number(csr).toFixed(3)
        return csr;



    }

    drivingCSR(accel, overburden, effective, depthred) {
        accel = Number(accel)
        overburden = Number(overburden);
        effective = Number(effective);
        depthred = Number(depthred)
        let driving = 0.65 * accel * (overburden / effective) * depthred;
        return Number(driving).toFixed(3)

    }

    piCorrectionFactor(pi) {
        let picorr = 1;
        if (pi < 10) {
            picorr = 1;
        }
        else {
            picorr = 1 + 0.022 * (pi - 10);
        }
        return picorr;
    }

    depthReductionFactor(depth) {
        let depthred = -3 * Math.pow(10, -6) * Math.pow(depth, 3) + 1 * Math.pow(10, -4) * Math.pow(depth, 2) - 0.0031 * (depth) + 1.0024;
        return Number(depthred).toFixed(3);
    }

    rodLengthCorrection(depth) {
        let rodcorr = 1;
        if (depth <= 13) {
            rodcorr = 0.75;
        } else if (13 < depth && depth <= 20) {
            rodcorr = 0.85;
        } else if (20 < depth && depth <= 30) {
            rodcorr = 0.95;
        } else {
            rodcorr = 1;
        }
        return rodcorr;
    }

    overburdenCorrection(effective) {


        let overcorr = ((2088) / (effective));
        overcorr = Math.sqrt(overcorr);

        return Number(overcorr).toFixed(3);

    }

    calcWetDen(wetwgt, diameter, length) {
        return Math.round(Number((wetwgt / (.25 * Math.pow(Number(diameter), 2) * Math.PI * Number(length))) * (1 / 453.592) * (144 * 12)))

    }

    getOverBurden(sampleid, depth) {
        const gfk = new GFK();
        let overburden = 0;
        let effective = 0;
        let hydro = 0;
        depth = Number(depth)
        const seismiccalcs = new SesimicCalcs();


        const getsample = gfk.getsamplebyid.call(this, sampleid)
        if (getsample) {

            const boringid = getsample.boringid;
            const boring = gfk.getboringbyid.call(this, boringid);

            let gwdepth = 0;
            if (boring) {
                gwdepth = Number(boring.gwdepth);
            }
            const samples = gfk.getsamplesbyboringid.call(this, boringid);

            if (samples) {

                samples.map((sample, i) => {


                    let wetwgt = Number(sample.wetwgt) - Number(sample.tarewgt)
                    let samplelength = Number(sample.samplelength);
                    let diameter = Number(sample.diameter)
                    let wetden = seismiccalcs.calcWetDen.call(this, wetwgt, diameter, samplelength)
                    let sampledepth = Number(sample.depth)

                    if (i === 0) {

                        if (sampledepth <= depth) {
                            overburden += wetden * sampledepth

                        } else {
                            overburden += (125 * depth)
                        }





                    } else {

                        if (sampledepth <= depth) {
                            overburden += wetden * (sampledepth - samples[i - 1].depth)

                        } else {

                            if (samples[i - 1].depth < depth) {


                                let wetwgtfinal = Number(samples[i - 1].wetwgt) - Number(samples[i - 1].tarewgt)
                                let wetdenfinal = seismiccalcs.calcWetDen.call(this, wetwgtfinal, samples[i - 1].diameter, samples[i - 1].samplelength)

                                overburden += wetdenfinal * (depth - samples[i - 1].depth)

                            }
                        }


                    }



                })

                if (gwdepth < depth) {
                    hydro = 62.4 * (depth - gwdepth)
                }

                effective = Math.round(overburden - hydro);
            }
        }

        return { overburden, effective };
    }





}
export default SesimicCalcs;