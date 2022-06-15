import { shallow } from "enzyme";

import AddHardwareMenu from "./AddHardwareMenu";

describe("AddHardwareMenu", () => {
  it("can render", () => {
    const wrapper = shallow(<AddHardwareMenu setHeaderContent={jest.fn()} />);
    expect(wrapper.find("AddHardwareMenu")).toMatchSnapshot();
  });

  it("can be disabled", () => {
    const wrapper = shallow(
      <AddHardwareMenu disabled setHeaderContent={jest.fn()} />
    );
    expect(wrapper.find("ContextualMenu").prop("toggleDisabled")).toBe(true);
  });
});
