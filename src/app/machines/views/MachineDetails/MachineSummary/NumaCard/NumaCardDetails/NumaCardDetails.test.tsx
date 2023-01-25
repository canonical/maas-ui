import NumaCardDetails, {
  Labels as NumaCardDetailsLabels,
} from "./NumaCardDetails";

import type { RootState } from "app/store/root/types";
import type { NodeNumaNode } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineNumaNode as machineNumaNodeFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

describe("NumaCardDetails", () => {
  let state: RootState;
  let numaNode: NodeNumaNode;
  beforeEach(() => {
    numaNode = machineNumaNodeFactory();
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            numa_nodes: [numaNode],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can display as expanded", () => {
    renderWithBrowserRouter(
      <NumaCardDetails machineId="abc123" numaNode={numaNode} showExpanded />,
      { route: "/machine/abc123", state }
    );

    expect(
      screen.queryByRole("button", { name: "Node 1" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(NumaCardDetailsLabels.Details)
    ).not.toBeInTheDocument();

    expect(screen.getByText("Node 1")).toBeInTheDocument();

    expect(
      screen.getByLabelText(NumaCardDetailsLabels.CpuCores)
    ).toHaveTextContent("0");
    expect(
      screen.getByLabelText(NumaCardDetailsLabels.Memory)
    ).toHaveTextContent("256 MiB");
    expect(
      screen.getByLabelText(NumaCardDetailsLabels.Storage)
    ).toHaveTextContent("0 B over 0 disks");
    expect(
      screen.getByLabelText(NumaCardDetailsLabels.Network)
    ).toHaveTextContent("0 interfaces");
  });

  it("can display as collapsed", () => {
    renderWithBrowserRouter(
      <NumaCardDetails machineId="abc123" numaNode={numaNode} />,
      { route: "/machine/abc123", state }
    );

    expect(screen.getByRole("button", { name: "Node 2" })).toBeInTheDocument();
    expect(
      screen.getByLabelText(NumaCardDetailsLabels.Details)
    ).toBeInTheDocument();
  });

  it("can be expanded", async () => {
    renderWithBrowserRouter(
      <NumaCardDetails machineId="abc123" numaNode={numaNode} />,
      { route: "/machine/abc123", state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Node 3" }));

    expect(
      screen.getByLabelText(NumaCardDetailsLabels.CpuCores)
    ).toHaveTextContent("0");
    expect(
      screen.getByLabelText(NumaCardDetailsLabels.Memory)
    ).toHaveTextContent("256 MiB");
    expect(
      screen.getByLabelText(NumaCardDetailsLabels.Storage)
    ).toHaveTextContent("0 B over 0 disks");
    expect(
      screen.getByLabelText(NumaCardDetailsLabels.Network)
    ).toHaveTextContent("0 interfaces");

    expect(
      screen.queryByLabelText(NumaCardDetailsLabels.Details)
    ).not.toBeInTheDocument();
  });
});
