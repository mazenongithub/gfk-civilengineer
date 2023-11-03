getweightscore(topdepth, bottomdepth) {
    let layer = bottomdepth - topdepth;
    let score = 0
    if (topdepth == 0 && layer >= 9) {
        score = 18;
    } else if (topdepth == 0 && layer >= 6) {
        score = 15 + (9 - layer);
    } else if (topdepth == 0 && layer >= 3) {
        score = 9 + (6 - layer) * 2;
    } else if (topdepth == 0 && layer > 0 && layer <= 3) {
        score = 9 + (6 - layer) * 2;
    } else if (topdepth < 3 && bottomdepth <= 3) {
        score = 3 * layer;
    } else if (topdepth <= 3 && bottomdepth < 6) {
        score = 3 * (3 - topdepth) + 2 * (bottomdepth - 3);
    } else if (topdepth <= 3 && bottomdepth <= 9) {
        score = 3 * (3 - topdepth) + 6 + (bottomdepth - 6);
    } else if (topdepth <= 3 && bottomdepth >= 9) {
        score = 3 * (3 - topdepth) + 9;
    } else if (topdepth <= 6 && bottomdepth <= 6) {
        scope = 2 * layer;
    } else if (topdepth <= 6 && bottomdepth <= 9) {
        score = (6 - topdepth) * 2 + (bottomdepth - 6);
    } else if (topdepth >= 6 && bottomdepth <= 9) {
        score = layer;
    } else if (topthdepth >= 6 && bottomdepth >= 9 && topdepth <= 9) {
        score = 9 - topdepth;
    } else if (topdepth > 9) {
        scope = 0;
    }
    return score;
}