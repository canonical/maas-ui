import { waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";

import MachineDetails from "./MachineDetails";

import urls from "app/base/urls";
import {
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("MachineDetails", () => {
  let state: any;
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
      renderWithBrowserRouter(<MachineDetails />, {
        route: path,
        store,
      });
      expect(screen.getByRole("heading")).toHaveTextContent(component);
    });
  });

  it("redirects to summary", () => {
    window.history.pushState(
      {},
      "",
      urls.machines.machine.index({ id: "abc123" })
    );
    const store = mockStore(state);
    renderWithBrowserRouter(<MachineDetails />, {
      route: urls.machines.machine.index({ id: "abc123" }),
      store,
    });
    waitFor(() => {
      expect(window.location.pathname).toBe(
        urls.machines.machine.summary({ id: "abc123" })
      );
    });
  });

  it("dispatches an action to set the machine as active", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<MachineDetails />, {
      route: "/machine/abc123",
      store,
    });
    waitFor(() => {
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
  });

  it("displays a message if the machine does not exist", () => {
    const store = mockStore(state);
    state.machine.loading = false;
    renderWithBrowserRouter(<MachineDetails />, {
      route: "/machine/not-valid-id",
      store,
    });
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });

  it("cleans up when unmounting", () => {
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(<MachineDetails />, {
      route: "/machine/abc123",
      store,
    });
    unmount();
    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    ).toBe(true);
  });

  it("scrolls to the top when changing tabs", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <>
        <Link to="/machine/abc123/commissioning" />
        <MachineDetails />
      </>,
      {
        route: "/machine/abc123",
        store,
      }
    );
    const linkTo = screen.getByRole("link");
    userEvent.click(linkTo);
    waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalled();
    });
  });
});
