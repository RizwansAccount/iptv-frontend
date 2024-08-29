import { combineReducers, configureStore } from "@reduxjs/toolkit";
import SnackBarReducer from "./SnackBarReducer";
import { iptvApi } from "./storeApis";

const appReducer = combineReducers({
  SnackBarReducer,
  [iptvApi.reducerPath]: iptvApi.reducer
})

export const store = configureStore({
  reducer: appReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(iptvApi.middleware),

})