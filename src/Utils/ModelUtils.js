// Include model creating functions.
import { hop, malt, mashStep } from "../Model.js"
// Include calculations
import { potentials2og, maltebc2beerebc, tinseth, totOil, oil, ibu, og2fg, gravities2Abv } from "./Formulas.js"

function calcMaltValues(beerRecipe) {
  // Calc OG.
  beerRecipe.recipe.og = potentials2og(beerRecipe.malt, beerRecipe.water.finalVolume, beerRecipe.recipe.maltYield)
  // If not valid value, reset it.
  beerRecipe.recipe.og = beerRecipe.recipe.og === 0 || beerRecipe.recipe.og === 1 ? null : beerRecipe.recipe.og

  // Calc beer color.
  beerRecipe.recipe.ebc = maltebc2beerebc(beerRecipe.malt, beerRecipe.water.finalVolume)
  // If not valid value, reset it.
  beerRecipe.recipe.ebc = beerRecipe.recipe.ebc === 0 ? null : beerRecipe.recipe.ebc
}

function calcHopValues(beerRecipe, id) {
  let maltAmount = beerRecipe.malt.reduce((pv, v) => pv+v.amount/1000, 0)
  let duration = beerRecipe.hops[id].type === 0 ? beerRecipe.cookingDuration : beerRecipe.hops[id].duration
  // If hop is cooked and OG is known, calculate IBU.
  beerRecipe.hops[id].ibu = beerRecipe.hops[id] > 1 || beerRecipe.recipe.og == null ? 0 : Math.round(tinseth(beerRecipe.recipe.og, beerRecipe.water.mashWaterVolume+beerRecipe.water.spargeWaterVolume-beerRecipe.water.grainLoss*maltAmount, beerRecipe.water.finalVolume, beerRecipe.hops[id].alpha, beerRecipe.hops[id].amount, duration));
  // Calculate the oil of the hop, if it is not cooked.
  beerRecipe.hops[id].oilTotal = beerRecipe.hops[id].type < 2 ? 0 : Math.round(totOil(beerRecipe.hops[id])*100)/100;
  beerRecipe.recipe.oil = oil(beerRecipe.hops);
  beerRecipe.recipe.ibu = ibu(beerRecipe.hops);
}

function calcHopsValues(beerRecipe) {
  // Calc amount of malt to calculate the amount of water lost.
  let maltAmount = beerRecipe.malt.reduce((pv, v) => pv+v.amount/1000, 0)
  for(let i = 0; i < beerRecipe.hops.length; i++) {
    // Get cooking duration of current hop, if first wort - take full cooking duration.
    let duration = beerRecipe.hops[i].type === 0 ? beerRecipe.cookingDuration : beerRecipe.hops[i].duration
    // If hop is cooked and OG is known, calculate IBU.
    beerRecipe.hops[i].ibu = beerRecipe.hops[i] > 1 || beerRecipe.recipe.og == null ? 0 : Math.round(tinseth(beerRecipe.recipe.og, beerRecipe.water.mashWaterVolume+beerRecipe.water.spargeWaterVolume-beerRecipe.water.grainLoss*maltAmount, beerRecipe.water.finalVolume, beerRecipe.hops[i].alpha, beerRecipe.hops[i].amount, duration));
  }
  beerRecipe.recipe.ibu = ibu(beerRecipe.hops);
}

function calcYeastValues(beerRecipe) {
  // If OG is correct, calculate FG and Alc
  beerRecipe.recipe.fg = beerRecipe.recipe.og === null ? null : og2fg(beerRecipe.recipe.og, beerRecipe.yeast.attenuation)
  beerRecipe.recipe.alc = beerRecipe.recipe.og === null ? null : gravities2Abv(beerRecipe.recipe.og, beerRecipe.recipe.fg)
}

export function updateRecipe(beerRecipe, target, value) {
  let valChanged = beerRecipe.recipe[target] !== value;
  beerRecipe.recipe[target] = value;
  return valChanged;
}

export function updateCookingDuration(beerRecipe, value) {
  let valChanged = beerRecipe.cookingDuration !== value;
  beerRecipe.cookingDuration = value;

  // IBU might change
  calcHopsValues(beerRecipe);
  return valChanged
}

export function updateMalt(beerRecipe, key, target, value) {
  let valChanged = false;
  let id = -1;
  beerRecipe.malt.forEach((malt, idx) => {
    if(malt.key === key) {
      id = idx;
    }
  })
  if(id === -1) {
    id = beerRecipe.malt.length;
    beerRecipe.malt.push(malt(key));
  }
  if(target != null) {
    valChanged = beerRecipe.malt[id][target] !== value;
    beerRecipe.malt[id][target] = value;
  } else {
    for(let [k, val] of Object.entries(value)) {
      valChanged = valChanged || beerRecipe.malt[id][k] !== val;
      beerRecipe.malt[id][k] = val
    }
  }
  // Color and OG changes.
  calcMaltValues(beerRecipe);
  // Depends on OG.
  calcYeastValues(beerRecipe);
  calcHopsValues(beerRecipe);
  return valChanged
}

