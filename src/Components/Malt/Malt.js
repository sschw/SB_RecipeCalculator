import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const emptyMalt = {name: "", ebc: 0, potential: 0, amount: 0}

function SingleMalt(props) {
  const dispatch = props.dispatch
  const rowId = props.rowID
  const updateMalt = (target, value) => {
    dispatch({type: 'updateMalt', rowId: rowId, target: target, value: value})
  }
  const [inputName, setInputName] = useState(props.malt.name)

  return (
    <TableRow key={props.malt.name}>
      <TableCell component="th" scope="row">
        <Autocomplete 
          options={[]}
          renderInput={(params) => <TextField {...params} label="Name" />} 
          freeSolo 
          value={props.malt.name} 
          onChange={(event, newValue) => updateMalt("name", newValue)} 
          inputValue={inputName} 
          onInputChange={(_, newValue) => setInputName(newValue)} 
        />
      </TableCell>
      <TableCell align="center">
        <TextField label="EBC" value={props.malt.ebc} onChange={(event) => updateMalt("ebc", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Potential" value={props.malt.potential} onChange={(event) => updateMalt("potential", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Amount" value={props.malt.amount} onChange={(event) => updateMalt("amount", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="right">
        <IconButton disabled={rowId < 0} aria-label="delete" onClick={() => {dispatch({type: "deleteMalt", rowId: rowId});}}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}


function Malt(props) {
  let rows = props.malt
  let dispatch = props.dispatch

  let children = []
  rows.forEach((row, index) => {
    children.push(<SingleMalt malt={row} rowID={index} dispatch={dispatch} />)
  });
  children.push(<SingleMalt malt={emptyMalt} rowID={-1} dispatch={dispatch} />)

  return <TableContainer component={Paper}>
  <Table aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="center">EBC</TableCell>
        <TableCell align="center">Pontential</TableCell>
        <TableCell align="center">Amount</TableCell>
        <TableCell align="right">Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {children}
    </TableBody>
  </Table>
</TableContainer>;
}

export default Malt