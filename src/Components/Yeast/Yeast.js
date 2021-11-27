import { Autocomplete, Grid, TextField } from '@material-ui/core';
import React, {useState, useEffect, useContext} from 'react';
import { PercentInput } from '../../Utils/NumberInput'
import * as Model from "../../Model"
import { metaData } from "../../Context/MetaDataContext"
import { useTranslation } from 'react-i18next';

export default function Yeast(props) {
  const [t, i18n] = useTranslation();
  const yeast = props.yeast
  const dispatch = props.dispatch
  const [state, setState] = useState({yeasts: []});
  const [inputValue, setInputValue] = useState('')
  const [inputValueFlocculation, setInputValueFlocculation] = useState(8)
  const metaDataContext = useContext(metaData)

  useEffect(() => {
    fetch("./locales/" + metaDataContext.state.language + "/sb_yeast.json")
    .then((resp) => resp.json())
    .then((resp) => {
      setState({yeasts: resp});
    });
  }, [metaDataContext.state]);
  
  const updateYeast = (target, value) => { dispatch({type: 'yeast', target: target, value: value})};

  return (
    <div>
      <h3>{t("Yeast")}</h3>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} xs={12}>
          <Autocomplete
            options={state.yeasts}
            value={yeast["name"] === null ? null : yeast}
            inputValue={inputValue}
            groupBy={(bt) => bt.use}
            getOptionLabel={(bt) => (typeof bt === 'string' || bt instanceof String) ? bt : bt.name}
            fullWidth
            freeSolo 
            renderInput={(params) => <TextField {...params} label={t("Yeast")} />}
            onChange={(event, newValue) => {
              if(newValue === null) { 
                newValue = Model.yeast()
                updateYeast("name", newValue.name);
                updateYeast("attenuation", newValue.attenuation);
                updateYeast("flocculation", newValue.flocculation);
              }
              else if(typeof newValue === 'string' || newValue instanceof String) {
                updateYeast("name", newValue)
              }
              else {
                updateYeast("name", newValue.name);
                updateYeast("attenuation", ((newValue.attenuation.min+newValue.attenuation.max)/2)/100);
                updateYeast("flocculation", newValue.flocculation);
              }
            }}
            onInputChange={(_, newValue) => setInputValue(newValue)} />
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <TextField label={t("Attenuation")} value={yeast["attenuation"].toString()} fullWidth onChange={(event) => {
            updateYeast("attenuation", event.floatValue)
          }} 
          InputProps={{
            inputComponent: PercentInput,
          }}
          InputLabelProps={{
            shrink: true,
          }}/>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
        <Autocomplete
          options={Model.flocculation}
          value={Model.flocculation[yeast["flocculation"]]}
          inputValue={inputValueFlocculation}
          getOptionLabel={(yfl) => t(yfl.label)}
          renderInput={(params) => <TextField {...params} label={t("Flocculation")} />}
          onChange={(event, newValue) => {
            if(newValue === null) newValue = {id: 8}
            updateYeast("flocculation", newValue.id);
          }}
          onInputChange={(_, newValue) => setInputValueFlocculation(newValue)} />
        </Grid>
      </Grid>
    </div>
  );
}