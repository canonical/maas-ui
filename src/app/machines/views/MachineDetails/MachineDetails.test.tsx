import { mount } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { CompatRouter, Link, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineDetails from "./MachineDetails";

import urls from "app/base/urls";
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
      path: urls.machines.machine.summary({ id: "abc123" }),
    },
    {
      component: "MachineInstances",
      path: urls.machines.machine.instances({ id: "abc123" }),
    },
    {
      component: "MachineNetwork",
      path: urls.machines.machine.network({ id: "abc123" }),
    },
    {
      component: "MachineStorage",
      path: urls.machines.machine.storage({ id: "abc123" }),
    },
    {
      component: "MachinePCIDevices",
      path: urls.machines.machine.pciDevices({ id: "abc123" }),
    },
    {
      component: "MachineUSBDevices",
      path: urls.machines.machine.usbDevices({ id: "abc123" }),
    },
    {
      component: "MachineCommissioning",
      path: urls.machines.machine.commissioning.index({ id: "abc123" }),
    },
    {
      component: "NodeTestDetails",
      path: urls.machines.machine.commissioning.scriptResult({
        id: "abc123",
        scriptResultId: 1,
      }),
    },
    {
      component: "MachineTests",
      path: urls.machines.machine.testing.index({ id: "abc123" }),
    },
    {
      component: "NodeTestDetails",
      path: urls.machines.machine.testing.scriptResult({
        id: "abc123",
        scriptResultId: 1,
      }),
    },
    {
      component: "NodeLogs",
      path: urls.machines.machine.logs.index({ id: "abc123" }),
    },
    {
      component: "MachineConfiguration",
      path: urls.machines.machine.configuration({ id: "abc123" }),
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, async () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Routes>
                <Route
                  element={<MachineDetails />}
                  path={`${urls.machines.machine.index(null)}/*`}
                />
              </Routes>
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });

  it("redirects to summary", () => {
    window.history.pushState(
      {},
      "",
      urls.machines.machine.index({ id: "abc123" })
    );
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <CompatRouter>
            <Routes>
              <Route
                element={<MachineDetails />}
                path={urls.machines.machine.index(null)}
              />
            </Routes>
          </CompatRouter>
        </BrowserRouter>
      </Provider>
    );
    expect(window.location.pathname).toBe(
      urls.machines.machine.summary({ id: "abc123" })
    );
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
              <Route
                element={<MachineDetails />}
                path={urls.machines.machine.index(null)}
              />
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
              <Route
                element={<MachineDetails />}
                path={urls.machines.machine.index(null)}
              />
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
                path={urls.machines.machine.index(null)}
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
