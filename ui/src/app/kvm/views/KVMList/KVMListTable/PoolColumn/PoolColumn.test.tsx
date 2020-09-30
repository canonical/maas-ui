import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import PoolColumn from "./PoolColumn";
import {
  pod as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("PoolColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            name: "pod-1",
            pool: 1,
            zone: 1,
          }),
        ],
      }),
      resourcepool: resourcePoolStateFactory({
        items: [
          resourcePoolFactory({
            id: 1,
            name: "swimming-pool",
          }),
        ],
      }),
      zone: zoneStateFactory({
        items: [
          zoneFactory({
            id: 1,
            name: "alone-zone",
          }),
        ],
      }),
    });
  });

  it("can display the pod's resource pool and zone", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PoolColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-pool']").text()).toBe("swimming-pool");
    expect(wrapper.find("[data-test='pod-zone']").text()).toBe("alone-zone");
  });
});
