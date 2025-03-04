import type { Mock } from "vitest";

import Routes from "./Routes";
import type { RootState } from "./store/root/types";

import urls from "@/app/base/urls";
import { LONG_TIMEOUT } from "@/testing/constants";
import * as factory from "@/testing/factories";
import { waitFor, renderWithBrowserRouter } from "@/testing/utils";

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
    title: "Error: Page not found",
    path: "/not/a/path",
  },
  {
    title: "Zones",
    path: urls.zones.index,
  },
  {
    title: "Network Discovery",
    path: urls.networkDiscovery.index,
  },
];

describe("Routes", () => {
  let state: RootState;
  let scrollToSpy: Mock;
  const queryData = {
    zones: [factory.zone({ id: 1, name: "test-zone" })],
  };
  beforeEach(() => {
    state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({ user: factory.user({ is_superuser: true }) }),
      }),
      controller: factory.controllerState({
        items: [
          factory.controller({
            system_id: "abc123",
            hostname: "test-controller",
          }),
        ],
        loaded: true,
        loading: false,
      }),
      device: factory.deviceState({
        items: [
          factory.deviceDetails({
            system_id: "abc123",
            hostname: "test-device",
          }),
        ],
        loaded: true,
        loading: false,
      }),
      domain: factory.domainState({
        items: [factory.domain({ id: 1, name: "test-domain" })],
      }),
      machine: factory.machineState({
        items: [
          factory.machine({
            system_id: "abc123",
            fqdn: "test-machine",
          }),
        ],
      }),
    });
    scrollToSpy = vi.fn();
    global.scrollTo = scrollToSpy;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  routes.forEach(({ title, path }) => {
    it(`Displays: ${title} at: ${path}`, async () => {
      renderWithBrowserRouter(<Routes />, {
        route: path,
        state,
        queryData,
        routePattern: "/*",
      });
      await waitFor(() => expect(document.title).toBe(`${title} | MAAS`), {
        // Wait for pages with redirects
        timeout: LONG_TIMEOUT,
      });
    });
  });

  nodeSummaryRoutes.forEach(({ name, path }) => {
    it(`Displays: ${name} at: ${path}`, async () => {
      renderWithBrowserRouter(<Routes />, {
        route: path,
        state,
      });
      await waitFor(() =>
        expect(window.location.pathname).toBe(`${path}/summary`)
      );
    });
  });

  it("redirects from index to machines", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.index,
      state,
    });
    expect(window.location.pathname).toBe(urls.machines.index);
  });

  it("redirects from Settings base URL to general", async () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.settings.index,
      state,
    });
    await waitFor(
      () =>
        expect(window.location.pathname).toBe(
          urls.settings.configuration.general
        ),
      {
        timeout: LONG_TIMEOUT,
      }
    );
  });

  it("redirects from Preferences base URL to Details", async () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.preferences.index,
      state,
    });
    await waitFor(
      () => expect(window.location.pathname).toBe(urls.preferences.details),
      {
        // Wait for pages with redirects
        timeout: LONG_TIMEOUT,
      }
    );
  });
});
