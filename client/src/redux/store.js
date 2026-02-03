import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js' //we gave it a new name while importing because it is a default export
import reducer from './user/userSlice.js'
import themeReducer from './theme/themeSlice.js'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

//this is the central store that holds all the global states of the application
//we can add multiple reducers to the store if we have multiple slices

//if we have multiple reducers we apparently need to combine them together, using combineReducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer
})

//for redux persist

const persistConfig = {
  key: 'root',
  version: 1,
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store);