const suffixValues: any = {
    del: 0,
    gnd: 1,
    twr: 2,
    app: 3,
    ctr: 4,
};

/**
 * Properly sorts two ATC Stations in ascending order (i.e. DEL, GND, TWR, ...)
 * @param a
 * @param b
 */
function sortAtcStation(a: string, b: string) {
    const suf_a = a.toLowerCase().slice(-3);
    const suf_b = b.toLowerCase().slice(-3);

    if (suf_a == suf_b) {
        if (a.length != b.length) {
            return a.length - b.length;
        }

        return a.localeCompare(b);
    }

    const keys = Object.keys(suffixValues);
    if (keys.includes(suf_a) && keys.includes(suf_b)) {
        return suffixValues[suf_a] - suffixValues[suf_b];
    }

    return 0;
}

export default {
    sortAtcStation,
};
