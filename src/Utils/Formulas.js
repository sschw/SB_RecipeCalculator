

export function plato2sg(plato) {
  return 1 + plato / (258.6 - ((plato / 258.2) * 227.1));
}

export function sg2plato(sg) {
  if(sg < 0.9) return 0;
  return -616.868 + (1111.14 * sg) - (630.272 * sg * sg) + (135.997 * sg * sg * sg);
}

export function celsius2fahrenheit(c) {
  return (c * 1.8 + 32);
}

export function fahrenheit2celsius(f) {
  return (f - 32) / 1.8;
}

export function ebc2Srm(ebc) {
  return ebc * 0.508;
}

export function srm2Ebc(srm) {
  return srm * 1.97;
}

export function srm2Lovibond(srm) {
  return (srm + 0.76) / 1.3546;
}

export function lovibond2Srm(l) {
  return (1.3546 * l) - 0.76;
}

export function sgTempCorrectedC(value, celsius, celsiusTarget) {
  return sgTempCorrectedF(value, celsius2fahrenheit(celsius), celsius2fahrenheit(celsiusTarget));
}

export function sgTempCorrectedF(value, fahrenheit, fahrenheitTarget) {
  return value * ((1.00130346 - 0.000134722124 * fahrenheit + 0.00000204052596 * fahrenheit * fahrenheit - 0.00000000232820948 * fahrenheit * fahrenheit * fahrenheit) / (1.00130346 - 0.000134722124 * fahrenheitTarget + 0.00000204052596 * fahrenheitTarget * fahrenheitTarget - 0.00000000232820948 * fahrenheitTarget * fahrenheitTarget * fahrenheitTarget));
}

export function gramm2Pounds(g) {
  return g/1000*2.20462262185;
}

export function pounds2Gramm(p) {
  return p*1000/2.20462262185;
}

export function litre2USGal(l) {
  return l / 3.785;
}

export function usGal2litre(g) {
  return g * 3.785;
}

export function litre2Gal(l) {
  return l / 4.546;
}

export function gal2litre(g) {
  return g * 4.546;
}

export function potentials2og(malt, waterVolume, maltyield) {
  const maltPoints = malt.reduce((pv, v) => pv + (v.type === "Grain" ? ((v.potential-1)*1000 * gramm2Pounds(v.amount)) : 0), 0) * maltyield / litre2USGal(waterVolume)
  const sugarPoints = malt.reduce((pv, v) => pv + (v.type === "Grain" ? 0 : ((v.potential-1)*1000 * gramm2Pounds(v.amount))), 0) / litre2USGal(waterVolume)
  return Math.round(maltPoints+sugarPoints)/1000+1
}

// Formula according to brauerei mueggelland.
// This formula is not found anywhere else but it has a better precision with higher OG.
export function potentials2og_v2(malt, waterVolume, maltyield) {
  const maltPoints = malt.reduce((pv, v) => pv + (v.type === "Grain" ? (((v.potential-1)*1000/40 + 0.04) * v.amount) : 0), 0) * maltyield / waterVolume
  const sugarPoints = malt.reduce((pv, v) => pv + (v.type === "Grain" ? 0 : (((v.potential-1)*1000/40 + 0.04) * v.amount)), 0) / waterVolume
  return plato2sg(Math.round(maltPoints+sugarPoints)/10)
}

// morey equation
export function maltebc2beerebc(malt, waterVolume) {
  return Math.round(srm2Ebc(1.4922*(malt.reduce((pv, v) => pv+srm2Lovibond(v.color.srm) * gramm2Pounds(v.amount) / litre2USGal(waterVolume), 0)**0.6859)))
}

export function og2fg(og, yeastAttenuation) {
  return (og-1)*(1-yeastAttenuation)+1
}

export function gravities2Abv(og, fg) {
  // Easy and less precise
  // return (og-fg)/0.00753 // Corresponds to og: 1.050 fg: 1.010

  return ((1.05*(og-fg) / fg) / fg) / 0.79 * 100
}

export function abv2Abw(abv, fg) {
  return 0.79 * abv / fg
}

export function tinseth(og, cookVolume, finalVolume, aa, amount, time, maximumUtilizationValue) {
  var sg = (og - 1.0) * finalVolume / cookVolume;
  if (maximumUtilizationValue == null) maximumUtilizationValue = 4.15;
  return 1.65 * Math.pow(0.000125, sg) * ((1 - Math.pow(Math.E, -0.04 * time)) / maximumUtilizationValue) * ((aa * amount * 1000) / finalVolume);
}

// Scale the post isomization time with the isomization we reach in the time until we hit the defined degree.
export function postIsomizationTime2IsomizationSpeedFactorTime(postIsomizationTime, degree) {
  if (degree == null) degree = 80;
  return postIsomizationTime * 0.046 * Math.pow(Math.E, 0.031*degree);
}

export function ibu(hops) {
  return hops.reduce((pv, v) => pv+v.ibu, 0)
}

export function totOil(hop) {
  return hop.oil*hop.amount/100
}

export function oil(hops) {
  return hops.reduce((pv, v) => pv+v.oilTotal, 0)
}