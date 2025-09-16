import ReservedRangesTable, { Labels } from "./ReservedRangesTable";

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
  renderWithProviders,
} from "@/testing/utils";

let ipRange: IPRange;
let state: RootState;
let subnet: Subnet;
let vlan: VLAN;

describe("ReservedRangesTable", () => {
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

  it("renders for a subnet", () => {
    const subnet2 = factory.subnet();
    state.iprange.items = [
      factory.ipRange({ start_ip: "11.1.1.1", subnet: subnet.id }),
      factory.ipRange({ start_ip: "11.1.1.2", subnet: subnet.id }),
      factory.ipRange({ start_ip: "11.1.1.3", subnet: subnet2.id }),
    ];
    state.subnet.items = [subnet, subnet2];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    expect(
      screen.queryAllByRole("gridcell", {
        name: Labels.StartIP,
      })
    ).toHaveLength(2);
    expect(
      screen
        .getAllByRole("gridcell", {
          name: Labels.StartIP,
        })
        .find((td) => td.textContent === "11.1.1.1")
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("gridcell", {
          name: Labels.StartIP,
        })
        .find((td) => td.textContent === "11.1.1.2")
    ).toBeInTheDocument();
  });

  it("renders for a vlan", () => {
    const vlan2 = factory.vlan();
    state.iprange.items = [
      factory.ipRange({ start_ip: "11.1.1.1", vlan: vlan.id }),
      factory.ipRange({ start_ip: "11.1.1.2", vlan: vlan.id }),
      factory.ipRange({ start_ip: "11.1.1.3", vlan: vlan2.id }),
    ];
    state.vlan.items = [vlan, vlan2];
    renderWithProviders(
      <ReservedRangesTable hasVLANSubnets vlanId={vlan.id} />,
      {
        state,
      }
    );
    expect(
      screen.queryAllByRole("gridcell", {
        name: Labels.StartIP,
      })
    ).toHaveLength(2);
    expect(
      screen
        .getAllByRole("gridcell", {
          name: Labels.StartIP,
        })
        .find((td) => td.textContent === "11.1.1.1")
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("gridcell", {
          name: Labels.StartIP,
        })
        .find((td) => td.textContent === "11.1.1.2")
    ).toBeInTheDocument();
  });

  it("displays an empty message for a subnet", () => {
    state.iprange.items = [];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    expect(
      screen.getByText("No IP ranges have been reserved for this subnet.")
    ).toBeInTheDocument();
  });

  it("displays an empty message for a vlan", () => {
    state.iprange.items = [];
    renderWithProviders(
      <ReservedRangesTable hasVLANSubnets vlanId={vlan.id} />,
      {
        state,
      }
    );
    expect(
      screen.getByText("No IP ranges have been reserved for this VLAN.")
    ).toBeInTheDocument();
  });

  it("displays a message if there are no subnets in a VLAN", () => {
    state.subnet.items = [];
    renderWithProviders(<ReservedRangesTable vlanId={vlan.id} />, {
      state,
    });
    expect(
      screen.getByText(/No subnets are available on this VLAN/)
    ).toBeInTheDocument();
  });

  it("displays content when it is dynamic", () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    expect(
      screen.getByRole("gridcell", {
        name: Labels.Type,
      })
    ).toHaveTextContent("Dynamic");
    expect(
      screen.getByRole("gridcell", {
        name: Labels.Owner,
      })
    ).toHaveTextContent("MAAS");
    expect(
      screen.getByRole("gridcell", {
        name: Labels.Comment,
      })
    ).toHaveTextContent("Dynamic");
  });

  it("displays content when it is reserved", () => {
    ipRange.type = IPRangeType.Reserved;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    expect(
      screen.getByRole("gridcell", {
        name: Labels.Type,
      })
    ).toHaveTextContent("Reserved");
    expect(
      screen.getByRole("gridcell", {
        name: Labels.Owner,
      })
    ).toHaveTextContent("wombat");
    expect(
      screen.getByRole("gridcell", {
        name: Labels.Comment,
      })
    ).toHaveTextContent("what a beaut");
  });

  it("displays an add button when it is reserved", () => {
    ipRange.type = IPRangeType.Reserved;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    expect(
      screen.getByRole("button", {
        name: Labels.ReserveRange,
      })
    ).toBeInTheDocument();
  });

  it("displays an add button when it is dynamic", async () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    await userEvent.click(
      screen.queryAllByRole("button", {
        name: Labels.ReserveRange,
      })[0]
    );
    await userEvent.click(
      screen.getByTestId("reserve-dynamic-range-menu-item")
    );

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
    renderWithProviders(<ReservedRangesTable vlanId={vlan.id} />, {
      state,
    });
    expect(
      screen.getByRole("button", { name: Labels.ReserveRange })
    ).toBeAriaDisabled();
  });

  it("displays the subnet column when the table is for a VLAN", () => {
    state.iprange.items = [
      factory.ipRange({ start_ip: "11.1.1.1", vlan: vlan.id }),
    ];
    renderWithProviders(
      <ReservedRangesTable hasVLANSubnets vlanId={vlan.id} />,
      {
        state,
      }
    );
    expect(
      screen.getByRole("gridcell", {
        name: Labels.Subnet,
      })
    ).toBeInTheDocument();
  });

  it("does not display the subnet column when the table is for a subnet", () => {
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    expect(
      screen.queryByRole("gridcell", {
        name: Labels.Subnet,
      })
    ).not.toBeInTheDocument();
  });
});
