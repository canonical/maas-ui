import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";

import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  podVmCount as podVmCountFactory,
  zone as zoneFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDSingleDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          podFactory({
            id: 1,
            name: "pod-1",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 10 }),
            }),
            type: PodType.LXD,
          }),
        ],
        statuses: podStatusesFactory({
          1: podStatusFactory(),
        }),
      }),
    });
  });

  it("displays a spinner if pod hasn't loaded", () => {
    state.pod.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the LXD project", () => {
    state.pod.items[0].power_parameters = powerParametersFactory({
      project: "Manhattan",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='block-subtitle']").at(3).text()).toBe(
      "Manhattan"
    );
  });

  it("displays the tracked VMs count", () => {
    state.pod.items[0].resources = podResourcesFactory({
      vm_count: podVmCountFactory({ tracked: 5 }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='block-subtitle']").at(1).text()).toBe(
      "5 available"
    );
  });

  it("displays the pod's zone's name", () => {
    state.zone.items = [zoneFactory({ id: 101, name: "danger" })];
    state.pod.items[0].zone = 101;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <CompatRouter>
            <LXDSingleDetailsHeader
              id={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='block-subtitle']").at(2).text()).toBe(
      "danger"
    );
  });
});
