import { createContext, useReducer } from "react"


const initialState = {
  language: "EN",
  system: "SI"
}

export const metaData = createContext(initialState);

const { Provider } = metaData

export const MetaDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const currentState = { ...state };
    switch(action.type) {
      case "language":
        currentState.language = action.value;
        return currentState;
      case "system": 
        currentState.system = action.value;
        return currentState;
      default:
        return state
    }
  }, initialState)
  return <Provider value={{state, dispatch}}>{children}</Provider>
}