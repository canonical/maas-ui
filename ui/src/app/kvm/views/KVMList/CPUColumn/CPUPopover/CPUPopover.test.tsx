import { mount } from "enzyme";

import CPUPopover from "./CPUPopover";

import { podResource as podResourceFactory } from "testing/factories";

describe("CPUPopover", () => {
  it("renders", () => {
    const wrapper = mount(
      <CPUPopover
        cores={podResourceFactory({
          allocated_other: 1,
          allocated_tracked: 2,
          free: 3,
        })}
        overCommit={2}
      >
        Child
      </CPUPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper).toMatchSnapshot();
  });

  it("shows if cores are used by any other projects in the group", () => {
    const wrapper = mount(
      <CPUPopover
        cores={podResourceFactory({
          allocated_other: 1,
        })}
        overCommit={1}
      >
        Child
      </CPUPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='allocated-label']").text()).toBe(
      "Project"
    );
    expect(wrapper.find("[data-test='other']").exists()).toBe(true);
  });

  it("does not show other cores if no other projects in the group use them", () => {
    const wrapper = mount(
      <CPUPopover
        cores={podResourceFactory({
          allocated_other: 0,
        })}
        overCommit={1}
      >
        Child
      </CPUPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='allocated-label']").text()).toBe(
      "Allocated"
    );
    expect(wrapper.find("[data-test='other']").exists()).toBe(false);
  });

  it("shows CPU over-commit ratio if it is not equal to 1", () => {
    const wrapper = mount(
      <CPUPopover
        cores={podResourceFactory({
          allocated_other: 1,
        })}
        overCommit={2}
      >
        Child
      </CPUPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='overcommit']").exists()).toBe(true);
  });

  it("does not show CPU over-commit ratio if it is equal to 1", () => {
    const wrapper = mount(
      <CPUPopover
        cores={podResourceFactory({
          allocated_other: 1,
        })}
        overCommit={1}
      >
        Child
      </CPUPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-test='overcommit']").exists()).toBe(false);
  });
});
