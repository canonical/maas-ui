import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import KVMActionFormWrapper from "./KVMActionFormWrapper";

const mockStore = configureStore();

describe("KVMActionFormWrapper", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          { id: 1, name: "pod-1", type: "lxd" },
          { id: 2, name: "pod-2", type: "virsh" },
        ],
        selected: [],
        errors: {},
        statuses: {
          1: {
            deleting: false,
            refreshing: false,
          },
          2: {
            deleting: false,
            refreshing: false,
          },
        },
      },
    };
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
