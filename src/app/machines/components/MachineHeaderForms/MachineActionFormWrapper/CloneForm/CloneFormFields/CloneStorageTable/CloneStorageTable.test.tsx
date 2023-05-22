import CloneStorageTable from "./CloneStorageTable";

import {
  machineDetails as machineDetailsFactory,
  nodeDisk as diskFactory,
  nodeFilesystem as fsFactory,
  nodePartition as partitionFactory,
} from "testing/factories";
import { render } from "testing/utils";

describe("CloneStorageTable", () => {
  it("renders empty table if neither loading details nor machine provided", () => {
    const { queryByTestId } = render(
      <CloneStorageTable machine={null} selected={false} />
    );
    expect(queryByTestId("mainTable")).toBeNull();
    expect(queryByTestId("placeholder")).toBeFalsy();
  });

  it("renders placeholder content while machine details are loading", () => {
    const { getByTestId } = render(
      <CloneStorageTable
        loadingMachineDetails
        machine={null}
        selected={false}
      />
    );
    expect(getByTestId("placeholder")).toBeTruthy();
  });

  it("renders machine storage details if machine is provided", () => {
    const machine = machineDetailsFactory({ disks: [diskFactory()] });
    const { queryByTestId, queryByText } = render(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(queryByTestId("placeholder")).toBeFalsy();
    expect(queryByTestId("mainTable")).toBeTruthy();
    expect(queryByText("Disk 1")).toBeTruthy();
  });

  it("shows a tick for available disks", () => {
    const machine = machineDetailsFactory({
      disks: [diskFactory({ available_size: 1000000000, size: 1000000000 })],
    });
    const { getByTestId } = render(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(getByTestId("disk-available")).toHaveAttribute("name", "tick");
  });

  it("shows a cross for unavailable disks", () => {
    const machine = machineDetailsFactory({
      disks: [diskFactory({ available_size: 0, size: 1000000000 })],
    });
    const { getByTestId } = render(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(getByTestId("disk-available")).toHaveAttribute("name", "close");
  });

  it("shows a tick for available partitions", () => {
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({ partitions: [partitionFactory({ filesystem: null })] }),
      ],
    });
    const { getByTestId } = render(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(getByTestId("partition-available")).toHaveAttribute("name", "tick");
  });

  it("shows a cross for unavailable partitions", () => {
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({
          partitions: [partitionFactory({ filesystem: fsFactory() })],
        }),
      ],
    });
    const { getByTestId } = render(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(getByTestId("partition-available")).toHaveAttribute("name", "close");
  });
});
