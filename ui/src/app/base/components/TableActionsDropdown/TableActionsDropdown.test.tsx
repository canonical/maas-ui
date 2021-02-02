import { mount, shallow } from "enzyme";

import TableActionsDropdown from "./TableActionsDropdown";

describe("TableActionsDropdown", () => {
  it("can be explicitly disabled", () => {
    const wrapper = shallow(
      <TableActionsDropdown
        actions={[
          { label: "Action 1", type: "action-1" },
          { label: "Action 2", type: "action-2" },
          { label: "Action 3", type: "action-3" },
        ]}
        disabled
        onActionClick={jest.fn()}
      />
    );
    expect(wrapper.find("TableMenu").prop("disabled")).toBe(true);
  });

  it("is disabled if no actions are provided", () => {
    const wrapper = shallow(
      <TableActionsDropdown actions={[]} onActionClick={jest.fn()} />
    );
    expect(wrapper.find("TableMenu").prop("disabled")).toBe(true);
  });

  it("can conditionally show actions", () => {
    const wrapper = mount(
      <TableActionsDropdown
        actions={[
          { label: "Action 1", show: true, type: "action-1" },
          { label: "Action 2", type: "action-2" },
          { label: "Action 3", show: false, type: "action-3" },
        ]}
        onActionClick={jest.fn()}
      />
    );
    // Open menu
    wrapper.find("button").simulate("click");

    expect(wrapper.find("button[data-test='action-1']").exists()).toBe(true);
    expect(wrapper.find("button[data-test='action-2']").exists()).toBe(true);
    expect(wrapper.find("button[data-test='action-3']").exists()).toBe(false);
  });

  it("runs click function with action type as argument", () => {
    const onActionClick = jest.fn();
    const wrapper = mount(
      <TableActionsDropdown
        actions={[{ label: "Action 1", type: "action-1" }]}
        onActionClick={onActionClick}
      />
    );
    // Open menu and click the actions
    wrapper.find("button").simulate("click");
    wrapper.find("button[data-test='action-1']").simulate("click");

    expect(onActionClick).toHaveBeenCalledWith("action-1");
  });
});
