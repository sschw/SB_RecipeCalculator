import { Autocomplete, Stack, TextField } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { PercentInput } from '../../Utils/NumberInput'

const emptyRecipe = {
  name: null,
  og: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
  sg: { minGravity: null, maxGravity: null,minPlato: null, maxPlato: null},
  alc: { minPercentWeight: null, maxPercentWeight: null,minPercentVol: null, maxPercentVol: null},
  colorVal: { minSRM: null, maxSRM: null,minEBC: null, maxEBC: null},
  ibu:  { min: null, max: null }
}

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
  
  const updateRecipe = (target, value) => { dispatch({type: 'recipe', target: target, value: value})};

  return (
    <div>
      <h3>Recipe settings</h3>
      <Stack spacing={2}>
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
        <TextField label="Malt yield" value={recipe["maltYield"].toString()} onChange={(event) => {
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
    </div>
  );
}

export default Recipe