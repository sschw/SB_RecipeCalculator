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
        state.hops.push(Model.hop());
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
        state.malt.push(Model.malt());
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
    case 'updateMashStep':
      if(action.rowId === -1) {
        action.rowId = state.mashSteps.length
        state.mashSteps.push(Model.mashStep());
        updated = true
      }
      if(state.mashSteps[action.rowId][action.target] !== action.value) {
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
            <Hops hops={state["hops"]} dispatch={dispatch} />
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