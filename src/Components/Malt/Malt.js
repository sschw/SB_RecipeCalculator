import React, {useState} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import *  as Model from '../../Model';

function SingleMalt(props) {
  const dispatch = props.dispatch
  const rowId = props.rowID
  const updateMalt = (target, value) => {
    dispatch({type: 'updateMalt', rowId: rowId, target: target, value: value})
  }
  const [inputName, setInputName] = useState(props.malt.name)

  const styling = rowId === -1 ? {'&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#eeeeee"} : {'&:last-child td, &:last-child th': { border: 0 }};

  return (
    <TableRow sx={styling}>
      <TableCell component="th" scope="row">
        <Autocomplete 
          options={[]}
          renderInput={(params) => <TextField {...params} label="Name" variant="standard" size="small" />} 
          freeSolo 
          fullWidth
          value={props.malt.name} 
          onChange={(_, newValue) => updateMalt("name", newValue == null ? "" : newValue)} 
          inputValue={inputName} 
          onInputChange={(_, newValue) => setInputName(newValue)} 
        />
      </TableCell>
      <TableCell align="center">
        <TextField label="EBC" variant="standard" fullWidth size="small" value={props.malt.ebc} onChange={(event) => updateMalt("ebc", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Potential" variant="standard" fullWidth size="small" value={props.malt.potential} onChange={(event) => updateMalt("potential", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Amount" variant="standard" fullWidth size="small" value={props.malt.amount} onChange={(event) => updateMalt("amount", event.target.valueAsNumber)} type="number" />
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
    children.push(<SingleMalt malt={row} rowID={index} dispatch={dispatch} key={"malt" + index} />)
  });
  children.push(<SingleMalt malt={Model.malt()} rowID={-1} dispatch={dispatch} key={"malt-1"} />)

  return (
    <div>
      <h3>Malt</h3>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="malt table">
          <TableHead>
            <TableRow>
              <TableCell width="30%">Name</TableCell>
              <TableCell width="20%" sx={{minWidth: 40}} align="center">EBC</TableCell>
              <TableCell width="20%" sx={{minWidth: 40}} align="center">Pontential</TableCell>
              <TableCell width="20%" sx={{minWidth: 40}} align="center">Amount</TableCell>
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

export default Malt