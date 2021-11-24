import React, { useContext } from 'react';
import { ShowRecipeHeader, ShowRecipeContent } from "./PrintRecipe"
import { metaData } from "../../Context/MetaDataContext"
import { useTranslation } from 'react-i18next';

export default function ShowRecipe(props) {
  const [t, i18n] = useTranslation();
  const beer = props.beer
  const metaDataContext = useContext(metaData)
  const system = metaDataContext.state.system

  return (
    <div>
      <div style={{padding: 25}} id="recipetoprint">
          {ShowRecipeHeader({beer, system, t})}
          {ShowRecipeContent({beer, system, t})}
      </div>
    </div>
  );
}
