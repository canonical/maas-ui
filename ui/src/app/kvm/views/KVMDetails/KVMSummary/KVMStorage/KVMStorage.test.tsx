import React from "react";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import {
  pod as podFactory,
  podState as podStateFactory,
  podStoragePool as podStoragePoolFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import KVMStorage from "./KVMStorage";

const mockStore = configureStore();

describe("KVMStorage", () => {
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
          <KVMStorage id={pod.id} />
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
});
