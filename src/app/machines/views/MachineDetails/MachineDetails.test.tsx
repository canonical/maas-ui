import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Link, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineDetails from "./MachineDetails";

import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("MachineDetails", () => {
  let state: RootState;
  let scrollToSpy: jest.Mock;

  beforeEach(() => {
    scrollToSpy = jest.fn();
    global.scrollTo = scrollToSpy;
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            devices: [machineDeviceFactory()],
          }),
        ],
        loaded: true,
      }),
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  [
    {
      component: "MachineSummary",
      route: machineURLs.machine.summary(null),
      path: machineURLs.machine.summary({ id: "abc123" }),
    },
    {
      component: "MachineInstances",
      route: machineURLs.machine.instances(null),
      path: machineURLs.machine.instances({ id: "abc123" }),
    },
    {
      component: "MachineNetwork",
      route: machineURLs.machine.network(null),
      path: machineURLs.machine.network({ id: "abc123" }),
    },
    {
      component: "MachineStorage",
      route: machineURLs.machine.storage(null),
      path: machineURLs.machine.storage({ id: "abc123" }),
    },
    {
      component: "MachinePCIDevices",
      route: machineURLs.machine.pciDevices(null),
      path: machineURLs.machine.pciDevices({ id: "abc123" }),
    },
    {
      component: "MachineUSBDevices",
      route: machineURLs.machine.usbDevices(null),
      path: machineURLs.machine.usbDevices({ id: "abc123" }),
    },
    {
      component: "MachineCommissioning",
      route: machineURLs.machine.commissioning.index(null),
      path: machineURLs.machine.commissioning.index({ id: "abc123" }),
    },
    {
      component: "NodeTestDetails",
      route: machineURLs.machine.commissioning.scriptResult(null),
      path: machineURLs.machine.commissioning.scriptResult({
        id: "abc123",
        scriptResultId: 1,
      }),
    },
    {
      component: "MachineTests",
      route: machineURLs.machine.testing.index(null),
      path: machineURLs.machine.testing.index({ id: "abc123" }),
    },
    {
      component: "NodeTestDetails",
      route: machineURLs.machine.testing.scriptResult(null),
      path: machineURLs.machine.testing.scriptResult({
        id: "abc123",
        scriptResultId: 1,
      }),
    },
    {
      component: "NodeLogs",
      route: machineURLs.machine.logs.index(null),
      path: machineURLs.machine.logs.index({ id: "abc123" }),
    },
    {
      component: "MachineConfiguration",
      route: machineURLs.machine.configuration(null),
      path: machineURLs.machine.configuration({ id: "abc123" }),
    },
    {
      // Redirects to summary:
      component: "MachineSummary",
      route: machineURLs.machine.index(null),
      path: machineURLs.machine.index({ id: "abc123" }),
    },
  ].forEach(({ component, path, route }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Routes>
                <Route element={<MachineDetails />} path={route || "*/:id/*"} />
              </Routes>
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });

  it("dispatches an action to set the machine as active", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <Routes>
              <Route element={<MachineDetails />} path="/machine/:id" />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().find((action) => action.type === "machine/setActive")
    ).toEqual({
      meta: {
        method: "set_active",
        model: "machine",
      },
      payload: {
        params: {
          system_id: "abc123",
        },
      },
      type: "machine/setActive",
    });
  });

  it("displays a message if the machine does not exist", () => {
    const store = mockStore(state);
    state.machine.loading = false;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/not-valid-id", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <MachineDetails />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='not-found']").exists()).toBe(true);
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <Routes>
              <Route element={<MachineDetails />} path="/machine/:id" />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
  });

  it("scrolls to the top when changing tabs", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={
                  <>
                    <Link to="/machine/abc123/commissioning" />
                    <MachineDetails />
                  </>
                }
                path="/machine/:id"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Link").first().simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(scrollToSpy).toHaveBeenCalled();
  });
});
