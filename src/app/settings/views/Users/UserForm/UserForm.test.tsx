import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { UserForm } from "./UserForm";

import settingsURLs from "app/settings/urls";
import type { RootState } from "app/store/root/types";
import type { User } from "app/store/user/types";
import {
  user as userFactory,
  rootState as rootStateFactory,
  statusState as statusStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

describe("UserForm", () => {
  let state: RootState;
  let user: User;

  beforeEach(() => {
    state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: null,
      }),
    });
    user = userFactory();
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <UserForm user={user} />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("form", { name: "Editing `user1`" })
    ).toBeInTheDocument();
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);

    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <UserForm user={user} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    unmount();

    expect(store.getActions()).toEqual([
      {
        type: "user/cleanup",
      },
    ]);
  });

  it("redirects when the user is saved", () => {
    state.user.saved = true;
    const history = createMemoryHistory({
      initialEntries: ["/"],
    });

    renderWithMockStore(
      <Router history={history}>
        <CompatRouter>
          <UserForm user={user} />
        </CompatRouter>
      </Router>,
      { state }
    );
    expect(history.location.pathname).toBe(settingsURLs.users.index);
  });

  it("can update a user", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <UserForm user={user} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.clear(screen.getByRole("textbox", { name: "Username" }));
    await userEvent.clear(
      screen.getByRole("textbox", { name: "Full name (optional)" })
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: "Email address" })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Username" }),
      "admin"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Full name (optional)" }),
      "Miss Wallaby"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "test@example.com"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save user" }));

    expect(store.getActions()).toEqual([
      {
        type: "user/update",
        payload: {
          params: {
            id: user.id,
            is_superuser: true,
            email: "test@example.com",
            last_name: "Miss Wallaby",
            username: "admin",
          },
        },
        meta: {
          model: "user",
          method: "update",
        },
      },
    ]);
  });

  it("can change a user's password", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <UserForm user={user} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Change password…" })
    );

    await userEvent.type(screen.getByText("Password"), "test1234");

    await userEvent.type(screen.getByText("Password (again)"), "test1234");

    await userEvent.click(screen.getByRole("button", { name: "Save user" }));

    expect(store.getActions()).toEqual([
      {
        type: "user/update",
        payload: {
          params: {
            id: user.id,
            is_superuser: true,
            email: "email5@example.com",
            last_name: "Full Name jr.",
            username: "user5",
          },
        },
        meta: {
          model: "user",
          method: "update",
        },
      },
      {
        type: "auth/adminChangePassword",
        payload: {
          params: {
            id: user.id,
            email: "email5@example.com",
            last_name: "Full Name jr.",
            is_superuser: true,
            password1: "test1234",
            password2: "test1234",
            username: "user5",
          },
        },
        meta: {
          method: "admin_change_password",
          model: "user",
        },
      },
    ]);
  });

  it("can create a user", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <UserForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Username" }),
      "admin"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Full name (optional)" }),
      "Miss Wallaby"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "test@example.com"
    );

    await userEvent.type(screen.getByText("Password"), "test1234");

    await userEvent.type(screen.getByText("Password (again)"), "test1234");

    await userEvent.click(
      screen.getByRole("checkbox", { name: "MAAS administrator" })
    );

    await userEvent.click(screen.getByRole("button", { name: "Save user" }));

    expect(store.getActions()).toEqual([
      {
        type: "user/create",
        payload: {
          params: {
            is_superuser: true,
            email: "test@example.com",
            last_name: "Miss Wallaby",
            password1: "test1234",
            password2: "test1234",
            username: "admin",
          },
        },
        meta: {
          model: "user",
          method: "create",
        },
      },
    ]);
  });

  it("adds a message when a user is added", () => {
    state.user.saved = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <UserForm user={user} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();

    expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("displays a checkbox for making the user a MAAS admin", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <UserForm user={user} />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("checkbox", { name: "MAAS administrator" })
    ).toBeInTheDocument();
  });
});
