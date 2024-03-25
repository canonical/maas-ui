import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom";

import { UserEdit } from "./UserEdit";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("UserEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      status: factory.statusState({
        externalAuthURL: null,
      }),
      user: factory.userState({
        loaded: true,
        items: [
          factory.user({
            email: "admin@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 0,
            username: "admin",
          }),
          factory.user({
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

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
      >
        <CompatRouter>
          <UserEdit />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles user not found", () => {
    state.user.items = [];
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/users/1", key: "testKey" }]}
      >
        <CompatRouter>
          <UserEdit />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("User not found")).toBeInTheDocument();
  });

  it("can display a user edit form", () => {
    renderWithMockStore(
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
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("form", { name: "Editing `admin`" })
    ).toBeInTheDocument();
  });
});
