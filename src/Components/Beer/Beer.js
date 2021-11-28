import { Box, Button, ClickAwayListener, FormControlLabel, FormGroup, Grid, MenuItem, Modal, Paper, Select, Switch, Tooltip } from '@material-ui/core';
import React, { useContext, useReducer } from 'react';
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
import { metaData } from "../../Context/MetaDataContext"
import { calcAllValues, deleteHop, deleteMalt, deleteMashSteps, moveMashSteps, updateCookingDuration, updateHop, updateMalt, updateMashSteps, updatePostIsomizationTime, updateRecipe, updateWater, updateYeast } from '../../Utils/ModelUtils';
import { useTranslation } from 'react-i18next';

import "./Beer.css"

// action = { type, target, key, value }
function changeState(state, action) {
  switch(action.type) {
    case 'model':
      let newState = action.value;
      calcAllValues(newState);
      return newState
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
    case 'postIsomizationTime':
      if(updatePostIsomizationTime(state, action.value)) {
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
  maxWidth: 1200,
  minWidth: 450,
};

function Beer(props) {
  let beer
  // props can include beer which represents a beerRecipe. In case we want to load a recipe from a server.
  if (props.beer === undefined) {
    beer = Model.beerRecipe()
  } else {
    beer = props.beer
  }
  const [t, i18n] = useTranslation();
  const [state, dispatch] = useReducer(changeState, beer)
  const metaDataContext = useContext(metaData)
  
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [tooltipExportOpen, setTooltipExportOpen] = React.useState(false);
  const handleTooltipClose = () => {
    setTooltipExportOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipExportOpen(true);
  };

  let beerRecipeClass = metaDataContext.state.simpleUI ? "simpleRecipe" : "advancedRecipe"

  const handleCopy = () => {handleTooltipOpen(); navigator.clipboard.writeText(Model.exportRecipe(state))};
  // Firefox not compatible
  const handlePaste = () => navigator.clipboard.readText().then((s) => dispatch({type: "model", value: Model.importRecipe(s)}));

  const changeLanguage = (evt) => metaDataContext.dispatch({type: "language", value: evt.target.value});
  const changeSystem = (evt) => metaDataContext.dispatch({type: "system", value: evt.target.value});
  const changeUI = (evt) => metaDataContext.dispatch({type: "ui", value: evt.target.checked});

  return (
    <div className={beerRecipeClass}>
      <h2>{state["recipe"]["name"] !== "" ? state["recipe"]["name"] + " Recipe" : t("New Beer Recipe")}</h2>
      <Grid container justifyContent="center">
        <Grid item>
          <Button sx={{ m: 2 }} variant="contained" onClick={handleOpen}>{t("Print Recipe")}</Button>
        </Grid>
        <Grid item>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={tooltipExportOpen}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={t("Recipe copied to clipboard")}
            >
              <Button sx={{ m: 2 }} variant="contained" onClick={handleCopy}>{t("Copy Recipe")}</Button>
            </Tooltip>
          </ClickAwayListener>
        </Grid>
        <Grid item>
          <Button sx={{ m: 2 }} variant="contained" onClick={handlePaste}>{t("Paste Recipe")}</Button>
        </Grid>
        <Grid item>
          <Select sx={{ m: 2 }} labelId="language" label="Languages" variant="standard" size="small" value={metaDataContext.state.language} onChange={changeLanguage}>
            <MenuItem key="en" value="en">English</MenuItem>
            <MenuItem key="de" value="de">Deutsch</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Select sx={{ m: 2 }} labelId="system" label="System of measured units" variant="standard" size="small" value={metaDataContext.state.system} onChange={changeSystem}>
            <MenuItem key="si" value="SI">International System of Units</MenuItem>
            <MenuItem key="us" value="US">United States customary units</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <div>
        <FormGroup style={{justifyContent: "end", flexDirection: "row"}}><FormControlLabel control={<Switch checked={metaDataContext.state.simpleUI} onChange={changeUI} />} label={t("Simple Interface")} /></FormGroup>
      </div>
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
            <Hops hops={state["hops"]} cookingDuration={state["cookingDuration"]} postIsomizationTime={state["postIsomizationTime"]} dispatch={dispatch} />
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
            <Button variant="contained" sx={{m:1}} color="grey" disabled={loading} onClick={() => { handleClose(); } }>{t("Close")}</Button>
            <Button variant="contained" sx={{m:1}} color="primary" disabled={loading} onClick={() => {setLoading(true); printRecipe(state, metaDataContext.state.system, t).then(() => {setLoading(false); handleClose()}) } }>{t("Print")}</Button>
          </Box>
        </Paper>
      </Modal>
    </div>
  )
}

export default Beer