import CPUPopover from "./CPUPopover";

import {
  podResource as podResourceFactory,
  vmClusterResource as vmClusterResourceFactory,
} from "testing/factories";
import { render, screen, userEvent } from "testing/utils";

describe("CPUPopover", () => {
  it("shows if cores are used by any other projects in the group", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: "Child" }));
    expect(screen.getByTestId("other")).toHaveTextContent("1");
  });

  it("does not show other cores if no other projects in the group use them", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: "Child" }));
    expect(screen.queryByTestId("other")).not.toBeInTheDocument();
  });

  it("shows CPU over-commit ratio if it is not equal to 1", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: "Child" }));
    expect(screen.getByTestId("overcommit")).toHaveTextContent("2");
  });

  it("does not show CPU over-commit ratio if it is equal to 1", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: "Child" }));
    expect(screen.queryByTestId("overcommit")).not.toBeInTheDocument();
  });

  it("displays cores for a vmcluster", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: "Child" }));
    expect(screen.getByTestId("other")).toHaveTextContent("1");
    expect(screen.getByTestId("allocated")).toHaveTextContent("2");
    expect(screen.getByTestId("free")).toHaveTextContent("3");
    expect(screen.getByTestId("total")).toHaveTextContent("6");
  });
});
