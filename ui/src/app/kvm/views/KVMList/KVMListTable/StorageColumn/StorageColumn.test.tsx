import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  pod as podFactory,
  podHint as podHintFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import StorageColumn from "./StorageColumn";

const mockStore = configureStore();

describe("StorageColumn", () => {
  it("displays correct storage information", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            name: "pod-1",
            total: podHintFactory({
              local_storage: 1000000000000,
            }),
            used: podHintFactory({
              local_storage: 100000000000,
            }),
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <StorageColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "0.1 of 1 TB allocated"
    );
    expect(wrapper.find("Meter").props().max).toBe(1000000000000);
  });
});
