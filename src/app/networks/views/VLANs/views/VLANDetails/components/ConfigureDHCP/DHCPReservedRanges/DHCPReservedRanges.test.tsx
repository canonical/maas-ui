import { Formik } from "formik";

import type { ConfigureDHCPValues } from "../ConfigureDHCP";
import { DHCPType } from "../ConfigureDHCP";

import DHCPReservedRanges, { Headers } from "./DHCPReservedRanges";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
  within,
} from "@/testing/utils";

let initialValues: ConfigureDHCPValues;

beforeEach(() => {
  initialValues = {
    dhcpType: DHCPType.CONTROLLERS,
    enableDHCP: true,
    endIP: "",
    gatewayIP: "",
    primaryRack: "",
    relayVLAN: "",
    secondaryRack: "",
    startIP: "",
    subnet: "",
  };
});

it("renders a table of IP ranges if the VLAN has any defined", () => {
  const vlan = factory.vlan();
  const subnet = factory.subnet({ gateway_ip: "192.168.1.11", vlan: vlan.id });
  const ipRange = factory.ipRange({
    start_ip: "192.168.1.1",
    end_ip: "192.168.1.10",
    subnet: subnet.id,
    vlan: vlan.id,
  });
  const state = factory.rootState({
    iprange: factory.ipRangeState({ items: [ipRange] }),
    subnet: factory.subnetState({ items: [subnet] }),
    vlan: factory.vlanState({ items: [vlan] }),
  });
  renderWithProviders(
    <Formik initialValues={initialValues} onSubmit={vi.fn()}>
      <DHCPReservedRanges id={vlan.id} />
    </Formik>,
    { state }
  );

  expect(
    within(screen.getByRole("gridcell", { name: Headers.Subnet })).getByRole(
      "link"
    )
  ).toHaveAttribute("href", urls.networks.subnet.index({ id: subnet.id }));
  expect(
    screen.getByRole("gridcell", { name: Headers.StartIP }).textContent
  ).toBe(ipRange.start_ip);
  expect(
    screen.getByRole("gridcell", { name: Headers.EndIP }).textContent
  ).toBe(ipRange.end_ip);
  expect(
    screen.getByRole("gridcell", { name: Headers.GatewayIP }).textContent
  ).toBe(subnet.gateway_ip);
});

it(`renders only a subnet select field if no IP ranges exist and no subnet is
    selected`, () => {
  const vlan = factory.vlan();
  const subnet = factory.subnet({ gateway_ip: "192.168.1.11", vlan: vlan.id });
  const state = factory.rootState({
    iprange: factory.ipRangeState({ items: [] }),
    subnet: factory.subnetState({ items: [subnet], loaded: true }),
    vlan: factory.vlanState({ items: [vlan] }),
  });
  renderWithProviders(
    <Formik initialValues={initialValues} onSubmit={vi.fn()}>
      <DHCPReservedRanges id={vlan.id} />
    </Formik>,
    { state }
  );

  expect(
    within(screen.getByRole("gridcell", { name: Headers.Subnet })).getByRole(
      "combobox",
      { name: "Subnet" }
    )
  ).toBeInTheDocument();
  expect(
    screen.getByRole("gridcell", { name: Headers.StartIP })
  ).toBeEmptyDOMElement();
  expect(
    screen.getByRole("gridcell", { name: Headers.EndIP })
  ).toBeEmptyDOMElement();
  expect(
    screen.getByRole("gridcell", { name: Headers.GatewayIP })
  ).toBeEmptyDOMElement();
});

it(`renders a subnet select field and prepopulated fields for a reserved range
    if no IP ranges exist and a subnet is selected`, async () => {
  const vlan = factory.vlan();
  const subnet = factory.subnet({
    gateway_ip: "192.168.1.11",
    statistics: factory.subnetStatistics({
      suggested_dynamic_range: factory.subnetStatisticsRange({
        start: "192.168.1.1",
        end: "192.168.1.5",
      }),
    }),
    vlan: vlan.id,
  });
  const state = factory.rootState({
    iprange: factory.ipRangeState({ items: [] }),
    subnet: factory.subnetState({ items: [subnet], loaded: true }),
    vlan: factory.vlanState({ items: [vlan] }),
  });
  renderWithProviders(
    <Formik initialValues={initialValues} onSubmit={vi.fn()}>
      <DHCPReservedRanges id={vlan.id} />
    </Formik>,
    { state }
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Subnet" }),
    subnet.id.toString()
  );

  await waitFor(() => {
    expect(
      within(screen.getByRole("gridcell", { name: Headers.Subnet })).getByRole(
        "combobox",
        { name: "Subnet" }
      )
    ).toBeInTheDocument();
  });
  expect(
    within(screen.getByRole("gridcell", { name: Headers.StartIP })).getByRole(
      "textbox",
      { name: Headers.StartIP }
    )
  ).toHaveAttribute("value", subnet.statistics.suggested_dynamic_range.start);
  expect(
    within(screen.getByRole("gridcell", { name: Headers.EndIP })).getByRole(
      "textbox",
      { name: Headers.EndIP }
    )
  ).toHaveAttribute("value", subnet.statistics.suggested_dynamic_range.end);
  expect(
    within(screen.getByRole("gridcell", { name: Headers.GatewayIP })).getByRole(
      "textbox",
      { name: Headers.GatewayIP }
    )
  ).toHaveAttribute("value", subnet.gateway_ip);
});
