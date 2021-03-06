import { createContext, useReducer } from "react"
import { useTranslation } from "react-i18next";

const initialState = {
  language: "en",
  system: "SI",
  simpleUI: false
}

export const metaData = createContext(initialState);

const { Provider } = metaData

export const MetaDataProvider = ({ children }) => {
  const [_, i18n] = useTranslation();
  const initState = {...initialState, language: (i18n.language != null && i18n.language.length === 2) ? i18n.language : "en"} // TODO: This needs improvement.
  const [state, dispatch] = useReducer((state, action) => {
    const currentState = { ...state };
    switch(action.type) {
      case "language":
        currentState.language = action.value;
        i18n.changeLanguage(action.value);
        return currentState;
        case "system": 
          currentState.system = action.value;
          return currentState;
        case "ui": 
          currentState.simpleUI = action.value;
          return currentState;
      default:
        return state
    }
  }, initState)
  return <Provider value={{state, dispatch}}>{children}</Provider>
}