import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  pod as podFactory,
  podState as podStateFactory,
} from "testing/factories";

import KVMConfiguration from "./KVMConfiguration";

const mockStore = configureStore();

describe("KVMConfiguration", () => {
  let initialState;

  beforeEach(() => {
    const pods = [podFactory({ id: 1, name: "pod1" })];
    const podState = podStateFactory({ items: pods, loaded: true });
    initialState = {
      config: {
        items: [],
      },
      pod: podState,
      resourcepool: {
        items: [],
        loaded: true,
      },
      tag: {
        items: [],
        loaded: true,
      },
      zone: {
        items: [],
        loaded: true,
      },
    };
  });

  it("fetches the necessary data on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <KVMConfiguration />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "pod/fetch",
      "FETCH_RESOURCEPOOL",
      "FETCH_TAG",
      "FETCH_ZONE",
    ];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.pod.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <KVMConfiguration />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("can handle updating a lxd KVM", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <Route
            exact
            path="/kvm/:id/edit"
            component={() => <KVMConfiguration />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          cpu_over_commit_ratio: 2,
          memory_over_commit_ratio: 2,
          password: "password",
          pool: "1",
          power_address: "192.168.1.1",
          tags: ["tag1", "tag2"],
          type: "lxd",
          zone: "2",
        })
    );
    expect(
      store.getActions().find((action) => action.type === "pod/update")
    ).toStrictEqual({
      type: "pod/update",
      meta: {
        method: "update",
        model: "pod",
      },
      payload: {
        params: {
          cpu_over_commit_ratio: 2,
          id: 1,
          memory_over_commit_ratio: 2,
          password: "password", // lxd uses password key
          pool: "1",
          power_address: "192.168.1.1",
          power_pass: undefined,
          tags: "tag1,tag2",
          zone: "2",
        },
      },
    });
  });

  it("can handle updating a virsh KVM", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <Route
            exact
            path="/kvm/:id/edit"
            component={() => <KVMConfiguration />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          cpu_over_commit_ratio: 2,
          memory_over_commit_ratio: 2,
          password: "password",
          pool: "1",
          power_address: "192.168.1.1",
          tags: ["tag1", "tag2"],
          type: "virsh",
          zone: "2",
        })
    );
    expect(
      store.getActions().find((action) => action.type === "pod/update")
    ).toStrictEqual({
      type: "pod/update",
      meta: {
        method: "update",
        model: "pod",
      },
      payload: {
        params: {
          cpu_over_commit_ratio: 2,
          id: 1,
          memory_over_commit_ratio: 2,
          password: undefined,
          pool: "1",
          power_address: "192.168.1.1",
          power_pass: "password", // virsh uses power_pass key
          tags: "tag1,tag2",
          zone: "2",
        },
      },
    });
  });
});
