import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
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

  it("can show a delete confirmation", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("[data-test='user-row']").at(2);
    expect(row.hasClass("is-active")).toBe(false);
    // Click on the delete button:
    wrapper
      .find("[data-test='user-row']")
      .at(2)
      .find("Button[data-test='table-actions-delete']")
      .simulate("click");
    wrapper.update();
    row = wrapper.find("[data-test='user-row']").at(2);
    expect(row.hasClass("is-active")).toBe(true);
  });

  it("can delete a user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper.find("TableRow").at(2).find("Button").at(1).simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("TableRow")
      .at(2)
      .find("ActionButton[data-test='action-confirm']")
      .simulate("click");
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("tbody TableRow").at(0).find("Button").at(1).prop("disabled")
    ).toBe(true);
  });

  it("links to preferences for the current user", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("tbody TableRow").at(0).find("Button").at(0).prop("to")
    ).toBe("/account/prefs/details");
  });

  it("can add a message when a user is deleted", () => {
    state.user.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("can filter users", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    let rows = wrapper.find("TableRow[data-test='user-row']");
    expect(rows.length).toBe(2);
    act(() => {
      wrapper.find("SearchBox input").simulate("change", {
        target: { name: "search", value: "admin" },
      });
    });
    wrapper.update();
    rows = wrapper.find("TableRow[data-test='user-row']");
    expect(rows.length).toBe(1);
  });

  it("can toggle username and real name", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("TableRow").at(1).find("TableCell").at(0).text()
    ).toEqual("admin");
    // Click on the header toggle.
    wrapper
      .find('[data-test="real-name-header"]')
      .find("button")
      .simulate("click");
    expect(
      wrapper.find("TableRow").at(1).find("TableCell").at(0).text()
    ).toEqual("Kangaroo");
  });

  it("shows a message when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users", key: "testKey" }]}
        >
          <UsersList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(true);
    expect(wrapper.find("MainTable").exists()).toBe(false);
  });
});
