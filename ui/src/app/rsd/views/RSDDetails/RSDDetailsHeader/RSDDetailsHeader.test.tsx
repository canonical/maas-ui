import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import RSDDetailsHeader from "./RSDDetailsHeader";

import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("RSDDetailsHeader", () => {
  let initialState: RootState;
  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
        items: [
          podFactory({
            composed_machines_count: 10,
            id: 1,
            name: "pod-1",
            type: "rsd",
          }),
        ],
      }),
    });
  });

  it("displays a spinner if pods are loading", () => {
    const state = { ...initialState };
    state.pod.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd/1", key: "testKey" }]}>
          <RSDDetailsHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays rsd name in header strip when loaded", () => {
    const state = { ...initialState };
    state.pod.items = [podFactory({ id: 1, name: "rsd-name", type: "rsd" })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd/1", key: "testKey" }]}>
          <Route exact path="/rsd/:id" component={() => <RSDDetailsHeader />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-title"]').text()).toBe(
      "rsd-name"
    );
  });

  it("can display composed machines count", () => {
    const state = { ...initialState };
    state.pod.items = [
      podFactory({ id: 1, composed_machines_count: 5, type: "rsd" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd/1", key: "testKey" }]}>
          <Route exact path="/rsd/:id" component={() => <RSDDetailsHeader />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "5 composed machines"
    );
    expect(
      wrapper.find("[data-test='section-header-tabs'] Link").at(0).props()[
        "aria-selected"
      ]
    ).toBe(true);
  });

  it("displays action dropdown at summary path", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd/1", key: "testKey" }]}>
          <Route exact path="/rsd/:id" component={() => <RSDDetailsHeader />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='action-dropdown']").exists()).toBe(true);
  });

  it("does not display action dropdown at non-summary paths", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/rsd/1/edit", key: "testKey" }]}
        >
          <Route
            exact
            path="/rsd/:id/edit"
            component={() => <RSDDetailsHeader />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='action-button']").exists()).toBe(false);
  });
});
