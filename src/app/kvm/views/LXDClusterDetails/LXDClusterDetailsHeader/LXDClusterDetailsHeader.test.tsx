import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";

import urls from "@/app/base/urls";
import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

describe("LXDClusterDetailsHeader", () => {
  let state: RootState;
  const zone = factory.zone({ id: 111, name: "danger" });
  const queryData = {
    zones: [zone],
  };

  beforeEach(() => {
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
    });
  });

  it("displays a spinner if cluster hasn't loaded", () => {
    state.vmcluster.items = [];
    renderWithBrowserRouter(
      <LXDClusterDetailsHeader clusterId={1} setSidePanelContent={vi.fn()} />,
      { route: urls.kvm.lxd.cluster.index({ clusterId: 1 }), state, queryData }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the cluster member count", () => {
    state.vmcluster.items[0].hosts = [factory.vmHost(), factory.vmHost()];

    renderWithBrowserRouter(
      <LXDClusterDetailsHeader clusterId={1} setSidePanelContent={vi.fn()} />,
      { route: urls.kvm.lxd.cluster.index({ clusterId: 1 }), state, queryData }
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
    renderWithBrowserRouter(
      <LXDClusterDetailsHeader clusterId={1} setSidePanelContent={vi.fn()} />,
      { route: urls.kvm.lxd.cluster.index({ clusterId: 1 }), state, queryData }
    );

    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "3 available"
    );
  });

  it("displays the cluster's zone's name", () => {
    renderWithBrowserRouter(
      <LXDClusterDetailsHeader clusterId={1} setSidePanelContent={vi.fn()} />,
      { route: urls.kvm.lxd.cluster.index({ clusterId: 1 }), state, queryData }
    );

    expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
      "danger"
    );
  });

  it("displays the cluster's project", () => {
    renderWithBrowserRouter(
      <LXDClusterDetailsHeader clusterId={1} setSidePanelContent={vi.fn()} />,
      { route: urls.kvm.lxd.cluster.index({ clusterId: 1 }), state, queryData }
    );

    expect(screen.getAllByTestId("block-subtitle")[3]).toHaveTextContent(
      "cluster-project"
    );
  });

  it("can open the refresh cluster form if it has hosts", async () => {
    const hosts = [factory.vmHost(), factory.vmHost()];
    state.vmcluster.items[0].hosts = hosts;
    const setSidePanelContent = vi.fn();
    renderWithBrowserRouter(
      <LXDClusterDetailsHeader
        clusterId={1}
        setSidePanelContent={setSidePanelContent}
      />,
      { route: urls.kvm.lxd.cluster.index({ clusterId: 1 }), state, queryData }
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
