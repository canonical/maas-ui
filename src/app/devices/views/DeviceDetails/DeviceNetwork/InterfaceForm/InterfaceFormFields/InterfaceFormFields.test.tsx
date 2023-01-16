import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import configureStore from "redux-mock-store";

import type { InterfaceFormValues } from "../InterfaceForm";

import InterfaceFormFields from "./InterfaceFormFields";

import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("InterfaceFormFields", () => {
  let initialValues: InterfaceFormValues;
  let state: RootState;
  beforeEach(() => {
    initialValues = {
      ip_address: "",
      ip_assignment: DeviceIpAssignment.DYNAMIC,
      mac_address: "",
      name: "",
      subnet: "",
      tags: [],
    };
    state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 1 }), subnetFactory({ id: 2 })],
        loaded: true,
      }),
    });
  });

  it("can render without headings", () => {
    initialValues.ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <InterfaceFormFields />
      </Formik>,
      { store }
    );

    expect(
      screen.queryByTestId("interface-form-heading")
    ).not.toBeInTheDocument();
  });

  it("can render with headings", () => {
    initialValues.ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <InterfaceFormFields showTitles />
      </Formik>,
      { store }
    );

    const titles = screen.getAllByTestId("interface-form-heading");
    expect(titles[0]).toBeInTheDocument();
    expect(titles[1]).toBeInTheDocument();
  });

  it("does not show subnet or IP address fields for dynamic IP assignment", () => {
    initialValues.ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <InterfaceFormFields />
      </Formik>,
      { store }
    );

    expect(screen.queryByTestId("subnet-field")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ip-address-field")).not.toBeInTheDocument();
  });

  it("shows the IP address field for external IP assignment", () => {
    initialValues.ip_assignment = DeviceIpAssignment.EXTERNAL;
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <InterfaceFormFields />
      </Formik>,
      { store }
    );

    expect(screen.queryByTestId("subnet-field")).not.toBeInTheDocument();
    expect(screen.getByTestId("ip-address-field")).toBeInTheDocument();
  });

  it("shows both the subnet and IP address fields for static IP assignment", () => {
    initialValues.ip_assignment = DeviceIpAssignment.STATIC;
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <InterfaceFormFields />
      </Formik>,
      { store }
    );

    expect(screen.getByTestId("subnet-field")).toBeInTheDocument();
    expect(screen.getByTestId("ip-address-field")).toBeInTheDocument();
  });

  it("clears subnet and IP address values when changing IP assignment", async () => {
    initialValues.ip_assignment = DeviceIpAssignment.STATIC;
    initialValues.subnet = 1;
    initialValues.ip_address = "192.168.1.1";
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <InterfaceFormFields />
      </Formik>,
      { store }
    );

    expect(screen.getByTestId("subnet-field")).toHaveValue("1");
    expect(screen.getByTestId("ip-address-field")).toHaveValue("192.168.1.1");

    // Change IP assignment to something else then back to the original value.
    await userEvent.selectOptions(
      screen.getByTestId("ip-assignment-field"),
      DeviceIpAssignment.DYNAMIC
    );
    await userEvent.selectOptions(
      screen.getByTestId("ip-assignment-field"),
      DeviceIpAssignment.STATIC
    );

    expect(screen.getByTestId("subnet-field")).toHaveValue("");
    expect(screen.getByTestId("ip-address-field")).toHaveValue("");
  });
});
