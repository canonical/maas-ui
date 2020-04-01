import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { DhcpForm } from "./DhcpForm";

const mockStore = configureStore();

describe("DhcpForm", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      controller: { items: [] },
      device: { items: [] },
      dhcpsnippet: {
        errors: {},
        items: [
          {
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10",
          },
          {
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39",
          },
        ],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      },
      machine: { items: [] },
      subnet: { items: [] },
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DhcpForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(
      store.getActions().some((action) => action.type === "CLEANUP_DHCPSNIPPET")
    ).toBe(true);
  });

  it("redirects when the snippet is saved", () => {
    state.dhcpsnippet.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can update a snippet", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm dhcpSnippet={state.dhcpsnippet.items[0]} />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        name: "new-lease",
        id: 1,
      })
    );
    expect(
      store.getActions().find((action) => action.type === "UPDATE_DHCPSNIPPET")
    ).toStrictEqual({
      type: "UPDATE_DHCPSNIPPET",
      payload: {
        params: {
          description: undefined,
          enabled: undefined,
          id: 1,
          name: "new-lease",
          value: undefined,
        },
      },
      meta: {
        model: "dhcpsnippet",
        method: "update",
      },
    });
  });

  it("can create a snippet", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        name: "new-lease",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "CREATE_DHCPSNIPPET")
    ).toStrictEqual({
      type: "CREATE_DHCPSNIPPET",
      payload: {
        params: {
          description: undefined,
          enabled: undefined,
          value: undefined,
          name: "new-lease",
        },
      },
      meta: {
        model: "dhcpsnippet",
        method: "create",
      },
    });
  });

  it("adds a message when a snippet is added", () => {
    state.dhcpsnippet.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "CLEANUP_DHCPSNIPPET")
    ).toBe(true);
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });

  it("fetches models when editing", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm dhcpSnippet={state.dhcpsnippet.items[0]} />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "FETCH_MACHINE")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "FETCH_DEVICE")).toBe(true);
    expect(actions.some((action) => action.type === "FETCH_SUBNET")).toBe(true);
    expect(actions.some((action) => action.type === "FETCH_CONTROLLER")).toBe(
      true
    );
  });

  it("shows a spinner when loading models", () => {
    state.subnet.loading = true;
    state.device.loading = true;
    state.controller.loading = true;
    state.machine.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm
            dhcpSnippet={{
              created: "Thu, 15 Aug. 2019 06:21:39",
              id: 1,
              name: "lease",
              updated: "Thu, 15 Aug. 2019 06:21:39",
              node: "xyz",
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
    expect(wrapper.find("FormCard").exists()).toBe(false);
  });

  it("shows the snippet name in the title when editing", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <DhcpForm dhcpSnippet={state.dhcpsnippet.items[0]} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".form-card__title").text()).toEqual("Editing `lease`");
  });
});
