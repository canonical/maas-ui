import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Routes from "./Routes";

import urls from "app/base/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

const componentPaths: { component: string; path: string }[] = [
  {
    // Redirects to machines:
    component: "Redirect",
    path: urls.index,
  },
  {
    component: "Intro",
    path: urls.intro.index,
  },
  {
    component: "Preferences",
    path: urls.preferences.index,
  },
  {
    component: "Controllers",
    path: urls.controllers.index,
  },
  {
    component: "DeviceList",
    path: urls.devices.index,
  },
  {
    component: "DeviceDetails",
    path: urls.devices.device.index({ id: "abc123" }),
  },
  {
    component: "Domains",
    path: urls.domains.index,
  },
  {
    component: "Domains",
    path: urls.domains.details({ id: 1 }),
  },
  {
    component: "Images",
    path: urls.images.index,
  },
  {
    component: "KVM",
    path: urls.kvm.index,
  },
  {
    component: "Machines",
    path: urls.machines.index,
  },
  {
    component: "MachineDetails",
    path: urls.machines.machine.index({ id: "abc123" }),
  },
  {
    component: "Pools",
    path: urls.pools.index,
  },
  {
    component: "Settings",
    path: urls.settings.index,
  },
  {
    component: "SubnetsList",
    path: urls.subnets.index,
  },
  {
    component: "FabricDetails",
    path: urls.subnets.fabric.index({ id: 1 }),
  },
  {
    component: "SpaceDetails",
    path: urls.subnets.space.index({ id: 1 }),
  },
  {
    component: "SubnetDetails",
    path: urls.subnets.subnet.index({ id: 1 }),
  },
  {
    component: "VLANDetails",
    path: urls.subnets.vlan.index({ id: 1 }),
  },
  {
    component: "Tags",
    path: urls.tags.index,
  },
  {
    component: "Tags",
    path: urls.tags.tag.index({ id: 1 }),
  },
  {
    component: "NotFound",
    path: "/not/a/path",
  },
  {
    component: "Zones",
    path: urls.zones.index,
  },
  {
    component: "Zones",
    path: urls.zones.details({ id: 1 }),
  },
  {
    component: "Dashboard",
    path: urls.dashboard.index,
  },
];

describe("Routes", () => {
  beforeEach(() => {
    global.scrollTo = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  componentPaths.forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Routes />
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
