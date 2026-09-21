import AddReservedRange, { Labels } from "./AddReservedRange";

import { ipRangeActions } from "@/app/store/iprange";
import type { IPRange } from "@/app/store/iprange/types";
import { IPRangeType } from "@/app/store/iprange/types";
import type { RootState } from "@/app/store/root/types";
import type { Subnet } from "@/app/store/subnet/types";
import * as factory from "@/testing/factories";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

describe("AddReservedRange", () => {
  let state: RootState;
  let ipRange: IPRange;
  let subnet: Subnet;

  beforeEach(() => {
    ipRange = factory.ipRange({
      comment: "what a beaut",
      start_ip: "10.10.0.1",
      end_ip: "10.10.0.100",
      type: IPRangeType.Reserved,
      user: "wombat",
    });
    subnet = factory.subnet({ cidr: "10.10.0.0/24" });
    state = factory.rootState({
      iprange: factory.ipRangeState({
        items: [ipRange],
      }),
      subnet: factory.subnetState({
        items: [subnet],
      }),
    });
  });

  it("displays a spinner when it is editing and data is loading", () => {
    state.iprange.items = [];

    renderWithProviders(
      <AddReservedRange
        createType={ipRange.type}
        ipRangeId={ipRange.id}
        subnetId={subnet.id}
      />,
      { state }
    );
    expect(screen.getByTestId("Spinner")).toBeInTheDocument();
  });

  it("does not display a spinner when it is not in edit mode", () => {
    renderWithProviders(
      <AddReservedRange createType={ipRange.type} subnetId={subnet.id} />,
      {
        state,
      }
    );
    expect(screen.queryByTestId("Spinner")).not.toBeInTheDocument();
  });

  it("initialises the reserved range details when editing", () => {
    renderWithProviders(
      <AddReservedRange
        createType={ipRange.type}
        ipRangeId={ipRange.id}
        subnetId={subnet.id}
      />,
      { state }
    );
    expect(
      screen.getByRole("textbox", { name: Labels.StartIp })
    ).toHaveAttribute("value", ipRange.start_ip.split(".")[-1]); // value should only be the last octet of the address
    expect(screen.getByRole("textbox", { name: Labels.EndIp })).toHaveAttribute(
      "value",
      ipRange.end_ip.split(".")[-1] // value should only be the last octet of the address
    );
    expect(
      screen.getByRole("textbox", { name: Labels.Comment })
    ).toHaveAttribute("value", ipRange.comment);
  });

  it("initialises the details when editing a dynamic range", () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];

    renderWithProviders(
      <AddReservedRange
        createType={ipRange.type}
        ipRangeId={ipRange.id}
        subnetId={subnet.id}
      />,
      { state }
    );
    expect(
      screen.getByRole("textbox", { name: Labels.Comment })
    ).toHaveAttribute("value", "Dynamic");
    expect(
      screen.getByRole("textbox", { name: Labels.Comment })
    ).toHaveAttribute("disabled");
  });

  it("dispatches an action to create a reserved range", async () => {
    const { store } = renderWithProviders(
      <AddReservedRange createType={ipRange.type} subnetId={subnet.id} />,
      { state }
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.StartIp }),
      "1"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.EndIp }),
      "99"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.Comment }),
      "reserved"
    );
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
    const expected = ipRangeActions.create({
      comment: "reserved",
      start_ip: "10.10.0.1",
      end_ip: "10.10.0.99",
      subnet: subnet.id,
      type: IPRangeType.Reserved,
    });
    await waitFor(() => {
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });
  });

  it("dispatches an action to update a reserved range", async () => {
    const { store } = renderWithProviders(
      <AddReservedRange
        createType={ipRange.type}
        ipRangeId={ipRange.id}
        subnetId={subnet.id}
      />,
      { state }
    );
    const startIpField = screen.getByRole("textbox", { name: Labels.StartIp });
    await userEvent.clear(startIpField);
    await userEvent.type(startIpField, "20");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: "10.10.0.20",
    });
    await waitFor(() => {
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });
  });

  it("resets the comment when updating a dynamic range", async () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];
    const { store } = renderWithProviders(
      <AddReservedRange
        createType={ipRange.type}
        ipRangeId={ipRange.id}
        subnetId={subnet.id}
      />,
      { state }
    );
    const startIpField = screen.getByRole("textbox", { name: Labels.StartIp });
    await userEvent.clear(startIpField);
    await userEvent.type(startIpField, "4");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: "10.10.0.4",
    });
    await waitFor(() => {
      const actual = store
        .getActions()
        .find((action) => action.type === expected.type);
      expect(actual.payload.params.comment).toBe(
        expected.payload.params.comment
      );
    });
  });

  it("does not display the Comment field when creating a dynamic range", async () => {
    renderWithProviders(
      <AddReservedRange
        createType={IPRangeType.Dynamic}
        subnetId={subnet.id}
      />,
      { state }
    );
    expect(
      screen.queryByRole("textbox", { name: Labels.Comment })
    ).not.toBeInTheDocument();
  });

  it("displays an error when start and end IP addresses are not provided", async () => {
    renderWithProviders(
      <AddReservedRange createType={ipRange.type} subnetId={subnet.id} />,
      { state }
    );
    await userEvent.click(
      screen.getByRole("textbox", { name: Labels.StartIp })
    );
    await userEvent.click(screen.getByRole("textbox", { name: Labels.EndIp }));
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
    expect(
      await screen.findByLabelText(Labels.StartIp)
    ).toHaveAccessibleErrorMessage(/Start IP is required/);
    expect(
      await screen.findByLabelText(Labels.EndIp)
    ).toHaveAccessibleErrorMessage(/End IP is required/);
  });

  it("displays an error when an invalid IP address is entered", async () => {
    renderWithProviders(
      <AddReservedRange createType={ipRange.type} subnetId={subnet.id} />,
      { state }
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.StartIp }),
      "abc"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.EndIp }),
      "abc"
    );
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
    expect(
      await screen.findByLabelText(Labels.StartIp)
    ).toHaveAccessibleErrorMessage(/This is not a valid IP address/);
    expect(
      await screen.findByLabelText(Labels.EndIp)
    ).toHaveAccessibleErrorMessage(/This is not a valid IP address/);
  });

  it.each([
    {
      type: IPRangeType.Reserved,
      cidr: "10.10.0.0/24",
      start: "0",
      end: "255",
      invalidFields: [Labels.StartIp, Labels.EndIp],
    },
    {
      type: IPRangeType.Reserved,
      cidr: "10.10.0.0/25",
      start: "128",
      end: "100",
      invalidFields: [Labels.StartIp],
    },
    {
      type: IPRangeType.Reserved,
      cidr: "10.10.0.0/25",
      start: "20",
      end: "128",
      invalidFields: [Labels.EndIp],
    },
    {
      type: IPRangeType.Dynamic,
      cidr: "10.10.0.0/25",
      start: "20",
      end: "128",
      invalidFields: [Labels.EndIp],
    },
  ])(
    "rejects a $type range $start-$end outside $cidr",
    async ({ type, cidr, start, end, invalidFields }) => {
      subnet.cidr = cidr;
      const { store } = renderWithProviders(
        <AddReservedRange createType={type} subnetId={subnet.id} />,
        { state }
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: Labels.StartIp }),
        start
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: Labels.EndIp }),
        end
      );
      await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
      await waitFor(() => {
        invalidFields.forEach((label) => {
          expect(
            screen.getByRole("textbox", { name: label })
          ).toHaveAccessibleErrorMessage(
            /The IP address is outside of the subnet's range/
          );
        });
      });
      expect(
        store
          .getActions()
          .some((action) => action.type === ipRangeActions.create.type)
      ).toBe(false);
    }
  );
});
