import { screen, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import UsersList from "./UsersList";

import type { RootState } from "app/store/root/types";
import type { User } from "app/store/user/types";
import {
  authState as authStateFactory,
  user as userFactory,
  userState as userStateFactory,
  rootState as rootStateFactory,
  statusState as statusStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

describe("UsersList", () => {
  let state: RootState;
  let users: User[];

  beforeEach(() => {
    users = [
      userFactory({
        email: "admin@example.com",
        global_permissions: ["machine_create"],
        id: 1,
        is_superuser: true,
        last_name: "Kangaroo",
        sshkeys_count: 0,
        username: "admin",
      }),
      userFactory({
        email: "user@example.com",
        global_permissions: ["machine_create"],
        id: 2,
        is_superuser: false,
        last_name: "Koala",
        sshkeys_count: 0,
        username: "user1",
      }),
    ];
    state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          user: users[0],
        }),
        loaded: true,
        items: users,
      }),
      status: statusStateFactory({ externalAuthURL: null }),
    });
  });

  it("can show a delete confirmation", async () => {
    const store = mockStore(state);
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <CompatRouter>
            <UsersList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let row = screen.getAllByTestId("user-row")[1];
    expect(row).not.toHaveClass("is-active");

    // Click on the delete button:
    await userEvent.click(within(row).getByTestId("table-actions-delete"));

    rerender(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <CompatRouter>
            <UsersList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    row = screen.getAllByTestId("user-row")[1];
    expect(row).toHaveClass("is-active");
  });

  it("can delete a user", async () => {
    const store = mockStore(state);
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <CompatRouter>
            <UsersList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let row = screen.getAllByTestId("user-row")[1];

    // Click on the delete button:
    await userEvent.click(within(row).getByTestId("table-actions-delete"));

    rerender(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <CompatRouter>
            <UsersList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    row = screen.getAllByTestId("user-row")[1];

    // Click on the delete confirm button
    await userEvent.click(within(row).getByTestId("action-confirm"));

    expect(store.getActions()[1]).toEqual({
      type: "user/delete",
      payload: {
        params: {
          id: 2,
        },
      },
      meta: {
        model: "user",
        method: "delete",
      },
    });
  });

  it("disables delete for the current user", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
      >
        <CompatRouter>
          <UsersList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    let row = screen.getAllByTestId("user-row")[0];
    expect(within(row).getByTestId("table-actions-delete")).toBeDisabled();
  });

  it("links to preferences for the current user", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
      >
        <CompatRouter>
          <UsersList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    let row = screen.getAllByTestId("user-row")[0];
    expect(within(row).getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/account/prefs/details"
    );
  });

  it("can add a message when a user is deleted", () => {
    state.user.saved = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <CompatRouter>
            <UsersList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("can filter users", async () => {
    const store = mockStore(state);
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <CompatRouter>
            <UsersList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let rows = screen.getAllByTestId("user-row");
    expect(rows.length).toBe(2);

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Search users" }),
      "admin"
    );

    rerender(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <CompatRouter>
            <UsersList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    rows = screen.getAllByTestId("user-row");
    expect(rows.length).toBe(1);
  });

  it("can toggle username and real name", async () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
      >
        <CompatRouter>
          <UsersList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      within(screen.getAllByTestId("user-row")[0]).getByText("admin")
    ).toBeInTheDocument();
    // Click on the header toggle.
    await userEvent.click(screen.getByRole("button", { name: "Real name" }));
    expect(
      within(screen.getAllByTestId("user-row")[0]).getByText("Kangaroo")
    ).toBeInTheDocument();
  });

  it("shows a message when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
      >
        <CompatRouter>
          <UsersList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByText(
        "Users for this MAAS are managed using an external service"
      )
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
