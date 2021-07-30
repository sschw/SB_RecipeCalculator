import { Box, Grid, Paper } from '@material-ui/core';
import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import Recipe from '../Recipe/Recipe';
import BeertypeComparer from '../Beertype/BeertypeComparer'
import Hops from '../Hop/Hops';
import Malt from '../Malt/Malt';

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
  },
  hops: [],
  malt: [],
}

function changeState(state, action) {
  let updated = false
  let array = []
  switch(action.type) {
    case 'recipe':
      if(state.recipe[action.target] !== action.value) {
        state.recipe[action.target] = action.value;
        return {...state};
      }
      return state
    case 'updateHop':
      if(action.rowId === -1) {
        action.rowId = state.hops.length
        state.hops.push({name: "", alpha: 0, oil: 0, amount: 0, type: null, duration: 0});
        updated = true
      }
      if(state.hops[action.rowId][action.target] !== action.value) {
        state.hops[action.rowId][action.target] = action.value;
        updated = true
      }
      if(updated)
        return {...state};
      return state
    case 'deleteHop':
      array = [...state.hops];
      array.splice(action.rowId, 1);
      return {...state, hops: array};
    case 'updateMalt':
      if(action.rowId === -1) {
        action.rowId = state.malt.length
        state.malt.push({name: "", ebc: 0, potential: 0, amount: 0});
        updated = true
      }
      if(state.malt[action.rowId][action.target] !== action.value) {
        state.malt[action.rowId][action.target] = action.value;
        updated = true
      }
      if(updated)
        return {...state};
      return state
    case 'deleteMalt':
      array = [...state.malt];
      array.splice(action.rowId, 1);
      return {...state, malt: array};
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
    <div>
      <h2>{state["recipe"]["name"] !== "" ? state["recipe"]["name"] + " Recipe" : "New Beer Recipe"}</h2>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Recipe recipe={state["recipe"]} dispatch={dispatch} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <BeertypeComparer  recipe={state["recipe"]} dispatch={dispatch} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Hops hops={state["hops"]} dispatch={dispatch} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Malt malt={state["malt"]} dispatch={dispatch} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default Beer