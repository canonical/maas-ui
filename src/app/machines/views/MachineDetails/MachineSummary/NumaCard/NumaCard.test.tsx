import { screen, within } from "@testing-library/react";

import NumaCard, { Labels as NumaCardLabels } from "./NumaCard";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineNumaNode as machineNumaNodeFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("NumaCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            numa_nodes: [machineNumaNodeFactory()],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("renders when there are no numa nodes", () => {
    state.machine.items = [
      machineDetailsFactory({
        numa_nodes: [],
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(<NumaCard id="abc123" />, {
      route: "/machine/abc123",
      wrapperProps: { state },
    });

    const numa_card = screen.getByLabelText(NumaCardLabels.NumaCard);
    expect(within(numa_card).getByText("0 NUMA nodes")).toBeInTheDocument();
    expect(
      within(numa_card).queryByRole("list", { name: NumaCardLabels.NumaList })
    ).not.toBeInTheDocument();
  });

  it("renders with numa nodes", () => {
    renderWithBrowserRouter(<NumaCard id="abc123" />, {
      route: "/machine/abc123",
      wrapperProps: { state },
    });
    expect(screen.getByLabelText(NumaCardLabels.NumaCard)).toMatchSnapshot();
  });
});
