import React from "react";

import { mount } from "enzyme";

import { normaliseFilesystem } from "../utils";

import DatastoresTable from "./DatastoresTable";

import {
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
} from "testing/factories";

describe("DatastoresTable", () => {
  it("renders", () => {
    const disk = diskFactory({
      filesystem: fsFactory({
        fstype: "vmfs6",
        mount_point: "/vmfs/volumes/datastore",
      }),
      name: "im-a-datastore",
      partitions: [],
      size: 100,
    });
    const normalised = normaliseFilesystem(disk.filesystem, disk);
    const wrapper = mount(<DatastoresTable datastores={[normalised]} />);

    expect(wrapper).toMatchSnapshot();
  });
});
