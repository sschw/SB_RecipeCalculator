import React from 'react';
import { ShowRecipeHeader, ShowRecipeContent } from "./PrintRecipe"

export default function ShowRecipe(props) {
  const beer = props.beer

  return (
    <div>
      <div style={{padding: 25}} id="recipetoprint">
          {ShowRecipeHeader({beer})}
          {ShowRecipeContent({beer})}
      </div>
    </div>
  );
}
