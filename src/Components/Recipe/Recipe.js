import { Autocomplete, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@material-ui/core';
import React, {useState, useEffect, useContext} from 'react';
import { PercentInput } from '../../Utils/NumberInput'
import * as Model from "../../Model"
import { metaData } from "../../Context/MetaDataContext"
import { useTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';

function Recipe(props) {
  const [t, i18n] = useTranslation();
  const recipe = props.recipe
  const dispatch = props.dispatch
  const [state, setState] = useState({beertypes: []});
  const [inputValue, setInputValue] = useState('')
  const metaDataContext = useContext(metaData)

  useEffect(() => {
    fetch("./locales/" + metaDataContext.state.language + "/sb_beertypes.json")
    .then((resp) => resp.json())
    .then((resp) => {
      setState({beertypes: resp});
    });
  }, [metaDataContext.state]);
  
  const updateRecipe = (target, value) => { dispatch({type: 'recipe', target: target, value: value})};

  return (
    <div>
      <h3>{t("Recipe settings")}</h3>
      <Stack spacing={2}>
        <TextField label={t("Recipe Name")} value={recipe["name"]} onChange={(event) => {
            updateRecipe("name", event.target.value)
          }} />
        <TextField label={t("Description")} value={recipe["description"]} multiline rows={4} onChange={(event) => {
          updateRecipe("description", event.target.value)
        }} />
        <TextField label={t("Author")} value={recipe["author"]} onChange={(event) => {
          updateRecipe("author", event.target.value)
        }} />
        <TextField label={t("Date")} value={recipe["date"]} type="date" onChange={(event) => {
          updateRecipe("date", event.target.value)
        }} 
        InputLabelProps={{
          shrink: true,
        }}/>
        <TextField label={t("Malt yield")} value={recipe["maltYield"].toString()} onChange={(event) => {
          updateRecipe("maltYield", event.floatValue)
        }} 
        InputProps={{
          inputComponent: PercentInput,
          endAdornment: 
              <InputAdornment position="end">
                <Tooltip title={t("MaltYieldInfo")}>
                  <IconButton size="small">
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
            </InputAdornment>
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
          renderInput={(params) => <TextField {...params} label={t("Beertype")} />}
          onChange={(event, newValue) => {
            if(newValue === null) { newValue = Model.beertype() }
            updateRecipe("beertype", newValue);
          }}
          onInputChange={(_, newValue) => setInputValue(newValue)} />
      </Stack>
    </div>
  );
}

export default Recipe