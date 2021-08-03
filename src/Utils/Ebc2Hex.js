let Ebc2Hex = function(ebc, sat) {
    ebc = ebc > 80 ? 80 : ebc;
    ebc = ebc < 0 ? 0 : ebc;
    var srm = ebcToSrm(ebc);
    var rgb = {
        r: calcRed(srm),
        g: calcGreen(srm),
        b: calcBlue(srm)
    };
    rgb = desaturate(rgb, sat);
    return rgbToHex(rgb);
}

function ebcToSrm(ebc) {
    return ebc * 0.508;
}

function calcRed(srm) {
    var result = Math.round(280 - srm * 5.65);
    return result > 255 ? 255 : result;
}

function calcGreen(srm) {
    var result = Math.round(0.188349 * Math.pow(srm, 2) - 13.2676 * srm + 239.51);
    return result;
}

function calcBlue(srm) {
    var result = Math.round(0.000933566 * Math.pow(srm, 4) - 0.0894788 * Math.pow(srm, 3) + 3.00611 * Math.pow(srm, 2) - 40.8883 * srm + 183.409);
    return result < 0 ? 0 : result;
}

function segmentToHex(seg) {
    var hex = seg.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + segmentToHex(rgb.r) + segmentToHex(rgb.g) + segmentToHex(rgb.b);
}

function desaturate(rgb, sat) {
    var gray = rgb.r * 0.3086 + rgb.g * 0.6094 + rgb.b * 0.0820;
    gray = gray * (1 - sat);
    rgb.r = Math.round(rgb.r * sat + gray);
    rgb.g = Math.round(rgb.g * sat + gray);
    rgb.b = Math.round(rgb.b * sat + gray);
    return rgb;
}

export default Ebc2Hex