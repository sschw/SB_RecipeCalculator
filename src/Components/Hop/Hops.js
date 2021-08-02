import React, {useState} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import *  as Model from '../../Model';
import { DecimalPercentInput, GrammInput, MinuteInput, PercentInput } from '../../Utils/NumberInput';

function Hop(props) {
  const dispatch = props.dispatch
  const rowId = props.rowID
  const updateHops = (target, value) => {
    dispatch({type: 'updateHop', rowId: rowId, target: target, value: value})
  }
  const [inputName, setInputName] = useState(props.hop.name)

  const styling = rowId === -1 ? {'&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#eeeeee"} : {'&:last-child td, &:last-child th': { border: 0 }};

  return (
    <TableRow sx={styling}>
      <TableCell component="th" scope="row">
        <Autocomplete 
          options={[]}
          renderInput={(params) => <TextField {...params} label="Name" variant="standard" size="small" />} 
          freeSolo 
          value={props.hop.name} 
          onChange={(_, newValue) => updateHops("name", newValue == null ? "" : newValue)} 
          inputValue={inputName} 
          onInputChange={(_, newValue) => setInputName(newValue)} 
        />
      </TableCell>
      <TableCell align="center">
        <TextField label="Alpha" fullWidth variant="standard" size="small" value={props.hop.alpha.toString()} InputProps={{ inputComponent: DecimalPercentInput }} InputLabelProps={{ shrink: true }}  onChange={(event) => updateHops("alpha", event.floatValue)} />
      </TableCell>
      <TableCell align="center">
        <TextField label="Oil" fullWidth variant="standard" size="small" value={props.hop.oil} onChange={(event) => updateHops("oil", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Amount" fullWidth variant="standard" size="small" value={props.hop.amount.toString()} InputProps={{ inputComponent: GrammInput }} InputLabelProps={{ shrink: true }} onChange={(event) => updateHops("amount", event.floatValue)} />
      </TableCell>
      <TableCell align="center">
        <InputLabel id={props.hop.key + "-hoptype"} variant="standard" sx={{ fontSize: 12 }} >
          Type
        </InputLabel>
        <Select labelId={props.hop.key + "-hoptype"} fullWidth label="Type" variant="standard" size="small" value={props.hop.type} onChange={(event) => updateHops("type", event.target.value)}>
          {Model.hopType.map(t => 
            <MenuItem key={props.hop.key + "hoptype" + t.id} value={t.id}>{t.label}</MenuItem>
          )}
        </Select>
      </TableCell>
      <TableCell align="center">
        <TextField label="Duration" disabled={props.hop.type !== 1} InputProps={{ inputComponent: MinuteInput }} InputLabelProps={{ shrink: true }} size="small" fullWidth variant="standard" value={props.hop.duration.toString()} onChange={(event) => updateHops("duration", event.floatValue)} />
      </TableCell>
      <TableCell align="center">
        {props.hop.type < 2 ? "IBU: " + props.hop.ibu : "Oil: " + props.hop.oilTotal }
      </TableCell>
      <TableCell align="right">
        <IconButton disabled={rowId < 0} aria-label="delete" onClick={() => {dispatch({type: "deleteHop", rowId: rowId});}}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}


function Hops(props) {
  let rows = props.hops
  let dispatch = props.dispatch

  let children = []
  rows.sort((a, b) => a.type > b.type || (a.type === b.type && a.duration < b.duration));
  rows.forEach((row, index) => {
    children.push(<Hop hop={row} rowID={index} dispatch={dispatch} key={row.key} />)
  });
  children.push(<Hop hop={Model.hop("hop"+rows.length)} rowID={-1} dispatch={dispatch} key={"hop"+rows.length} />)

  return (
    <div>
      <Grid container>
        <Grid item lg={2} md={2} sm={12} xs={12} ></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} >
          <h3>Hop</h3>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}>
        <TextField label="Cooking Duration" InputProps={{ inputComponent: MinuteInput }} InputLabelProps={{ shrink: true }} size="small" fullWidth variant="standard" value={props.cookingDuration.toString()} onChange={(event) => dispatch({type: "duration", value: event.floatValue})} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="hop table">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Name</TableCell>
              <TableCell width="10%" sx={{minWidth: 40}} align="center">Alpha</TableCell>
              <TableCell width="10%" sx={{minWidth: 40}} align="center">Oil</TableCell>
              <TableCell width="10%" sx={{minWidth: 40}} align="center">Amount</TableCell>
              <TableCell width="10%" sx={{minWidth: 40}} align="center">Type</TableCell>
              <TableCell width="10%" sx={{minWidth: 40}} align="center">Duration</TableCell>
              <TableCell width="20%" align="center">Info</TableCell>
              <TableCell width="10%" align="right">Actions</TableCell>
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

export default Hops