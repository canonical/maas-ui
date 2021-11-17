import { mount } from "enzyme";

import TagsColumn from "./TagsColumn";

describe("TagsColumn", () => {
  it("displays the pod's tags", () => {
    const tags = ["tag1", "tag2"];
    const wrapper = mount(<TagsColumn tags={tags} />);
    expect(wrapper.find("[data-testid='pod-tags']").text()).toBe("tag1, tag2");
  });
});
