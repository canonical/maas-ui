import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { sendAnalyticsEvent } from "analytics";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import KVMNumaResources, { TRUNCATION_POINT } from "./KVMNumaResources";
import { fakeNumas } from "../KVMSummary";

jest.mock("analytics", () => ({
  sendAnalyticsEvent: jest.fn(),
}));

const mockStore = configureStore();

describe("KVMNumaResources", () => {
  it("can expand truncated NUMA nodes if above truncation point", () => {
    const numaNodes = [
      ...fakeNumas,
      { ...fakeNumas[0], index: 3 },
      { ...fakeNumas[1], index: 4 },
    ];
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMNumaResources numaNodes={numaNodes} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Button[data-test='show-more-numas']").exists()).toBe(
      true
    );
    expect(wrapper.find("KVMResourcesCard").length).toBe(TRUNCATION_POINT);

    act(() => {
      wrapper.find("Button[data-test='show-more-numas']").simulate("click");
    });
    wrapper.update();

    expect(
      wrapper.find("Button[data-test='show-more-numas'] span").text()
    ).toBe("Show less NUMA nodes");
    expect(wrapper.find("KVMResourcesCard").length).toBe(numaNodes.length);
  });

  it("shows wide cards if the pod has less than or equal to 2 NUMA nodes", () => {
    const numaNodes = [fakeNumas[0]];
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMNumaResources numaNodes={numaNodes} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(".numa-resources-grid.is-wide").exists()).toBe(true);
    expect(wrapper.find("KVMResourcesCard").length).toBe(1);
    expect(
      wrapper
        .find("KVMResourcesCard")
        .prop("className")
        .includes("kvm-resources-card--wide")
    ).toBe(true);
  });

  it("can send an analytics event when expanding NUMA nodes if analytics enabled", () => {
    const numaNodes = [
      ...fakeNumas,
      { ...fakeNumas[0], index: 3 },
      { ...fakeNumas[1], index: 4 },
    ];
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "enable_analytics",
            value: true,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMNumaResources numaNodes={numaNodes} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("Button[data-test='show-more-numas']").simulate("click");
    });
    wrapper.update();

    expect(sendAnalyticsEvent).toHaveBeenCalled();
  });
});
