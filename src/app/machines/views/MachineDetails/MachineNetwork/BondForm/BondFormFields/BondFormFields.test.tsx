import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import { LinkMonitoring } from "../types";

import BondFormFields from "./BondFormFields";

import {
  BondLacpRate,
  BondMode,
  BondXmitHashPolicy,
} from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  generalState as generalStateFactory,
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const route = "/machines";

describe("BondFormFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          data: bondOptionsFactory({
            lacp_rates: [
              [BondLacpRate.FAST, BondLacpRate.FAST],
              [BondLacpRate.SLOW, BondLacpRate.SLOW],
            ],
            modes: [
              [BondMode.BALANCE_RR, BondMode.BALANCE_RR],
              [BondMode.ACTIVE_BACKUP, BondMode.ACTIVE_BACKUP],
              [BondMode.BALANCE_XOR, BondMode.BALANCE_XOR],
              [BondMode.BROADCAST, BondMode.BROADCAST],
              [BondMode.LINK_AGGREGATION, BondMode.LINK_AGGREGATION],
              [BondMode.BALANCE_TLB, BondMode.BALANCE_TLB],
              [BondMode.BALANCE_ALB, BondMode.BALANCE_ALB],
            ],
            xmit_hash_policies: [
              [BondXmitHashPolicy.LAYER2, BondXmitHashPolicy.LAYER2],
              [BondXmitHashPolicy.LAYER2_3, BondXmitHashPolicy.LAYER2_3],
              [BondXmitHashPolicy.LAYER3_4, BondXmitHashPolicy.LAYER3_4],
              [BondXmitHashPolicy.ENCAP2_3, BondXmitHashPolicy.ENCAP2_3],
              [BondXmitHashPolicy.ENCAP3_4, BondXmitHashPolicy.ENCAP3_4],
            ],
          }),
          loaded: true,
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            interfaces: [
              machineInterfaceFactory({
                id: 17,
                type: NetworkInterfaceTypes.PHYSICAL,
                mac_address: "6a:6e:4a:29:a5:42",
              }),
            ],
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("does not display the hash policy field by default", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );

    expect(
      screen.queryByRole("combobox", { name: "Hash policy" })
    ).not.toBeInTheDocument();
  });

  it("displays the hash policy field for some bond modes", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Bond mode" }),
      BondMode.BALANCE_XOR
    );

    expect(
      screen.getByRole("combobox", { name: "Hash policy" })
    ).toBeInTheDocument();
  });

  it("does not display the lacp rate field by default", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );

    expect(
      screen.queryByRole("combobox", { name: "LACP rate" })
    ).not.toBeInTheDocument();
  });

  it("displays the lacp rate field for some bond modes", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Bond mode" }),
      BondMode.LINK_AGGREGATION
    );

    expect(
      screen.getByRole("combobox", { name: "LACP rate" })
    ).toBeInTheDocument();
  });

  it("does not display the monitoring fields by default", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );

    const monitoringFieldNames = [
      "Monitoring frequency (ms)",
      "Updelay (ms)",
      "Downdelay (ms)",
    ];

    monitoringFieldNames.forEach((field) =>
      expect(
        screen.queryByRole("textbox", { name: field })
      ).not.toBeInTheDocument()
    );
  });

  it("displays the monitoring fields when link monitoring is set", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Link monitoring" }),
      LinkMonitoring.MII
    );

    const monitoringFieldNames = [
      "Monitoring frequency (ms)",
      "Updelay (ms)",
      "Downdelay (ms)",
    ];

    monitoringFieldNames.forEach((field) =>
      expect(screen.getByRole("textbox", { name: field })).toBeInTheDocument()
    );
  });

  // it("sets the mac address field when the nic field changes", async () => {
  //   renderWithBrowserRouter(
  //     <Formik initialValues={{ mac_address: "" }} onSubmit={jest.fn()}>
  //       <BondFormFields selected={[]} systemId="abc123" />
  //     </Formik>,
  //     { route, wrapperProps: { state } }
  //   );
  //   await userEvent.click(
  //     screen.getByRole("radio", { name: "Use MAC address from bond member" })
  //   );
  //   await userEvent.selectOptions(
  //     screen.getByRole("combobox", { name: "Select bond member" }),
  //     "6a:6e:4a:29:a5:42"
  //   );
  //   expect(screen.getByRole("textbox", { name: "MAC address" })).toHaveValue(
  //     "6a:6e:4a:29:a5:42"
  //   );
  // });

  it("enables the mac address field when the radio is changed to manual", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{ mac_address: "" }} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );
    await userEvent.click(
      screen.getByRole("radio", { name: "Manual MAC address" })
    );

    expect(
      screen.getByRole("textbox", { name: "MAC address" })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("combobox", { name: "Select bond member" })
    ).toBeDisabled();
  });

  it("enables the mac nic field when the radio is changed to 'nic'", async () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );
    await userEvent.click(
      screen.getByRole("radio", { name: "Use MAC address from bond member" })
    );

    expect(screen.getByRole("textbox", { name: "MAC address" })).toBeDisabled();
    expect(
      screen.getByRole("combobox", { name: "Select bond member" })
    ).not.toBeDisabled();
  });

  it("resets the mac address field when the radio is changed to 'nic'", async () => {
    renderWithBrowserRouter(
      <Formik
        initialValues={{ macNic: "6a:6e:4a:29:a5:42", mac_address: "" }}
        onSubmit={jest.fn()}
      >
        <BondFormFields selected={[]} systemId="abc123" />
      </Formik>,
      { route, wrapperProps: { state } }
    );
    // Enable the mac address field so it can be changed.
    await userEvent.click(
      screen.getByRole("radio", { name: "Manual MAC address" })
    );

    // Change the mac address.
    await userEvent.type(
      screen.getByRole("textbox", { name: "MAC address" }),
      "11:11:11:11:11:11"
    );

    // Enable the nic select again
    await userEvent.click(
      screen.getByRole("radio", { name: "Use MAC address from bond member" })
    );
    // The mac address field should be updated to the nic select value.
    expect(screen.getByRole("textbox", { name: "MAC address" })).toHaveValue(
      "6a:6e:4a:29:a5:42"
    );
  });
});
