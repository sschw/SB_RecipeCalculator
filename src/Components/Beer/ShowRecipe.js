import React, { useContext } from 'react';
import { ShowRecipeHeader, ShowRecipeContent } from "./PrintRecipe"
import { metaData } from "../../Context/MetaDataContext"

export default function ShowRecipe(props) {
  const beer = props.beer
  const metaDataContext = useContext(metaData)
  const system = metaDataContext.state.system

  return (
    <div>
      <div style={{padding: 25}} id="recipetoprint">
          {ShowRecipeHeader({beer, system})}
          {ShowRecipeContent({beer, system})}
      </div>
    </div>
  );
}
