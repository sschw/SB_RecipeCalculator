import React from 'react';
import './BeertypeComparer.css';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';
import {sg2plato} from '../../Utils/Formulas'

function getMinSliderPos(min, max, value) {
  if(min === null && max === null && value === null) return 0
  if(min === null) {
    if(value === null) {
      min = max/2
    } else if(max === null) {
      min = value / 2
    } else {
      min = max - Math.abs(max-value)*2
    }
  }
  if(max === null) {
    if(value === null) {
      max = min*2
    } else if(min === null) {
      max = value + value / 2
    } else {
      max = min + Math.abs(value-min)*2
    }
  }
  if(value !== null) {
    return Math.min(value, min - (max-min) / 2)
  }
  return min - (max-min) / 2
}

function getMaxSliderPos(min, max, value) {
  if(min === null && max === null && value === null) return 0
  if(min === null) {
    if(value === null) {
      min = max/2
    } else if(max === null) {
      min = value / 2
    } else {
      min = max - Math.abs(max-value)*2
    }
  }
  if(max === null) {
    if(value === null) {
      max = min*2
    } else if(min === null) {
      max = value + value / 2
    } else {
      max = min + Math.abs(value-min)*2
    }
  }
  if(value !== null) {
    return Math.max(value, max + (max-min) / 2)
  }
  return max + (max-min) / 2
}

function getMarkers(minVal, maxVal, val, fun) {
  let markers = [];
  if(minVal === null && maxVal === null) return markers;

  if(minVal !== null) {
    markers.push({ label: fun(minVal), value: minVal});
  } else {
    markers.push({ label: "", value: getMinSliderPos(minVal, maxVal, val)})
  }
  if(maxVal !== null) {
    markers.push({ label: fun(maxVal), value: maxVal});
  } else {
    markers.push({ label: "", value: getMaxSliderPos(minVal, maxVal, val)})
  }
  return markers;
}

function alctext(value) {
  return `${Math.round(value*100)/100}%vol`;
}

function platotext(value) {
  return `${Math.round(value*100)/100}°Plato`;
}

function ibutext(value) {
  return `${value} IBU`;
}

function ebctext(value) {
  return `${value} EBC`;
}

function BeertypeComparer (props) {
  const recipe = props.recipe
  const beertype = recipe.beertype

  const og = recipe.og != null ? sg2plato(recipe.og) : null
  const fg = recipe.fg != null ? sg2plato(recipe.fg) : null
  const alc = recipe.alc
  const ibu = recipe.ibu
  const ebc = recipe.ebc

  return (
    <Box className="beertype">
      <h3>Beer type</h3>
      <Typography id="discrete-slider-always" gutterBottom>
          Original Gravity
      </Typography>
      <Slider
        value={og === null ? getMinSliderPos(beertype.og.minPlato, beertype.og.maxPlato, og) : og}
        min={getMinSliderPos(beertype.og.minPlato, beertype.og.maxPlato, og)}
        max={getMaxSliderPos(beertype.og.minPlato, beertype.og.maxPlato, og)}
        getAriaValueText={platotext}
        valueLabelFormat={platotext}
        aria-labelledby="discrete-slider-always"
        steps={0.001}
        marks={getMarkers(beertype.og.minPlato, beertype.og.maxPlato, og, platotext)}
        disabled={true}
        valueLabelDisplay={og !== null && !isNaN(og) ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          Final Gravity
      </Typography>
      <Slider
        value={fg === null ? getMinSliderPos(beertype.fg.minPlato, beertype.fg.maxPlato, fg) : fg}
        min={getMinSliderPos(beertype.fg.minPlato, beertype.fg.maxPlato, fg)}
        max={getMaxSliderPos(beertype.fg.minPlato, beertype.fg.maxPlato, fg)}
        getAriaValueText={platotext}
        valueLabelFormat={platotext}
        aria-labelledby="discrete-slider-always"
        steps={0.001}
        marks={getMarkers(beertype.fg.minPlato, beertype.fg.maxPlato, fg, platotext)}
        disabled={true}
        valueLabelDisplay={fg !== null && !isNaN(fg) ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          Alcohol
      </Typography>
      <Slider
        value={alc === null ? getMinSliderPos(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, alc) : alc}
        min={getMinSliderPos(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, alc)}
        max={getMaxSliderPos(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, alc)}
        getAriaValueText={alctext}
        valueLabelFormat={alctext}
        aria-labelledby="discrete-slider-always"
        steps={0.1}
        marks={getMarkers(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, alc, alctext)}
        disabled={true}
        valueLabelDisplay={alc !== null && !isNaN(alc) ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          IBU
      </Typography>
      <Slider
        value={ibu === null ? getMinSliderPos(beertype.ibu.min, beertype.ibu.max, ibu) : ibu}
        min={getMinSliderPos(beertype.ibu.min, beertype.ibu.max, ibu)}
        max={getMaxSliderPos(beertype.ibu.min, beertype.ibu.max, ibu)}
        getAriaValueText={ibutext}
        valueLabelFormat={ibutext}
        aria-labelledby="discrete-slider-always"
        disabled={true}
        steps={1}
        marks={getMarkers(beertype.ibu.min, beertype.ibu.max, ibu, ibutext)}
        valueLabelDisplay={ibu !== null && !isNaN(ibu) ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          EBC
      </Typography>
      <Slider
        value={ebc === null ? getMinSliderPos(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, ebc) : ebc}
        min={getMinSliderPos(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, ebc)}
        max={getMaxSliderPos(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, ebc)}
        getAriaValueText={ebctext}
        valueLabelFormat={ebctext}
        aria-labelledby="discrete-slider-always"
        disabled={true}
        steps={1}
        marks={getMarkers(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, ebc, ebctext)}
        valueLabelDisplay={ebc !== null && !isNaN(ebc) ? "on" : "off"}
      />
    </Box>
  );
}

export default BeertypeComparer