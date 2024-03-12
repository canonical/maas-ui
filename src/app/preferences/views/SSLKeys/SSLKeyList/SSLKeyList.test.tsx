import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import SSLKeyList, { Label as SSLKeyListLabels } from "./SSLKeyList";

import type { RootState } from "@/app/store/root/types";
import {
  sslKey as sslKeyFactory,
  sslKeyState as sslKeyStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import {
  screen,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

describe("SSLKeyList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      sslkey: sslKeyStateFactory({
        loading: false,
        loaded: true,
        items: [
          sslKeyFactory({
            id: 1,
            key: "ssh-rsa aabb",
          }),
          sslKeyFactory({
            id: 2,
            key: "ssh-rsa ccdd",
          }),
          sslKeyFactory({
            id: 3,
            key: "ssh-rsa eeff",
          }),
          sslKeyFactory({
            id: 4,
            key: "ssh-rsa gghh",
          }),
          sslKeyFactory({ id: 5, key: "ssh-rsa gghh" }),
        ],
      }),
    });
  });

  it("displays a loading component if machines are loading", () => {
    state.sslkey.loading = true;
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/account/prefs/ssl-keys", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <SSLKeyList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("can display errors", () => {
    state.sslkey.errors = "Unable to list SSL keys.";
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/account/prefs/ssl-keys", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <SSLKeyList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Unable to list SSL keys.")).toBeInTheDocument();
  });

  it("can render the table", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/account/prefs/ssl-keys", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <SSLKeyList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByRole("grid", { name: SSLKeyListLabels.Title }));
  });

  it("displays an empty state message", () => {
    state.sslkey.items = [];
    renderWithBrowserRouter(<SSLKeyList />, {
      state,
      route: "/account/prefs/ssl-keys",
    });

    expect(screen.getByText("No SSL keys available.")).toBeInTheDocument();
  });
});
