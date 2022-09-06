import configureStore from "redux-mock-store";

import Routes from "./Routes";
import type { RootState } from "./store/root/types";

import urls from "app/base/urls";
import { rootState as rootStateFactory } from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

const routes: { title: string; path: string }[] = [
  // {
  //   // Redirects to machines:
  //   title: "Redirect",
  //   path: urls.index,
  // },
  {
    title: "Welcome",
    path: urls.intro.index,
  },
  {
    title: "Welcome",
    path: urls.preferences.index,
  },
  {
    title: "Controllers",
    path: urls.controllers.index,
  },
  {
    title: "Controllers",
    path: urls.controllers.controller.index({ id: "abc123" }),
  },
  {
    title: "Devices",
    path: urls.devices.index,
  },
  {
    title: "Devices",
    path: urls.devices.device.index({ id: "abc123" }),
  },
  {
    title: "DNS",
    path: urls.domains.index,
  },
  // {
  //   title: "DomainDetails",
  //   path: urls.domains.details({ id: 1 }),
  // },
  {
    title: "Images",
    path: urls.images.index,
  },
  {
    title: "KVM",
    path: urls.kvm.index,
  },
  {
    title: "Machines",
    path: urls.machines.index,
  },
  {
    title: "Machines",
    path: urls.machines.machine.index({ id: "abc123" }),
  },
  {
    title: "Pools",
    path: urls.pools.index,
  },
  {
    title: "Pools",
    path: urls.settings.index,
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
  // {
  //   title: "ZoneDetails",
  //   path: urls.zones.details({ id: 1 }),
  // },
  // {
  //   title: "Dashboard",
  //   path: urls.dashboard.index,
  // },
];

describe("Routes", () => {
  beforeEach(() => {
    global.scrollTo = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  routes.forEach(({ title, path }) => {
    it(`Displays: ${title} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      renderWithBrowserRouter(<Routes />, {
        route: path,
        wrapperProps: { store },
      });
      expect(document.title).toBe(`${title} | MAAS`);
    });
  });
});
