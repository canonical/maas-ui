import * as React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMListHeader from "./KVMListHeader";

import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMListHeader", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
        items: [podFactory({ id: 1 }), podFactory({ id: 2 })],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loader if pods have not loaded", () => {
    const state = { ...initialState };
    state.pod.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a pod count if pods have loaded", () => {
    const state = { ...initialState };
    state.pod.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "2 VM hosts available"
    );
  });

  it("can display partial selection count", () => {
    const state = { ...initialState };
    state.pod.loaded = true;
    state.pod.selected = [1];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "1 of 2 VM hosts selected"
    );
  });

  it("can display all selected message", () => {
    const state = { ...initialState };
    state.pod.loaded = true;
    state.pod.selected = [1, 2];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "All VM hosts selected"
    );
  });

  it("disables 'Add KVM' button if at least one KVM is selected", () => {
    const state = { ...initialState };
    state.pod.selected = [1];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('Button[data-test="add-kvm"]').prop("disabled")).toBe(
      true
    );
  });

  it("clears action form if no KVMs are selected", () => {
    const state = { ...initialState };
    state.pod.selected = [];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find('[data-test="action-menu"] button').prop("disabled")
    ).toBe(true);
  });
});
