import { mount } from "enzyme";

import CloneStorageTable from "./CloneStorageTable";

import {
  machineDetails as machineDetailsFactory,
  nodeDisk as diskFactory,
  nodeFilesystem as fsFactory,
  nodePartition as partitionFactory,
} from "testing/factories";

describe("CloneStorageTable", () => {
  it("renders empty table if neither loading details nor machine provided", () => {
    const wrapper = mount(
      <CloneStorageTable machine={null} selected={false} />
    );
    expect(wrapper.find("MainTable").prop("rows")).toStrictEqual([]);
    expect(wrapper.find("Placeholder").exists()).toBe(false);
  });

  it("renders placeholder content while machine details are loading", () => {
    const wrapper = mount(
      <CloneStorageTable
        loadingMachineDetails
        machine={null}
        selected={false}
      />
    );
    expect(wrapper.find("Placeholder").exists()).toBe(true);
  });

  it("renders machine storage details if machine is provided", () => {
    const machine = machineDetailsFactory({ disks: [diskFactory()] });
    const wrapper = mount(
      <CloneStorageTable machine={machine} selected={false} />
    );
    expect(wrapper.find("Placeholder").exists()).toBe(false);
    expect(wrapper.find("MainTable").prop("rows")).not.toStrictEqual([]);
  });

  it("shows a tick for available disks", () => {
    const machine = machineDetailsFactory({
      disks: [diskFactory({ available_size: 1000000000, size: 1000000000 })],
    });
    const wrapper = mount(
      <CloneStorageTable machine={machine} selected={false} />
    );

    expect(
      wrapper.find("Icon[data-testid='disk-available']").prop("name")
    ).toBe("tick");
  });

  it("shows a cross for unavailable disks", () => {
    const machine = machineDetailsFactory({
      disks: [diskFactory({ available_size: 0, size: 1000000000 })],
    });
    const wrapper = mount(
      <CloneStorageTable machine={machine} selected={false} />
    );

    expect(
      wrapper.find("Icon[data-testid='disk-available']").prop("name")
    ).toBe("close");
  });

  it("shows a tick for available partitions", () => {
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({ partitions: [partitionFactory({ filesystem: null })] }),
      ],
    });
    const wrapper = mount(
      <CloneStorageTable machine={machine} selected={false} />
    );

    expect(
      wrapper.find("Icon[data-testid='partition-available']").prop("name")
    ).toBe("tick");
  });

  it("shows a cross for unavailable partitions", () => {
    const machine = machineDetailsFactory({
      disks: [
        diskFactory({
          partitions: [partitionFactory({ filesystem: fsFactory() })],
        }),
      ],
    });
    const wrapper = mount(
      <CloneStorageTable machine={machine} selected={false} />
    );

    expect(
      wrapper.find("Icon[data-testid='partition-available']").prop("name")
    ).toBe("close");
  });
});
