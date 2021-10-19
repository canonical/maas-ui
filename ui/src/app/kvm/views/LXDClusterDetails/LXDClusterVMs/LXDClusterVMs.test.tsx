import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterVMs from "./LXDClusterVMs";

import LXDVMsTable from "app/kvm/components/LXDVMsTable";
import kvmURLs from "app/kvm/urls";
import {
  machine as machineFactory,
  rootState as rootStateFactory,
  virtualMachine as clusterVMFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterVMs", () => {
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
              pathname: kvmURLs.lxd.cluster.vms.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterVMs
            clusterId={1}
            searchFilter=""
            setSearchFilter={jest.fn()}
            setHeaderContent={jest.fn()}
          />
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
});
