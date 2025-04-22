import VirshDetails from "./VirshDetails";

import urls from "@/app/base/urls";
import { Label as VirshResourcesLabel } from "@/app/kvm/views/VirshDetails/VirshResources/VirshResources";
import { Label as VirshSettingsLabel } from "@/app/kvm/views/VirshDetails/VirshSettings/VirshSettings";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  zoneResolvers.listZones.handler(),
  zoneResolvers.getZone.handler()
);

describe("VirshDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [factory.podDetails({ id: 1, type: PodType.VIRSH })],
        loaded: true,
      }),
      tag: factory.tagState({
        loaded: true,
      }),
    });
  });

  it(`Displays: ${VirshResourcesLabel.Title} at: ${urls.kvm.virsh.details.resources({ id: 1 })}`, () => {
    renderWithBrowserRouter(<VirshDetails />, {
      route: urls.kvm.virsh.details.resources({ id: 1 }),
      state,
      routePattern: `${urls.kvm.virsh.details.index(null)}/*`,
    });
    expect(
      screen.getByLabelText(VirshResourcesLabel.Title)
    ).toBeInTheDocument();
  });

  it(`Displays: ${VirshSettingsLabel.Title} at: ${urls.kvm.virsh.details.edit({ id: 1 })}`, async () => {
    renderWithBrowserRouter(<VirshDetails />, {
      route: urls.kvm.virsh.details.edit({ id: 1 }),
      state,
      routePattern: `${urls.kvm.virsh.details.index(null)}/*`,
    });
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());
    expect(screen.getByLabelText(VirshSettingsLabel.Title)).toBeInTheDocument();
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
