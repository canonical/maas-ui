import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import CPUPopover from "./CPUPopover";

import {
  podResource as podResourceFactory,
  vmClusterResource as vmClusterResourceFactory,
} from "testing/factories";
import { screen } from "testing/utils";

describe("CPUPopover", () => {
  it("shows if cores are used by any other projects in the group", () => {
    act(() => {
      render(
        <CPUPopover
          cores={podResourceFactory({
            allocated_other: 1,
          })}
          overCommit={1}
        >
          Child
        </CPUPopover>
      );
    });
    const popover = screen.getByRole("button");
    userEvent.click(popover);
    expect(screen.getByTestId("other")).toBeInTheDocument();
  });

  it("does not show other cores if no other projects in the group use them", () => {
    act(() => {
      render(
        <CPUPopover
          cores={podResourceFactory({
            allocated_other: 0,
          })}
          overCommit={1}
        >
          Child
        </CPUPopover>
      );
    });
    const popover = screen.getByRole("button");
    userEvent.click(popover);
    expect(screen.queryByTestId("other")).not.toBeInTheDocument();
  });

  it("shows CPU over-commit ratio if it is not equal to 1", () => {
    act(() => {
      render(
        <CPUPopover
          cores={podResourceFactory({
            allocated_other: 1,
          })}
          overCommit={2}
        >
          Child
        </CPUPopover>
      );
    });
    const popover = screen.getByRole("button");
    userEvent.click(popover);
    expect(screen.getByTestId("overcommit")).toBeInTheDocument();
  });

  it("does not show CPU over-commit ratio if it is equal to 1", () => {
    act(() => {
      render(
        <CPUPopover
          cores={podResourceFactory({
            allocated_other: 1,
          })}
          overCommit={1}
        >
          Child
        </CPUPopover>
      );
    });
    const popover = screen.getByRole("button");
    userEvent.click(popover);
    expect(screen.queryByTestId("overcommit")).not.toBeInTheDocument();
  });

  it("displays cores for a vmcluster", () => {
    act(() => {
      render(
        <CPUPopover
          cores={vmClusterResourceFactory({
            allocated_other: 1,
            allocated_tracked: 2,
            free: 3,
          })}
          overCommit={1}
        >
          Child
        </CPUPopover>
      );
    });
    const popover = screen.getByRole("button");
    userEvent.click(popover);
    expect(screen.getByTestId("other")).toHaveTextContent("1");
    expect(screen.getByTestId("allocated")).toHaveTextContent("2");
    expect(screen.getByTestId("free")).toHaveTextContent("3");
    expect(screen.getByTestId("total")).toHaveTextContent("6");
  });
});
