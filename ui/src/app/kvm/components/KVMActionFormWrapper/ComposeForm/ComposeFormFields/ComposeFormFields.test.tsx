import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import ComposeForm from "../ComposeForm";

import type { RootState } from "app/store/root/types";
import {
  domainState as domainStateFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  pod as podFactory,
  podHint as podHintFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ComposeFormFields", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
          loaded: true,
        }),
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
    ).toEqual("22 cores available.");
  });

  it("correctly displays the available memory", () => {
    const state = { ...initialState };
    const pod = state.pod.items[0];
    pod.total.memory = 8000;
    pod.used.memory = 5000;
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
    // 8000 * 2 - 5000 = 11000
    expect(
      wrapper.find("FormikField[name='memory'] .p-form-help-text").text()
    ).toEqual("11000 MiB available.");
  });

  it("shows warnings if available cores/memory is less than the default", () => {
    const state = { ...initialState };
    const powerType = powerTypeFactory({
      defaults: { cores: 2, memory: 2, storage: 2 },
      driver_type: "pod",
    });
    state.general.powerTypes.data = [powerType];
    state.pod.items = [
      podFactory({
        cpu_over_commit_ratio: 1,
        id: 1,
        memory_over_commit_ratio: 1,
        total: podHintFactory({ cores: 2, memory: 2 }),
        type: powerType.name,
        used: podHintFactory({ cores: 1, memory: 1 }),
      }),
    ];
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
    expect(
      wrapper
        .find("FormikField[name='cores'] .p-form-validation__message")
        .exists()
    ).toBe(true);
    expect(
      wrapper
        .find("FormikField[name='memory'] .p-form-validation__message")
        .exists()
    ).toBe(true);
  });
});
