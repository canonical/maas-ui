import { mount } from "enzyme";
import React from "react";

import { machineDisk as diskFactory } from "testing/factories";
import { normaliseStorageDevice } from "../utils";
import BootStatus from "./BootStatus";

describe("BootStatus", () => {
  it("shows boot status for boot disks", () => {
    const disk = diskFactory({ is_boot: true, type: "physical" });
    const normalised = normaliseStorageDevice(disk);
    const wrapper = mount(<BootStatus storageDevice={normalised} />);

    expect(wrapper.find("Icon").prop("name")).toBe("tick");
  });

  it("shows boot status for non-boot disks", () => {
    const disk = diskFactory({ is_boot: false, type: "physical" });
    const normalised = normaliseStorageDevice(disk);
    const wrapper = mount(<BootStatus storageDevice={normalised} />);

    expect(wrapper.find("Icon").prop("name")).toBe("close");
  });

  it("shows boot status for non-physical disks", () => {
    const disk = diskFactory({ is_boot: false, type: "virtual" });
    const normalised = normaliseStorageDevice(disk);
    const wrapper = mount(<BootStatus storageDevice={normalised} />);

    expect(wrapper.find("span").text()).toBe("—");
  });
});
