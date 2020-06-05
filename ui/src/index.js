import { Provider } from "react-redux";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./root-saga";
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
  useEffect(() => {
    const loadingNode = document.querySelector(".root-loading");
    if (!loadingNode) {
      return;
    }
    if (!loadingNode.classList.contains("u-hide")) {
      loadingNode.classList.add("u-hide");
    }
  }, []);

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
