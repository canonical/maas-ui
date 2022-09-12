import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import { DeviceType } from "../types";

import DiscoveryAddFormFields, {
  Labels as DiscoveryAddFormFieldsLabels,
} from "./DiscoveryAddFormFields";

import { DeviceMeta } from "app/store/device/types";
import type { Discovery } from "app/store/discovery/types";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("DiscoveryAddFormFields", () => {
  let state: RootState;
  let discovery: Discovery;

  beforeEach(() => {
    discovery = discoveryFactory();
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [discovery],
      }),
    });
  });

  it("shows fields for a device", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{ type: DeviceType.DEVICE }} onSubmit={jest.fn()}>
        <DiscoveryAddFormFields
          discovery={discovery}
          setDevice={jest.fn()}
          setDeviceType={jest.fn()}
        />
      </Formik>,
      { route: "/dashboard", wrapperProps: { state } }
    );
    expect(
      screen.getByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.Domain,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.Parent,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: DiscoveryAddFormFieldsLabels.Hostname + " (optional)",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("textbox", {
        name: DiscoveryAddFormFieldsLabels.InterfaceName + " (optional)",
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.DeviceName,
      })
    ).not.toBeInTheDocument();
  });

  it("shows fields for an interface", () => {
    renderWithBrowserRouter(
      <Formik
        initialValues={{ type: DeviceType.INTERFACE }}
        onSubmit={jest.fn()}
      >
        <DiscoveryAddFormFields
          discovery={discovery}
          setDevice={jest.fn()}
          setDeviceType={jest.fn()}
        />
      </Formik>,
      { route: "/dashboard", wrapperProps: { state } }
    );
    expect(
      screen.queryByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.Domain,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.Parent,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: DiscoveryAddFormFieldsLabels.Hostname + " (optional)",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: DiscoveryAddFormFieldsLabels.InterfaceName + " (optional)",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.DeviceName,
      })
    ).toBeInTheDocument();
  });

  it("includes static ip if there is a subnet", () => {
    discovery.subnet = 0;
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <DiscoveryAddFormFields
          discovery={discovery}
          setDevice={jest.fn()}
          setDeviceType={jest.fn()}
        />
      </Formik>,
      { route: "/dashboard", wrapperProps: { state } }
    );

    const ipAssignment = screen.getByRole("combobox", {
      name: "IP assignment",
    });

    expect(
      within(ipAssignment).getByRole("option", {
        name: "Static",
      })
    ).toBeInTheDocument();
  });

  it("does not includes static ip if there is no subnet", () => {
    discovery.subnet = null;
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <DiscoveryAddFormFields
          discovery={discovery}
          setDevice={jest.fn()}
          setDeviceType={jest.fn()}
        />
      </Formik>,
      { route: "/dashboard", wrapperProps: { state } }
    );

    const ipAssignment = screen.getByRole("combobox", {
      name: "IP assignment",
    });

    expect(
      within(ipAssignment).queryByRole("option", {
        name: "Static",
      })
    ).not.toBeInTheDocument();
  });

  it("calls the callback with the selected device type", async () => {
    const setDeviceType = jest.fn();
    const setDevice = jest.fn();
    state.device = deviceStateFactory({
      items: [
        deviceFactory({ [DeviceMeta.PK]: "abc123" }),
        deviceFactory({ [DeviceMeta.PK]: "def456" }),
      ],
    });
    renderWithBrowserRouter(
      <Formik
        initialValues={{ type: DeviceType.INTERFACE }}
        onSubmit={jest.fn()}
      >
        <DiscoveryAddFormFields
          discovery={discovery}
          setDevice={setDevice}
          setDeviceType={setDeviceType}
        />
      </Formik>,
      { route: "/dashboard", wrapperProps: { state } }
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: DiscoveryAddFormFieldsLabels.Type }),
      DeviceType.INTERFACE
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.DeviceName,
      }),
      "abc123"
    );
    expect(setDeviceType).toHaveBeenCalledWith(DeviceType.INTERFACE);
    // The device should get cleared.
    expect(setDevice).toHaveBeenCalledWith(null);
  });

  it("calls the callback with the device id when selecting a device", async () => {
    const setDevice = jest.fn();
    state.device = deviceStateFactory({
      items: [
        deviceFactory({ [DeviceMeta.PK]: "abc123" }),
        deviceFactory({ [DeviceMeta.PK]: "def456" }),
      ],
    });
    renderWithBrowserRouter(
      <Formik
        initialValues={{ type: DeviceType.INTERFACE }}
        onSubmit={jest.fn()}
      >
        <DiscoveryAddFormFields
          discovery={discovery}
          setDevice={setDevice}
          setDeviceType={jest.fn()}
        />
      </Formik>,
      { route: "/dashboard", wrapperProps: { state } }
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", {
        name: DiscoveryAddFormFieldsLabels.DeviceName,
      }),
      "abc123"
    );
    expect(setDevice).toHaveBeenCalledWith("abc123");
  });
});
