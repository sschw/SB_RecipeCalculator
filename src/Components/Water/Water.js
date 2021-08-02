import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import { LitreInput, PercentInput } from '../../Utils/NumberInput'

export default function Water(props) {
  const water = props.water
  const maltAmount = props.malt.reduce((pv, v) => pv+v.amount/1000, 0)
  const cookingDuration = props.cookingDuration/60
  const dispatch = props.dispatch
  
  const updateWater = (target, value) => { dispatch({type: 'water', target: target, value: value})};

  return (
    <div>
      <h3>Water</h3>
      <Grid container spacing={2}>
        <Grid item lg={3} md={3} xs={12}>
          <TextField label="Quantity of beer" value={water["finalVolume"].toString()} fullWidth onChange={(event) => {
              updateWater("finalVolume", event.floatValue)
            }} 
            InputProps={{
              inputComponent: LitreInput,
            }}
            InputLabelProps={{
              shrink: true,
            }}/>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <TextField label="Mash Water" value={water["mashWaterVolume"].toString()} fullWidth onChange={(event) => {
              updateWater("mashWaterVolume", event.floatValue)
            }} 
            InputProps={{
              inputComponent: LitreInput,
            }}
            InputLabelProps={{
              shrink: true,
            }}/>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <TextField label="Sparge Water" value={water["spargeWaterVolume"].toString()} fullWidth onChange={(event) => {
              updateWater("spargeWaterVolume", event.floatValue)
            }} 
            InputProps={{
              inputComponent: LitreInput,
            }}
            InputLabelProps={{
              shrink: true,
            }}/>
        </Grid>
        <Grid item lg={3} md={3} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} xs={6}>
              <TextField label="Water loss" disabled value={(water["spargeWaterVolume"]+water["mashWaterVolume"]-water["finalVolume"]).toString()} fullWidth
                InputProps={{
                  inputComponent: LitreInput,
                }}
                InputLabelProps={{
                  shrink: true,
                }}/>
            </Grid>
            <Grid item lg={6} md={6} xs={6}>
              <TextField label="Water loss %" disabled value={(Math.round(100*(1-(water["finalVolume"]/(water["spargeWaterVolume"]+water["mashWaterVolume"]))))/100).toString()} fullWidth
                InputProps={{
                  inputComponent: PercentInput,
                }}
                InputLabelProps={{
                  shrink: true,
                }}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={5} md={5} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={8} md={8} xs={8}>
              <TextField label="Grain loss per 1kg malt" value={water["grainLoss"].toString()} fullWidth onChange={(event) => {
                  updateWater("grainLoss", event.floatValue)
                }} 
                InputProps={{
                  inputComponent: LitreInput,
                }}
                InputLabelProps={{
                  shrink: true,
                }}/>
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField label="Grain loss" value={(water["grainLoss"]*maltAmount).toString()} disabled fullWidth
                InputProps={{
                  inputComponent: LitreInput,
                }}
                InputLabelProps={{
                  shrink: true,
                }}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={5} md={5} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={8} md={8} xs={8}>
              <TextField label="Boil loss per 1h boiling" value={water["boilLoss"].toString()} fullWidth onChange={(event) => {
                  updateWater("boilLoss", event.floatValue)
                }} 
                InputProps={{
                  inputComponent: LitreInput,
                }}
                InputLabelProps={{
                  shrink: true,
                }}/>
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField label="Boil loss" value={(water["boilLoss"]*cookingDuration).toString()} disabled fullWidth
                InputProps={{
                  inputComponent: LitreInput,
                }}
                InputLabelProps={{
                  shrink: true,
                }}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={2} md={2} xs={12}>
          <TextField label="Trub loss" value={(water["mashWaterVolume"]+water["spargeWaterVolume"]-water["finalVolume"]-water["boilLoss"]*cookingDuration-water["grainLoss"]*maltAmount).toString()} fullWidth disabled
            InputProps={{
              inputComponent: LitreInput,
            }}
            InputLabelProps={{
              shrink: true,
            }}/>
        </Grid>
      </Grid>
    </div>
  );
}