import configureStore from "redux-mock-store";

import EditInterface from "./EditInterface";

import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { DeviceNetworkInterface } from "app/store/device/types";
import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceInterface as deviceInterfaceFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("EditInterface", () => {
  let state: RootState;
  let nic: DeviceNetworkInterface;
  beforeEach(() => {
    nic = deviceInterfaceFactory();
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [
          deviceDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        loaded: true,
        statuses: deviceStatusesFactory({
          abc123: deviceStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 1 }), subnetFactory({ id: 2 })],
        loaded: true,
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays a spinner if device is not detailed version", () => {
    state.device.items[0] = deviceFactory({ system_id: "abc123" });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface closeForm={jest.fn()} nicId={nic.id} systemId="abc123" />,
      { store }
    );
    expect(screen.getByTestId("loading-device-details")).toBeInTheDocument();
  });

  it("dispatches an action to update an interface", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface closeForm={jest.fn()} nicId={nic.id} systemId="abc123" />,
      { store }
    );
    const formValues = {
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.EXTERNAL,
      mac_address: "11:22:33:44:55:66",
      name: "eth123",
      tags: [],
    };
    await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Name" }),
      "eth123"
    );

    await userEvent.clear(screen.getByRole("textbox", { name: "MAC address" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "MAC address" }),
      "11:22:33:44:55:66"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "IP assignment" }),
      DeviceIpAssignment.EXTERNAL
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "IP address" }),
      "192.168.1.1"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );

    const expectedAction = deviceActions.updateInterface({
      ...formValues,
      interface_id: nic.id,
      system_id: "abc123",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("closes the form if there are no errors when updating the interface", async () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        closeForm={closeForm}
        nicId={nic.id}
        systemId={"abc123"}
      />,
      { store }
    );
    mockFormikFormSaved();
    await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Name" }),
      "eth123"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );
    expect(closeForm).toHaveBeenCalled();
  });

  it("does not close the form if there is an error when updating the interface", async () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        closeForm={closeForm}
        nicId={nic.id}
        systemId={"abc123"}
      />,
      { store }
    );
    await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Name" }),
      "eth123"
    );
    const errors = jest.spyOn(deviceSelectors, "eventErrorsForDevices");
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "updateInterface",
      }),
    ]);
    const updatingInterface = jest.spyOn(deviceSelectors, "getStatusForDevice");
    updatingInterface.mockReturnValue(true);
    store.dispatch({ type: "" });
    updatingInterface.mockReturnValue(false);
    store.dispatch({ type: "" });
    expect(closeForm).not.toHaveBeenCalled();
  });

  it("does not close the form if there is an error when submitting the form multiple times", async () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        closeForm={closeForm}
        nicId={nic.id}
        systemId={"abc123"}
      />,
      { store }
    );
    await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Name" }),
      "eth123"
    );
    const errors = jest.spyOn(deviceSelectors, "eventErrorsForDevices");
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "updateInterface",
      }),
    ]);
    const updatingInterface = jest.spyOn(deviceSelectors, "getStatusForDevice");
    updatingInterface.mockReturnValue(true);
    store.dispatch({ type: "" });
    updatingInterface.mockReturnValue(false);
    store.dispatch({ type: "" });
    errors.mockReturnValue([]);

    await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Name" }),
      "eth123"
    );
    updatingInterface.mockReturnValue(true);
    store.dispatch({ type: "" });
    updatingInterface.mockReturnValue(false);
    // Mock an error for the second submission.
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "updateInterface",
      }),
    ]);
    store.dispatch({ type: "" });
    expect(closeForm).not.toHaveBeenCalled();
  });
});
