import configureStore from "redux-mock-store";

import Settings from "./Settings";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { screen, renderWithProviders, setupMockServer } from "@/testing/utils";

const mockStore = configureStore<RootState>();
setupMockServer(authResolvers.getThisUser.handler());

describe("Settings", () => {
  it("dispatches action to fetch config on load", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    renderWithProviders(<Settings />, { store });

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
    renderWithProviders(<Settings />);
    expect(
      screen.getByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).toBeInTheDocument();
  });
});
