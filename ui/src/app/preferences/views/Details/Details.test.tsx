import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Details } from "./Details";

import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Details", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Details").exists()).toBe(true);
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    const actions = store.getActions();
    expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
    expect(actions.some((action) => action.type === "auth/cleanup")).toBe(true);
  });

  it("can update the user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("UserForm").props().onSave(
        {
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin",
        },
        {}
      )
    );
    expect(
      store.getActions().find(({ type }) => type === "user/update")
    ).toEqual({
      type: "user/update",
      payload: {
        params: {
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin",
        },
      },
      meta: {
        model: "user",
        method: "update",
      },
    });
  });

  it("can change the password", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("UserForm").props().onSave(
        {
          isSuperuser: true,
          email: "test@example.com",
          fullName: "Miss Wallaby",
          password: "test1234",
          passwordConfirm: "test1234",
          username: "admin",
        },
        {
          old_password: "test1",
          password: "test2",
          passwordConfirm: "test2",
        }
      )
    );
    const changePassword = store
      .getActions()
      .find((action) => action.type === "auth/changePassword");
    expect(changePassword).toEqual({
      type: "auth/changePassword",
      payload: {
        params: {
          old_password: "test1",
          new_password1: "test2",
          new_password2: "test2",
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
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("shows a message when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Details />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
  });
});
