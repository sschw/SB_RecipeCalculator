import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, IconButton, InputLabel, inputLabelClasses, MenuItem, Paper, Select, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';

const emptyHop = {name: "", alpha: 0, oil: 0, amount: 0, type: 1, duration: 0}

const hopType = [
  {id: 0, label: "first wort"},
  {id: 1, label: "boil"},
  {id: 2, label: "whirlpool"},
  {id: 3, label: "whirlpool 80°C"},
  {id: 4, label: "dry hopping"}
]

function Hop(props) {
  const dispatch = props.dispatch
  const rowId = props.rowID
  const updateHops = (target, value) => {
    dispatch({type: 'updateHop', rowId: rowId, target: target, value: value})
  }
  const [inputName, setInputName] = useState(props.hop.name)

  return (
    <TableRow key={rowId}>
      <TableCell component="th" scope="row">
        <Autocomplete 
          options={[]}
          renderInput={(params) => <TextField {...params} label="Name" variant="standard" size="small" />} 
          freeSolo 
          value={props.hop.name} 
          onChange={(event, newValue) => updateHops("name", newValue)} 
          inputValue={inputName} 
          onInputChange={(_, newValue) => setInputName(newValue)} 
        />
      </TableCell>
      <TableCell align="center">
        <TextField label="Alpha" variant="standard" size="small" value={props.hop.alpha} onChange={(event) => updateHops("alpha", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Oil" variant="standard" size="small" value={props.hop.oil} onChange={(event) => updateHops("oil", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Amount" variant="standard" size="small" value={props.hop.amount} onChange={(event) => updateHops("amount", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <InputLabel id={rowId + "-type"} variant="standard" sx={{
          fontSize: 12,
            }} >
          Type
        </InputLabel>
        <Select labelId={rowId + "-type"} label="Type" variant="standard" size="small" value={props.hop.type} onChange={(event) => updateHops("type", event.target.value)}>
          {hopType.map(t => 
            <MenuItem value={t.id}>{t.label}</MenuItem>
          )}
        </Select>
      </TableCell>
      <TableCell align="center">
        <TextField label="Duration" size="small" variant="standard" value={props.hop.duration} type="number" onChange={(event) => updateHops("duration", event.target.valueAsNumber)} />
      </TableCell>
      <TableCell align="center">
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
  rows.forEach((row, index) => {
    children.push(<Hop hop={row} rowID={index} dispatch={dispatch} />)
  });
  children.push(<Hop hop={emptyHop} rowID={-1} dispatch={dispatch} />)

  return (
    <div>
      <h3>Hop</h3>
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