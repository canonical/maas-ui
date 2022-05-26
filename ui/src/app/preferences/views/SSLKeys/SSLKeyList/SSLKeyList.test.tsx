import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SSLKeyList from "./SSLKeyList";

import type { RootState } from "app/store/root/types";
import {
  sslKey as sslKeyFactory,
  sslKeyState as sslKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SSLKeyList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      sslkey: sslKeyStateFactory({
        loading: false,
        loaded: true,
        items: [
          sslKeyFactory({
            id: 1,
            key: "ssh-rsa aabb",
          }),
          sslKeyFactory({
            id: 2,
            key: "ssh-rsa ccdd",
          }),
          sslKeyFactory({
            id: 3,
            key: "ssh-rsa eeff",
          }),
          sslKeyFactory({
            id: 4,
            key: "ssh-rsa gghh",
          }),
          sslKeyFactory({ id: 5, key: "ssh-rsa gghh" }),
        ],
      }),
    });
  });

  it("displays a loading component if machines are loading", () => {
    state.sslkey.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can display errors", () => {
    state.sslkey.errors = "Unable to list SSL keys.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").text()).toEqual(
      "Error:Unable to list SSL keys."
    );
  });

  it("can render the table", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("can show a delete confirmation", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("[data-testid='sslkey-row']").at(0);
    expect(row.hasClass("is-active")).toBe(false);
    // Click on the delete button:
    row.find("Button[data-testid='table-actions-delete']").simulate("click");
    row = wrapper.find("[data-testid='sslkey-row']").at(0);
    expect(row.hasClass("is-active")).toBe(true);
  });

  it("can delete a SSL key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper
      .find("tbody TableRow")
      .at(0)
      .findWhere((n) => n.name() === "Button" && n.text() === "Delete")
      .simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("tbody TableRow")
      .at(0)
      .find("ActionButton[data-testid='action-confirm']")
      .simulate("click");
    expect(
      store.getActions().find((action) => action.type === "sslkey/delete")
    ).toEqual({
      type: "sslkey/delete",
      payload: {
        params: {
          id: 1,
        },
      },
      meta: {
        model: "sslkey",
        method: "delete",
      },
    });
  });

  it("can add a message when a SSL key is deleted", () => {
    state.sslkey.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/ssl-keys", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <SSLKeyList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper
      .find("tbody TableRow")
      .at(0)
      .findWhere((n) => n.name() === "Button" && n.text() === "Delete")
      .simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("tbody TableRow")
      .at(0)
      .findWhere((n) => n.name() === "Button" && n.text() === "Delete")
      .last()
      .simulate("click");
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "sslkey/cleanup")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
