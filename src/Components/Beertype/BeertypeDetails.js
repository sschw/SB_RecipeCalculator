import React from 'react';
import './BeertypeComparer.css';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';

function BeertypeDetails (props) {
  //const beertype = props.beertype
  const [t, i18n] = useTranslation();
  return (
    <Box className="beertype">
      <h3>{t("Beer type")}</h3>
      
    </Box>
  );
}

export default BeertypeDetails