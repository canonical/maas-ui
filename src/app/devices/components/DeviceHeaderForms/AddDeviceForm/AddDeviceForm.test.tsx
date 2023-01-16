import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import AddDeviceForm from "./AddDeviceForm";

import { actions as deviceActions } from "app/store/device";
import { DeviceIpAssignment } from "app/store/device/types";
import { actions as domainActions } from "app/store/domain";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import { actions as zoneActions } from "app/store/zone";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { screen, within, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("AddDeviceForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 0, name: "maas" })],
        loaded: true,
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 0, name: "subnet" })],
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
        items: [zoneFactory({ id: 0, name: "default" })],
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<AddDeviceForm clearHeaderContent={jest.fn()} />, {
      store,
    });

    const expectedActions = [
      domainActions.fetch(),
      subnetActions.fetch(),
      zoneActions.fetch(),
    ];
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    });
  });

  it("displays a spinner if data has not loaded", () => {
    state.zone.genericActions.fetch = "idle";
    const store = mockStore(state);
    renderWithBrowserRouter(<AddDeviceForm clearHeaderContent={jest.fn()} />, {
      store,
    });

    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it("can handle saving a device", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<AddDeviceForm clearHeaderContent={jest.fn()} />, {
      store,
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: "Device name" }),
      "plot-device"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Domain" }),
      "maas"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Zone" }),
      "default"
    );

    // Add interfaces

    await userEvent.click(
      screen.getByRole("button", { name: "Add interface" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Add interface" })
    );

    const rows = screen.getAllByTestId("interface-row");

    const getFieldFromRow = (index: number, name: string, type: string) => {
      return within(
        within(rows[index]).getByRole("gridcell", { name: name })
      ).getByRole(type);
    };

    await userEvent.type(
      getFieldFromRow(0, "* MAC address", "textbox"),
      "11:11:11:11:11:11"
    );

    await userEvent.selectOptions(
      getFieldFromRow(0, "* IP assignment", "combobox"),
      DeviceIpAssignment.STATIC
    );

    await userEvent.selectOptions(
      getFieldFromRow(0, "Subnet", "combobox"),
      "0"
    );

    await userEvent.type(
      getFieldFromRow(0, "IP address", "textbox"),
      "192.168.1.1"
    );

    await userEvent.type(
      getFieldFromRow(1, "* MAC address", "textbox"),
      "22:22:22:22:22:22"
    );

    await userEvent.selectOptions(
      getFieldFromRow(1, "* IP assignment", "combobox"),
      DeviceIpAssignment.EXTERNAL
    );

    await userEvent.type(
      getFieldFromRow(1, "IP address", "textbox"),
      "192.168.1.2"
    );

    await userEvent.type(
      getFieldFromRow(2, "* MAC address", "textbox"),
      "33:33:33:33:33:33"
    );

    await userEvent.selectOptions(
      getFieldFromRow(2, "* IP assignment", "combobox"),
      DeviceIpAssignment.DYNAMIC
    );

    await userEvent.click(screen.getByRole("button", { name: "Save device" }));

    const expectedAction = deviceActions.create({
      domain: { name: "maas" },
      extra_macs: ["22:22:22:22:22:22", "33:33:33:33:33:33"],
      hostname: "plot-device",
      interfaces: [
        {
          ip_address: "192.168.1.1",
          ip_assignment: DeviceIpAssignment.STATIC,
          mac: "11:11:11:11:11:11",
          name: "eth0",
          subnet: 0,
        },
        {
          ip_address: "192.168.1.2",
          ip_assignment: DeviceIpAssignment.EXTERNAL,
          mac: "22:22:22:22:22:22",
          name: "eth1",
          subnet: null,
        },
        {
          ip_address: null,
          ip_assignment: DeviceIpAssignment.DYNAMIC,
          mac: "33:33:33:33:33:33",
          name: "eth2",
          subnet: null,
        },
      ],
      primary_mac: "11:11:11:11:11:11",
      zone: { name: "default" },
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
