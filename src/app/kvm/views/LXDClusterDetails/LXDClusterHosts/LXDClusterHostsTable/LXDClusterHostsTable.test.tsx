import LXDClusterHostsTable from "./LXDClusterHostsTable";

import urls from "app/base/urls";
import { KVMSidePanelViews } from "app/kvm/constants";
import { PodType } from "app/store/pod/constants";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("LXDClusterHostsTable", () => {
  let state: RootState;
  let host: Pod;
  beforeEach(() => {
    host = podFactory({
      cluster: 1,
      id: 22,
      name: "cluster-host",
      pool: 333,
      type: PodType.LXD,
    });
    state = rootStateFactory({
      pod: podStateFactory({
        items: [host],
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory({ id: 333, name: "swimming" })],
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            hosts: [vmHostFactory({ id: host.id, name: host.name })],
          }),
        ],
      }),
    });
  });

  it("shows a spinner if pods or pools haven't loaded yet", () => {
    state.resourcepool.loaded = false;
    renderWithBrowserRouter(
      <LXDClusterHostsTable
        clusterId={1}
        currentPage={1}
        hosts={state.pod.items}
        searchFilter=""
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), state }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can link to a host's VMs tab", () => {
    renderWithBrowserRouter(
      <LXDClusterHostsTable
        clusterId={1}
        currentPage={1}
        hosts={state.pod.items}
        searchFilter=""
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), state }
    );

    expect(screen.getByRole("link", { name: host.name })).toHaveAttribute(
      "href",
      urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 22 })
    );
  });

  it("can show the name of the host's pool", () => {
    renderWithBrowserRouter(
      <LXDClusterHostsTable
        clusterId={1}
        currentPage={1}
        hosts={state.pod.items}
        searchFilter=""
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), state }
    );

    expect(screen.getByTestId("host-pool-name")).toHaveTextContent("swimming");
  });

  it("can open the compose VM form for a host", async () => {
    const setSidePanelContent = jest.fn();
    renderWithBrowserRouter(
      <LXDClusterHostsTable
        clusterId={1}
        currentPage={1}
        hosts={state.pod.items}
        searchFilter=""
        setSidePanelContent={setSidePanelContent}
      />,
      { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), state }
    );
    await userEvent.click(screen.getByTestId("vm-host-compose"));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.COMPOSE_VM,
      extras: { hostId: 22 },
    });
  });

  it("can link to a host's settings page", () => {
    renderWithBrowserRouter(
      <LXDClusterHostsTable
        clusterId={1}
        currentPage={1}
        hosts={state.pod.items}
        searchFilter=""
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), state }
    );
    expect(screen.getByTestId("vm-host-settings")).toHaveAttribute(
      "href",
      urls.kvm.lxd.cluster.host.edit({
        clusterId: 1,
        hostId: 22,
      })
    );
  });

  it("displays a message if there are no search results", () => {
    renderWithBrowserRouter(
      <LXDClusterHostsTable
        clusterId={1}
        currentPage={1}
        hosts={[]}
        searchFilter="nothing"
        setSidePanelContent={jest.fn()}
      />,
      { route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }), state }
    );

    expect(screen.getByTestId("no-hosts")).toBeInTheDocument();
  });
});