export function deleteMalt(beerRecipe, key) {
  let id = -1;
  beerRecipe.malt.forEach((malt, idx) => {
    if(malt.key === key) {
      id = idx;
    }
  })
  if(id !== -1) {
    beerRecipe.malt.splice(id, 1);
    // Color and OG changes.
    calcMaltValues(beerRecipe);
    // Depends on OG.
    calcYeastValues(beerRecipe);
    calcHopsValues(beerRecipe);
    return true;
  }
  return false;
}

export function updateMashSteps(beerRecipe, key, target, value) {
  let valChanged = false;
  let id = -1;
  beerRecipe.mashSteps.forEach((mashStep, idx) => {
    if(mashStep.key === key) {
      id = idx;
    }
  })
  if(id === -1) {
    id = beerRecipe.mashSteps.length;
    beerRecipe.mashSteps.push(mashStep(key));
  }
  if(target != null) {
    valChanged = beerRecipe.mashSteps[id][target] !== value;
    beerRecipe.mashSteps[id][target] = value;
  } else {
    for(let [k, val] of Object.entries(value)) {
      valChanged = valChanged || beerRecipe.mashSteps[id][k] !== val;
      beerRecipe.mashSteps[id][k] = val
    }
  }
  return valChanged
}

export function moveMashSteps(beerRecipe, key, direction) {
  let id = -1;
  beerRecipe.mashSteps.forEach((mashSteps, idx) => {
    if(mashSteps.key === key)
      id = idx;
  })
  if(id !== -1 && id+direction >= 0 && id+direction < beerRecipe.mashSteps.length) {
    let tmp = beerRecipe.mashSteps[id];
    beerRecipe.mashSteps[id] = beerRecipe.mashSteps[id+direction];
    beerRecipe.mashSteps[id+direction] = tmp;
    return true;
  }
  return false;

}

export function switchMashSteps(beerRecipe, key1, key2) {
  let idKey1 = -1;
  let idKey2 = -1;
  beerRecipe.mashSteps.forEach((mashSteps, idx) => {
    if(mashSteps.key === key1)
      idKey1 = idx;
    if(mashSteps.key === key2)
      idKey2 = idx;
  })
  if(idKey1 !== -1 && idKey2 !== -1) {
    let tmp = beerRecipe.mashSteps[idKey1];
    beerRecipe.mashSteps[idKey1] = beerRecipe.mashSteps[idKey2];
    beerRecipe.mashSteps[idKey2] = tmp;
    return true;
  }
  return false;
}

export function deleteMashSteps(beerRecipe, key) {
  let id = -1;
  beerRecipe.mashSteps.forEach((mashStep, idx) => {
    if(mashStep.key === key) {
      id = idx;
    }
  })
  if(id !== -1) {
    beerRecipe.mashSteps.splice(id, 1);
    return true;
  }
  return false;
}

export function updateHop(beerRecipe, key, target, value) {
  let valChanged = false;
  let id = -1;
  beerRecipe.hops.forEach((hop, idx) => {
    if(hop.key === key) {
      id = idx;
    }
  })
  if(id === -1) {
    id = beerRecipe.hops.length;
    beerRecipe.hops.push(hop(key));
  }
  if(target != null) {
    valChanged = beerRecipe.hops[id][target] !== value;
    beerRecipe.hops[id][target] = value;
  } else {
    for(let [k, val] of Object.entries(value)) {
      valChanged = valChanged || beerRecipe.hops[id][k] !== val;
      beerRecipe.hops[id][k] = val
    }
  }
  // Specific IBU & oil and general IBU changes.
  calcHopValues(beerRecipe, id);
  return valChanged
}

export function deleteHop(beerRecipe, key) {
  let id = -1;
  beerRecipe.hops.forEach((hop, idx) => {
    if(hop.key === key) {
      id = idx;
    }
  })
  if(id !== -1) {
    beerRecipe.hops.splice(id, 1);
    // IBU changed.
    calcHopsValues(beerRecipe);
    return true
  }
  return false
}

export function updateYeast(beerRecipe, target, value) {
  let valChanged = false;
  if(target != null) {
    valChanged = beerRecipe.yeast[target] !== value
    beerRecipe.yeast[target] = value;
  } else {
    valChanged = beerRecipe.yeast !== value
    beerRecipe.yeast = value;
  }
  // FG & alc changes.
  calcYeastValues(beerRecipe);
  return valChanged
}

export function updateWater(beerRecipe, target, value) {
  let valChanged = false;
  if(target != null) {
    valChanged = beerRecipe.water[target] !== value
    beerRecipe.water[target] = value;
  } else {
    valChanged = beerRecipe.water !== value
    beerRecipe.water = value;
  }
  // IBU and OG changes.
  calcMaltValues(beerRecipe);
  calcHopsValues(beerRecipe);
  return valChanged
}