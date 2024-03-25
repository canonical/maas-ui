import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import SSLKeyList, { Label as SSLKeyListLabels } from "./SSLKeyList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

describe("SSLKeyList", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      sslkey: factory.sslKeyState({
        loading: false,
        loaded: true,
        items: [
          factory.sslKey({
            id: 1,
            key: "ssh-rsa aabb",
          }),
          factory.sslKey({
            id: 2,
            key: "ssh-rsa ccdd",
          }),
          factory.sslKey({
            id: 3,
            key: "ssh-rsa eeff",
          }),
          factory.sslKey({
            id: 4,
            key: "ssh-rsa gghh",
          }),
          factory.sslKey({ id: 5, key: "ssh-rsa gghh" }),
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
