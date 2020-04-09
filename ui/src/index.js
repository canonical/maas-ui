import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";

import { name as appName, version as appVersion } from "../package.json";
import rootSaga from "./root-saga";
import "./scss/index.scss";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import createRootReducer from "./root-reducer";

export const history = createBrowserHistory({
  basename: `${process.env.REACT_APP_BASENAME}${process.env.REACT_APP_REACT_BASENAME}`,
});
const reducer = createRootReducer(history);

const persistConfig = {
  key: "root",
  whitelist: ["machine"],
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  ...getDefaultMiddleware({
    thunk: false,
    immutableCheck: false,
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  sagaMiddleware,
  routerMiddleware(history),
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <React.StrictMode>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();

console.info(`${appName} ${appVersion} (${process.env.REACT_APP_GIT_SHA}).`);
