import { mount } from "enzyme";

import RAMPopover from "./RAMPopover";

import {
  podMemoryResource as podMemoryResourceFactory,
  podResource as podResourceFactory,
  vmClusterResource as vmClusterResourceFactory,
  vmClusterResourcesMemory as vmClusterResourcesMemoryFactory,
} from "testing/factories";

describe("RAMPopover", () => {
  it("renders", () => {
    const wrapper = mount(
      <RAMPopover
        memory={podMemoryResourceFactory({
          general: podResourceFactory({
            allocated_other: 1,
            allocated_tracked: 2,
            free: 3,
          }),
          hugepages: podResourceFactory({
            allocated_other: 4,
            allocated_tracked: 5,
            free: 3,
          }),
        })}
        overCommit={2}
      >
        Child
      </RAMPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper).toMatchSnapshot();
  });

  it("shows if memory is used by any other projects in the group", () => {
    const wrapper = mount(
      <RAMPopover
        memory={podMemoryResourceFactory({
          general: podResourceFactory({
            allocated_other: 1,
          }),
          hugepages: podResourceFactory({
            allocated_other: 1,
          }),
        })}
        overCommit={1}
      >
        Child
      </RAMPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='other']").exists()).toBe(true);
  });

  it("does not show other memory if no other projects in the group use them", () => {
    const wrapper = mount(
      <RAMPopover
        memory={podMemoryResourceFactory({
          general: podResourceFactory({ allocated_other: 0 }),
          hugepages: podResourceFactory({ allocated_other: 0 }),
        })}
        overCommit={1}
      >
        Child
      </RAMPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='other']").exists()).toBe(false);
  });

  it("shows memory over-commit ratio if it is not equal to 1", () => {
    const wrapper = mount(
      <RAMPopover memory={podMemoryResourceFactory()} overCommit={2}>
        Child
      </RAMPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='overcommit']").exists()).toBe(true);
  });

  it("does not show memory over-commit ratio if it is equal to 1", () => {
    const wrapper = mount(
      <RAMPopover memory={podMemoryResourceFactory()} overCommit={1}>
        Child
      </RAMPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='overcommit']").exists()).toBe(false);
  });

  it("displays memory for a vmcluster", () => {
    const memory = vmClusterResourcesMemoryFactory({
      general: vmClusterResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      }),
      hugepages: vmClusterResourceFactory({
        allocated_other: 4,
        allocated_tracked: 5,
        free: 6,
      }),
    });
    const wrapper = mount(<RAMPopover memory={memory}>Child</RAMPopover>);
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='other']").text()).toBe("5B");
    expect(wrapper.find("[data-test='allocated']").text()).toBe("7B");
    expect(wrapper.find("[data-test='free']").text()).toBe("9B");
    expect(wrapper.find("[data-test='total']").text()).toBe("21B");
  });
});
