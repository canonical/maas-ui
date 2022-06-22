import { screen } from "@testing-library/react";

import LXDSingleDetails from "./LXDSingleDetails";

import kvmURLs from "app/kvm/urls";
import { Label as LXDSingleResourcesLabel } from "app/kvm/views/LXDSingleDetails/LXDSingleResources/LXDSingleResources";
import { Label as LXDSingleSettingsLabel } from "app/kvm/views/LXDSingleDetails/LXDSingleSettings/LXDSingleSettings";
import { Label as LXDSingleVMsLabel } from "app/kvm/views/LXDSingleDetails/LXDSingleVMs/LXDSingleVMs";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("LXDSingleDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.LXD })],
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
      tag: tagStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        loaded: true,
      }),
    });
  });

  [
    {
      label: LXDSingleVMsLabel.Title,
      path: kvmURLs.lxd.single.vms({ id: 1 }),
    },
    {
      label: LXDSingleResourcesLabel.Title,
      path: kvmURLs.lxd.single.resources({ id: 1 }),
    },
    {
      label: LXDSingleSettingsLabel.Title,
      path: kvmURLs.lxd.single.edit({ id: 1 }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<LXDSingleDetails />, {
        route: path,
        wrapperProps: {
          state,
          routePattern: `${kvmURLs.lxd.single.index(null, true)}/*`,
        },
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
