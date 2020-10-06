import React from "react";
import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import * as hooks from "app/base/hooks";
import {
  config as configFactory,
  configState as configStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  podStoragePool as podStoragePoolFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import PodStorage, { TRUNCATION_POINT } from "./PodStorage";

const mockStore = configureStore();

describe("PodStorage", () => {
  it("sorts pools by id, with default first", () => {
    const [defaultPool, pool1, pool2] = [
      podStoragePoolFactory({ id: "a" }),
      podStoragePoolFactory({ id: "b" }),
      podStoragePoolFactory({ id: "c" }),
    ];
    const pod = podFactory({
      default_storage_pool: defaultPool.id,
      id: 1,
      storage_pools: [pool2, defaultPool, pool1],
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodStorage id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='pool-name']").at(0).text()).toBe(
      defaultPool.name
    );
    expect(wrapper.find("[data-test='pool-name']").at(1).text()).toBe(
      pool1.name
    );
    expect(wrapper.find("[data-test='pool-name']").at(2).text()).toBe(
      pool2.name
    );
  });

  it("can expand truncated pools if above truncation point", () => {
    const pools = [
      podStoragePoolFactory(),
      podStoragePoolFactory(),
      podStoragePoolFactory(),
      podStoragePoolFactory(),
      podStoragePoolFactory(),
    ];
    const pod = podFactory({
      default_storage_pool: pools[0].id,
      id: 1,
      storage_pools: pools,
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodStorage id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Button[data-test='show-more-pools']").exists()).toBe(
      true
    );
    expect(wrapper.find("Card").length).toBe(TRUNCATION_POINT);

    act(() => {
      wrapper.find("Button[data-test='show-more-pools']").simulate("click");
    });
    wrapper.update();

    expect(
      wrapper.find("Button[data-test='show-more-pools'] span").text()
    ).toBe("Show less storage pools");
    expect(wrapper.find("Card").length).toBe(pools.length);
  });

  it("can send an analytics event when expanding pools if analytics enabled", () => {
    const pools = [
      podStoragePoolFactory(),
      podStoragePoolFactory(),
      podStoragePoolFactory(),
      podStoragePoolFactory(),
      podStoragePoolFactory(),
    ];
    const pod = podFactory({
      default_storage_pool: pools[0].id,
      id: 1,
      storage_pools: pools,
    });
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = (hooks.useSendAnalytics = jest.fn(
      () => mockSendAnalytics
    ));

    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "enable_analytics",
            value: false,
          }),
        ],
      }),
      pod: podStateFactory({ items: [pod] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <PodStorage id={pod.id} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("Button[data-test='show-more-pools']").simulate("click");
    });
    wrapper.update();

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "KVM details",
      "Toggle expanded storage pools",
      "Show more storage pools",
    ]);

    mockUseSendAnalytics.mockRestore();
  });
});
