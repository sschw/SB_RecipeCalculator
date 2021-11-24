import React, {useContext, useState} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import *  as Model from '../../Model';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { CelsiusInput, FahrenheitInput, MinuteInput } from '../../Utils/NumberInput';
import { metaData } from "../../Context/MetaDataContext"
import { useTranslation } from 'react-i18next';

function MashStep(props) {
  const [t, i18n] = useTranslation();
  const dispatch = props.dispatch
  const isNew = props.isNew
  const key = props.mashStep.key
  const isFirst = props.isFirst
  const isLast = props.isLast

  const metaDataContext = useContext(metaData)

  const updateMashStep = (target, value) => {
    dispatch({type: 'updateMashStep', key: key, target: target, value: value})
  }

  const styling = isNew ? {'&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#eeeeee"} : {'&:last-child td, &:last-child th': { border: 0 }};

  return (
    <TableRow sx={styling}>
      <TableCell align="center">
        <TextField label={t("Temperature")} InputProps={ metaDataContext.state["system"] === "US" ? { inputComponent: FahrenheitInput } : { inputComponent: CelsiusInput } } fullWidth variant="standard" size="small" value={props.mashStep.temp.toString()} onChange={(event) => updateMashStep("temp", event.floatValue)} />
      </TableCell>
      <TableCell align="center">
      <TextField label={t("Duration")} disabled={props.mashStep.type === 0} InputProps={{ inputComponent: MinuteInput }} InputLabelProps={{ shrink: true }} size="small" fullWidth variant="standard" value={props.mashStep.dur.toString()} onChange={(event) => updateMashStep("dur", event.floatValue)} />
      </TableCell>
      <TableCell align="center">
        <InputLabel id={props.mashStep.key + "-mashtype"} variant="standard" sx={{
          fontSize: 12,
            }} >
          {t("Type")}
        </InputLabel>
        <Select labelId={props.mashStep.key + "-mashtype"} label="Type" variant="standard" fullWidth size="small" value={props.mashStep.type} onChange={(event) => updateMashStep("type", event.target.value)}>
          {Model.mashStepTypes.map(ty => 
            <MenuItem key={props.mashStep.key + "mashtype" + ty.id} value={ty.id}>{t(ty.label)}</MenuItem>
          )}
        </Select>
      </TableCell>
      <TableCell align="center">
        <TextField label={t("Description")} variant="standard" size="small" fullWidth value={props.mashStep.descr} onChange={(event) => updateMashStep("descr", event.target.value)} />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1}>
          <IconButton disabled={isFirst || isNew} aria-label="up" onClick={() => {dispatch({type: "moveMashStep", key: key, value: -1});}}>
            <ArrowUpward />
          </IconButton>
          <IconButton disabled={isLast || isNew} aria-label="down" onClick={() => {dispatch({type: "moveMashStep", key: key, value: 1});}}>
            <ArrowDownward />
          </IconButton>
          <IconButton disabled={isNew} aria-label="delete" onClick={() => {dispatch({type: "deleteMashStep", key: key});}}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}


function MashSteps(props) {
  const [t, i18n] = useTranslation();
  let rows = props.mashSteps
  let dispatch = props.dispatch

  let children = []
  rows.forEach((row, index) => {
    children.push(<MashStep mashStep={row} isNew={false} isFirst={index === 0} isLast={index === rows.length-1} dispatch={dispatch} key={row.key} />)
  });
  let newMashStep = Model.mashStep()
  children.push(<MashStep mashStep={newMashStep} isNew={true} isFirst={false} isLast={false} dispatch={dispatch} key={newMashStep.key} />)

  const [maltTemplate, setMaltTemplate] = useState(0)

  return (
    <div>
      <Grid container>
        <Grid item lg={2} md={2} sm={12} xs={12} ></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} >
          <h3>{t("Mashing")}</h3>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}>
          <InputLabel id={"mashtemplate"} variant="standard" sx={{
            fontSize: 12,
              }} >
            {t("Mashing Templates")}
          </InputLabel>
          <Select labelId={"mashtemplate"} label={t("Mashing Templates")} fullWidth variant="standard" size="small" value={maltTemplate} onChange={(event) => {dispatch({type: "setMashTemplate", value: event.target.value.value}); setMaltTemplate(event.target.value)}}>
            {Model.mashStepTemplates.map(ty => 
              <MenuItem key={"mashstep" + ty.id} value={ty}>{t(ty.label)}</MenuItem>
            )}
          </Select>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="mashsteps table">
          <TableHead>
            <TableRow>
              <TableCell width="15%" sx={{minWidth: 40}} align="center">{t("Temperature")}</TableCell>
              <TableCell width="15%" sx={{minWidth: 40}} align="center">{t("Duration")}</TableCell>
              <TableCell width="15%" sx={{minWidth: 40}} align="center">{t("Type")}</TableCell>
              <TableCell width="45%" sx={{minWidth: 40}} align="center">{t("Description")}</TableCell>
              <TableCell width="10%" align="right">{t("Action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MashSteps