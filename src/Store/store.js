import { configureStore } from "@reduxjs/toolkit";
import fightReducer from "../Features/Fight/fightSlice";

export const store = configureStore({
  reducer: {
    fight: fightReducer,
  }, // Nous ajouterons nos reducers ici
  // Le DevTools Redux est activé par défaut en développement !
});