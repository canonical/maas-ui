import configureStore from "redux-mock-store";

import Settings from "./Settings";

import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("Settings", () => {
  it("dispatches action to fetch config on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithBrowserRouter(<Settings />, { store });

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
    const state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({ user: userFactory({ is_superuser: false }) }),
      }),
    });
    renderWithBrowserRouter(<Settings />, { state });
    expect(
      screen.getByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).toBeInTheDocument();
  });
});
