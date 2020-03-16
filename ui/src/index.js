import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./root-saga";
import "./scss/index.scss";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import createRootReducer from "./root-reducer";

export const history = createBrowserHistory({
  basename: `${process.env.REACT_APP_BASENAME}${process.env.REACT_APP_REACT_BASENAME}`
});
const reducer = createRootReducer(history);

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  ...getDefaultMiddleware(),
  sagaMiddleware,
  routerMiddleware(history)
];

export const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production"
});

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
