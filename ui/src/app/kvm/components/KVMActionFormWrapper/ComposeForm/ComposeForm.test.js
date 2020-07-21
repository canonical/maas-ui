import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  domainState as domainStateFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

import ComposeForm from "./ComposeForm";

const mockStore = configureStore();

describe("ComposeForm", () => {
  let initialState = rootStateFactory();

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
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
      space: spaceStateFactory({
        loaded: true,
      }),
      subnet: subnetStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <ComposeForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "FETCH_DOMAIN",
      "FETCH_FABRIC",
      "FETCH_GENERAL_POWER_TYPES",
      "FETCH_POD",
      "FETCH_RESOURCEPOOL",
      "FETCH_SPACE",
      "FETCH_SUBNET",
      "FETCH_VLAN",
      "FETCH_ZONE",
    ];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.zone.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <ComposeForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("can handle composing a machine", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <ComposeForm />} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        architecture: "amd64/generic",
        cores: 5,
        domain: "0",
        hostname: "mean-bean-machine",
        id: "1",
        memory: 4096,
        pool: "2",
        zone: "3",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "COMPOSE_POD")
    ).toStrictEqual({
      type: "COMPOSE_POD",
      meta: {
        method: "compose",
        model: "pod",
      },
      payload: {
        params: {
          architecture: "amd64/generic",
          cores: 5,
          domain: 0,
          hostname: "mean-bean-machine",
          id: 1,
          interfaces: undefined,
          memory: 4096,
          pool: 2,
          storage: undefined,
          zone: 3,
        },
      },
    });
  });
});
