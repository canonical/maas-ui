import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VirshDetailsHeader from "./VirshDetailsHeader";

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
  rootState as rootStateFactory,
  zone as zoneFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VirshDetailsHeader", () => {
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
            type: PodType.VIRSH,
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
          <VirshDetailsHeader
            id={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the virsh power address", () => {
    state.pod.items[0].power_parameters = powerParametersFactory({
      power_address: "qemu+ssh://ubuntu@192.168.1.1/system",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <VirshDetailsHeader
            id={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='block-subtitle']").at(0).text()).toBe(
      "qemu+ssh://ubuntu@192.168.1.1/system"
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
          <VirshDetailsHeader
            id={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='block-subtitle']").at(1).text()).toBe(
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
          <VirshDetailsHeader
            id={1}
            headerContent={null}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='block-subtitle']").at(2).text()).toBe(
      "danger"
    );
  });
});
