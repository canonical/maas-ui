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
import KVMSummaryStorage from "./KVMSummaryStorage";

const mockStore = configureStore();

describe("KVMSummaryStorage", () => {
  it("correctly chunks KVM storage pools into rows of 3", () => {
    const pod = podFactory({
      storage_pools: Array.from(Array(4)).map(() => podStoragePoolFactory()),
    });
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/2", key: "testKey" }]}>
          <KVMSummaryStorage id={pod.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Row")).toHaveLength(2);
    expect(wrapper.find("Row").at(0).props()?.children).toHaveLength(3);
    expect(wrapper.find("Row").at(1).props()?.children).toHaveLength(1);
  });
});
