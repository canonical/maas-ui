import { render } from "@testing-library/react";

import RAMPopover from "./RAMPopover";

import {
  podMemoryResource as podMemoryResourceFactory,
  podResource as podResourceFactory,
  vmClusterResource as vmClusterResourceFactory,
  vmClusterResourcesMemory as vmClusterResourcesMemoryFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("RAMPopover", () => {
  it("shows if memory is used by any other projects in the group", () => {
    render(
      <RAMPopover
        memory={podMemoryResourceFactory({
          general: podResourceFactory({
            allocated_other: 1,
          }),
          hugepages: podResourceFactory({
            allocated_other: 1,
          }),
        })}
        overCommit={1}
      >
        Child
      </RAMPopover>
    );
    screen.getByText("Child").focus();
    expect(screen.getByTestId("other")).toBeInTheDocument();
  });

  it("does not show other memory if no other projects in the group use them", () => {
    render(
      <RAMPopover
        memory={podMemoryResourceFactory({
          general: podResourceFactory({ allocated_other: 0 }),
          hugepages: podResourceFactory({ allocated_other: 0 }),
        })}
        overCommit={1}
      >
        Child
      </RAMPopover>
    );
    screen.getByText("Child").focus();
    expect(screen.queryByTestId("other")).not.toBeInTheDocument();
  });

  it("shows memory over-commit ratio if it is not equal to 1", () => {
    render(
      <RAMPopover memory={podMemoryResourceFactory()} overCommit={2}>
        Child
      </RAMPopover>
    );
    screen.getByText("Child").focus();
    expect(screen.getByTestId("overcommit")).toBeInTheDocument();
  });

  it("does not show memory over-commit ratio if it is equal to 1", () => {
    render(
      <RAMPopover memory={podMemoryResourceFactory()} overCommit={1}>
        Child
      </RAMPopover>
    );
    screen.getByText("Child").focus();
    expect(screen.queryByTestId("overcommit")).not.toBeInTheDocument();
  });

  it("displays memory for a vmcluster", () => {
    const memory = vmClusterResourcesMemoryFactory({
      general: vmClusterResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      }),
      hugepages: vmClusterResourceFactory({
        allocated_other: 4,
        allocated_tracked: 5,
        free: 6,
      }),
    });
    render(<RAMPopover memory={memory}>Child</RAMPopover>);
    screen.getByText("Child").focus();
    expect(screen.getByTestId("other")).toHaveTextContent("5B");
    expect(screen.getByTestId("allocated")).toHaveTextContent("7B");
    expect(screen.getByTestId("free")).toHaveTextContent("9B");
    expect(screen.getByTestId("total")).toHaveTextContent("21B");
  });
});
