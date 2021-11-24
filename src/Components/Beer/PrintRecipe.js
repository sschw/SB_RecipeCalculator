import { Grid, Stack, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import logo from '../../logo.svg';
import * as Model from '../../Model';
import html2pdf from 'html2pdf.js';
import { renderToString } from 'react-dom/server';
import { celsius2fahrenheit, gramm2Pounds, litre2USGal, sg2plato } from '../../Utils/Formulas';
import { metaData } from "../../Context/MetaDataContext"

export default async function print(beer) {
  await html2pdf().from(renderToString(ShowRecipeHeader({beer}))).set({ html2canvas:  { scale: 2 }}).toImg().get('img').then(async img => {
    await html2pdf().from(renderToString(ShowRecipeContent({beer}))).set({ margin: [46, 0, 0, 2], html2canvas:  { scale: 2 }, pagebreak: { avoid: '.keepTogether' }}).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const imgProps= pdf.getImageProperties(img);
      const width = pdf.internal.pageSize.getWidth();
      const height = (imgProps.height * pdf.internal.pageSize.getWidth()) / imgProps.width;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.addImage(img, 'JPEG', 0, 0, width, height);
      }
    }).save(beer.recipe.name !== "" ? beer.recipe.name : "recipe");
  })
}

export function ShowRecipeHeader(props) {
  const beer = props.beer
  const metaDataContext = useContext(metaData)

  const recipeVolume = metaDataContext.state["system"] === "US" ? (litre2USGal(beer.water.finalVolume) + "gal") : (beer.water.finalVolume + "L")

  return (
    <div>
      <div style={{padding: 25}} id="showRecipeHeader">
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
            <Typography variant="subtitle1" align="center"  component="div">
              Recipe for {recipeVolume}
            </Typography>
            <Typography variant="subtitle2" align="center" gutterBottom component="div">
              OG: {Math.round(sg2plato(beer.recipe.og)*10)/10}°P &nbsp;&nbsp; FG: {Math.round(sg2plato(beer.recipe.fg)*10)/10}°P &nbsp;&nbsp; ALC: {Math.round(beer.recipe.alc*100)/100}%vol &nbsp;&nbsp; EBC: {beer.recipe.ebc} &nbsp;&nbsp; IBU: {beer.recipe.ibu}
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <Typography variant="subtitle" align="right" >
              {beer.recipe.author}<br />
              {beer.recipe.date}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export function ShowRecipeContent(props) {
  const beer = props.beer
  const metaDataContext = useContext(metaData)
  
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
    let amount;
    if(metaDataContext.state["system"] === "US") {
      amount = gramm2Pounds(c.amount) + "lb"
    } else {
      amount = c.amount > 999 ? (c.amount/1000).toString() + "kg" : c.amount.toString() + "g"
    }
    maltListToDisplay.push(
      <Typography key={c.name} variant="body2" align="left">
        {amount} {c.name}
      </Typography>
    )
  })

  let hopListToDisplay = []
  hopList.forEach((c) => {
    let amount;
    if(metaDataContext.state["system"] === "US") {
      amount = gramm2Pounds(c.amount)*12 + "oz"
    } else {
      amount = c.amount.toString() + "g"
    }
    hopListToDisplay.push(
      <Typography key={c.name} variant="body2" align="left">
        {amount} {c.name}
      </Typography>
    )
  })

  let mashstepsListToDisplay = []
  beer.mashSteps.forEach((c, i) => {
    let temp;
    if(metaDataContext.state["system"] === "US") {
      temp = celsius2fahrenheit(c.temp) + "°F"
    } else {
      temp = c.temp + "°C"
    }
    let detail = (c.type === 1) ? "for " + c.dur + "min" : c.descr !== "" ? " - " + c.descr : ""
    mashstepsListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        {Model.mashStepTypes[c.type].label} at {temp} {detail}
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
    let amount;
    if(metaDataContext.state["system"] === "US") {
      amount = gramm2Pounds(c.amount)*12 + "oz"
    } else {
      amount = c.amount.toString() + "g"
    }
    hopadditionListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        {amount} {c.name}
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

  let mashWaterVolume = metaDataContext.state["system"] === "US" ? (litre2USGal(beer.water.mashWaterVolume) + "gal") : (beer.water.mashWaterVolume + "L")
  let spargeWaterVolume = metaDataContext.state["system"] === "US" ? (litre2USGal(beer.water.spargeWaterVolume) + "gal") : (beer.water.spargeWaterVolume + "L")
  
  return (
    <div>
      <div style={{padding: "0px 25px 0px 25px"}}>
        <Grid container spacing={3}>
          <Grid item xs={2} md={2} lg={2}></Grid>
          <Grid item xs={8} md={8} lg={8}>
            <Typography variant="body2" align="left" component="div">
              {beer.recipe.description}
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} lg={2}></Grid>

          <Grid item xs={1} md={1} lg={1}></Grid>
          <Grid item xs={10} md={10} lg={10}>
            <div class="keepTogether">
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
                  <Typography variant="body2" align="left">
                    {beer.yeast.name}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <div class="keepTogether">
              <hr />
              <Typography variant="h6" align="left" gutterBottom>
                Mashing
              </Typography>
              <Typography sx={{ marginBottom: 2 }} variant="body1" align="left" gutterBottom>
                Mash water: {mashWaterVolume} &nbsp;&nbsp; Sparge water: {spargeWaterVolume}
              </Typography>
              <Stack direction="row" spacing={4}>
                <Stack>
                  {mashstepsListToDisplay}
                </Stack>
                <Stack>
                  {mashstepsDetailListToDisplay}
                </Stack>
              </Stack>
            </div>
            <div class="keepTogether">
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
            </div>
            <div class="keepTogether">
              <hr />
              <Typography variant="body1" align="left" sx={{marginTop: 4}} gutterBottom>
                <span>OG: <span style={{display: "inline-block", marginRight: "20px", borderBottom: "1px solid black", width: "140px"}} /></span><span>FG: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "140px"}} /></span>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={1} md={1} lg={1}></Grid>
        </Grid>
      </div>
    </div>
  )
}