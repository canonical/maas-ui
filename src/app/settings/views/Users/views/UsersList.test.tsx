import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import UsersList from "./UsersList";

import type { UserWithSummaryResponse } from "@/app/apiclient";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  within,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("UsersList", () => {
  let state: RootState;
  let users: UserWithSummaryResponse[];

  beforeEach(() => {
    users = [
      factory.user({
        email: "admin@example.com",
        id: 1,
        is_superuser: true,
        last_name: "Kangaroo",
        sshkeys_count: 0,
        username: "admin",
      }),
      factory.user({
        email: "user@example.com",
        id: 2,
        is_superuser: false,
        last_name: "Koala",
        sshkeys_count: 0,
        username: "user1",
      }),
    ];
    state = factory.rootState({
      status: factory.statusState({ externalAuthURL: null }),
    });
  });

  it("disables delete for the current user", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
      >
        <UsersList />
      </MemoryRouter>,
      { state }
    );
    const row = screen.getAllByTestId("user-row")[0];
    expect(
      within(row).getByRole("link", { name: /delete/i })
    ).toBeAriaDisabled();
  });

  it("links to preferences for the current user", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
      >
        <UsersList />
      </MemoryRouter>,
      { state }
    );
    const row = screen.getAllByTestId("user-row")[0];
    expect(within(row).getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/account/prefs/details"
    );
  });

  it("can filter users", async () => {
    const store = mockStore(state);
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    let rows = screen.getAllByTestId("user-row");
    expect(rows.length).toBe(2);

    await userEvent.type(
      screen.getAllByPlaceholderText("Search users")[0],
      "admin"
    );

    rerender(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
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
        <UsersList />
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
        <UsersList />
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

  it("displays a message when there are no users", () => {
    state.user.items = [];

    renderWithBrowserRouter(<UsersList />, { state, route: "/settings/users" });

    expect(screen.getByText("No users available.")).toBeInTheDocument();
  });
});
