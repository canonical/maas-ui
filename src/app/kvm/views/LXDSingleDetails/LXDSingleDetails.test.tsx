import LXDSingleDetails from "./LXDSingleDetails";

import { zoneResolvers } from "@/app/api/query/zones.test";
import urls from "@/app/base/urls";
import { Label as LXDSingleResourcesLabel } from "@/app/kvm/views/LXDSingleDetails/LXDSingleResources/LXDSingleResources";
import { Label as LXDSingleSettingsLabel } from "@/app/kvm/views/LXDSingleDetails/LXDSingleSettings/LXDSingleSettings";
import { Label as LXDSingleVMsLabel } from "@/app/kvm/views/LXDSingleDetails/LXDSingleVMs/LXDSingleVMs";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(zoneResolvers.listZones.handler());

beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => mockServer.close());

describe("LXDSingleDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [factory.podDetails({ id: 1, type: PodType.LXD })],
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

  it(`Displays: ${LXDSingleVMsLabel.Title} at: ${urls.kvm.lxd.single.vms({ id: 1 })}`, async () => {
    renderWithBrowserRouter(<LXDSingleDetails />, {
      route: urls.kvm.lxd.single.vms({ id: 1 }),
      state,
      routePattern: `${urls.kvm.lxd.single.index(null)}/*`,
    });
    expect(screen.getByLabelText(LXDSingleVMsLabel.Title)).toBeInTheDocument();
  });

  it(`Displays: ${LXDSingleResourcesLabel.Title} at: ${urls.kvm.lxd.single.resources({ id: 1 })}`, async () => {
    renderWithBrowserRouter(<LXDSingleDetails />, {
      route: urls.kvm.lxd.single.resources({ id: 1 }),
      state,
      routePattern: `${urls.kvm.lxd.single.index(null)}/*`,
    });
    expect(
      screen.getByLabelText(LXDSingleResourcesLabel.Title)
    ).toBeInTheDocument();
  });

  it(`Displays: ${LXDSingleSettingsLabel.Title} at: ${urls.kvm.lxd.single.edit({ id: 1 })}`, async () => {
    renderWithBrowserRouter(<LXDSingleDetails />, {
      route: urls.kvm.lxd.single.edit({ id: 1 }),
      state,
      routePattern: `${urls.kvm.lxd.single.index(null)}/*`,
    });
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());
    expect(
      screen.getByLabelText(LXDSingleSettingsLabel.Title)
    ).toBeInTheDocument();
  });

  it("redirects to vms", async () => {
    renderWithBrowserRouter(<LXDSingleDetails />, {
      route: urls.kvm.lxd.single.index({ id: 1 }),
      state,
      routePattern: `${urls.kvm.lxd.single.index(null)}/*`,
    });
    expect(window.location.pathname).toBe(urls.kvm.lxd.single.vms({ id: 1 }));
  });
});
