import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NumaResourcesCard from "./NumaResourcesCard";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  pod as podFactory,
  podNetworkInterface as podInterfaceFactory,
  podNuma as podNumaFactory,
  podNumaMemory as podNumaMemoryFactory,
  podNumaHugepageMemory as podNumaHugepageFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVM as podVmFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NumaResourcesCard", () => {
  it("aggregates the individual NUMA hugepages memory", () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: [
          podNumaFactory({
            memory: podNumaMemoryFactory({
              hugepages: [
                podNumaHugepageFactory({
                  allocated: 1,
                  free: 2,
                  page_size: 1024,
                }),
                podNumaHugepageFactory({
                  allocated: 4,
                  free: 5,
                  page_size: 1024,
                }),
              ],
            }),
            node_id: 11,
          }),
        ],
      }),
    });
    const state = rootStateFactory({
      pod: podStateFactory({ items: [pod] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NumaResourcesCard numaId={11} podId={1} />
      </Provider>
    );
    expect(wrapper.find("RamResources").prop("hugepages")).toStrictEqual({
      allocated: 5,
      free: 7,
      pageSize: 1024,
    });
  });

  it("filters interface resources to those that belong to the NUMA node", () => {
    const podInterfaces = [
      podInterfaceFactory({ id: 11 }),
      podInterfaceFactory({ id: 22 }),
      podInterfaceFactory({ id: 33 }),
    ];
    const numaNode = podNumaFactory({ interfaces: [11, 33], node_id: 111 });
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        interfaces: podInterfaces,
        numa: [numaNode],
      }),
    });
    const state = rootStateFactory({
      pod: podStateFactory({ items: [pod] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NumaResourcesCard numaId={111} podId={1} />
      </Provider>
    );
    expect(wrapper.find("VfResources").prop("interfaces")).toStrictEqual([
      podInterfaces[0],
      podInterfaces[2],
    ]);
  });

  it("correctly filters VMs dropdown to those that belong to each NUMA node", () => {
    const podID = 1;
    const podName = "pod";
    const machines = [
      machineFactory({
        pod: { id: podID, name: podName },
        system_id: "abc123",
      }),
      machineFactory({
        pod: { id: podID, name: podName },
        system_id: "def456",
      }),
      machineFactory({
        pod: { id: podID, name: podName },
        system_id: "ghi789",
      }),
    ];
    const pod = podFactory({
      id: podID,
      name: podName,
      resources: podResourcesFactory({
        numa: [podNumaFactory({ node_id: 11, vms: [111, 333] })],
        vms: [
          podVmFactory({ id: 111, system_id: "abc123" }),
          podVmFactory({ id: 222, system_id: "def456" }),
          podVmFactory({ id: 333, system_id: "ghi789" }),
        ],
      }),
    });
    const state = rootStateFactory({
      machine: machineStateFactory({ items: machines }),
      pod: podStateFactory({ items: [pod] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NumaResourcesCard numaId={11} podId={1} />
      </Provider>
    );

    expect(wrapper.find("VmResources").prop("vms")).toStrictEqual([
      machines[0],
      machines[2],
    ]);
  });
});
