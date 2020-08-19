import { shallow } from "enzyme";
import React from "react";

import KVMResourcesCard from "./KVMResourcesCard";

describe("KVMResourcesCard", () => {
  it("can be given a title", () => {
    const wrapper = shallow(<KVMResourcesCard title="Title" />);

    expect(wrapper.find("[data-test='kvm-resources-card-title']").text()).toBe(
      "Title"
    );
  });
});
