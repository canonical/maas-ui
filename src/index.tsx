import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Router, CompatRouter } from "react-router-dom";

import packageInfo from "../package.json";

import App from "./app/App";
import SidePanelContextProvider from "./app/base/side-panel-context";
import { history, store } from "./redux-store";
import * as serviceWorker from "./serviceWorker";

import "./scss/index.scss";

export const RootProviders = ({ children }: { children: JSX.Element }) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <SidePanelContextProvider>{children}</SidePanelContextProvider>
        </CompatRouter>
      </Router>
    </Provider>
  );
};

const AppRoot = (): JSX.Element => {
  return (
    <StrictMode>
      <RootProviders>
        <App />
      </RootProviders>
    </StrictMode>
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
    import.meta.env.VITE_APP_GIT_SHA ?? ""
  }`
);

export default AppRoot;

serviceWorker.unregister();
