import React, {useState, useEffect} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import *  as Model from '../../Model';
import { GrammInput } from '../../Utils/NumberInput';
import { ebc2Srm } from '../../Utils/Formulas';

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
          options={props.maltList.malt}
          getOptionLabel={(bt) => (typeof bt === 'string' || bt instanceof String) ? bt : bt.name}
          renderInput={(params) => <TextField {...params} label="Name" variant="standard" size="small" />} 
          freeSolo 
          fullWidth
          value={props.malt} 
          onChange={(_, newValue) => { 
            if(newValue == null) {
              updateMalt("name", "")
            } else if(typeof newValue === 'string' || newValue instanceof String) {
              updateMalt("name", newValue)
            } else {
              updateMalt(null, newValue)
            }
          }} 
          inputValue={inputName} 
          onInputChange={(_, newValue) => setInputName(newValue)} 
        />
      </TableCell>
      <TableCell align="center">
        <TextField label="EBC" variant="standard" fullWidth size="small" value={props.malt.color.ebc} onChange={(event) => updateMalt("color", {srm: ebc2Srm(event.target.valueAsNumber), ebc: event.target.valueAsNumber})} type="number" />
      </TableCell>
      <TableCell align="center">
        <TextField label="Potential" variant="standard" inputProps={{step: 0.001}} fullWidth size="small" value={props.malt.potential} onChange={(event) => updateMalt("potential", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
      <TextField label="Amount" fullWidth variant="standard" size="small" value={props.malt.amount.toString()} InputProps={{ inputComponent: GrammInput }} InputLabelProps={{ shrink: true }} onChange={(event) => updateMalt("amount", event.floatValue)} />
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

  const [state, setState] = useState({malt: []});

  useEffect(() => {
    fetch("./sb_malt.json")
    .then((resp) => resp.json())
    .then((resp) => {
      for(let i = 0; i < resp.length; i++) {
        resp[i].color.ebc = Math.round(resp[i].color.ebc)
      }
      setState({malt: resp});
    });
  }, []);

  let children = []
  rows.sort((a, b) => a.amount < b.amount);
  rows.forEach((row, index) => {
    children.push(<SingleMalt malt={row} rowID={index} maltList={state} dispatch={dispatch} key={row.key} />)
  });
  children.push(<SingleMalt malt={Model.malt("malt"+rows.length)} maltList={state} rowID={-1} dispatch={dispatch} key={"malt"+rows.length} />)

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