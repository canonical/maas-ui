import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import KVMListHeader from "./KVMListHeader";

const mockStore = configureStore();

describe("KVMListHeader", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        loaded: true,
        loading: false,
        items: [{ id: 1 }, { id: 2 }],
        selected: [],
      },
    };
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
    expect(wrapper.find('[data-test="pod-count"]').text()).toBe(
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
    expect(wrapper.find('[data-test="pod-count"]').text()).toBe(
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
    expect(wrapper.find('[data-test="pod-count"]').text()).toBe(
      "All VM hosts selected"
    );
  });
});
