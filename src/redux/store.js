import { combineReducers, configureStore } from "@reduxjs/toolkit";
import SnackBarReducer from "./SnackBarReducer";

const appReducer = combineReducers({
    SnackBarReducer
})

export const store = configureStore({
  reducer: appReducer,
})