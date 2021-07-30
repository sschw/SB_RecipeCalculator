import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, IconButton, Paper, Select, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const emptyHop = {name: "", alpha: 0, oil: 0, amount: 0, type: null, duration: 0}

function Hop(props) {
  const dispatch = props.dispatch
  const rowId = props.rowID
  const updateHops = (target, value) => {
    dispatch({type: 'updateHop', rowId: rowId, target: target, value: value})
  }
  const [inputName, setInputName] = useState(props.hop.name)

  return (
    <TableRow key={props.hop.name}>
      <TableCell component="th" scope="row">
        <Autocomplete 
          options={[]}
          renderInput={(params) => <TextField {...params} label="Name" />} 
          freeSolo 
          value={props.hop.name} 
          onChange={(event, newValue) => updateHops("name", newValue)} 
          inputValue={inputName} 
          onInputChange={(_, newValue) => setInputName(newValue)} 
        />
      </TableCell>
      <TableCell align="center">
        <TextField label="Alpha" value={props.hop.alpha} onChange={(event) => updateHops("alpha", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Oil" value={props.hop.oil} onChange={(event) => updateHops("oil", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Amount" value={props.hop.amount} onChange={(event) => updateHops("amount", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <Select label="Type" value={props.hop.type} onChange={(event) => updateHops("type", event.target.value)} />
      </TableCell>
      <TableCell align="center">
        <TextField label="Duration" value={props.hop.duration} type="number" onChange={(event) => updateHops("duration", event.target.valueAsNumber)} />
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

  return <TableContainer component={Paper}>
  <Table aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="center">Alpha</TableCell>
        <TableCell align="center">Oil</TableCell>
        <TableCell align="center">Amount</TableCell>
        <TableCell align="center">Type</TableCell>
        <TableCell align="center">Duration</TableCell>
        <TableCell align="center">Info</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {children}
    </TableBody>
  </Table>
</TableContainer>;
}

export default Hops