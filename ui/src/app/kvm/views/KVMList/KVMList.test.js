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
        items: [
          {
            cpu_over_commit_ratio: 1,
            id: 1,
            memory_over_commit_ratio: 1,
            name: "pod-1",
            total: {
              memory: 8192,
              cores: 8,
              local_storage: 1000000000000,
            },
            used: {
              memory: 2048,
              cores: 4,
              local_storage: 100000000000,
            },
          },
        ],
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

  it("displays available cores", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Meter").at(0).find(".p-meter__labels").text()).toBe(
      "4 cores free"
    );
  });

  it("displays available memory", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Meter").at(1).find(".p-meter__labels").text()).toBe(
      "6 GiB free"
    );
  });

  it("displays available storage", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Meter").at(2).find(".p-meter__labels").text()).toBe(
      "900 GB free"
    );
  });
});
