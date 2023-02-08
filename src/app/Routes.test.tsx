import Routes from "./Routes";
import type { RootState } from "./store/root/types";

import urls from "app/base/urls";
import {
  rootState as rootStateFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  authState as authStateFactory,
  user as userFactory,
  userState as userStateFactory,
  domain as domainFactory,
  domainState as domainStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
} from "testing/factories";
import { waitFor, renderWithBrowserRouter } from "testing/utils";

const nodeSummaryRoutes: { path: string; name: string }[] = [
  {
    path: urls.controllers.controller.index({ id: "abc123" }),
    name: "Controller details",
  },
  {
    name: "Device details",
    path: urls.devices.device.index({ id: "abc123" }),
  },
  {
    name: "Machine details",
    path: urls.machines.machine.index({ id: "abc123" }),
  },
];

const routes: { title: string; path: string }[] = [
  {
    title: "Welcome",
    path: urls.intro.index,
  },
  {
    title: "Controllers",
    path: urls.controllers.index,
  },
  {
    title: "Devices",
    path: urls.devices.index,
  },
  {
    title: "DNS",
    path: urls.domains.index,
  },
  {
    title: "test-domain",
    path: urls.domains.details({ id: 1 }),
  },
  {
    title: "Images",
    path: urls.images.index,
  },
  {
    title: "LXD",
    path: urls.kvm.index,
  },
  {
    title: "Machines",
    path: urls.machines.index,
  },
  {
    title: "Pools",
    path: urls.pools.index,
  },
  {
    title: "Subnets",
    path: urls.subnets.index,
  },
  {
    title: "Fabric details",
    path: urls.subnets.fabric.index({ id: 1 }),
  },
  {
    title: "Space details",
    path: urls.subnets.space.index({ id: 1 }),
  },
  {
    title: "Subnet details",
    path: urls.subnets.subnet.index({ id: 1 }),
  },
  {
    title: "VLAN details",
    path: urls.subnets.vlan.index({ id: 1 }),
  },
  {
    title: "Tags",
    path: urls.tags.index,
  },
  {
    title: "Tag",
    path: urls.tags.tag.index({ id: 1 }),
  },
  {
    title: "Error: Page not found.",
    path: "/not/a/path",
  },
  {
    title: "Zones",
    path: urls.zones.index,
  },
  {
    title: "test-zone",
    path: urls.zones.details({ id: 1 }),
  },
  {
    title: "Dashboard",
    path: urls.dashboard.index,
  },
];

describe("Routes", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({ user: userFactory({ is_superuser: true }) }),
      }),
      controller: controllerStateFactory({
        items: [
          controllerFactory({
            system_id: "abc123",
            hostname: "test-controller",
          }),
        ],
        loaded: true,
        loading: false,
      }),
      device: deviceStateFactory({
        items: [
          deviceDetailsFactory({
            system_id: "abc123",
            hostname: "test-device",
          }),
        ],
        loaded: true,
        loading: false,
      }),
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "test-domain" })],
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({
            system_id: "abc123",
            fqdn: "test-machine",
          }),
        ],
      }),
      zone: zoneStateFactory({
        items: [
          zoneFactory({
            id: 1,
            name: "test-zone",
          }),
        ],
      }),
    });
    global.scrollTo = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  routes.forEach(({ title, path }) => {
    it(`Displays: ${title} at: ${path}`, async () => {
      renderWithBrowserRouter(<Routes />, {
        route: path,
        state,
        routePattern: "/*",
      });
      await waitFor(() => expect(document.title).toBe(`${title} | MAAS`));
    });
  });

  nodeSummaryRoutes.forEach(({ name, path }) => {
    it(`Displays: ${name} at: ${path}`, async () => {
      renderWithBrowserRouter(<Routes />, {
        route: path,
        state,
      });
      expect(window.location.pathname).toBe(`${path}/summary`);
    });
  });

  it("redirects from index to machines", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.index,
      state,
    });
    expect(window.location.pathname).toBe(urls.machines.index);
  });

  it("redirects from Settings base URL to configuration", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.settings.index,
      state,
    });
    expect(window.location.pathname).toBe(urls.settings.configuration.index);
  });

  it("redirects from Preferences base URL to Details", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.preferences.index,
      state,
    });
    expect(window.location.pathname).toBe(urls.preferences.details);
  });
});
