var uuid = require('uuid');

export const beerRecipe = () => {return {
    recipe: {
      name: "", 
      description: "",
      author: "",
      date: new Date().toISOString().substr(0,10), // Default is today for recipe.
      maltYield: 0.68,                             // Default is 68%

      og: null,
      fg: null,
      ibu: null,
      alc: null,
      ebc: null,
      oil: null,
      beertype: {
        name: null,
        og: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
        fg: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
        alc: { minPercentWeight: null, maxPercentWeight: null,minPercentVol: null, maxPercentVol: null},
        colorVal: { minSRM: null, maxSRM: null,minEBC: null, maxEBC: null},
        ibu:  { min: null, max: null }
      }
    },
    cookingDuration: 90,
    water: { mashWaterVolume: 17, spargeWaterVolume: 13, finalVolume: 20, grainLoss: 1, boilLoss: 4 },
    malt: [],
    mashSteps: [{key: uuid.v4(), temp: 57, dur: 0, type: 0, descr: "" }],
    hops: [],
    yeast: { name: "", attenuation: 0.7, flocculation: "" }
  }
}

export const malt = (key) => {return {key: key == null ? uuid.v4() : key, name: "", color: {srm: 0, ebc: 0}, potential: 1, amount: 0}}

export const hop = (key) => {return {key: key == null ? uuid.v4() : key, name: "", alpha: 0, oil: 0, amount: 0, type: 1, ibu: 0, oilTotal: 0, duration: 0}}

export const mashStep = (key) => {return {key: key == null ? uuid.v4() : key, temp: 0, dur: 0, type: 1, descr: "" }}

export const yeast = () => {return { name: "", attenuation: 0.7, flocculation: "" }}

export const recipe = () => {return ({
    name: null,
    og: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
    fg: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
    alc: { minPercentWeight: null, maxPercentWeight: null,minPercentVol: null, maxPercentVol: null},
    colorVal: { minSRM: null, maxSRM: null,minEBC: null, maxEBC: null},
    ibu:  { min: null, max: null }
  })
}

export const mashStepTemplates = [
  { id: 0, label: "3-Rests", value: [{key: uuid.v4(), temp: 57, dur: 0, type: 0, descr: "" }, {key: uuid.v4(), temp: 55, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 68, dur: 60, type: 1, descr: "" }, {key: uuid.v4(), temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 1, label: "4-Rests", value: [{key: uuid.v4(), temp: 57, dur: 0, type: 0, descr: "" }, {key: uuid.v4(), temp: 55, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 63, dur: 60, type: 1, descr: "" }, {key: uuid.v4(), temp: 72, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 2, label: "5-Rests Wheat Beer", value: [{key: uuid.v4(), temp: 47, dur: 0, type: 0, descr: "" }, {key: uuid.v4(), temp: 45, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 55, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 63, dur: 60, type: 1, descr: "" }, {key: uuid.v4(), temp: 72, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 3, label: "5-Rests Rye Beer", value: [{key: uuid.v4(), temp: 37, dur: 0, type: 0, descr: "" }, {key: uuid.v4(), temp: 35, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 55, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 63, dur: 60, type: 1, descr: "" }, {key: uuid.v4(), temp: 72, dur: 15, type: 1, descr: "" }, {key: uuid.v4(), temp: 78, dur: 10, type: 1, descr: "" }]},
]

export const hopType = [
  {id: 0, label: "first wort", descr: " as first wort"},
  {id: 1, label: "boil", descr: " boiling for "},
  //{id: 2, label: "whirlpool", descr: ""},
  {id: 2, label: "whirlpool 80°C", descr: " at 80°C with whirlpool"},
  {id: 3, label: "dry hopping", descr: " as dry hop"}
]

export const mashStepTypes = [
  { id: 0, label: "Adding" },
  { id: 1, label: "Resting" }
]

export const sedimentation = [
  { id: 0, label: "Low" }, 
  { id: 1, label: "Medium-Low" }, 
  { id: 2, label: "Medium" }, 
  { id: 3, label: "Medium-High" }, 
  { id: 4, label: "High" }, 
] 

export const exportRecipe = (beerRecipe) => {
  let exportData = {}
  exportData["recipe"] = {
    name: beerRecipe.recipe.name, 
      description: beerRecipe.recipe.description,
      author: beerRecipe.recipe.author,
      date: beerRecipe.recipe.date,
      maltYield: beerRecipe.recipe.maltYield,
      beertype: beerRecipe.recipe.beertype
  }
  exportData["cookingDuration"] = beerRecipe.cookingDuration
  exportData["water"] = beerRecipe.water
  exportData["yeast"] = beerRecipe.yeast
  exportData["malt"] = []
  beerRecipe.malt.forEach((data) => {
    let row = {}
    for(let [k, val] of Object.entries(data)) {
      if(k !== "key")
        row[k] = val
    }
    exportData["malt"].push(row)
  })
  exportData["mashSteps"] = []
  beerRecipe.mashSteps.forEach((data) => {
    let row = {}
    for(let [k, val] of Object.entries(data)) {
      if(k !== "key")
        row[k] = val
    }
    exportData["mashSteps"].push(row)
  })
  exportData["hops"] = []
  beerRecipe.hops.forEach((data) => {
    let row = {}
    for(let [k, val] of Object.entries(data)) {
      if(k !== "key")
        row[k] = val
    }
    exportData["hops"].push(row)
  })
  return JSON.stringify(exportData, null, 4)
}

export const importRecipe = (data) => {
  data = JSON.parse(data)
  let recipe = beerRecipe()
  recipe["recipe"] = {
    name: data.recipe.name, 
      description: data.recipe.description,
      author: data.recipe.author,
      date: data.recipe.date,
      maltYield: data.recipe.maltYield,
      beertype: data.recipe.beertype
  }
  recipe["cookingDuration"] = data.cookingDuration
  recipe["water"] = data.water
  recipe["yeast"] = data.yeast
  recipe["malt"] = []
  data.malt.forEach((data) => {
    let row = malt()
    for(let [k, val] of Object.entries(data)) {
      row[k] = val
    }
    recipe["malt"].push(row)
  })
  recipe["mashSteps"] = []
  data.mashSteps.forEach((data) => {
    let row = mashStep()
    for(let [k, val] of Object.entries(data)) {
      row[k] = val
    }
    recipe["mashSteps"].push(row)
  })
  recipe["hops"] = []
  data.hops.forEach((data) => {
    let row = hop()
    for(let [k, val] of Object.entries(data)) {
      row[k] = val
    }
    recipe["hops"].push(row)
  })
  return recipe
}