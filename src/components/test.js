export function sortdisplacement(testa, testb) {

    if (Number(testa.displacement) < Number(testb.displacement)) {
        return 1;
    }
    else if (Number(testb.displacement) < Number(testa.displacement)) {
        return -1;
    }
    else {
        return 0;
    }
}