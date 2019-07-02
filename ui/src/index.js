import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";

import "./scss/base.scss";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import createRootReducer from "./root-reducer";

export const history = createBrowserHistory();
const composeEnhancers = composeWithDevTools({});
const middleware = [routerMiddleware(history)];
const enhancers = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(createRootReducer(history), enhancers);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
