import { Box, Button, Grid, Modal, Paper } from '@material-ui/core';
import React, { useReducer } from 'react';
import Recipe from '../Recipe/Recipe';
import BeertypeComparer from '../Beertype/BeertypeComparer'
import Hops from '../Hop/Hops';
import Malt from '../Malt/Malt';
import * as Model from '../../Model';
import MashSteps from '../MashSteps/MashSteps';
import ShowRecipe from './ShowRecipe';
import printRecipe from './PrintRecipe';
import { gravities2Abv, ibu, maltebc2beerebc, og2fg, oil, potentials2og, tinseth, totOil } from '../../Utils/Formulas';
import Yeast from '../Yeast/Yeast';
import Water from '../Water/Water';

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
    case 'duration':
      state.cookingDuration = action.value
      return {...state}
    case 'yeast':
        if(state.yeast[action.target] !== action.value) {
          state.yeast[action.target] = action.value;
          state.recipe.fg = state.recipe.og === null ? null : og2fg(state.recipe.og, state.yeast.attenuation)
          state.recipe.alc = state.recipe.og === null ? null : gravities2Abv(state.recipe.og, state.recipe.fg)
          return {...state};
        }
        return state
    case 'water':
      if(state.water[action.target] !== action.value) {
        state.water[action.target] = action.value;
        state.recipe.og = potentials2og(state.malt, state.water.finalVolume, state.recipe.maltYield)
        state.recipe.og = state.recipe.og === 0 || state.recipe.og === 1 ? null : state.recipe.og
        state.recipe.fg = state.recipe.og === null ? null : og2fg(state.recipe.og, state.yeast.attenuation)
        state.recipe.alc = state.recipe.og === null ? null : gravities2Abv(state.recipe.og, state.recipe.fg)
        state.recipe.ebc = maltebc2beerebc(state.malt, state.water.finalVolume)
        state.recipe.ebc = state.recipe.ebc === 0 ? null : state.recipe.ebc
        let maltAmount = state.malt.reduce((pv, v) => pv+v.amount/1000, 0)
        for(let i = 0; i < state.hops.length; i++) {
          let duration = state.hops[action.rowId].type === 0 ? state.cookingDuration : state.hops[action.rowId].duration
          state.hops[i].ibu = state.hops[action.rowId] > 1 || state.recipe.og == null ? 0 : Math.round(tinseth(state.recipe.og, state.water.mashWaterVolume+state.water.spargeWaterVolume-state.water.grainLoss*maltAmount, state.water.finalVolume, state.hops[i].alpha, state.hops[i].amount, duration));
        }
        state.recipe.ibu = ibu(state.hops);
        return {...state};
      }
      return state
    case 'updateHop':
      if(action.rowId >= state.hops.length) return state
      if(action.rowId === -1) {
        action.rowId = state.hops.length
        state.hops.push(Model.hop("hop"+state.hops.length));
        updated = true
      }
      if(action.target == null) {
        for(let [key, value] of Object.entries(action.value)) {
          if(state.hops[action.rowId][key] !== undefined)
            state.hops[action.rowId][key] = value
        }
        updated = true
      } else if(state.hops[action.rowId][action.target] !== action.value  && (isNaN(action.value) || isNaN(state.hops[action.rowId][action.target]) || Math.abs(state.hops[action.rowId][action.target]-action.value) > Number.EPSILON)) {
        state.hops[action.rowId][action.target] = action.value;
        updated = true
      }
      if(updated) {
        let maltAmount = state.malt.reduce((pv, v) => pv+v.amount/1000, 0)
        let duration = state.hops[action.rowId].type === 0 ? state.cookingDuration : state.hops[action.rowId].duration
        state.hops[action.rowId].ibu = state.hops[action.rowId].type > 1 || state.recipe.og == null ? 0 : Math.round(tinseth(state.recipe.og, state.water.mashWaterVolume+state.water.spargeWaterVolume-state.water.grainLoss*maltAmount, state.water.finalVolume, state.hops[action.rowId].alpha, state.hops[action.rowId].amount, duration));
        state.recipe.ibu = ibu(state.hops);
        state.hops[action.rowId].oilTotal = state.hops[action.rowId].type < 2 ? 0 : Math.round(totOil(state.hops[action.rowId])*100)/100;
        state.recipe.oil = oil(state.hops);
        state.recipe.ibu = ibu(state.hops);
        return {...state};
      }
      return state
    case 'deleteHop':
      array = [...state.hops];
      array.splice(action.rowId, 1);
      state.recipe.ibu = ibu(array);
      state.recipe.oil = oil(state.hops);
      return {...state, hops: array};
    case 'updateMalt':
      if(action.rowId >= state.malt.length) return state
      if(action.rowId === -1) {
        action.rowId = state.malt.length
        state.malt.push(Model.malt("malt"+state.malt.length));
        updated = true
      }
      if(action.target == null) {
        for(let [key, value] of Object.entries(action.value)) {
          if(state.malt[action.rowId][key] !== undefined)
            state.malt[action.rowId][key] = value
        }
        updated = true
      } else if(state.malt[action.rowId][action.target] !== action.value && (isNaN(action.value) || isNaN(state.malt[action.rowId][action.target]) || Math.abs(state.malt[action.rowId][action.target]-action.value) > Number.EPSILON)) {
        state.malt[action.rowId][action.target] = action.value;
        updated = true
      }
      if(updated) {
        state.recipe.og = potentials2og(state.malt, state.water.finalVolume, state.recipe.maltYield)
        state.recipe.og = state.recipe.og === 0 || state.recipe.og === 1 ? null : state.recipe.og
        state.recipe.fg = state.recipe.og === null ? null : og2fg(state.recipe.og, state.yeast.attenuation)
        state.recipe.alc = state.recipe.og === null ? null : gravities2Abv(state.recipe.og, state.recipe.fg)
        state.recipe.ebc = maltebc2beerebc(state.malt, state.water.finalVolume)
        state.recipe.ebc = state.recipe.ebc === 0 ? null : state.recipe.ebc
        return {...state};
      }
      return state
    case 'deleteMalt':
      array = [...state.malt];
      array.splice(action.rowId, 1);
      state.recipe.og = potentials2og(array, state.water.finalVolume, state.recipe.maltYield)
      state.recipe.og = state.recipe.og === 0 || state.recipe.og === 1 ? null : state.recipe.og
      state.recipe.fg = state.recipe.og === null ? null : og2fg(state.recipe.og, state.yeast.attenuation)
      state.recipe.alc = state.recipe.og === null ? null : gravities2Abv(state.recipe.og, state.recipe.fg)
      state.recipe.ebc = maltebc2beerebc(array, state.water.finalVolume)
      state.recipe.ebc = state.recipe.ebc === 0 ? null : state.recipe.ebc
      return {...state, malt: array};
    case 'updateMashStep':
      if(action.rowId === -1) {
        action.rowId = state.mashSteps.length
        state.mashSteps.push(Model.mashStep("mash"+state.mashSteps.length));
        updated = true
      }
      if(action.target == null) {
        for(let [key, value] of Object.entries(action.value)) {
          if(state.mashSteps[action.rowId][key] !== undefined)
            state.mashSteps[action.rowId][key] = value
        }
        updated = true
      } else if(state.mashSteps[action.rowId][action.target] !== action.value && (isNaN(action.value) || isNaN(state.mashSteps[action.rowId][action.target]) || Math.abs(state.mashSteps[action.rowId][action.target]-action.value) > Number.EPSILON)) {
        state.mashSteps[action.rowId][action.target] = action.value;
        updated = true
      }
      if(updated)
        return {...state};
      return state
    case 'moveMashStep':
      if(action.rowId2 >= state.mashSteps.length)
        state.mashSteps.push(Model.mashStep())
      array = [...state.mashSteps];
      array[action.rowId1] = state.mashSteps[action.rowId2]
      array[action.rowId2] = state.mashSteps[action.rowId1]
      return {...state, mashSteps: array};
    case 'deleteMashStep':
      array = [...state.mashSteps];
      array.splice(action.rowId, 1);
      return {...state, mashSteps: array};
    case 'setMashTemplate':
      array = [...action.value];
      return {...state, mashSteps: array};
    default:
      return state
  }
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
};

