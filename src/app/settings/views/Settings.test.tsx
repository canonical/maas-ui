import Settings from "./Settings";

import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeStatistics.handler()
);

describe("Settings", () => {
  it("dispatches action to fetch config on load", () => {
    const state = factory.rootState();

    const { store } = renderWithProviders(<Settings />, { state });

    const fetchConfigAction = store
      .getActions()
      .find((action) => action.type === "config/fetch");

    expect(fetchConfigAction).toEqual({
      type: "config/fetch",
      meta: {
        model: "config",
        method: "list",
      },
      payload: null,
    });
  });

  it("displays a message if not an admin", () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.userInfo({ entitlements: [] })
      )
    );
    renderWithProviders(<Settings />);
    expect(
      screen.getByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).toBeInTheDocument();
  });

  it("does not display a permission message for users with access", async () => {
    renderWithProviders(<Settings />);
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /You do not have permission to view this page./,
        })
      ).not.toBeInTheDocument();
    });
  });
});
