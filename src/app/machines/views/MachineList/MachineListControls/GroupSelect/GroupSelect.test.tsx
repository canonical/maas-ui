import { shallow } from "enzyme";

import GroupSelect from "./GroupSelect";

describe("GroupSelect ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <GroupSelect
        grouping={null}
        setGrouping={jest.fn()}
        setHiddenGroups={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("executes setGrouping and setHiddenGroups functions on change", () => {
    const setGrouping = jest.fn();
    const setHiddenGroups = jest.fn();
    const wrapper = shallow(
      <GroupSelect
        grouping={null}
        setGrouping={setGrouping}
        setHiddenGroups={setHiddenGroups}
      />
    );
    const mockEvent = { target: { value: "status" } };
    wrapper.find("Select").simulate("change", mockEvent);
    expect(setGrouping).toHaveBeenCalledWith(mockEvent.target.value);
    expect(setHiddenGroups).toHaveBeenCalledWith([]);
  });
});
