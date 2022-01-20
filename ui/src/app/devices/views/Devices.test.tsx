import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Devices from "./Devices";

import devicesURLs from "app/devices/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Devices", () => {
  [
    {
      component: "DeviceList",
      path: devicesURLs.devices.index,
    },
    {
      component: "DeviceDetails",
      path: devicesURLs.device.configuration({ id: "abc123" }),
    },
    {
      component: "DeviceDetails",
      path: devicesURLs.device.index({ id: "abc123" }),
    },
    {
      component: "DeviceDetails",
      path: devicesURLs.device.network({ id: "abc123" }),
    },
    {
      component: "DeviceDetails",
      path: devicesURLs.device.summary({ id: "abc123" }),
    },
    {
      component: "NotFound",
      path: "/not/a/path",
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <Devices />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
