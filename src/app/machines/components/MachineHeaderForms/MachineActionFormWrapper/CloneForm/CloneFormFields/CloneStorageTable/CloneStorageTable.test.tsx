import CloneStorageTable from "./CloneStorageTable";

import {
  machineDetails as machineDetailsFactory,
  nodeDisk as diskFactory,
  nodeFilesystem as fsFactory,
  nodePartition as partitionFactory,
} from "testing/factories";
import { render, screen, within } from "testing/utils";

describe("CloneStorageTable", () => {
  it("renders empty table if neither loading details nor machine provided", () => {
    render(<CloneStorageTable machine={null} selected={false} />);
    expect(screen.getAllByRole("row")).toHaveLength(1);
    expect(screen.queryByTestId("placeholder")).not.toBeInTheDocument();
  });

  it("renders placeholder content while machine details are loading", () => {
    render(
      <CloneStorageTable
        loadingMachineDetails
        machine={null}
        selected={false}
      />
    );
    const rows = screen.getAllByRole("row");
    rows.shift();

    rows.forEach((row) => {
      const placeholders = within(row).getAllByTestId("placeholder");
      expect(placeholders[0]).toHaveTextContent("Disk name");
      expect(placeholders[1]).toHaveTextContent("Model");
      expect(placeholders[2]).toHaveTextContent("1.0.0");
      expect(placeholders[3]).toHaveTextContent("Disk type");
      expect(placeholders[4]).toHaveTextContent("X, X");
      expect(placeholders[5]).toHaveTextContent("1.23 GB");
      expect(placeholders[6]).toHaveTextContent("Icon");
    });
  });

  it("renders machine storage details if machine is provided", () => {
    const machine = machineDetailsFactory({
      disks: [diskFactory({ name: "Disk 1" })],
    });
    render(<CloneStorageTable machine={machine} selected={false} />);
    expect(screen.queryByTestId("placeholder")).not.toBeInTheDocument();

    expect(screen.getByText("Disk 1")).toBeInTheDocument();
  });

  it("shows a tick for available disks", () => {
    const machine = machineDetailsFactory({
      disks: [diskFactory({ available_size: 1000000000, size: 1000000000 })],
    });
    render(<CloneStorageTable machine={machine} selected={false} />);
    expect(screen.getByTestId("disk-available")).toHaveClass("p-icon--tick");
  });

  it("shows a cross for unavailable disks", () => {
    const machine = machineDetailsFactory({
      disks: [diskFactory({ available_size: 0, size: 1000000000 })],
    });
    render(<CloneStorageTable machine={machine} selected={false} />);
    expect(screen.getByTestId("disk-available")).toHaveClass("p-icon--close");
  });

  it("shows a tick for available partitions", () => {
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({ partitions: [partitionFactory({ filesystem: null })] }),
      ],
    });
    render(<CloneStorageTable machine={machine} selected={false} />);
    expect(screen.getByTestId("partition-available")).toHaveClass(
      "p-icon--tick"
    );
  });

  it("shows a cross for unavailable partitions", () => {
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({
          partitions: [partitionFactory({ filesystem: fsFactory() })],
        }),
      ],
    });
    render(<CloneStorageTable machine={machine} selected={false} />);
    expect(screen.getByTestId("partition-available")).toHaveClass(
      "p-icon--close"
    );
  });
});
