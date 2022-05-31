import { mount } from "enzyme";

import DiskBootStatus from "./DiskBootStatus";

import { DiskTypes } from "app/store/types/enum";
import { nodeDisk as diskFactory } from "testing/factories";

describe("DiskBootStatus", () => {
  it("shows boot status for boot disks", () => {
    const disk = diskFactory({ is_boot: true, type: DiskTypes.PHYSICAL });
    const wrapper = mount(<DiskBootStatus disk={disk} />);

    expect(wrapper.find("Icon").prop("name")).toBe("tick");
  });

  it("shows boot status for non-boot disks", () => {
    const disk = diskFactory({ is_boot: false, type: DiskTypes.PHYSICAL });
    const wrapper = mount(<DiskBootStatus disk={disk} />);

    expect(wrapper.find("Icon").prop("name")).toBe("close");
  });

  it("shows boot status for non-physical disks", () => {
    const disk = diskFactory({ is_boot: false, type: DiskTypes.VIRTUAL });
    const wrapper = mount(<DiskBootStatus disk={disk} />);

    expect(wrapper.find("span").text()).toBe("—");
  });
});
