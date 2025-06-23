import { StrictMode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";

import packageInfo from "../package.json";

import { createQueryClient } from "./app/api/query-client";
import { store } from "./redux-store";

import SidePanelContextProvider from "@/app/base/side-panel-context";
import { WebSocketProvider } from "@/app/base/websocket-context";
import "./scss/index.scss";
import { router } from "@/router";

export const Root = () => {
  const queryClient = createQueryClient();

  return (
    <Provider store={store}>
      <WebSocketProvider>
        <QueryClientProvider client={queryClient}>
          <SidePanelContextProvider>
            <RouterProvider router={router} />
          </SidePanelContextProvider>
          <ReactQueryDevtools
            initialIsOpen={
              import.meta.env.VITE_APP_REACT_QUERY_DEVTOOLS === "true"
            }
          />
        </QueryClientProvider>
      </WebSocketProvider>
    </Provider>
  );
};

const AppRoot = (): React.ReactElement => {
  return (
    <StrictMode>
      <Root />
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
