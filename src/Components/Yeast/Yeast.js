import { Autocomplete, Grid, TextField } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { PercentInput } from '../../Utils/NumberInput'
import * as Model from "../../Model"

export default function Yeast(props) {
  const yeast = props.yeast
  const dispatch = props.dispatch
  const [state, setState] = useState({yeasts: []});
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    fetch("./sb_yeast.json")
    .then((resp) => resp.json())
    .then((resp) => {
      setState({yeasts: resp});
    });
  }, []);
  
  const updateYeast = (target, value) => { dispatch({type: 'yeast', target: target, value: value})};

  return (
    <div>
      <h3>Yeast</h3>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} xs={12}>
          <Autocomplete
            options={state.yeasts}
            value={yeast["name"] === null ? null : yeast}
            inputValue={inputValue}
            groupBy={(bt) => bt.use}
            getOptionLabel={(bt) => bt.name}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Yeast" />}
            onChange={(event, newValue) => {
              if(newValue === null) { newValue = Model.yeast() }
              updateYeast("name", newValue.name);
              updateYeast("attenuation", ((newValue.attenuation.min+newValue.attenuation.max)/2)/100);
              updateYeast("flocculation", newValue.flocculation);
            }}
            onInputChange={(_, newValue) => setInputValue(newValue)} />
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <TextField label="Attenuation" value={yeast["attenuation"].toString()} fullWidth onChange={(event) => {
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
          <TextField label="Flocculation" value={yeast["flocculation"]} fullWidth onChange={(event) => {
              updateYeast("flocculation", event.target.value)
            }} />
        </Grid>
      </Grid>
    </div>
  );
}