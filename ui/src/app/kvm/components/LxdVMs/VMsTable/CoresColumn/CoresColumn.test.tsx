import { mount } from "enzyme";

import CoresColumn from "./CoresColumn";

describe("CoresColumn", () => {
  it("can show the pinned cores of a VM", () => {
    const wrapper = mount(
      <CoresColumn pinnedCores={[0, 1, 2, 4]} unpinnedCores={0} />
    );

    expect(wrapper.find("DoubleRow").prop("primary")).toBe("0-2, 4");
    expect(wrapper.find("DoubleRow").prop("secondary")).toBe("pinned");
  });

  it("can show the unpinned cores of a VM", () => {
    const wrapper = mount(<CoresColumn pinnedCores={[]} unpinnedCores={4} />);

    expect(wrapper.find("DoubleRow").prop("primary")).toBe("Any 4");
    expect(wrapper.find("DoubleRow").prop("secondary")).toBe("");
  });
});
