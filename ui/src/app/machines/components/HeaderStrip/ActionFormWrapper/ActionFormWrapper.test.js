import { mount } from "enzyme";
import React from "react";

import ActionFormWrapper from "./ActionFormWrapper";

describe("ActionFormWrapper", () => {
  it(`displays a warning if not all selected machines can perform selected
  action`, () => {
    const wrapper = mount(
      <ActionFormWrapper
        selectedAction={{ name: "commission" }}
        selectedMachines={[{ actions: ["commission"] }, { actions: [] }]}
        setSelectedAction={jest.fn()}
        setSelectedMachines={jest.fn()}
      />
    );
    expect(wrapper.find("[data-test='machine-action-warning']").exists()).toBe(
      true
    );
  });

  it("can set selected machines to those that can perform action", () => {
    const selectedMachines = [{ actions: ["commission"] }, { actions: [] }];
    const setSelectedMachines = jest.fn();
    const wrapper = mount(
      <ActionFormWrapper
        selectedAction={{ name: "commission" }}
        selectedMachines={selectedMachines}
        setSelectedAction={jest.fn()}
        setSelectedMachines={setSelectedMachines}
      />
    );
    wrapper
      .find('[data-test="select-actionable-machines"] button')
      .simulate("click");

    expect(setSelectedMachines).toHaveBeenCalledWith([selectedMachines[0]]);
  });

  it("can unset the selected action", () => {
    const setSelectedAction = jest.fn();
    const wrapper = mount(
      <ActionFormWrapper
        selectedAction={{ name: "commission" }}
        selectedMachines={[{ actions: ["commission"] }]}
        setSelectedAction={setSelectedAction}
        setSelectedMachines={jest.fn()}
      />
    );
    wrapper.find('[data-test="cancel-action"] button').simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith(null);
  });
});
