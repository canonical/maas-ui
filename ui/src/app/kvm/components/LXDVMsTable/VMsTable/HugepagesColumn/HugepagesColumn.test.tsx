import { mount } from "enzyme";

import HugepagesColumn from "./HugepagesColumn";

describe("HugepagesColumn", () => {
  it("can show if a VM is backed by hugepages", () => {
    const wrapper = mount(<HugepagesColumn hugepagesBacked={true} />);

    expect(wrapper.text()).toBe("Enabled");
  });

  it("can show if a VM is not backed by hugepages", () => {
    const wrapper = mount(<HugepagesColumn hugepagesBacked={false} />);

    expect(wrapper.text()).toBe("");
  });
});
