import ReservedRangesTable, { Labels } from "./ReservedRangesTable";

import AddReservedRange from "@/app/networks/components/AddReservedRange";
import type { IPRange } from "@/app/store/iprange/types";
import { IPRangeType } from "@/app/store/iprange/types";
import type { RootState } from "@/app/store/root/types";
import type { Subnet } from "@/app/store/subnet/types";
import type { VLAN } from "@/app/store/vlan/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  within,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

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

  it("renders the correct columns for a chosen subnet", () => {
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
    const ReservedRangesTableTable = within(
      screen.getByRole("region", {
        name: "Reserved ranges",
      })
    ).getByRole("treegrid");

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

    expect(within(ReservedRangesTableTable).getAllByRole("row")).toHaveLength(
      2 + 1
    );
  });

  it("renders the correct columns for a chosen vlan", () => {
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

    const ReservedRangesTableTable = within(
      screen.getByRole("region", {
        name: "Reserved ranges",
      })
    ).getByRole("treegrid");

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

    expect(within(ReservedRangesTableTable).getAllByRole("row")).toHaveLength(
      2 + 1
    );
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
    renderWithProviders(
      <ReservedRangesTable hasVLANSubnets={false} vlanId={vlan.id} />,
      {
        state,
      }
    );
    expect(
      screen.getByText(/No subnets are available on this VLAN/)
    ).toBeInTheDocument();
  });

  it("displays the right content when range type is 'dynamic'", () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });

    const ReservedRangesTableTable = within(
      screen.getByRole("region", {
        name: "Reserved ranges",
      })
    ).getByRole("treegrid");

    expect(
      within(ReservedRangesTableTable).getAllByRole("gridcell", {
        name: "Dynamic",
      })
    ).toHaveLength(2);

    expect(
      within(ReservedRangesTableTable).getAllByRole("gridcell", {
        name: "MAAS",
      })
    ).toHaveLength(1);
  });

  it("displays the right content when range type is 'reserved'", () => {
    ipRange.type = IPRangeType.Reserved;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });

    const ReservedRangesTableTable = within(
      screen.getByRole("region", {
        name: "Reserved ranges",
      })
    ).getByRole("treegrid");

    expect(
      within(ReservedRangesTableTable).getAllByRole("gridcell", {
        name: "Reserved",
      })
    ).toHaveLength(1);

    expect(
      within(ReservedRangesTableTable).getAllByRole("gridcell", {
        name: "wombat",
      })
    ).toHaveLength(1);
  });

  it("displays an add button when range type is 'reserved'", () => {
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

  it("displays an add button when range type is 'dynamic'", async () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });
    await waitFor(() => {
      expect(
        screen.queryAllByRole("button", { name: Labels.ReserveRange })[0]
      ).not.toBeAriaDisabled();
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

  describe.each(["subnet", "VLAN"])("actions from a %s", (view) => {
    it.each([
      [IPRangeType.Reserved, Labels.ReserveRange],
      [IPRangeType.Dynamic, Labels.ReserveDynamicRange],
    ])(
      "opens the %s form with the correct subnet context",
      async (type, label) => {
        renderWithProviders(
          view === "subnet" ? (
            <ReservedRangesTable subnetId={subnet.id} />
          ) : (
            <ReservedRangesTable hasVLANSubnets vlanId={vlan.id} />
          ),
          { state }
        );

        const button = screen.getByRole("button", {
          name: Labels.ReserveRange,
        });
        await waitFor(() => {
          expect(button).not.toBeAriaDisabled();
        });
        await userEvent.click(button);
        await userEvent.click(screen.getByRole("menuitem", { name: label }));

        expect(mockOpen).toHaveBeenCalledWith({
          component: AddReservedRange,
          title: label,
          props: {
            createType: type,
            subnetId: view === "subnet" ? subnet.id : undefined,
          },
        });
      }
    );

    it.each([IPRangeType.Reserved, IPRangeType.Dynamic])(
      "edits a %s range using its own subnet",
      async (type) => {
        ipRange.type = type;
        ipRange.vlan = vlan.id;
        renderWithProviders(
          view === "subnet" ? (
            <ReservedRangesTable subnetId={subnet.id} />
          ) : (
            <ReservedRangesTable hasVLANSubnets vlanId={vlan.id} />
          ),
          { state }
        );

        await waitFor(() => {
          expect(
            screen.getByRole("button", { name: "Edit" })
          ).not.toBeAriaDisabled();
        });
        await userEvent.click(screen.getByRole("button", { name: "Edit" }));

        expect(mockOpen).toHaveBeenCalledWith({
          component: AddReservedRange,
          title: "Edit reserved range",
          props: {
            createType: type,
            ipRangeId: ipRange.id,
            subnetId: subnet.id,
          },
        });
      }
    );
  });

  it("disables the Reserve range dropdown and table actions without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    ipRange.type = IPRangeType.Reserved;
    state.iprange.items = [ipRange];
    renderWithProviders(<ReservedRangesTable subnetId={subnet.id} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: Labels.ReserveRange })
      ).toBeAriaDisabled();
    });
    expect(screen.getByRole("button", { name: "Edit" })).toBeAriaDisabled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
  });
});
