import { screen } from "@testing-library/react";

import VirshDetails from "./VirshDetails";

import urls from "app/base/urls";
import { Label as VirshResourcesLabel } from "app/kvm/views/VirshDetails/VirshResources/VirshResources";
import { Label as VirshSettingsLabel } from "app/kvm/views/VirshDetails/VirshSettings/VirshSettings";
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

describe("VirshDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.VIRSH })],
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
      label: VirshResourcesLabel.Title,
      path: urls.kvm.virsh.details.resources({ id: 1 }),
    },
    {
      label: VirshSettingsLabel.Title,
      path: urls.kvm.virsh.details.edit({ id: 1 }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<VirshDetails />, {
        route: path,
        wrapperProps: {
          state,
          routePattern: `${urls.kvm.virsh.details.index(null)}/*`,
        },
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
