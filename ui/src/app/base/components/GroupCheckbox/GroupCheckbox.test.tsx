import { shallow } from "enzyme";

import GroupCheckbox from "./GroupCheckbox";

describe("GroupCheckbox", () => {
  it("renders", () => {
    const wrapper = shallow(
      <GroupCheckbox
        items={[]}
        selectedItems={[]}
        handleGroupCheckbox={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("shows as mixed when some items are checked", () => {
    const wrapper = shallow(
      <GroupCheckbox
        items={[1, 2, 3]}
        selectedItems={[2]}
        handleGroupCheckbox={jest.fn()}
      />
    );
    expect(wrapper.prop("checked")).toBe(true);
    expect(wrapper.hasClass("p-checkbox--mixed")).toBe(true);
  });

  it("can show a label", () => {
    const wrapper = shallow(
      <GroupCheckbox
        items={[]}
        inputLabel="Check all"
        selectedItems={[]}
        handleGroupCheckbox={jest.fn()}
      />
    );
    expect(wrapper.prop("label")).toBe("Check all");
  });

  it("can be disabled even if items exist", () => {
    const wrapper = shallow(
      <GroupCheckbox
        disabled
        items={[1, 2, 3]}
        inputLabel="Check all"
        selectedItems={[2]}
        handleGroupCheckbox={jest.fn()}
      />
    );
    expect(wrapper.prop("disabled")).toBe(true);
  });
});
