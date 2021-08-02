

export function plato2sg(plato) {
  return 1 + plato / (258.6 - ((plato / 258.2) * 227.1));
}

export function sg2plato(sg) {
  return -616.868 + (1111.14 * sg) - (630.272 * sg * sg) + (135.997 * sg * sg * sg);
}

export function celsius2fahrenheit(c) {
  return (c * 1.8 + 32);
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
  return l * 0.26417;
}

export function usGal2litre(g) {
  return g / 0.26417;
}

// Note: using waterVolume pre-boil will give the pre-boil gravity
export function potentials2og(malt, waterVolume, maltyield) {
  return Math.round(malt.reduce((pv, v) => pv+(v.potentials-1)*1000 * v.amount, 0)*maltyield/waterVolume)/1000+1
}

// morey equation
export function maltebc2beerebc(malt, waterVolume) {
  return 1.4922*(malt.reduce((pv, v) => pv+srm2Lovibond(v.color.srm) * gramm2Pounds(v.amount) / litre2USGal(waterVolume), 0)**0.6859)
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