import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import KVMList from "./KVMList";

const mockStore = configureStore();

describe("KVMList", () => {
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
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays links to details pages", () => {
    const state = { ...initialState };
    state.pod.items = [{ id: 1 }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("table tbody tr").at(0).find("td:first-child Link").props()
        .to
    ).toBe("/kvm/1");
  });
});
