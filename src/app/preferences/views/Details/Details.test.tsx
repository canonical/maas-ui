import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Details, Label as DetailsLabels } from "./Details";

import { Labels as UserFormLabels } from "app/base/components/UserForm/UserForm";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
  statusState as statusStateFactory,
} from "testing/factories";
import { screen, render, renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

describe("Details", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      status: statusStateFactory({
        externalAuthURL: null,
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({
            email: "test@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 0,
            username: "admin",
          }),
        }),
      }),
    });
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <Details />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByLabelText(DetailsLabels.Title));
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <Details />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    unmount();

    const actions = store.getActions();
    expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
    expect(actions.some((action) => action.type === "auth/cleanup")).toBe(true);
  });

  it("can update the user", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <Details />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const fullname = screen.getByRole("textbox", {
      name: UserFormLabels.FullName,
    });

    await userEvent.clear(fullname);

    await userEvent.type(fullname, "Miss Wallaby");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      store.getActions().find(({ type }) => type === "user/update")
    ).toEqual({
      type: "user/update",
      payload: {
        params: {
          id: 1,
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
    });
  });

  it("can change the password", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <Details />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: UserFormLabels.ChangePassword })
    );

    const old_password = screen.getByLabelText(UserFormLabels.CurrentPassword);
    const new_password1 = screen.getByLabelText(UserFormLabels.NewPassword);
    const new_password2 = screen.getByLabelText(
      UserFormLabels.NewPasswordAgain
    );

    await userEvent.type(old_password, "test1");
    await userEvent.type(new_password1, "test1234");
    await userEvent.type(new_password2, "test1234");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const changePassword = store
      .getActions()
      .find((action) => action.type === "auth/changePassword");
    expect(changePassword).toEqual({
      type: "auth/changePassword",
      payload: {
        params: {
          old_password: "test1",
          new_password1: "test1234",
          new_password2: "test1234",
        },
      },
      meta: {
        model: "user",
        method: "change_password",
      },
    });
  });

  it("adds a message when a user is updated", () => {
    state.user.saved = true;
    state.user.auth.saved = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <Details />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("shows a message when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <Details />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByText(
        "Users for this MAAS are managed using an external service"
      )
    );
  });
});
