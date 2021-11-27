import { Grid, Stack, Typography } from '@material-ui/core';
import React from 'react';
import logo from '../../logo.svg';
import * as Model from '../../Model';
import html2pdf from 'html2pdf.js';
import { renderToString } from 'react-dom/server';
import { celsius2fahrenheit, gramm2Pounds, litre2USGal, sg2plato } from '../../Utils/Formulas';

import "./PrintRecipe.css"

export default async function print(beer, system, t) {
  await html2pdf().from(renderToString(ShowRecipeHeader({beer, system, t}))).set({ html2canvas:  { scale: 2 }}).toImg().get('img').then(async img => {
    await html2pdf().from(renderToString(ShowRecipeContent({beer, system, t}))).set({ margin: [50, 0, 0, 2], html2canvas:  { scale: 2 }, pagebreak: { avoid: '.keepTogether' }}).toPdf().get('pdf').then((pdf) => {
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

function roundNumber(num, scale) {
  if(isNaN(num)) return 0;
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

// Generated using https://bl.ocks.org/tophtucker/62f93a4658387bb61e4510c37e2e97cf
// Great tool as we only want a static map for Roboto.
function measureText(string, fontSize = 14) {
  const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.04999847412109375,0.5350006103515625,0.6100006103515625,0.7,0.7,1.0333328247070312,0.9800003051757813,0.38000030517578126,0.5350006103515625,0.5350006103515625,0.7,0.7633331298828125,0.45,0.5350006103515625,0.45,0.47833404541015623,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.47833404541015623,0.47833404541015623,0.7633331298828125,0.7633331298828125,0.7633331298828125,0.6449996948242187,1.1216659545898438,0.925,0.8683334350585937,0.8683334350585937,0.925,0.8133331298828125,0.7566665649414063,0.925,0.925,0.5350006103515625,0.5916671752929688,0.925,0.8133331298828125,1.0883331298828125,0.925,0.925,0.7566665649414063,0.925,0.8683334350585937,0.7566665649414063,0.8133331298828125,0.925,0.925,1.1449996948242187,0.925,0.925,0.8133331298828125,0.5350006103515625,0.47833404541015623,0.5350006103515625,0.6699996948242187,0.7,0.5350006103515625,0.6449996948242187,0.7,0.6449996948242187,0.7,0.6449996948242187,0.5350006103515625,0.7,0.7,0.47833404541015623,0.47833404541015623,0.7,0.47833404541015623,0.9800003051757813,0.7,0.7,0.7,0.7,0.5350006103515625,0.5916671752929688,0.47833404541015623,0.7,0.7,0.925,0.7,0.7,0.6449996948242187,0.6816665649414062,0.4,0.6816665649414062,0.7416671752929688]
  const avg = 0.7068948203638984
  return string
    .split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((cur, acc) => acc + cur) * fontSize
}

export function ShowRecipeHeader(props) {
  const beer = props.beer
  const system = props.system
  const t = props.t

  const recipeVolume = system === "US" ? (roundNumber(litre2USGal(beer.water.finalVolume), 1) + "gal") : (beer.water.finalVolume + "L")

  let beerName = beer.recipe.name !== "" ? beer.recipe.name : t("Unnamed Recipe")
  let pxOfTitle = measureText(beerName, 14*3) // 3em
  const sizeOfTitle = 364
  let titleScale = {fontSize: "1em"}
  if(pxOfTitle > sizeOfTitle) {
    titleScale = {fontSize: sizeOfTitle/pxOfTitle + "em"}
  }

  return (
    <div className="print">
      <div style={{paddingTop: 35, paddingLeft: 45, paddingRight: 45}} id="showRecipeHeader">
        <Grid container spacing={3}>
          <Grid item xs={3} md={3} lg={3}>
            <img src={logo} width="80%" alt="" />
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Typography variant="h3" align="center" gutterBottom component="div">
              <span style={titleScale}>{beerName}</span>
            </Typography>
            <Typography sx={{ marginBottom: 2 }} variant="h5" align="center" gutterBottom component="div">
              {beer.recipe.beertype.name}
            </Typography>
            <Typography variant="subtitle1" align="center"  component="div">
              {t("Recipe for")} {recipeVolume}
            </Typography>
            <Typography variant="subtitle2" align="center" gutterBottom component="div">
              {t("OG")}: {Math.round(sg2plato(beer.recipe.og)*10)/10}°P &nbsp;&nbsp; {t("FG")}: {Math.round(sg2plato(beer.recipe.fg)*10)/10}°P &nbsp;&nbsp; {t("ALC")}: {Math.round(beer.recipe.alc*100)/100}%vol &nbsp;&nbsp; EBC: {beer.recipe.ebc} &nbsp;&nbsp; IBU: {beer.recipe.ibu}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3} lg={3} sx={{ textAlign: 'right', paddingRight: 5 }}>
            <Typography variant="subtitle" >
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
  const system = props.system
  const t = props.t
  
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
    if(system === "US") {
      amount = roundNumber(gramm2Pounds(c.amount), 2) + "lb"
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
    if(system === "US") {
      amount = roundNumber(gramm2Pounds(c.amount)*12, 0) + "oz"
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
    if(system === "US") {
      temp = roundNumber(celsius2fahrenheit(c.temp), 0) + "°F"
    } else {
      temp = c.temp + "°C"
    }
    let detail = (c.type === 1) ? t("for") + " " + c.dur + "min" : c.descr !== "" ? " - " + c.descr : ""
    mashstepsListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        {t(Model.mashStepTypes[c.type].label + " at")} {temp} {detail}
      </Typography>
    )
  })

  let mashstepsDetailListToDisplay = []
  beer.mashSteps.forEach((c, i) => {
    mashstepsDetailListToDisplay.push(
      <Typography sx={{ marginBottom: 2 }} key={i} variant="body1" align="left" gutterBottom>
        <span>{t("Start")}: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "6.5em"}} /></span>
        {(c.type !== 0) ? (<span style={{marginLeft: 20}}>{t("End")}: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "6.5em"}} /></span>) : <span></span> }
      </Typography>
    )
  })

  let hopadditionListToDisplay = []
  beer.hops.forEach((c, i) => {
    let amount;
    if(system === "US") {
      amount = roundNumber(gramm2Pounds(c.amount)*12, 0) + "oz"
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
    let txt = t(Model.hopType[c.type].descr) + ((c.type === 1) ? " " + c.duration + "min" : "")
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
        <span>{t("Time")}: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "6.5em"}} /></span>
      </Typography>
    )
  })

  let mashWaterVolume = system === "US" ? (roundNumber(litre2USGal(beer.water.mashWaterVolume), 1) + "gal") : (beer.water.mashWaterVolume + "L")
  let spargeWaterVolume = system === "US" ? (roundNumber(litre2USGal(beer.water.spargeWaterVolume), 1) + "gal") : (beer.water.spargeWaterVolume + "L")
  
  return (
    <div className="print">
      <div style={{padding: "15px 25px 0px 25px"}}>
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
            <div className="keepTogether">
              <hr />
              <Grid container spacing={3}>
                <Grid item xs={4} md={4} lg={4}>
                  <Typography variant="h6" align="left" gutterBottom component="div">
                    {t("Malt")}
                  </Typography>
                  {maltListToDisplay}
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                  <Typography variant="h6" align="left" gutterBottom component="div">
                    {t("Hop")}
                  </Typography>
                  {hopListToDisplay}
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                  <Typography variant="h6" align="left" gutterBottom component="div">
                    {t("Yeast")}
                  </Typography>
                  <Typography variant="body2" align="left">
                    {beer.yeast.name}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <div className="keepTogether">
              <hr />
              <Typography variant="h6" align="left" gutterBottom>
                {t("Mashing")}
              </Typography>
              <Typography sx={{ marginBottom: 2 }} variant="body1" align="left" gutterBottom>
                {t("Mash Water")}: {mashWaterVolume} &nbsp;&nbsp; {t("Sparge Water")}: {spargeWaterVolume}
              </Typography>
              <Stack direction="row" spacing={4}>
                <Stack style={{maxWidth: "50%"}}>
                  {mashstepsListToDisplay}
                </Stack>
                <Stack>
                  {mashstepsDetailListToDisplay}
                </Stack>
              </Stack>
            </div>
            <div className="keepTogether">
              <hr />
              <Typography variant="h6" align="left" gutterBottom>
                {t("Hop Cooking")}
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
            <div className="keepTogether">
              <hr />
              <Typography variant="body1" align="left" sx={{marginTop: 4}} gutterBottom>
                <span>{t("OG")}: <span style={{display: "inline-block", marginRight: "20px", borderBottom: "1px solid black", width: "6.5em"}} /></span><span>{t("FG")}: <span style={{display: "inline-block", borderBottom: "1px solid black", width: "6.5em"}} /></span>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={1} md={1} lg={1}></Grid>
        </Grid>
      </div>
    </div>
  )
}