import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import KVMSummary from "./KVMSummary";

const mockStore = configureStore();

describe("KVMSummary", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({ items: [podFactory({ id: 1 })] }),
    });
  });

  it("can view resources by NUMA node", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <KVMSummary />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("KVMAggregateResources").exists()).toBe(true);
    expect(wrapper.find("KVMNumaResources").exists()).toBe(false);

    act(() => {
      wrapper.find("input[data-test='numa-switch']").prop("onChange")({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    wrapper.update();

    expect(wrapper.find("KVMAggregateResources").exists()).toBe(false);
    expect(wrapper.find("KVMNumaResources").exists()).toBe(true);
  });
});
