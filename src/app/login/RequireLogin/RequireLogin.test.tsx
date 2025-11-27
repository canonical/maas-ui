import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import configureStore from "redux-mock-store";

import RequireLogin from "./RequireLogin";

import { WebSocketProvider } from "@/app/base/websocket-context";
import type { RootState } from "@/app/store/root/types";
import {
  rootState as rootStateFactory,
  statusState as statusStateFactory,
} from "@/testing/factories";
import { render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

describe("RequireLogin", () => {
  let state: RootState;

  const renderFn = () => {
    const router = createMemoryRouter(
      [
        {
          path: "/login",
          element: <>Login</>,
        },
        {
          element: <RequireLogin />,
          children: [
            {
              path: "/machines",
              element: <>Machines</>,
            },
          ],
        },
      ],
      { initialEntries: ["/machines"] }
    );

    const view = render(
      <Provider store={mockStore(state)}>
        <QueryClientProvider client={queryClient}>
          <WebSocketProvider>
            <RouterProvider router={router} />
          </WebSocketProvider>
        </QueryClientProvider>
      </Provider>
    );

    return { view, router };
  };

  beforeEach(() => {
    state = rootStateFactory({
      status: statusStateFactory({
        authenticating: false,
        authenticated: false,
        connected: true,
        connecting: false,
        error: undefined,
      }),
    });
  });

  it("redirects to /login if not authenticated", async () => {
    const { router } = renderFn();

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });
  });

  it("includes the initial route as a query parameter for redirecting after login", async () => {
    const { router } = renderFn();

    await waitFor(() => {
      expect(router.state.location.search).toBe("?redirectTo=%2Fmachines");
    });
  });

  it("doesn't render anything when not authenticated", async () => {
    const router = createMemoryRouter(
      [
        {
          element: <RequireLogin />,
          children: [
            {
              path: "/machines",
              element: <>Machines</>,
            },
          ],
        },
      ],
      { initialEntries: ["/machines"] }
    );

    render(
      <Provider store={mockStore(state)}>
        <QueryClientProvider client={queryClient}>
          <WebSocketProvider>
            <RouterProvider router={router} />
          </WebSocketProvider>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Machines")).not.toBeInTheDocument();
    });
  });

  it("renders child routes when logged in", async () => {
    state.status.authenticated = true;
    renderFn();

    await waitFor(() => {
      expect(screen.getByText("Machines")).toBeInTheDocument();
    });
  });
});
