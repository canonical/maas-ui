import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import KVMActionFormWrapper from "./KVMActionFormWrapper";

const mockStore = configureStore();

describe("KVMActionFormWrapper", () => {
  let initialState = rootStateFactory();

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({ id: 1, name: "pod-1", type: "lxd" }),
          podFactory({ id: 2, name: "pod-2", type: "virsh" }),
        ],
        statuses: {
          1: podStatusFactory(),
          2: podStatusFactory(),
        },
      }),
    });
  });

  it("does not render if selectedAction is not defined", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            selectedAction=""
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='kvm-action-form-wrapper']").exists()).toBe(
      false
    );
  });

  it("renders ComposeForm if compose action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            selectedAction="compose"
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ComposeForm").exists()).toBe(true);
  });

  it("renders DeleteForm if delete action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            selectedAction="delete"
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeleteForm").exists()).toBe(true);
  });

  it("renders RefreshForm if refresh action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMActionFormWrapper
            selectedAction="refresh"
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("RefreshForm").exists()).toBe(true);
  });
});
