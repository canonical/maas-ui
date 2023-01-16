import LXDClusterHostVMs, { Label } from "./LXDClusterHostVMs";

import urls from "app/base/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    pod: podStateFactory({
      items: [podFactory({ id: 2, type: PodType.LXD, cluster: 1 })],
      loaded: true,
    }),
    vmcluster: vmClusterStateFactory({
      items: [
        vmClusterFactory({
          id: 1,
          hosts: [vmHostFactory({ id: 1 })],
        }),
      ],
      loaded: true,
    }),
  });
});

describe("LXDClusterHostVMs", () => {
  it("renders the LXD host VM table if the host is part of the cluster", () => {
    renderWithBrowserRouter(
      <LXDClusterHostVMs
        clusterId={1}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      {
        route: urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 2 }),
        state,
        routePattern: urls.kvm.lxd.cluster.vms.host(null),
      }
    );
    expect(screen.getByText("VMs on pod1")).toBeInTheDocument();
  });

  it("renders a spinner if cluster hasn't loaded", () => {
    state.pod.loaded = false;
    renderWithBrowserRouter(
      <LXDClusterHostVMs
        clusterId={1}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      {
        route: urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 2 }),
        state,
        routePattern: urls.kvm.lxd.cluster.vms.host(null),
      }
    );
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
  });

  it("displays a message if the host is not found", () => {
    state.pod.items = [];
    renderWithBrowserRouter(
      <LXDClusterHostVMs
        clusterId={1}
        searchFilter=""
        setHeaderContent={jest.fn()}
        setSearchFilter={jest.fn()}
      />,
      {
        route: urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 2 }),
        state,
        routePattern: urls.kvm.lxd.cluster.vms.host(null),
      }
    );
    expect(screen.getByText("LXD host not found")).toBeInTheDocument();
  });
});
