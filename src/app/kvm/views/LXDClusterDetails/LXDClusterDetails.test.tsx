import { screen } from "@testing-library/react";

import LXDClusterDetails from "./LXDClusterDetails";

import urls from "app/base/urls";
import { Label as LXDClusterHostSettingsLabel } from "app/kvm/views/LXDClusterDetails/LXDClusterHostSettings/LXDClusterHostSettings";
import { Label as LXDClusterHostVMsLabel } from "app/kvm/views/LXDClusterDetails/LXDClusterHostVMs/LXDClusterHostVMs";
import { Label as LXDClusterHostsLabel } from "app/kvm/views/LXDClusterDetails/LXDClusterHosts/LXDClusterHosts";
import { Label as LXDClusterResourcesLabel } from "app/kvm/views/LXDClusterDetails/LXDClusterResources/LXDClusterResources";
import { Label as LXDClusterSettingsLabel } from "app/kvm/views/LXDClusterDetails/LXDClusterSettings/LXDClusterSettings";
import { Label as LXDClusterVMsLabel } from "app/kvm/views/LXDClusterDetails/LXDClusterVMs/LXDClusterVMs";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("LXDClusterDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 2, type: PodType.LXD, cluster: 1 })],
        loaded: true,
      }),
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory({ id: 1 })],
        loaded: true,
      }),
    });
  });

  [
    {
      label: LXDClusterHostsLabel.Title,
      path: urls.kvm.lxd.cluster.hosts({ clusterId: 1 }),
    },
    {
      label: LXDClusterVMsLabel.Title,
      path: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }),
    },
    {
      label: LXDClusterResourcesLabel.Title,
      path: urls.kvm.lxd.cluster.resources({ clusterId: 1 }),
    },
    {
      label: LXDClusterSettingsLabel.Title,
      path: urls.kvm.lxd.cluster.edit({ clusterId: 1 }),
    },
    {
      label: LXDClusterHostVMsLabel.Title,
      path: urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 2 }),
    },
    {
      label: LXDClusterHostSettingsLabel.Title,
      path: urls.kvm.lxd.cluster.host.edit({ clusterId: 1, hostId: 2 }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<LXDClusterDetails />, {
        route: path,
        state,
        routePattern: `${urls.kvm.lxd.cluster.index(null)}/*`,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
