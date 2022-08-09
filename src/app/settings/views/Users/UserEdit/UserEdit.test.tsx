import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { UserEdit } from "./UserEdit";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  statusState as statusStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("UserEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: null,
      }),
      user: userStateFactory({
        loaded: true,
        items: [
          userFactory({
            email: "admin@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 0,
            username: "admin",
          }),
          userFactory({
            email: "user@example.com",
            global_permissions: ["machine_create"],
            id: 2,
            is_superuser: false,
            last_name: "",
            sshkeys_count: 0,
            username: "user1",
          }),
        ],
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.user.loading = true;
    state.user.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <CompatRouter>
            <UserEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles user not found", () => {
    state.user.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
        >
          <CompatRouter>
            <UserEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("User not found")).toBeInTheDocument();
  });

  it("can display a user edit form", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/users/1/edit", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route element={<UserEdit />} path="/settings/users/:id/edit" />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("form", { name: "Editing `admin`" })
    ).toBeInTheDocument();
  });
});
