import { mount } from "enzyme";

import CPUPopover from "./CPUPopover";

import {
  podResource as podResourceFactory,
  vmClusterResource as vmClusterResourceFactory,
} from "testing/factories";

describe("CPUPopover", () => {
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
    expect(wrapper.find("[data-testid='other']").exists()).toBe(true);
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
    expect(wrapper.find("[data-testid='other']").exists()).toBe(false);
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
    expect(wrapper.find("[data-testid='overcommit']").exists()).toBe(true);
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
    expect(wrapper.find("[data-testid='overcommit']").exists()).toBe(false);
  });

  it("displays cores for a vmcluster", () => {
    const wrapper = mount(
      <CPUPopover
        cores={vmClusterResourceFactory({
          allocated_other: 1,
          allocated_tracked: 2,
          free: 3,
        })}
        overCommit={1}
      >
        Child
      </CPUPopover>
    );
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-testid='other']").text()).toBe("1");
    expect(wrapper.find("[data-testid='allocated']").text()).toBe("2");
    expect(wrapper.find("[data-testid='free']").text()).toBe("3");
    expect(wrapper.find("[data-testid='total']").text()).toBe("6");
  });
});
