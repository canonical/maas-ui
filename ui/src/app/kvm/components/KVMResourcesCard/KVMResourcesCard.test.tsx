import { shallow } from "enzyme";
import React from "react";

import KVMResourcesCard from "./KVMResourcesCard";

describe("KVMResourcesCard", () => {
  it("renders", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2, total: 3 }}
        nics={[]}
        ram={{ general: { allocated: 2, free: 3, total: 5 } }}
        vfs={{ allocated: 100, free: 156, total: 256 }}
        title="Title"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("can be given a title", () => {
    const wrapper = shallow(
      <KVMResourcesCard
        cores={{ allocated: 1, free: 2, total: 3 }}
        nics={[]}
        ram={{ general: { allocated: 2, free: 3, total: 5 } }}
        vfs={{ allocated: 100, free: 156, total: 256 }}
        title="Title"
      />
    );

    expect(wrapper.find("[data-test='kvm-resources-card-title']").text()).toBe(
      "Title"
    );
  });
});
