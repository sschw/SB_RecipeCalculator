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
import Yeast from '../Yeast/Yeast';
import Water from '../Water/Water';
import { deleteHop, deleteMalt, deleteMashSteps, moveMashSteps, updateCookingDuration, updateHop, updateMalt, updateMashSteps, updateRecipe, updateWater, updateYeast } from '../../Utils/ModelUtils';

// action = { type, target, key, value }
function changeState(state, action) {
  switch(action.type) {
    case 'recipe':
      if(updateRecipe(state, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'duration':
      if(updateCookingDuration(state, action.value)) {
        return {...state};
      }
      return state
    case 'yeast':
      if(updateYeast(state, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'water':
      if(updateWater(state, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'updateHop':
      if(updateHop(state, action.key, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'deleteHop':
      if(deleteHop(state, action.key)) {
        return {...state};
      }
      return state
    case 'updateMalt':
      if(updateMalt(state, action.key, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'deleteMalt':
      if(deleteMalt(state, action.key, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'updateMashStep':
      if(updateMashSteps(state, action.key, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'moveMashStep':
      if(moveMashSteps(state, action.key, action.value)) {
        return {...state};
      }
      return state
    case 'deleteMashStep':
      if(deleteMashSteps(state, action.key, action.target, action.value)) {
        return {...state};
      }
      return state
    case 'setMashTemplate':
      // MashSteps are the value.
      let array = [...action.value];
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