import { render, screen } from "@testing-library/react";

import DiskNumaNodes from "./DiskNumaNodes";

import { nodeDisk as diskFactory } from "testing/factories";

describe("DiskNumaNodes", () => {
  it("can show a single numa node", () => {
    const disk = diskFactory({
      numa_node: 5,
      numa_nodes: undefined,
    });
    render(<DiskNumaNodes disk={disk} />);
    expect(screen.getByTestId("numa-nodes")).toHaveTextContent("5");
  });

  it("can show multiple numa nodes with a warning", () => {
    const disk = diskFactory({
      numa_node: undefined,
      numa_nodes: [0, 1],
    });
    render(<DiskNumaNodes disk={disk} />);
    expect(screen.getByTestId("numa-nodes")).toHaveTextContent("0, 1");
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      /This volume is spread over multiple NUMA nodes/
    );
  });
});
