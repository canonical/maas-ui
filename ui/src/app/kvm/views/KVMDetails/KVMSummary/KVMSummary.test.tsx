import React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMSummary from "./KVMSummary";

import * as hooks from "app/base/hooks";
import {
  config as configFactory,
  configState as configStateFactory,
  pod as podFactory,
  podNumaNode as podNumaNodeFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMSummary", () => {
  it("can view resources by NUMA node if pod includes data on at least one node", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, numa_pinning: [podNumaNodeFactory()] })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <KVMSummary />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("input[data-test='numa-switch']").exists()).toBe(true);
    expect(wrapper.find("PodAggregateResources").exists()).toBe(true);
    expect(wrapper.find("KVMNumaResources").exists()).toBe(false);

    act(() => {
      wrapper.find("input[data-test='numa-switch']").prop("onChange")({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    wrapper.update();

    expect(wrapper.find("PodAggregateResources").exists()).toBe(false);
    expect(wrapper.find("KVMNumaResources").exists()).toBe(true);
  });

  it("can send an analytics event when toggling NUMA node view if analytics enabled", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "enable_analytics",
            value: true,
          }),
        ],
      }),
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
      }),
    });

    const useSendMock = jest.spyOn(hooks, "useSendAnalytics");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <KVMSummary />} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("input[data-test='numa-switch']").prop("onChange")({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    wrapper.update();

    expect(useSendMock).toHaveBeenCalled();
    useSendMock.mockRestore();
  });

  it("can display the power address", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            power_address: "qemu+ssh://ubuntu@171.16.4.28/system",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <KVMSummary />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Code").exists()).toBe(true);
    expect(wrapper.find("Code input").prop("value")).toBe(
      "qemu+ssh://ubuntu@171.16.4.28/system"
    );
  });
});
