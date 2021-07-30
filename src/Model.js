

export const beerRecipe = () => {return {
    recipe: { 
      name: "", 
      description: "",
      author: "",
      date: new Date().toISOString().substr(0,10), // Default is today for recipe.
      maltYield: 0.68,                             // Default is 68%

      og: null,
      sg: null,
      ibu: null,
      alc: null,
      ebc: null,
      beertype: {
        name: null,
        og: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
        sg: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
        alc: { minPercentWeight: null, maxPercentWeight: null,minPercentVol: null, maxPercentVol: null},
        colorVal: { minSRM: null, maxSRM: null,minEBC: null, maxEBC: null},
        ibu:  { min: null, max: null }
      }
    },
    malt: [],
    mashSteps: [{temp: 57, dur: 0, type: 0, descr: "" }],
    hops: [],
  }
}

export const malt = () => {return {name: "", ebc: 0, potential: 0, amount: 0}}

export const hop = () => {return {name: "", alpha: 0, oil: 0, amount: 0, type: 1, duration: 0}}

export const mashStep = () => {return {temp: 0, dur: 0, type: 1, descr: "" }}

export const mashStepTemplates = [
  { id: 0, label: "3-Rests", value: [{temp: 57, dur: 0, type: 0, descr: "" }, {temp: 55, dur: 15, type: 1, descr: "" }, {temp: 68, dur: 60, type: 1, descr: "" }, {temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 1, label: "4-Rests", value: [{temp: 57, dur: 0, type: 0, descr: "" }, {temp: 55, dur: 15, type: 1, descr: "" }, {temp: 63, dur: 60, type: 1, descr: "" }, {temp: 72, dur: 15, type: 1, descr: "" }, {temp: 78, dur: 10, type: 1, descr: "" }]},
  { id: 2, label: "5-Rests Wheat Beer", value: [{temp: 47, dur: 0, type: 0, descr: "" }, {temp: 45, dur: 15, type: 1, descr: "" }, {temp: 55, dur: 15, type: 1, descr: "" }, {temp: 63, dur: 60, type: 1, descr: "" }, {temp: 72, dur: 15, type: 1, descr: "" }, {temp: 78, dur: 10, type: 1, descr: "" }]},
]

export const hopType = [
  {id: 0, label: "first wort"},
  {id: 1, label: "boil"},
  //{id: 2, label: "whirlpool"},
  {id: 3, label: "whirlpool 80°C"},
  {id: 4, label: "dry hopping"}
]

export const mashStepTypes = [
  { id: 0, label: "Adding" },
  { id: 1, label: "Resting" }
]