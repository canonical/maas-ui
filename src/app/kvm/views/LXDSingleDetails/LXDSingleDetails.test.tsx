import { screen } from "@testing-library/react";

import LXDSingleDetails from "./LXDSingleDetails";

import urls from "app/base/urls";
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
  zoneGenericActions as zoneGenericActionsFactory,
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
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
      }),
    });
  });

  [
    {
      label: LXDSingleVMsLabel.Title,
      path: urls.kvm.lxd.single.vms({ id: 1 }),
    },
    {
      label: LXDSingleResourcesLabel.Title,
      path: urls.kvm.lxd.single.resources({ id: 1 }),
    },
    {
      label: LXDSingleSettingsLabel.Title,
      path: urls.kvm.lxd.single.edit({ id: 1 }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<LXDSingleDetails />, {
        route: path,
        wrapperProps: {
          state,
          routePattern: `${urls.kvm.lxd.single.index(null)}/*`,
        },
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("redirects to vms", () => {
    renderWithBrowserRouter(<LXDSingleDetails />, {
      route: urls.kvm.lxd.single.index({ id: 1 }),
      wrapperProps: {
        state,
        routePattern: `${urls.kvm.lxd.single.index(null)}/*`,
      },
    });
    expect(window.location.pathname).toBe(urls.kvm.lxd.single.vms({ id: 1 }));
  });
});
