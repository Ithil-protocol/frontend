import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

import application from './application';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [''],
};

const isDevelopment = process.env.NODE_ENV !== 'production';

const store: Store = configureStore({
  reducer: persistReducer(persistConfig, combineReducers({ application })),
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    });
    return isDevelopment ? middleware.concat(logger) : middleware;
  },
  devTools: isDevelopment,
});

export const persistor = persistStore(store);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
