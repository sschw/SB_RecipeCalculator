import { Autocomplete, Box, FormControl, ListSubheader, MenuItem, Select, Stack, TextField } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import ReactDOM from 'react-dom';

const emptyRecipe = {
  name: null,
  og: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
  sg: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
  alc: { minPercentWeight: null, maxPercentWeight: null,minPercentVol: null, maxPercentVol: null},
  colorVal: { minSRM: null, maxSRM: null,minEBC: null, maxEBC: null},
  ibu:  { min: null, max: null }
}

const PercentInput = (props) => {
  const { value, onChange } = props;

  return (
      <NumberFormat
          format="###%"
          decimalSeparator=","
          className={`text-right ${props.className}`}
          value={value * 100}
          onValueChange={values => {
              values?.floatValue > 100
                  ? onChange({ floatValue: 1, formattedValue: '1,00', value: '1' })
                  : onChange({ floatValue: values?.floatValue/100, formattedValue: values?.formattedValue, value: values?.value });
          }}
      />
  );
};

function Recipe(props) {
  const recipe = props.recipe
  const dispatch = props.dispatch
  const [state, setState] = useState({beertypes: []});
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    fetch("./sb_beertypes.json")
    .then((resp) => resp.json())
    .then((resp) => {
      setState({beertypes: resp});
    });
  }, []);
  
  let updateRecipe = (target, value) => { dispatch({type: 'recipe', target: target, value: value})};

  return (
    <FormControl fullWidth>
      <h3>Recipe settings</h3>
      <Stack spacing={2} sx={{ width: 300 }}>
        <TextField label="Recipe Name" value={recipe["name"]} onChange={(event) => {
            updateRecipe("name", event.target.value)
          }} />
        <TextField label="Description" value={recipe["description"]} multiline rows={4} onChange={(event) => {
          updateRecipe("description", event.target.value)
        }} />
        <TextField label="Author" value={recipe["author"]} onChange={(event) => {
          updateRecipe("author", event.target.value)
        }} />
        <TextField label="Date" value={recipe["date"]} type="date" onChange={(event) => {
          updateRecipe("date", event.target.value)
        }} 
        InputLabelProps={{
          shrink: true,
        }}/>
        <TextField label="Malt yield" value={recipe["maltYield"]} onChange={(event) => {
          updateRecipe("maltYield", event.floatValue)
        }} 
        InputProps={{
          inputComponent: PercentInput,
        }}
        InputLabelProps={{
          shrink: true,
        }}/>
        
        
        <Autocomplete
          options={state.beertypes}
          value={recipe["beertype"]["name"] === null ? null : recipe["beertype"]}
          inputValue={inputValue}
          groupBy={(bt) => bt.category}
          getOptionLabel={(bt) => bt.name}
          renderInput={(params) => <TextField {...params} label="Beertype" />}
          onChange={(event, newValue) => {
            if(newValue === null) { newValue = emptyRecipe }
            updateRecipe("beertype", newValue);
          }}
          onInputChange={(_, newValue) => setInputValue(newValue)} />
      </Stack>
    </FormControl>
  );
}

export default Recipe