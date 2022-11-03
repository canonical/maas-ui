import { screen } from "@testing-library/react";

import KVM from "./KVM";

import urls from "app/base/urls";
import { Label as KVMListLabel } from "app/kvm/views/KVMList/KVMList";
import { Label as LXDClusterDetailsLabel } from "app/kvm/views/LXDClusterDetails/LXDClusterDetails";
import { Label as LXDSingleDetailsLabel } from "app/kvm/views/LXDSingleDetails/LXDSingleDetails";
import { Label as VirshDetailsLabel } from "app/kvm/views/VirshDetails/VirshDetails";
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

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    pod: podStateFactory({
      items: [
        podFactory({ id: 2, type: PodType.LXD, cluster: 1 }),
        podFactory({ id: 4, type: PodType.LXD }),
        podFactory({ id: 3, type: PodType.VIRSH }),
      ],
      loaded: true,
    }),
    vmcluster: vmClusterStateFactory({
      items: [vmClusterFactory({ id: 1 })],
      loaded: true,
    }),
  });
});

describe("KVM", () => {
  [
    {
      label: KVMListLabel.Title,
      path: urls.kvm.index,
    },
    {
      label: KVMListLabel.Title,
      path: urls.kvm.lxd.index,
    },
    {
      label: KVMListLabel.Title,
      path: urls.kvm.virsh.index,
    },
    {
      label: LXDClusterDetailsLabel.Title,
      path: urls.kvm.lxd.cluster.index({ clusterId: 1 }),
    },
    {
      label: LXDSingleDetailsLabel.Title,
      path: urls.kvm.lxd.single.index({ id: 4 }),
    },
    {
      label: VirshDetailsLabel.Title,
      path: urls.kvm.virsh.details.index({ id: 3 }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<KVM />, {
        route: path,
        state,
        routePattern: `${urls.kvm.index}/*`,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
