import React from 'react';
import ReactDOM from 'react-dom';
import './BeertypeComparer.css';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';

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
  return `${value}%vol`;
}

function platotext(value) {
  return `${value}°Plato`;
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
  return (
    <Box className="beertype">
      <h3>Beer type</h3>
      <Typography id="discrete-slider-always" gutterBottom>
          Original Gravity
      </Typography>
      <Slider
        value={recipe.og === null ? getMinSliderPos(beertype.og.minPlato, beertype.og.maxPlato, recipe.og) : recipe.og}
        min={getMinSliderPos(beertype.og.minPlato, beertype.og.maxPlato, recipe.og)}
        max={getMaxSliderPos(beertype.og.minPlato, beertype.og.maxPlato, recipe.og)}
        getAriaValueText={platotext}
        aria-labelledby="discrete-slider-always"
        steps={0.001}
        marks={getMarkers(beertype.og.minPlato, beertype.og.maxPlato, recipe.og, platotext)}
        disabled={true}
        valueLabelDisplay={recipe.og !== null ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          Final Gravity
      </Typography>
      <Slider
        value={recipe.sg === null ? getMinSliderPos(beertype.sg.minPlato, beertype.sg.maxPlato, recipe.sg) : recipe.sg}
        min={getMinSliderPos(beertype.sg.minPlato, beertype.sg.maxPlato, recipe.sg)}
        max={getMaxSliderPos(beertype.sg.minPlato, beertype.sg.maxPlato, recipe.sg)}
        getAriaValueText={platotext}
        aria-labelledby="discrete-slider-always"
        steps={0.001}
        marks={getMarkers(beertype.sg.minPlato, beertype.sg.maxPlato, recipe.sg, platotext)}
        disabled={true}
        valueLabelDisplay={recipe.sg !== null ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          Alcohol
      </Typography>
      <Slider
        value={recipe.alc === null ? getMinSliderPos(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, recipe.alc) : recipe.alc}
        min={getMinSliderPos(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, recipe.alc)}
        max={getMaxSliderPos(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, recipe.alc)}
        getAriaValueText={alctext}
        aria-labelledby="discrete-slider-always"
        steps={0.1}
        marks={getMarkers(beertype.alc.minPercentVol, beertype.alc.maxPercentVol, recipe.alc, alctext)}
        disabled={true}
        valueLabelDisplay={recipe.alc !== null ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          IBU
      </Typography>
      <Slider
        value={recipe.ibu === null ? getMinSliderPos(beertype.ibu.min, beertype.ibu.max, recipe.ibu) : recipe.ibu}
        min={getMinSliderPos(beertype.ibu.min, beertype.ibu.max, recipe.ibu)}
        max={getMaxSliderPos(beertype.ibu.min, beertype.ibu.max, recipe.ibu)}
        getAriaValueText={ibutext}
        aria-labelledby="discrete-slider-always"
        disabled={true}
        steps={1}
        marks={getMarkers(beertype.ibu.min, beertype.ibu.max, recipe.ibu, ibutext)}
        valueLabelDisplay={recipe.ibu !== null ? "on" : "off"}
      />
      <Typography id="discrete-slider-always" gutterBottom>
          EBC
      </Typography>
      <Slider
        value={recipe.ebc === null ? getMinSliderPos(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, recipe.ebc) : recipe.ebc}
        min={getMinSliderPos(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, recipe.ebc)}
        max={getMaxSliderPos(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, recipe.ebc)}
        getAriaValueText={ebctext}
        aria-labelledby="discrete-slider-always"
        disabled={true}
        steps={1}
        marks={getMarkers(beertype.colorVal.minEBC, beertype.colorVal.maxEBC, recipe.ebc, ebctext)}
        valueLabelDisplay={recipe.ebc !== null ? "on" : "off"}
      />
    </Box>
  );
}

export default BeertypeComparer