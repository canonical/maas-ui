import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { UserForm } from "./UserForm";

import BaseUserForm from "app/base/components/UserForm";
import type { RootState } from "app/store/root/types";
import type { User } from "app/store/user/types";
import {
  user as userFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("UserForm", () => {
  let state: RootState;
  let user: User;

  beforeEach(() => {
    state = rootStateFactory();
    user = userFactory();
  });

  it("can render", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm user={user} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("UserForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm user={user} />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.unmount();
    });

    expect(store.getActions()).toEqual([
      {
        type: "user/cleanup",
      },
    ]);
  });

  it("redirects when the user is saved", () => {
    state.user.saved = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm user={user} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can update a user", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm user={user} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find(BaseUserForm).invoke("onSave")({
      isSuperuser: true,
      email: "test@example.com",
      fullName: "Miss Wallaby",
      username: "admin",
    });

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

  it("can change a user's password", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm user={user} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find(BaseUserForm).invoke("onSave")({
      isSuperuser: true,
      email: "test@example.com",
      fullName: "Miss Wallaby",
      password: "test1234",
      passwordConfirm: "test1234",
      username: "admin",
    });

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
      {
        type: "auth/adminChangePassword",
        payload: {
          params: {
            id: user.id,
            email: "test@example.com",
            last_name: "Miss Wallaby",
            is_superuser: true,
            password1: "test1234",
            password2: "test1234",
            username: "admin",
          },
        },
        meta: {
          method: "admin_change_password",
          model: "user",
        },
      },
    ]);
  });

  it("can create a user", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find(BaseUserForm).invoke("onSave")({
      isSuperuser: true,
      email: "test@example.com",
      fullName: "Miss Wallaby",
      password: "test1234",
      passwordConfirm: "test1234",
      username: "admin",
    });

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

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm user={user} />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();

    expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("displays a checkbox for making the user a MAAS admin", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <UserForm user={user} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("FormikField[label='MAAS administrator']").exists()
    ).toBe(true);
  });
});
