import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createSagaMiddleware from "redux-saga";

import { generateNewURL } from "@maas-ui/maas-ui-shared";
import rootSaga from "./root-saga";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import createRootReducer from "./root-reducer";
import WebSocketClient from "./websocket-client";

export const history = createBrowserHistory({
  basename: generateNewURL(),
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

let websocketClient = new WebSocketClient();

sagaMiddleware.run(rootSaga, websocketClient);

const Root = () => {
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

if (process.env.REACT_APP_STANDALONE === "true") {
  require("@maas-ui/maas-ui-root/dist/assets/css/root-application.css");
  ReactDOM.render(<Root />, document.getElementById("root"));
}

export default Root;

serviceWorker.unregister();
