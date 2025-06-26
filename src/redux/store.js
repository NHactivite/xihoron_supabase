import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer } from "./reducer/cartReducer";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["cartReducer"], // Only persist cartReducer, or add other reducers if needed
  };
  // Combine reducers
const rootReducer = combineReducers({
    [cartReducer.name]: cartReducer.reducer,
  });

  // Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store=configureStore({
    reducer:persistedReducer,
     middleware:( getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck: false,})
});

export const persistor = persistStore(store);