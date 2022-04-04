import { StrictMode } from "react";

import { generateNewURL } from "@maas-ui/maas-ui-shared";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createReduxHistoryContext } from "redux-first-history";
import createSagaMiddleware from "redux-saga";

import App from "./app/App";
import createRootReducer from "./root-reducer";
import rootSaga from "./root-saga";
import * as serviceWorker from "./serviceWorker";
import WebSocketClient from "./websocket-client";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory({
      basename: generateNewURL(),
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
        <StrictMode>
          <App />
        </StrictMode>
      </Router>
    </Provider>
  );
};

if (process.env.REACT_APP_STANDALONE === "true") {
  require("@maas-ui/maas-ui-root/dist/assets/css/root-application.css");
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(<Root />);
  }
}

require("./scss/index.scss");

export default Root;

serviceWorker.unregister();
