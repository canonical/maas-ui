import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import configureStore from "redux-mock-store";

import AddDeviceInterfaces from "../AddDeviceInterfaces";
import type { AddDeviceInterface } from "../types";

import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter, within } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("AddDeviceInterfaces", () => {
  let interfaces: AddDeviceInterface[];
  let state: RootState;

  beforeEach(() => {
    interfaces = [
      {
        id: 0,
        ip_address: "",
        ip_assignment: DeviceIpAssignment.DYNAMIC,
        mac: "",
        name: "eth0",
        subnet: "",
      },
    ];
    state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 0, name: "default" })],
        loaded: true,
      }),
    });
  });

  it("does not show subnet or IP address fields for dynamic IP assignment", () => {
    interfaces[0].ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
        <AddDeviceInterfaces />
      </Formik>,
      { store }
    );

    expect(screen.queryByTestId("subnet-field")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ip-address-field")).not.toBeInTheDocument();
  });

  it("shows the IP address field for external IP assignment", () => {
    interfaces[0].ip_assignment = DeviceIpAssignment.EXTERNAL;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
        <AddDeviceInterfaces />
      </Formik>,
      { store }
    );

    expect(screen.queryByTestId("subnet-field")).not.toBeInTheDocument();
    expect(screen.getByTestId("ip-address-field")).toBeInTheDocument();
  });

  it("shows both the subnet and IP address fields for static IP assignment", () => {
    interfaces[0].ip_assignment = DeviceIpAssignment.STATIC;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
        <AddDeviceInterfaces />
      </Formik>,
      { store }
    );

    expect(screen.getByTestId("subnet-field")).toBeInTheDocument();
    expect(screen.getByTestId("ip-address-field")).toBeInTheDocument();
  });

  it("can add and remove interfaces", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
        <AddDeviceInterfaces />
      </Formik>,
      { store }
    );

    const getCardCount = () => screen.getAllByTestId("interface-card").length;

    // There is only one interface by default. Since at least one interface must
    // be defined, the remove button should be hidden.
    expect(getCardCount()).toBe(1);
    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();

    // Add an interface.
    await userEvent.click(
      screen.getByRole("button", { name: /Add interface/i })
    );

    expect(getCardCount()).toBe(2);
    expect(screen.queryAllByRole("button", { name: /delete/i })).toHaveLength(
      2
    );

    // Remove an interface.
    await userEvent.click(
      within(screen.getAllByTestId("interface-card")[0]).getByRole("button", {
        name: /delete/i,
      })
    );

    expect(getCardCount()).toBe(1);
    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();
  });
});
