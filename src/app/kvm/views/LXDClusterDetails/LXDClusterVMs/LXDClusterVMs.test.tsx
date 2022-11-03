import reduxToolkit from "@reduxjs/toolkit";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDClusterVMs from "./LXDClusterVMs";

import urls from "app/base/urls";
import LXDVMsTable from "app/kvm/components/LXDVMsTable";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  virtualMachine as clusterVMFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  vmHost as vmHostFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("LXDClusterVMs", () => {
  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterVMs
              clusterId={1}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find(LXDVMsTable).invoke("getResources")(
        machineFactory({ system_id: "abc123" })
      )
    ).toStrictEqual({
      hugepagesBacked: true,
      pinnedCores: [2],
      unpinnedCores: 3,
    });
  });

  it("renders a link to a cluster's host's VM page", () => {
    const machine = machineFactory({
      pod: { id: 11, name: "podrick" },
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        lists: {
          "123456": machineStateListFactory({
            loaded: true,
            groups: [
              machineStateListGroupFactory({
                items: [machine.system_id],
              }),
            ],
          }),
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterVMs
              clusterId={1}
              searchFilter=""
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Link[data-testid='host-link']").prop("to")).toBe(
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
              vmHostFactory({ name: "host 1" }),
              vmHostFactory({ name: "host 2" }),
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
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      { store }
    );
    const expected = machineActions.fetch("123456", {
      filter: { pod: ["host 1", "host 2"] },
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches[fetches.length - 1].payload.params.filter).toStrictEqual({
      pod: ["host 1", "host 2"],
    });
  });
});
