import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import packageInfo from "../package.json";

import App from "./app/App";
import * as serviceWorker from "./serviceWorker";

import SidePanelContextProvider from "app/base/side-panel-context";
import { history, store } from "redux-store";

import "./scss/index.scss";

const AppRoot = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <SidePanelContextProvider>
            <StrictMode>
              <App />
            </StrictMode>
          </SidePanelContextProvider>
        </CompatRouter>
      </Router>
    </Provider>
  );
};

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(<AppRoot />);
}

// log the maas-ui version to the console
// eslint-disable-next-line no-console
console.info(
  `${packageInfo.name} ${packageInfo.version} ${
    process.env.REACT_APP_GIT_SHA ?? ""
  }`
);

export default AppRoot;

serviceWorker.unregister();
