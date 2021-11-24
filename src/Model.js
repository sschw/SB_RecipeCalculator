var uuid = require('uuid');

export const beerRecipe = () => {return {
    system: "SI", // US for gal & °F - Will just change display type
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
    mashSteps: [{key: "mash0", temp: 57, dur: 0, type: 0, descr: "" }],
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
  { id: 0, label: "3-Rests", value: [{temp: 57, dur: 0, type: 0, descr: "" }, {temp: 55, dur: 15, type: 1, descr: "" }, {temp: 68, dur: 60, type: 1, descr: "" }, {temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 1, label: "4-Rests", value: [{temp: 57, dur: 0, type: 0, descr: "" }, {temp: 55, dur: 15, type: 1, descr: "" }, {temp: 63, dur: 60, type: 1, descr: "" }, {temp: 72, dur: 15, type: 1, descr: "" }, {temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 2, label: "5-Rests Wheat Beer", value: [{temp: 47, dur: 0, type: 0, descr: "" }, {temp: 45, dur: 15, type: 1, descr: "" }, {temp: 55, dur: 15, type: 1, descr: "" }, {temp: 63, dur: 60, type: 1, descr: "" }, {temp: 72, dur: 15, type: 1, descr: "" }, {temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 3, label: "5-Rests Rye Beer", value: [{temp: 37, dur: 0, type: 0, descr: "" }, {temp: 35, dur: 15, type: 1, descr: "" }, {temp: 55, dur: 15, type: 1, descr: "" }, {temp: 63, dur: 60, type: 1, descr: "" }, {temp: 72, dur: 15, type: 1, descr: "" }, {temp: 78, dur: 10, type: 1, descr: "" }]},
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