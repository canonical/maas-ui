import { screen } from "@testing-library/react";

import VirshDetails from "./VirshDetails";

import kvmURLs from "app/kvm/urls";
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
        loaded: true,
      }),
    });
  });

  [
    {
      label: VirshResourcesLabel.Title,
      path: kvmURLs.virsh.details.resources({ id: 1 }),
    },
    {
      label: VirshSettingsLabel.Title,
      path: kvmURLs.virsh.details.edit({ id: 1 }),
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithBrowserRouter(<VirshDetails />, {
        route: path,
        wrapperProps: {
          state,
          routePattern: `${kvmURLs.virsh.details.index(null, true)}/*`,
        },
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
