import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";

import urls from "@/app/base/urls";
import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("LXDClusterDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    const zone = factory.zone({ id: 111, name: "danger" });
    const cluster = factory.vmCluster({
      availability_zone: zone.id,
      id: 1,
      name: "vm-cluster",
      project: "cluster-project",
    });
    state = factory.rootState({
      vmcluster: factory.vmClusterState({
        items: [cluster],
      }),
      zone: factory.zoneState({
        items: [zone],
      }),
    });
  });

  it("displays a spinner if cluster hasn't loaded", () => {
    state.vmcluster.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              setSidePanelContent={vi.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the cluster member count", () => {
    state.vmcluster.items[0].hosts = [factory.vmHost(), factory.vmHost()];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              setSidePanelContent={vi.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[0]).toHaveTextContent(
      "2 members"
    );
  });

  it("displays the tracked VMs count", () => {
    state.vmcluster.items[0].virtual_machines = [
      factory.virtualMachine(),
      factory.virtualMachine(),
      factory.virtualMachine(),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              setSidePanelContent={vi.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "3 available"
    );
  });

  it("displays the cluster's zone's name", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              setSidePanelContent={vi.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
      "danger"
    );
  });

  it("displays the cluster's project", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              setSidePanelContent={vi.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[3]).toHaveTextContent(
      "cluster-project"
    );
  });

  it("can open the refresh cluster form if it has hosts", async () => {
    const hosts = [factory.vmHost(), factory.vmHost()];
    state.vmcluster.items[0].hosts = hosts;
    const setSidePanelContent = vi.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: urls.kvm.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              setSidePanelContent={setSidePanelContent}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Refresh cluster" })
    );

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.REFRESH_KVM,
      extras: { hostIds: hosts.map((host) => host.id) },
    });
  });
});