function Beer(props) {
  let beer
  if (props.beer === undefined) {
    beer = Model.beerRecipe()
  } else {
    beer = props.beer
  }
  const [state, dispatch] = useReducer(changeState, beer)
  
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <h2>{state["recipe"]["name"] !== "" ? state["recipe"]["name"] + " Recipe" : "New Beer Recipe"}</h2>
      <Button sx={{ m: 2 }} variant="contained" onClick={handleOpen}>Print recipe</Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
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
            <Water water={state["water"]} malt={state["malt"]} cookingDuration={state["cookingDuration"]} dispatch={dispatch} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Malt malt={state["malt"]} dispatch={dispatch} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <MashSteps mashSteps={state["mashSteps"]} dispatch={dispatch} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Hops hops={state["hops"]} cookingDuration={state["cookingDuration"]} dispatch={dispatch} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Yeast yeast={state["yeast"]} dispatch={dispatch} />
          </Paper>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={modalStyle}>
          <div style={{height: "calc(100vh - 225px)", overflowY: "auto"}}>
            <Paper sx={{minHeight: "100%"}}>
              <ShowRecipe beer={state} />
            </Paper>
          </div>
          <Box display="flex" justifyContent="flex-end" spacing={2} sx={{borderTop: "1px solid black"}}>
            <Button variant="contained" sx={{m:1}} color="grey" disabled={loading} onClick={() => { handleClose(); } }>Close</Button>
            <Button variant="contained" sx={{m:1}} color="primary" disabled={loading} onClick={() => {setLoading(true); printRecipe(state).then(() => {setLoading(false); handleClose()}) } }>Print</Button>
          </Box>
        </Paper>
      </Modal>
    </div>
  )
}

export default Beer