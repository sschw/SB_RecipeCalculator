import { Box } from '@material-ui/core';
import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import Recipe from '../Recipe/Recipe';
import BeertypeComparer from '../Beertype/BeertypeComparer'

const beerRecipe = {
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
  }
}

function changeState(state, action) {
  switch(action.type) {
    case 'recipe':
      state.recipe[action.target] = action.value
      return {...state}
    default:
      return state
  }
}

function Beer(props) {
  let beer
  if (props.beer === undefined) {
    beer = beerRecipe
  } else {
    beer = props.beer
  }
  const [state, dispatch] = useReducer(changeState, beer)

  return (
    <Box>
      <h2>{state["recipe"]["name"] !== "" ? state["recipe"]["name"] + " Recipe" : "New Beer Recipe"}</h2>
      <Recipe recipe={state["recipe"]} dispatch={dispatch} />
      <BeertypeComparer  recipe={state["recipe"]} dispatch={dispatch} />
    </Box>
  )
}

export default Beer