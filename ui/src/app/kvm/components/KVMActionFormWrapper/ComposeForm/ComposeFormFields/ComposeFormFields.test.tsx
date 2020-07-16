import { mount } from "enzyme";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import {
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import ComposeForm from "../ComposeForm";

const mockStore = configureStore();

describe("ComposeFormFields", () => {
  let initialState = rootStateFactory();

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({ loaded: true }),
      }),
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
        loaded: true,
        statuses: { 1: podStatusFactory() },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        loaded: true,
      }),
    });
  });

  it("correctly displays the available cores", () => {
    const state = { ...initialState };
    const pod = state.pod.items[0];
    pod.total.cores = 10;
    pod.used.cores = 8;
    pod.cpu_over_commit_ratio = 3;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    // 10 * 3 - 8 = 22
    expect(
      wrapper.find("FormikField[name='cores'] .p-form-help-text").text()
    ).toEqual("22 cores available");
  });

  it("correctly displays the available memory", () => {
    const state = { ...initialState };
    const pod = state.pod.items[0];
    pod.total.memory = 8;
    pod.used.memory = 5;
    pod.memory_over_commit_ratio = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    // 8 * 2 - 5 = 11
    expect(
      wrapper.find("FormikField[name='memory'] .p-form-help-text").text()
    ).toEqual("11 MiB available");
  });
});
