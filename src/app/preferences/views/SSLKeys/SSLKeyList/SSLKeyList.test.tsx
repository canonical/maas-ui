import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SSLKeyList, { Label as SSLKeyListLabels } from "./SSLKeyList";

import type { RootState } from "app/store/root/types";
import {
  sslKey as sslKeyFactory,
  sslKeyState as sslKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, render, within, renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

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

  it("can show a delete confirmation", async () => {
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
    let row = screen.getByRole("row", { name: "ssh-rsa aabb" });
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));
    row = screen.getByRole("row", { name: "ssh-rsa aabb" });
    expect(row).toHaveClass("is-active");
  });

  it("can delete a SSL key", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let row = screen.getByRole("row", { name: "ssh-rsa aabb" });

    // Click on the delete button:
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));

    // Click on the delete confirm button
    await userEvent.click(
      within(
        within(row).getByLabelText(SSLKeyListLabels.DeleteConfirm)
      ).getByRole("button", {
        name: "Delete",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "sslkey/delete")
    ).toEqual({
      type: "sslkey/delete",
      payload: {
        params: {
          id: 1,
        },
      },
      meta: {
        model: "sslkey",
        method: "delete",
      },
    });
  });

  it("can add a message when a SSL key is deleted", async () => {
    state.sslkey.saved = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let row = screen.getByRole("row", { name: "ssh-rsa aabb" });

    // Click on the delete button:
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));

    // Click on the delete confirm button
    await userEvent.click(
      within(
        within(row).getByLabelText(SSLKeyListLabels.DeleteConfirm)
      ).getByRole("button", {
        name: "Delete",
      })
    );

    const actions = store.getActions();
    expect(actions.some((action) => action.type === "sslkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
