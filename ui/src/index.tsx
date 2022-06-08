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

ReactDOM.render(<Root />, document.getElementById("root"));

export default Root;

serviceWorker.unregister();
