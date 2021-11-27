import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { celsius2fahrenheit, fahrenheit2celsius, gramm2Pounds, litre2USGal, pounds2Gramm, usGal2litre } from './Formulas';

export const FahrenheitInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="°F"
      decimalScale={0}
      className={`text-right ${props.className}`}
      value={celsius2fahrenheit(value)}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        else values.floatValue = fahrenheit2celsius(value.floatValue)
        onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  ); 
});

export const CelsiusInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;
  
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="°C"
      decimalScale={0}
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

FahrenheitInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
CelsiusInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const PercentInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="%"
      decimalScale={0}
      fixedDecimalScale={true}
      className={`text-right ${props.className}`}
      value={parseFloat(value) * 100}
      onValueChange={values => {
        if(values !== undefined)
          values?.floatValue > 100
              ? onChange({ floatValue: 1, formattedValue: '1.00', value: '1' })
              : onChange({ floatValue: values?.floatValue/100, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

PercentInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const DecimalPercentInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="%"
      decimalSeparator="."
      decimalScale={1}
      fixedDecimalScale={true}
      className={`text-right ${props.className}`}
      value={parseFloat(value) * 100}
      onValueChange={values => {
        if(values !== undefined)
          values?.floatValue > 100
              ? onChange({ floatValue: 1, formattedValue: '1.00', value: '1' })
              : onChange({ floatValue: values?.floatValue/100, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

DecimalPercentInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const PoundsInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, useScale, ...other } = props;

  let floatVal = gramm2Pounds(parseFloat(value))*16 // to oz
  if(isNaN(floatVal)) floatVal = 0
  let currentScale = {name: "lb", scale: 16}

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      decimalScale={Math.ceil(Math.log10(currentScale.scale))}
      suffix={currentScale.name}
      className={`text-right ${props.className}`}
      value={floatVal/currentScale.scale}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        else values.floatValue = pounds2Gramm(values.floatValue/16) // from oz
        onChange({ floatValue: values?.floatValue*currentScale.scale, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

export const OunceInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, useScale, ...other } = props;

  let floatVal = gramm2Pounds(parseFloat(value))*16 // to oz
  if(isNaN(floatVal)) floatVal = 0
  let currentScale = {name: "oz", scale: 1}

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      decimalScale={Math.ceil(Math.log10(currentScale.scale))}
      suffix={currentScale.name}
      className={`text-right ${props.className}`}
      value={floatVal/currentScale.scale}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        else values.floatValue = pounds2Gramm(values.floatValue/16) // from oz
        onChange({ floatValue: values?.floatValue*currentScale.scale, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

export const GrammInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, useScale, ...other } = props;

  const scales = [ {name: "g", scale: 1}, {name: "kg", scale: 1000}, {name: "t", scale: 1000000} ]
  let floatVal = parseFloat(value)
  if(isNaN(floatVal)) floatVal = 0

  let currentScale = scales[0]
  if (useScale) {
    scales.forEach((s) => {
      if(useScale === s.name)
        currentScale = s
    })
  } else {
    scales.forEach((s) => {
      if(floatVal > s.scale-1) currentScale = s
    })
  }

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      decimalScale={Math.log10(currentScale.scale)}
      suffix={currentScale.name}
      className={`text-right ${props.className}`}
      value={floatVal/currentScale.scale}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        onChange({ floatValue: values?.floatValue*currentScale.scale, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

PoundsInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
OunceInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
GrammInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

  
export const USGalInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, useUSGallon, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="gal"
      decimalScale={1}
      className={`text-right ${props.className}`}
      value={litre2USGal(value)}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        else values.floatValue = usGal2litre(values.floatValue);
        onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});
  
export const LitreInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, useUSGallon, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="L"
      decimalScale={1}
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

USGalInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
LitreInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const MinuteInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      decimalScale={0}
      suffix="min"
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

MinuteInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const MlPerGInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      decimalScale={2}
      suffix="ml"
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

MlPerGInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};