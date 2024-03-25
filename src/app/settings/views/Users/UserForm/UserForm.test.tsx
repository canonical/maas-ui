import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { UserForm, Labels as UserFormLabels } from "./UserForm";

import { Labels as BaseUserFormLabels } from "@/app/base/components/UserForm/UserForm";
import settingsURLs from "@/app/settings/urls";
import type { RootState } from "@/app/store/root/types";
import type { User } from "@/app/store/user/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithMockStore,
} from "@/testing/utils";

const mockStore = configureStore();

describe("UserForm", () => {
  let state: RootState;
  let user: User;

  beforeEach(() => {
    state = factory.rootState({
      status: factory.statusState({
        externalAuthURL: null,
      }),
    });
    user = factory.user();
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

    await userEvent.clear(
      screen.getByRole("textbox", { name: BaseUserFormLabels.Username })
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: BaseUserFormLabels.FullName })
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: BaseUserFormLabels.Email })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: BaseUserFormLabels.Username }),
      "admin"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: BaseUserFormLabels.FullName }),
      "Miss Wallaby"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: BaseUserFormLabels.Email }),
      "test@example.com"
    );

    await userEvent.click(
      screen.getByRole("button", { name: UserFormLabels.Save })
    );

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
      screen.getByRole("button", { name: BaseUserFormLabels.ChangePassword })
    );

    await userEvent.type(
      screen.getByText(BaseUserFormLabels.Password),
      "test1234"
    );

    await userEvent.type(
      screen.getByText(BaseUserFormLabels.PasswordAgain),
      "test1234"
    );

    await userEvent.click(
      screen.getByRole("button", { name: UserFormLabels.Save })
    );

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
      screen.getByRole("textbox", { name: BaseUserFormLabels.Username }),
      "admin"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: BaseUserFormLabels.FullName }),
      "Miss Wallaby"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: BaseUserFormLabels.Email }),
      "test@example.com"
    );

    await userEvent.type(
      screen.getByText(BaseUserFormLabels.Password),
      "test1234"
    );

    await userEvent.type(
      screen.getByText(BaseUserFormLabels.PasswordAgain),
      "test1234"
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: BaseUserFormLabels.MaasAdmin })
    );

    await userEvent.click(
      screen.getByRole("button", { name: UserFormLabels.Save })
    );

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
      screen.getByRole("checkbox", { name: BaseUserFormLabels.MaasAdmin })
    ).toBeInTheDocument();
  });
});
