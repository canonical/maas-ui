```
import configureStore from "redux-mock-store";
import { renderWithBrowserRouter, screen } from "testing/utils";
import LXDClusterVMs from "./LXDClusterVMs";
import urls from "app/base/urls";
import LXDVMsTable from "app/kvm/components/LXDVMsTable";
import {
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  virtualMachine as clusterVMFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterVMs", () => {
  beforeEach(() => {
    jest.spyOn(require("@reduxjs/toolkit"), "nanoid").mockReturnValue("123456");
  });

  it("can get resources for a cluster VM", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            virtual_machines: [
              clusterVMFactory({
                hugepages_backed: true,
                pinned_cores: [2],
                system_id: "abc123",
                unpinned_cores: 3,
              }),
            ],
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <LXDClusterVMs
        clusterId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }), store }
    );
    expect(
      container.querySelector(LXDVMsTable)?.invoke("getResources")(
        { system_id: /abc123/i }
      )
    ).toStrictEqual({
      hugepagesBacked: true,
      pinnedCores: [2],
      unpinnedCores: 3,
    });
  });

  it("renders a link to a cluster's host's VM page", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          {
            pod: { id: 11, name: "podrick" },
            system_id: "abc123",
          },
        ],
        lists: {
          "123456": {
            loaded: true,
            groups: [
              { items: ["abc123"] },
            ],
          },
        },
      }),
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            virtual_machines: [clusterVMFactory({ system_id: "abc123" })],
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LXDClusterVMs
        clusterId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }), store }
    );
    expect(
      screen.getByTestId('host-link')
    ).toHaveAttribute(
      'href',
      urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 11 })
    );
  });

  it("fetches VMs for the hosts", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            hosts: [
              { name: "host 1" },
              { name: "host 2" },
            ],
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LXDClusterVMs
        clusterId={1}
        searchFilter=""
        setSearchFilter={jest.fn()}
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }), store }
    );
    const expected = {
      payload: {
        method: "GET",
        params: {
          filter: { pod: ["host 1", "host 2"] },
        },
        url: "/api/machines/query_set/123456/",
      },
      type: "machine/fetch",
    };

    const fetches = store.getActions().filter((action) => action.type === expected.type);

    expect(fetches[fetches.length - 1]).toEqual(expected);
  });
});
```;
