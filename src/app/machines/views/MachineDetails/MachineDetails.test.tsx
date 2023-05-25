import { waitFor } from "@testing-library/react";
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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

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
            fqdn: "test-machine",
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
      title: "details",
    },
    {
      component: "MachineInstances",
      path: urls.machines.machine.instances({ id: "abc123" }),
      title: "instances",
    },
    {
      component: "MachineNetwork",
      path: urls.machines.machine.network({ id: "abc123" }),
      title: "network",
    },
    {
      component: "MachineStorage",
      path: urls.machines.machine.storage({ id: "abc123" }),
      title: "storage",
    },
    {
      component: "MachinePCIDevices",
      path: urls.machines.machine.pciDevices({ id: "abc123" }),
      title: "PCI devices",
    },
    {
      component: "MachineUSBDevices",
      path: urls.machines.machine.usbDevices({ id: "abc123" }),
      title: "USB devices",
    },
    {
      component: "MachineCommissioning",
      path: urls.machines.machine.commissioning.index({ id: "abc123" }),
      title: "commissioning",
    },
    {
      component: "NodeTestDetails",
      path: urls.machines.machine.commissioning.scriptResult({
        id: "abc123",
        scriptResultId: 1,
      }),
      title: "commissioning",
    },
    {
      component: "MachineTests",
      path: urls.machines.machine.testing.index({ id: "abc123" }),
      title: "tests",
    },
    {
      component: "NodeTestDetails",
      path: urls.machines.machine.testing.scriptResult({
        id: "abc123",
        scriptResultId: 1,
      }),
      title: "tests",
    },
    {
      component: "NodeLogs",
      path: urls.machines.machine.logs.index({ id: "abc123" }),
      title: "logs",
    },
    {
      component: "MachineConfiguration",
      path: urls.machines.machine.configuration({ id: "abc123" }),
      title: "configuration",
    },
  ].forEach(({ component, path, title }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      renderWithBrowserRouter(<MachineDetails />, {
        route: path,
        state,
        routePattern: `${urls.machines.machine.index(null)}/*`,
      });
      expect(document.title).toBe(
        `${state.machine.items[0].fqdn} ${title} | MAAS`
      );
    });
  });

  it("redirects to summary", () => {
    renderWithBrowserRouter(<MachineDetails />, {
      route: urls.machines.machine.index({ id: "abc123" }),
      state,
      routePattern: `${urls.machines.machine.index(null)}/*`,
    });

    expect(window.location.pathname).toBe(
      urls.machines.machine.summary({ id: "abc123" })
    );
  });

  it("dispatches an action to set the machine as active", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<MachineDetails />, {
      route: "/machine/abc123",
      store,
      routePattern: `${urls.machines.machine.index(null)}/*`,
    });

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
    state.machine.loading = false;
    renderWithBrowserRouter(<MachineDetails />, {
      route: "/machine/not-valid-id",
      state,
    });
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(<MachineDetails />, {
      route: "/machine/abc123",
      store,
      routePattern: `${urls.machines.machine.index(null)}/*`,
    });
    unmount();
    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
  });

  it("scrolls to the top when changing tabs", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<MachineDetails />, {
      route: "/machine/abc123",
      store,
      routePattern: `${urls.machines.machine.index(null)}/*`,
    });
    const linkTo = screen.getByRole("link", { name: "USB" });
    await userEvent.click(linkTo);
    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalled();
    });
  });
});
