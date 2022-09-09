import { StrictMode } from "react";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import packageInfo from "../package.json";

import App from "./app/App";
import * as serviceWorker from "./serviceWorker";

import { history, store } from "redux-store";

import "./scss/index.scss";

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

// log the maas-ui version to the console
console.info(
  `${packageInfo.name} ${packageInfo.version} ${
    process.env.REACT_APP_GIT_SHA ?? ""
  }`
);

export default Root;

serviceWorker.unregister();
