import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import AddInterface from "./AddInterface";

import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();
const createNewInterface = async () => {
  await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
  await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "eth123");

  await userEvent.type(
    screen.getByRole("textbox", { name: "MAC address" }),
    "11:22:33:44:55:66"
  );

  await userEvent.type(screen.getByRole("textbox", { name: "Tags" }), "tag1");

  await userEvent.click(screen.getByTestId("new-tag"));

  await userEvent.type(screen.getByRole("textbox", { name: "Tags" }), "tag2");

  await userEvent.click(screen.getByTestId("new-tag"));

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "IP assignment" }),
    DeviceIpAssignment.STATIC
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Subnet" }),
    "2"
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "IP address" }),
    "192.168.1.1"
  );

  await userEvent.click(screen.getByRole("button", { name: "Save interface" }));
};

describe("AddInterface", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [
          deviceDetailsFactory({
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
      <AddInterface closeForm={jest.fn()} systemId="abc123" />,
      { store }
    );

    expect(screen.getByTestId("loading-device-details"));
  });

  it("correctly dispatches action to create an interface", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddInterface closeForm={jest.fn()} systemId="abc123" />,
      { store }
    );

    await createNewInterface();

    const expectedAction = deviceActions.createInterface({
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.STATIC,
      mac_address: "11:22:33:44:55:66",
      name: "eth123",
      subnet: "2",
      tags: ["tag1", "tag2"],
      system_id: "abc123",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("closes the form if there are no errors when creating the interface", async () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddInterface closeForm={closeForm} systemId="abc123" />,
      { store }
    );

    mockFormikFormSaved();
    await createNewInterface();

    expect(closeForm).toHaveBeenCalled();
  });

  it("does not close the form if there is an error when creating the interface", async () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddInterface closeForm={closeForm} systemId="abc123" />,
      { store }
    );
    await createNewInterface();
    const errors = jest.spyOn(deviceSelectors, "eventErrorsForDevices");
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "createInterface",
      }),
    ]);
    const creatingInterface = jest.spyOn(deviceSelectors, "getStatusForDevice");
    creatingInterface.mockReturnValue(true);
    store.dispatch({ type: "" });
    creatingInterface.mockReturnValue(false);
    store.dispatch({ type: "" });
    expect(closeForm).not.toHaveBeenCalled();
  });

  it("does not close the form if there is an error when submitting the form multiple times", async () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddInterface closeForm={closeForm} systemId="abc123" />,
      { store }
    );
    await createNewInterface();
    const errors = jest.spyOn(deviceSelectors, "eventErrorsForDevices");
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "createInterface",
      }),
    ]);
    const creatingInterface = jest.spyOn(deviceSelectors, "getStatusForDevice");
    creatingInterface.mockReturnValue(true);
    store.dispatch({ type: "" });
    creatingInterface.mockReturnValue(false);
    store.dispatch({ type: "" });
    errors.mockReturnValue([]);
    await userEvent.click(
      screen.getByRole("button", { name: "Save interface" })
    );
    creatingInterface.mockReturnValue(true);
    store.dispatch({ type: "" });
    creatingInterface.mockReturnValue(false);

    // Mock an error for the second submission.
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "createInterface",
      }),
    ]);
    store.dispatch({ type: "" });
    expect(closeForm).not.toHaveBeenCalled();
  });
});
