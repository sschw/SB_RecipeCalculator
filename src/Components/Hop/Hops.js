import React, {useState, useEffect, useContext} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Autocomplete, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableContainer, TableHead, TextField, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import *  as Model from '../../Model';
import { DecimalPercentInput, GrammInput, MinuteInput, MlPerGInput, OunceInput } from '../../Utils/NumberInput';
import { metaData } from "../../Context/MetaDataContext"
import { useTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';

function Hop(props) {
  const [t, i18n] = useTranslation();
  const dispatch = props.dispatch
  const isNew = props.isNew
  const key = props.hop.key
  const updateHops = (target, value) => {
    dispatch({type: 'updateHop', key: key, target: target, value: value})
  }
  const [inputName, setInputName] = useState(props.hop.name)

  const metaDataContext = useContext(metaData)

  const styling = isNew ? {'&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#eeeeee"} : {'&:last-child td, &:last-child th': { border: 0 }};

  return (
    <TableRow sx={styling}>
      <TableCell component="th" scope="row">
        <Autocomplete 
          options={props.hopList}
          getOptionLabel={(bt) => (typeof bt === 'string' || bt instanceof String) ? bt : bt.name}
          renderInput={(params) => <TextField {...params} label={t("Name")} variant="standard" size="small" />} 
          freeSolo 
          fullWidth
          value={props.hop} 
          onChange={(_, newValue) => {
            if(newValue == null) {
              updateHops("name", "")
            } else if(typeof newValue === 'string' || newValue instanceof String) {
              updateHops("name", newValue)
            } else {
              updateHops(null, {"name": newValue.name, "alpha": Math.round((newValue.alpha.min+newValue.alpha.max)*5)/1000, "oil": (newValue.oil.min+newValue.oil.max)/2})
            }
          }}
          inputValue={inputName} 
          onInputChange={(_, newValue) => setInputName(newValue)} 
        />
      </TableCell>
      <TableCell align="center">
        <TextField label={t("Alpha")} fullWidth variant="standard" size="small" value={props.hop.alpha.toString()} InputProps={{ inputComponent: DecimalPercentInput }} InputLabelProps={{ shrink: true }}  onChange={(event) => {if(event.floatValue > 0) updateHops("alpha", event.floatValue)}} />
      </TableCell>
      <TableCell className="advancedSettings" align="center">
        <TextField label={t("Oil")} fullWidth variant="standard" size="small" value={props.hop.oil.toString()} InputProps={{ inputComponent: MlPerGInput }} InputLabelProps={{ shrink: true }} onChange={(event) => {if(event.floatValue > 0) updateHops("oil", event.floatValue)}} />
      </TableCell>
      <TableCell align="center">
        <TextField label={t("Amount")} fullWidth variant="standard" size="small" value={props.hop.amount.toString()} InputProps={ metaDataContext.state["system"] === "US" ? { inputComponent: OunceInput } : { inputComponent: GrammInput } } InputLabelProps={{ shrink: true }} onChange={(event) => updateHops("amount", event.floatValue)} />
      </TableCell>
      <TableCell align="center">
        <InputLabel id={props.hop.key + "-hoptype"} variant="standard" sx={{ fontSize: 12 }} >
          {t("Type")}
        </InputLabel>
        <Select labelId={props.hop.key + "-hoptype"} fullWidth label={t("Type")} variant="standard" size="small" value={props.hop.type} onChange={(event) => updateHops("type", event.target.value)}>
          {Model.hopType.map(ty => 
            <MenuItem key={props.hop.key + "hoptype" + ty.id} value={ty.id}>{t(ty.label)}</MenuItem>
          )}
        </Select>
      </TableCell>
      <TableCell align="center">
        <TextField label={t("Duration")} disabled={props.hop.type !== 1} InputProps={{ inputComponent: MinuteInput }} InputLabelProps={{ shrink: true }} size="small" fullWidth variant="standard" value={props.hop.duration.toString()} onChange={(event) => updateHops("duration", event.floatValue)} />
      </TableCell>
      <TableCell className="advancedSettings" align="center">
        {props.hop.type < 2 ? ("IBU: " + props.hop.ibu) : (t("Oil") + ": " + props.hop.oilTotal) }
      </TableCell>
      <TableCell align="right">
        <IconButton disabled={isNew} aria-label="delete" onClick={() => {dispatch({type: "deleteHop", key: key});}}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}


function Hops(props) {
  const [t, i18n] = useTranslation();
  let rows = props.hops
  let dispatch = props.dispatch

  const [state, setState] = useState({hops: []});
  const metaDataContext = useContext(metaData)

  useEffect(() => {
    fetch("./locales/" + metaDataContext.state.language + "/sb_hops.json")
    .then((resp) => resp.json())
    .then((resp) => {
      setState({hops: resp});
    });
  }, [metaDataContext.state]);

  let children = []
  rows.sort((a, b) => a.type > b.type || (a.type === b.type && a.duration < b.duration));
  rows.forEach((row, index) => {
    children.push(<Hop hop={row} isNew={false} hopList={state.hops} dispatch={dispatch} key={row.key} />)
  });
  let newHop = Model.hop();
  children.push(<Hop hop={newHop} isNew={true} hopList={state.hops} dispatch={dispatch} key={newHop.key} />)

  return (
    <div>
      <Grid container>
        <Grid item lg={2} md={2} sm={12} xs={12} ></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} >
          <h3>{t("Hop")}</h3>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}>
        <TextField label="Cooking Duration" 
          InputProps={{ 
            inputComponent: MinuteInput,
            endAdornment: 
              <InputAdornment position="end">
                <Tooltip title={t("CookingDurationInfo")}>
                  <IconButton size="small">
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
            </InputAdornment>
          }} 
          InputLabelProps={{ shrink: true }} 
          size="small" fullWidth variant="standard" 
          value={props.cookingDuration.toString()} 
          onChange={(event) => dispatch({type: "duration", value: event.floatValue})} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="hop table">
          <TableHead>
            <TableRow>
              <TableCell width="20%">{t("Name")}</TableCell>
              <TableCell width="10%" sx={{minWidth: 65}} align="center">
                {t("Alpha")}
                <Tooltip title={t("AlphaInfo")}>
                  <IconButton size="small">
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell className="advancedSettings" width="10%" sx={{minWidth: 60}} align="center">
                {t("Oil")}
                <Tooltip title={t("OilInfo")}>
                  <IconButton size="small">
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell width="10%" sx={{minWidth: 60}} align="center">{t("Amount")}</TableCell>
              <TableCell width="10%" sx={{minWidth: 60}} align="center">
                {t("Type")}
                <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{t("HopTypesInfo")}</span>}>
                  <IconButton size="small">
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell width="10%" sx={{minWidth: 60}} align="center">{t("Duration")}</TableCell>
              <TableCell className="advancedSettings" width="15%" align="center">{t("Info")}</TableCell>
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

export default Hops