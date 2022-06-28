import { StrictMode } from "react";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

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

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // @ts-ignore
  const { devtools } = require("./mocks/browser");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  devtools.init();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.MAAS_DEVTOOLS = devtools;
}

if (rootNode) {
  ReactDOM.render(<Root />, rootNode);
}

export default Root;

serviceWorker.unregister();
