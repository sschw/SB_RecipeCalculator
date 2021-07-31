import { Grid, Paper, Stack, Typography } from '@material-ui/core';
import React from 'react';
import logo from '../../logo.svg';
import * as Model from '../../Model';

export default function ShowRecipe(props) {
  const beer = props.beer

  const maltList = Object.values(
    beer.malt.reduce((pv, c) => { 
      if(c.name in pv) {
        pv[c.name].amount += c.amount
      } else { 
        pv[c.name] = { ...c }
      }
      return pv
    }, {})
  )

  const hopList = Object.values(
    beer.hops.reduce((pv, c) => { 
      if(c.name in pv) {
        pv[c.name].amount += c.amount
      } else { 
        pv[c.name] = { ...c }
      }
      return pv
    }, {})
  )

  let maltListToDisplay = []
  maltList.forEach((c) => {
    maltListToDisplay.push(
      <Typography key={c.name} variant="body1" align="left" gutterBottom>
        {c.amount}g {c.name}
      </Typography>
    )
  })

  let hopListToDisplay = []
  hopList.forEach((c) => {
    hopListToDisplay.push(
      <Typography key={c.name} variant="body1" align="left" gutterBottom>
        {c.amount}g {c.name}
      </Typography>
    )
  })

  let mashstepsListToDisplay = []
  beer.mashSteps.forEach((c, i) => {
    mashstepsListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        {Model.mashStepTypes[c.type].label} at {c.temp}°C
      </Typography>
    )
  })

  let mashstepsDetailListToDisplay = []
  beer.mashSteps.forEach((c, i) => {
    mashstepsDetailListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        <span>Start: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "140px"}} /></span>
        {(c.type !== 0) ? (<span style={{marginLeft: 20}}>End: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "140px"}} /></span>) : <span></span> }
      </Typography>
    )
  })

  let hopadditionListToDisplay = []
  beer.hops.forEach((c, i) => {
    hopadditionListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        {c.amount}g {c.name}
      </Typography>
    )
  })

  let hopadditionDescrListToDisplay = []
  beer.hops.forEach((c, i) => {
    let txt = Model.hopType[c.type].descr + ((c.type === 1) ? c.duration + "min" : "")
    hopadditionDescrListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        {txt}
      </Typography>
    )
  })

  let hopadditionDetailListToDisplay = []
  beer.hops.forEach((c, i) => {
    hopadditionDetailListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        <span>Time: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "140px"}} /></span>
      </Typography>
    )
  })
  
  return (
    <Paper >
      <div style={{padding: 25}} id="recipetoprint">
        <Grid container spacing={3}>
          <Grid item xs={2} md={2} lg={2}>
            <img src={logo} width="100%" alt="" />
          </Grid>
          <Grid item xs={8} md={8} lg={8}>
            <Typography variant="h3" align="center" gutterBottom component="div">
              {beer.recipe.name !== "" ? beer.recipe.name : "Unnamed Recipe"}
            </Typography>
            <Typography sx={{ marginBottom: 2 }} variant="h5" align="center" gutterBottom component="div">
              {beer.recipe.beertype.name}
            </Typography>
            <Typography sx={{ marginBottom: 2 }} variant="subtitle2" align="center" gutterBottom component="div">
              OW: {beer.recipe.og}°P &nbsp;&nbsp; FW: {beer.recipe.sg}°P &nbsp;&nbsp; ALC: {beer.recipe.alc}%vol &nbsp;&nbsp; EBC: {beer.recipe.ebc} &nbsp;&nbsp; IBU: {beer.recipe.ibu}
            </Typography>
            <Typography variant="subtitle" align="left" gutterBottom component="div">
              {beer.recipe.description}
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <Typography variant="subtitle" align="right" >
              {beer.recipe.author}<br />
              {beer.recipe.date}
            </Typography>
          </Grid>
          <Grid item xs={1} md={1} lg={1}></Grid>
          <Grid item xs={10} md={10} lg={10}>
            <hr />
            <Grid container spacing={3}>
              <Grid item xs={4} md={4} lg={4}>
                <Typography variant="h6" align="left" gutterBottom component="div">
                  Malt
                </Typography>
                {maltListToDisplay}
              </Grid>
              <Grid item xs={4} md={4} lg={4}>
                <Typography variant="h6" align="left" gutterBottom component="div">
                  Hop
                </Typography>
                {hopListToDisplay}
              </Grid>
              <Grid item xs={4} md={4} lg={4}>
                <Typography variant="h6" align="left" gutterBottom component="div">
                  Yeast
                </Typography>
                <Typography variant="body1" align="left" gutterBottom>
                  {beer.yeast.name}
                </Typography>
              </Grid>
            </Grid>
            <hr />
            <Typography variant="h6" align="left" gutterBottom>
              Mashing
            </Typography>
            <Stack direction="row" spacing={4}>
              <Stack>
                {mashstepsListToDisplay}
              </Stack>
              <Stack>
                {mashstepsDetailListToDisplay}
              </Stack>
            </Stack>
            <hr />
            <Typography variant="h6" align="left" gutterBottom>
              Hop Cooking
            </Typography>
            <Stack direction="row" spacing={4}>
              <Stack>
                {hopadditionListToDisplay}
              </Stack>
              <Stack>
                {hopadditionDescrListToDisplay}
              </Stack>
              <Stack>
                {hopadditionDetailListToDisplay}
              </Stack>
            </Stack>
            <hr />
            <Typography variant="body1" align="left" sx={{marginTop: 4}} gutterBottom>
            <span>OW: <span style={{display: "inline-block", marginRight: "20px", borderBottom: "1px solid black", width: "140px"}} /></span><span>FW: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "140px"}} /></span>
            </Typography>
          </Grid>
          <Grid item xs={1} md={1} lg={1}></Grid>
        </Grid>
      </div>
    </Paper>
  );
}