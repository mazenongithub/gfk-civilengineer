magnitudeCorrectionFactor(mag) {
    magcorr = 0.032 * Math.pow(mag, 2) -(0.6311 * mag) + 3.9377;
    return magcorr;
    }