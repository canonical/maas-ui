import { StrictMode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import packageInfo from "../package.json";

import App from "./app/App";
import { createQueryClient } from "./app/api/query-client";
import SidePanelContextProvider from "./app/base/side-panel-context";
import { store } from "./redux-store";
import * as serviceWorker from "./serviceWorker";

import { WebSocketProvider } from "@/app/base/websocket-context";
import "./scss/index.scss";

export const Root = ({ children }: { children: React.ReactElement }) => {
  const queryClient = createQueryClient();
  const router = createBrowserRouter(
    [
      {
        path: "*",
        element: (
          <SidePanelContextProvider>{children}</SidePanelContextProvider>
        ),
      },
    ],
    {
      basename: `${import.meta.env.VITE_APP_BASENAME}${
        import.meta.env.VITE_APP_VITE_BASENAME
      }`,
    }
  );

  return (
    <Provider store={store}>
      <WebSocketProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
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
      <Root>
        <App />
      </Root>
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
