import { mount } from "enzyme";

import BootStatus from "./BootStatus";

import { DiskTypes } from "app/store/machine/types";
import { machineDisk as diskFactory } from "testing/factories";

describe("BootStatus", () => {
  it("shows boot status for boot disks", () => {
    const disk = diskFactory({ is_boot: true, type: DiskTypes.PHYSICAL });
    const wrapper = mount(<BootStatus disk={disk} />);

    expect(wrapper.find("Icon").prop("name")).toBe("tick");
  });

  it("shows boot status for non-boot disks", () => {
    const disk = diskFactory({ is_boot: false, type: DiskTypes.PHYSICAL });
    const wrapper = mount(<BootStatus disk={disk} />);

    expect(wrapper.find("Icon").prop("name")).toBe("close");
  });

  it("shows boot status for non-physical disks", () => {
    const disk = diskFactory({ is_boot: false, type: DiskTypes.VIRTUAL });
    const wrapper = mount(<BootStatus disk={disk} />);

    expect(wrapper.find("span").text()).toBe("—");
  });
});
