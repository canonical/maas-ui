import VirshDetails from "./VirshDetails";

import urls from "@/app/base/urls";
import { Label as VirshResourcesLabel } from "@/app/kvm/views/VirshDetails/VirshResources/VirshResources";
import { Label as VirshSettingsLabel } from "@/app/kvm/views/VirshDetails/VirshSettings/VirshSettings";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("VirshDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [factory.podDetails({ id: 1, type: PodType.VIRSH })],
        loaded: true,
      }),
      resourcepool: factory.resourcePoolState({
        loaded: true,
      }),
      tag: factory.tagState({
        loaded: true,
      }),
      zone: factory.zoneState({
        genericActions: factory.zoneGenericActions({ fetch: "success" }),
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
        state,
        routePattern: `${urls.kvm.virsh.details.index(null)}/*`,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("redirects to resources", () => {
    renderWithBrowserRouter(<VirshDetails />, {
      route: urls.kvm.virsh.details.index({ id: 1 }),
      state,
      routePattern: `${urls.kvm.virsh.details.index(null)}/*`,
    });
    expect(window.location.pathname).toBe(
      urls.kvm.virsh.details.resources({ id: 1 })
    );
  });
});
