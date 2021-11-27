import React, {useState, useEffect, useContext} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TextField, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import *  as Model from '../../Model';
import { GrammInput, PoundsInput } from '../../Utils/NumberInput';
import { ebc2Srm } from '../../Utils/Formulas';
import { metaData } from "../../Context/MetaDataContext"
import { useTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';

function SingleMalt(props) {
  const [t, i18n] = useTranslation();
  const dispatch = props.dispatch
  const isNew = props.isNew
  const key = props.malt.key
  const updateMalt = (target, value) => {
    dispatch({type: 'updateMalt', key: key, target: target, value: value})
  }
  const [inputName, setInputName] = useState(props.malt.name)

  const metaDataContext = useContext(metaData)

  const styling = isNew ? {'&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#eeeeee"} : {'&:last-child td, &:last-child th': { border: 0 }};

  return (
    <TableRow sx={styling}>
      <TableCell component="th" scope="row">
        <Autocomplete 
          options={props.maltList.malt}
          getOptionLabel={(bt) => (typeof bt === 'string' || bt instanceof String) ? bt : bt.name}
          renderInput={(params) => <TextField {...params} label={t("Name")} variant="standard" size="small" />} 
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
        <TextField label={t("Potential")} variant="standard" inputProps={{step: 0.001}} fullWidth size="small" value={props.malt.potential} onChange={(event) => updateMalt("potential", event.target.valueAsNumber)} type="number" />
      </TableCell>
      <TableCell align="center">
      <TextField label={t("Amount")} fullWidth variant="standard" size="small" value={props.malt.amount.toString()} InputProps={ metaDataContext.state["system"] === "US" ? { inputComponent: PoundsInput } : { inputComponent: GrammInput } } InputLabelProps={{ shrink: true }} onChange={(event) => updateMalt("amount", event.floatValue)} />
      </TableCell>
      <TableCell align="right">
        <IconButton disabled={isNew} aria-label="delete" onClick={() => {dispatch({type: "deleteMalt", key: key});}}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}


function Malt(props) {
  const [t, i18n] = useTranslation();
  let rows = props.malt
  let dispatch = props.dispatch

  const [state, setState] = useState({malt: []});
  const metaDataContext = useContext(metaData)

  useEffect(() => {
    fetch("./locales/" + metaDataContext.state.language + "/sb_malt.json")
    .then((resp) => resp.json())
    .then((resp) => {
      for(let i = 0; i < resp.length; i++) {
        resp[i].color.ebc = Math.round(resp[i].color.ebc)
      }
      setState({malt: resp});
    });
  }, [metaDataContext.state]);

  let children = []
  rows.sort((a, b) => a.amount < b.amount);
  rows.forEach((row, index) => {
    children.push(<SingleMalt malt={row} isNew={false} maltList={state} dispatch={dispatch} key={row.key} />)
  });
  let newMalt = Model.malt();
  children.push(<SingleMalt malt={newMalt} isNew={true} maltList={state} dispatch={dispatch} key={newMalt.key} />)

  return (
    <div>
      <h3>{t("Malt")}</h3>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="malt table">
          <TableHead>
            <TableRow>
              <TableCell width="30%">{t("Name")}</TableCell>
              <TableCell width="20%" sx={{minWidth: 40}} align="center">
                EBC
                <Tooltip title={t("EBCInfo")}>
                  <IconButton size="small">
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell width="20%" sx={{minWidth: 40}} align="center">
                {t("Potential")}
                <Tooltip title={t("PotentialInfo")}>
                  <IconButton size="small">
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell width="20%" sx={{minWidth: 40}} align="center">{t("Amount")}</TableCell>
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

export default Malt