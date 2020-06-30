import React from "react";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import KVMDetails from "./KVMDetails";

const mockStore = configureStore();

describe("KVMDetails", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [],
      },
      messages: {
        items: [],
      },
      notification: {
        items: [],
      },
      pod: {
        errors: {},
        loading: false,
        loaded: true,
        items: [],
      },
    };
  });

  it("displays a spinner if pods are loading", () => {
    const state = { ...initialState };
    state.pod.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMDetails />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays pod name in header strip when loaded", () => {
    const state = { ...initialState };
    state.pod.items = [{ id: 1, name: "pod-name" }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={(props) => <KVMDetails {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-title"]').text()).toBe(
      "pod-name"
    );
  });

  it("can display composed machines count", () => {
    const state = { ...initialState };
    state.pod.items = [{ id: 1, composed_machines_count: 5 }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={(props) => <KVMDetails {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='section-header-tabs'] Link").at(0).text()
    ).toBe("5 composed machines");
    expect(
      wrapper.find("[data-test='section-header-tabs'] Link").at(0).props()[
        "aria-selected"
      ]
    ).toBe(true);
  });
});
