import configureStore from "redux-mock-store";

import ReservedRanges, { Labels } from "./ReservedRanges";

import type { IPRange } from "@/app/store/iprange/types";
import { IPRangeType } from "@/app/store/iprange/types";
import type { RootState } from "@/app/store/root/types";
import type { Subnet } from "@/app/store/subnet/types";
import type { VLAN } from "@/app/store/vlan/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  waitFor,
  within,
  renderWithProviders,
} from "@/testing/utils";

const mockStore = configureStore();
let ipRange: IPRange;
let state: RootState;
let subnet: Subnet;
let vlan: VLAN;

beforeEach(() => {
  subnet = factory.subnet();
  vlan = factory.vlan();
  ipRange = factory.ipRange({
    comment: "what a beaut",
    start_ip: "11.1.1.1",
    subnet: subnet.id,
    type: IPRangeType.Reserved,
    user: "wombat",
  });
  state = factory.rootState({
    iprange: factory.ipRangeState({
      items: [ipRange],
    }),
    subnet: factory.subnetState({
      items: [subnet],
    }),
    vlan: factory.vlanState({
      items: [vlan],
    }),
  });
});

it("renders the correct columns for a chosen subnet", () => {
  const subnet2 = factory.subnet();
  state.iprange.items = [
    factory.ipRange({ start_ip: "11.1.1.1", subnet: subnet.id }),
    factory.ipRange({ start_ip: "11.1.1.2", subnet: subnet.id }),
    factory.ipRange({ start_ip: "11.1.1.3", subnet: subnet2.id }),
  ];
  state.subnet.items = [subnet, subnet2];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges subnetId={subnet.id} />, {
    store,
  });
  const reservedRangesTable = within(
    screen.getByRole("region", {
      name: "Reserved ranges",
    })
  ).getByRole("grid");

  [
    Labels.Actions,
    Labels.Comment,
    Labels.EndIP,
    Labels.Owner,
    Labels.StartIP,
    Labels.Type,
  ].forEach((label) => {
    expect(
      screen.getByRole("columnheader", {
        name: new RegExp(`^${label}`, "i"),
      })
    ).toBeInTheDocument();
  });

  expect(within(reservedRangesTable).getAllByRole("row")).toHaveLength(2 + 1);
});

it("renders the correct columns for a chosen vlan", () => {
  const vlan2 = factory.vlan();
  state.iprange.items = [
    factory.ipRange({ start_ip: "11.1.1.1", vlan: vlan.id }),
    factory.ipRange({ start_ip: "11.1.1.2", vlan: vlan.id }),
    factory.ipRange({ start_ip: "11.1.1.3", vlan: vlan2.id }),
  ];
  state.vlan.items = [vlan, vlan2];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges hasVLANSubnets vlanId={vlan.id} />, {
    store,
  });

  const reservedRangesTable = within(
    screen.getByRole("region", {
      name: "Reserved ranges",
    })
  ).getByRole("grid");

  [
    Labels.Actions,
    Labels.Comment,
    Labels.EndIP,
    Labels.Owner,
    Labels.StartIP,
    Labels.Type,
    Labels.Subnet,
  ].forEach((label) => {
    expect(
      screen.getByRole("columnheader", {
        name: new RegExp(`^${label}`, "i"),
      })
    ).toBeInTheDocument();
  });

  expect(within(reservedRangesTable).getAllByRole("row")).toHaveLength(2 + 1);
});

it("displays an empty message for a subnet", () => {
  state.iprange.items = [];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges subnetId={subnet.id} />, {
    store,
  });
  expect(
    screen.getByText("No IP ranges have been reserved for this subnet.")
  ).toBeInTheDocument();
});

it("displays an empty message for a vlan", () => {
  state.iprange.items = [];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges hasVLANSubnets vlanId={vlan.id} />, {
    store,
  });
  expect(
    screen.getByText("No IP ranges have been reserved for this VLAN.")
  ).toBeInTheDocument();
});

it("displays a message if there are no subnets in a VLAN", () => {
  state.subnet.items = [];
  const store = mockStore(state);
  renderWithProviders(
    <ReservedRanges hasVLANSubnets={false} vlanId={vlan.id} />,
    {
      store,
    }
  );
  expect(
    screen.getByText(/No subnets are available on this VLAN/)
  ).toBeInTheDocument();
});

it("displays the right content when range type is 'dynamic'", () => {
  ipRange.type = IPRangeType.Dynamic;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges subnetId={subnet.id} />, {
    store,
  });

  const reservedRangesTable = within(
    screen.getByRole("region", {
      name: "Reserved ranges",
    })
  ).getByRole("grid");

  expect(
    within(reservedRangesTable).getAllByRole("cell", { name: "Dynamic" })
  ).toHaveLength(2);

  expect(
    within(reservedRangesTable).getAllByRole("cell", { name: "MAAS" })
  ).toHaveLength(1);
});

it("displays the right content when range type is 'reserved'", () => {
  ipRange.type = IPRangeType.Reserved;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges subnetId={subnet.id} />, {
    store,
  });

  const reservedRangesTable = within(
    screen.getByRole("region", {
      name: "Reserved ranges",
    })
  ).getByRole("grid");

  expect(
    within(reservedRangesTable).getAllByRole("cell", { name: "Reserved" })
  ).toHaveLength(1);

  expect(
    within(reservedRangesTable).getAllByRole("cell", { name: "wombat" })
  ).toHaveLength(1);
});

it("displays an add button when range type is 'reserved'", () => {
  ipRange.type = IPRangeType.Reserved;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges subnetId={subnet.id} />, {
    store,
  });
  expect(
    screen.getByRole("button", {
      name: Labels.ReserveRange,
    })
  ).toBeInTheDocument();
});

it("displays an add button when range type is 'dynamic'", async () => {
  ipRange.type = IPRangeType.Dynamic;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges subnetId={subnet.id} />, {
    store,
  });
  await userEvent.click(
    screen.queryAllByRole("button", {
      name: Labels.ReserveRange,
    })[0]
  );
  await userEvent.click(screen.getByTestId("reserve-dynamic-range-menu-item"));

  await waitFor(() => {
    expect(
      screen.getByRole("button", {
        name: Labels.ReserveDynamicRange,
      })
    ).toBeInTheDocument();
  });
});

it("disables the add button if there are no subnets in a VLAN", () => {
  ipRange.type = IPRangeType.Reserved;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  renderWithProviders(<ReservedRanges vlanId={vlan.id} />, {
    store,
  });
  expect(
    screen.getByRole("button", { name: Labels.ReserveRange })
  ).toBeAriaDisabled();
});
