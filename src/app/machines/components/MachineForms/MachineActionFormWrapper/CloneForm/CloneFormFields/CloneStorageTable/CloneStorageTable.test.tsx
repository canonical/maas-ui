import CloneStorageTable from "./CloneStorageTable";

import * as factory from "@/testing/factories";
import { screen, renderWithProviders } from "@/testing/utils";

describe("CloneStorageTable", () => {
  it("renders the table", () => {
    renderWithProviders(<CloneStorageTable machine={null} selected={false} />);
    expect(screen.getByTestId("p-generic-table")).toBeInTheDocument();
  });

  it("renders a loading spinner while machine details are loading", () => {
    renderWithProviders(
      <CloneStorageTable
        loadingMachineDetails
        machine={null}
        selected={false}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Loading...");
  });

  it("renders machine storage details if machine is provided", () => {
    const machine = factory.machineDetails({
      disks: [factory.nodeDisk({ name: "Disk 1" })],
    });
    renderWithProviders(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Disk 1")).toBeInTheDocument();
  });

  it("shows a tick for available disks", () => {
    const machine = factory.machineDetails({
      disks: [
        factory.nodeDisk({ available_size: 1000000000, size: 1000000000 }),
      ],
    });
    renderWithProviders(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(screen.getByTestId("disk-available")).toHaveClass("p-icon--tick");
    expect(screen.getByTestId("disk-available")).toHaveAccessibleName(
      "available"
    );
  });

  it("shows a cross for unavailable disks", () => {
    const machine = factory.machineDetails({
      disks: [factory.nodeDisk({ available_size: 0, size: 1000000000 })],
    });
    renderWithProviders(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(screen.getByTestId("disk-available")).toHaveClass("p-icon--close");
    expect(screen.getByTestId("disk-available")).toHaveAccessibleName(
      "not available"
    );
  });

  it("shows a tick for available partitions", () => {
    const machine = factory.machineDetails({
      disks: [
        factory.nodeDisk({
          partitions: [factory.nodePartition({ filesystem: null })],
        }),
      ],
    });
    renderWithProviders(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(screen.getByTestId("partition-available")).toHaveClass(
      "p-icon--tick"
    );
    expect(screen.getByTestId("partition-available")).toHaveAccessibleName(
      "available"
    );
  });

  it("shows a cross for unavailable partitions", () => {
    const machine = factory.machineDetails({
      disks: [
        factory.nodeDisk({
          partitions: [
            factory.nodePartition({ filesystem: factory.nodeFilesystem() }),
          ],
        }),
      ],
    });
    renderWithProviders(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(screen.getByTestId("partition-available")).toHaveClass(
      "p-icon--close"
    );
    expect(screen.getByTestId("partition-available")).toHaveAccessibleName(
      "not available"
    );
  });
});
