import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SSLKeyList from "./SSLKeyList";

const mockStore = configureStore();

describe("SSLKeyList", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      sslkey: {
        loading: false,
        loaded: true,
        items: [
          {
            id: 1,
            key: "ssh-rsa aabb",
            keysource: { protocol: "lp", auth_id: "koalaparty" },
          },
          {
            id: 2,
            key: "ssh-rsa ccdd",
            keysource: { protocol: "gh", auth_id: "koalaparty" },
          },
          {
            id: 3,
            key: "ssh-rsa eeff",
            keysource: { protocol: "lp", auth_id: "maaate" },
          },
          {
            id: 4,
            key: "ssh-rsa gghh",
            keysource: { protocol: "gh", auth_id: "koalaparty" },
          },
          { id: 5, key: "ssh-rsa gghh" },
        ],
      },
    };
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
          <SSLKeyList />
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
          <SSLKeyList />
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
          <SSLKeyList />
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
          <SSLKeyList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(false);
    // Click on the delete button:
    wrapper
      .find("tbody TableRow")
      .at(0)
      .findWhere((n) => n.name() === "Button" && n.text() === "Delete")
      .simulate("click");
    row = wrapper.find("MainTable").prop("rows")[0];
    expect(row.expanded).toBe(true);
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
          <SSLKeyList />
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
          <SSLKeyList />
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
