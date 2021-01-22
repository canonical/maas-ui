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
        label="Check all"
        selectedItems={[]}
        handleGroupCheckbox={jest.fn()}
      />
    );
    expect(wrapper.prop("label")).toBe("Check all");
  });
});
