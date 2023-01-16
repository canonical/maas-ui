import LXDClusterHosts from "./LXDClusterHosts";

import urls from "app/base/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmHost as vmHostFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

describe("LXDClusterHosts", () => {
  let state: RootState;

  beforeEach(() => {
    const pods = [
      podFactory({ id: 111, name: "cluster-member-1", type: PodType.LXD }),
      podFactory({ id: 222, name: "cluster-member-2", type: PodType.LXD }),
    ];
    const cluster = vmClusterFactory({
      id: 1,
      hosts: pods.map((pod) => vmHostFactory({ id: pod.id, name: pod.name })),
    });
    state = rootStateFactory({
      pod: podStateFactory({
        items: pods,
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [cluster],
        loaded: true,
      }),
    });
  });

  it("displays a spinner if pods haven't loaded", () => {
    state.pod.loaded = false;
    renderWithBrowserRouter(
      <LXDClusterHosts clusterId={1} setHeaderContent={jest.fn()} />,
      {
        route: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }),
        routePattern: `${urls.kvm.index}/*`,
        state,
      }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
