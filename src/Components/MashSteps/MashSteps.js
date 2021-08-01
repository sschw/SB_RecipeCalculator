import React, {useState} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import *  as Model from '../../Model';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { MinuteInput } from '../../Utils/NumberInput';

function MashStep(props) {
  const dispatch = props.dispatch
  const rowId = props.rowID
  const updateMashStep = (target, value) => {
    dispatch({type: 'updateMashStep', rowId: rowId, target: target, value: value})
  }

  const styling = rowId === -1 ? {'&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#eeeeee"} : {'&:last-child td, &:last-child th': { border: 0 }};

  return (
    <TableRow sx={styling}>
      <TableCell align="center">
        <TextField label="Temperature" fullWidth variant="standard" size="small" value={props.mashStep.temp} onChange={(event) => updateMashStep("temp", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
      <TextField label="Duration" disabled={props.mashStep.type === 0} InputProps={{ inputComponent: MinuteInput }} InputLabelProps={{ shrink: true }} size="small" fullWidth variant="standard" value={props.mashStep.dur.toString()} onChange={(event) => updateMashStep("dur", event.floatValue)} />
      </TableCell>
      <TableCell align="center">
        <InputLabel id={props.mashStep.key + "-mashtype"} variant="standard" sx={{
          fontSize: 12,
            }} >
          Type
        </InputLabel>
        <Select labelId={props.mashStep.key + "-mashtype"} label="Type" variant="standard" fullWidth size="small" value={props.mashStep.type} onChange={(event) => updateMashStep("type", event.target.value)}>
          {Model.mashStepTypes.map(t => 
            <MenuItem key={props.mashStep.key + "mashtype" + t.id} value={t.id}>{t.label}</MenuItem>
          )}
        </Select>
      </TableCell>
      <TableCell align="center">
        <TextField label="Description" variant="standard" size="small" fullWidth value={props.mashStep.descr} onChange={(event) => updateMashStep("descr", event.target.valueAsNumber)} />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1}>
          <IconButton disabled={rowId === 0 || rowId === -1} aria-label="up" onClick={() => {dispatch({type: "moveMashStep", rowId1: rowId, rowId2: rowId-1});}}>
            <ArrowUpward />
          </IconButton>
          <IconButton disabled={rowId === 0 || rowId === -1} aria-label="down" onClick={() => {dispatch({type: "moveMashStep", rowId1: rowId, rowId2: rowId+1});}}>
            <ArrowDownward />
          </IconButton>
          <IconButton disabled={rowId < 0} aria-label="delete" onClick={() => {dispatch({type: "deleteMashStep", rowId: rowId});}}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}


function MashSteps(props) {
  let rows = props.mashSteps
  let dispatch = props.dispatch

  let children = []
  rows.forEach((row, index) => {
    children.push(<MashStep mashStep={row} rowID={index} dispatch={dispatch} key={row.key} />)
  });
  children.push(<MashStep mashStep={Model.mashStep("mash"+rows.length)} rowID={-1} dispatch={dispatch} key={"mash"+rows.length} />)

  const [maltTemplate, setMaltTemplate] = useState(0)

  return (
    <div>
      <Grid container>
        <Grid item lg={2} md={2} sm={0} xs={0} ></Grid>
        <Grid item lg={8} md={8} sm={12}xs={12} >
          <h3>Mashing</h3>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}>
          <InputLabel id={"mashtemplate"} variant="standard" sx={{
            fontSize: 12,
              }} >
            Mashing Templates
          </InputLabel>
          <Select labelId={"mashtemplate"} label="Mashing Templates" fullWidth variant="standard" size="small" value={maltTemplate} onChange={(event) => {dispatch({type: "setMashTemplate", value: event.target.value.value}); setMaltTemplate(event.target.value)}}>
            {Model.mashStepTemplates.map(t => 
              <MenuItem key={"mashstep" + t.id} value={t}>{t.label}</MenuItem>
            )}
          </Select>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="mashsteps table">
          <TableHead>
            <TableRow>
              <TableCell width="15%" sx={{minWidth: 40}} align="center">Temperature</TableCell>
              <TableCell width="15%" sx={{minWidth: 40}} align="center">Duration</TableCell>
              <TableCell width="15%" sx={{minWidth: 40}} align="center">Type</TableCell>
              <TableCell width="45%" sx={{minWidth: 40}} align="center">Description</TableCell>
              <TableCell width="10%" align="right">Action</TableCell>
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