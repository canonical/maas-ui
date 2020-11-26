import React from "react";

import { mount } from "enzyme";

import { separateStorageData } from "../utils";

import UsedStorageTable from "./UsedStorageTable";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import { machineDisk as diskFactory } from "testing/factories";

describe("UsedStorageTable", () => {
  it("can show an empty message", () => {
    const wrapper = mount(<UsedStorageTable storageDevices={[]} />);

    expect(wrapper.find("[data-test='no-used']").text()).toBe(
      "No disk or partition has been fully utilised."
    );
  });

  it("can show what the disk is being used for", () => {
    const disks = [
      diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        used_for: "nefarious purposes",
      }),
    ];
    const { used } = separateStorageData(disks);
    const wrapper = mount(<UsedStorageTable storageDevices={used} />);

    expect(wrapper.find("[data-test='used-for']").text()).toBe(
      "nefarious purposes"
    );
  });
});
