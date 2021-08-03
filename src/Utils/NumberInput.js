import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

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
      decimalScale={0}
      format="###%"
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

export const GrammInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  let valFloat = parseFloat(value)
  if(valFloat > 999) {
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        decimalScale={3}
        suffix="kg"
        className={`text-right ${props.className}`}
        value={valFloat/1000}
        onValueChange={values => {
          if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
          onChange({ floatValue: values?.floatValue*1000, formattedValue: values?.formattedValue, value: values?.value });
        }}
      />
    );
  }
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      decimalScale={0}
      suffix="g"
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values === undefined || values?.floatValue === undefined) values = { floatValue: 0, formattedValue: "", value: ""}
        onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

GrammInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const LitreInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="L"
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