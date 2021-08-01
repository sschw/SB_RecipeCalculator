import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

export const PercentInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
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

export const GrammInput = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      suffix="g"
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values !== undefined && values?.floatValue !== undefined)
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
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values !== undefined && values?.floatValue !== undefined)
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
      suffix="min"
      className={`text-right ${props.className}`}
      value={value}
      onValueChange={values => {
        if(values !== undefined && values?.floatValue !== undefined)
          onChange({ floatValue: values?.floatValue, formattedValue: values?.formattedValue, value: values?.value });
      }}
    />
  );
});

MinuteInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};