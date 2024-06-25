import { StrictMode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HistoryRouter as Router } from "redux-first-history/rr6";

import packageInfo from "../package.json";

import App from "./app/App";
import { createQueryClient } from "./app/api/query-client";
import SidePanelContextProvider from "./app/base/side-panel-context";
import { store, history } from "./redux-store";
import * as serviceWorker from "./serviceWorker";

import "./scss/index.scss";

const queryClient = createQueryClient();

export const RootProviders = ({ children }: { children: JSX.Element }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router
          basename={`${import.meta.env.VITE_APP_BASENAME}${
            import.meta.env.VITE_APP_VITE_BASENAME
          }`}
          history={history}
        >
          <SidePanelContextProvider>{children}</SidePanelContextProvider>
        </Router>
        <ReactQueryDevtools
          initialIsOpen={
            import.meta.env.VITE_APP_REACT_QUERY_DEVTOOLS === "true"
          }
        />
      </QueryClientProvider>
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
