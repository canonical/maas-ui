import { Provider } from "react-redux";
import React from "react";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
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

const sagaMiddleware = createSagaMiddleware();
const checkMiddleware = process.env.REACT_APP_CHECK_MIDDLEWARE === "true";
const middleware = [
  ...getDefaultMiddleware({
    thunk: false,
    immutableCheck: checkMiddleware,
    serializableCheck: checkMiddleware,
  }),
  sagaMiddleware,
  routerMiddleware(history),
];

export const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

const Root = () => {
  console.info(`${appName} ${appVersion} (${process.env.REACT_APP_GIT_SHA}).`);
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ConnectedRouter>
    </Provider>
  );
};

export default Root;

serviceWorker.unregister();

window.addEventListener("popstate", (evt) => {
  if (evt.singleSpa) {
    // not a maas-ui-legacy route
    console.log(window.location.pathname.split("/"));
    const reactRoute =
      window.location.pathname.split("/")[2] ===
      process.env.REACT_APP_REACT_BASENAME.substr(1);
    console.log("reactROute", reactRoute);
    if (reactRoute) {
      console.log(window.location.pathname);
      console.log(history.location.pathname);
      const newPath = window.location.pathname.split("/").slice(3)[0];
      const lastPath = history.location.pathname.split("/")[1];
      console.log("new path", newPath);
      console.log("last path", lastPath);
      if (newPath !== lastPath) {
        console.log("updating history to", `/${newPath}`);
        history.push(`/${newPath}`);
      }
    }
  }
});
