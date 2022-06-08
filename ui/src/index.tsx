import { StrictMode } from "react";

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import { createReduxHistoryContext } from "redux-first-history";
import createSagaMiddleware from "redux-saga";

import App from "./app/App";
import createRootReducer from "./root-reducer";
import rootSaga from "./root-saga";
import * as serviceWorker from "./serviceWorker";
import WebSocketClient from "./websocket-client";

import "./scss/index.scss";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory({
      basename: `${process.env.REACT_APP_BASENAME}${process.env.REACT_APP_REACT_BASENAME}`,
    }),
  });

const reducer = createRootReducer(routerReducer);

const sagaMiddleware = createSagaMiddleware();
const checkMiddleware = process.env.REACT_APP_CHECK_MIDDLEWARE === "true";
const middleware = [
  ...getDefaultMiddleware({
    thunk: false,
    immutableCheck: checkMiddleware,
    serializableCheck: checkMiddleware,
  }),
  sagaMiddleware,
  routerMiddleware,
];

export const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});

export const history = createReduxHistory(store);

const websocketClient = new WebSocketClient();

sagaMiddleware.run(rootSaga, websocketClient);

const Root = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <StrictMode>
            <App />
          </StrictMode>
        </CompatRouter>
      </Router>
    </Provider>
  );
};

const rootNode = document.getElementById("root");

if (rootNode) {
  ReactDOM.render(<Root />, rootNode);
}

export default Root;

serviceWorker.unregister();
