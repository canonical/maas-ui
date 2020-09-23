import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  pod as podFactory,
  podState as podStateFactory,
} from "testing/factories";
import PodConfiguration from "../PodConfiguration";

const mockStore = configureStore();

describe("PodConfigurationFields", () => {
  let initialState;

  beforeEach(() => {
    const podState = podStateFactory({ items: [], loaded: true });
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

  it("correctly sets initial values for virsh pods", () => {
    const state = { ...initialState };
    const pod = podFactory({ id: 1, type: "virsh", power_pass: "maxpower" });
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <Route
            exact
            path="/kvm/:id/edit"
            component={() => <PodConfiguration />}
          />
          <PodConfiguration />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input[name='type']").props().value).toBe("Virsh");
    expect(wrapper.find("Select[name='zone']").props().value).toEqual(
      pod.zone.toString()
    );
    expect(wrapper.find("Select[name='pool']").props().value).toEqual(
      pod.pool.toString()
    );
    expect(wrapper.find("TagSelector[name='tags']").props().value).toEqual(
      pod.tags
    );
    expect(wrapper.find("Input[name='power_address']").props().value).toBe(
      pod.power_address
    );
    expect(wrapper.find("Input[name='password']").props().value).toBe(
      pod.power_pass
    );
    expect(
      wrapper.find("Slider[name='cpu_over_commit_ratio']").props().value
    ).toBe(pod.cpu_over_commit_ratio);
    expect(
      wrapper.find("Slider[name='memory_over_commit_ratio']").props().value
    ).toBe(pod.memory_over_commit_ratio);
  });

  it("correctly sets initial values for lxd pods", () => {
    const state = { ...initialState };
    const pod = podFactory({ id: 1, type: "lxd", password: "powerranger" });
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <Route
            exact
            path="/kvm/:id/edit"
            component={() => <PodConfiguration />}
          />
          <PodConfiguration />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input[name='type']").props().value).toBe("LXD");
    expect(wrapper.find("Select[name='zone']").props().value).toEqual(
      pod.zone.toString()
    );
    expect(wrapper.find("Select[name='pool']").props().value).toEqual(
      pod.pool.toString()
    );
    expect(wrapper.find("TagSelector[name='tags']").props().value).toEqual(
      pod.tags
    );
    expect(wrapper.find("Input[name='power_address']").props().value).toBe(
      pod.power_address
    );
    expect(wrapper.find("Input[name='password']").props().value).toBe(
      pod.password
    );
    expect(
      wrapper.find("Slider[name='cpu_over_commit_ratio']").props().value
    ).toBe(pod.cpu_over_commit_ratio);
    expect(
      wrapper.find("Slider[name='memory_over_commit_ratio']").props().value
    ).toBe(pod.memory_over_commit_ratio);
  });
});
