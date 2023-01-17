import { shallow } from "enzyme";

import AddHardwareMenu from "./AddHardwareMenu";

describe("AddHardwareMenu", () => {
  it("can render", () => {
    const wrapper = shallow(
      <AddHardwareMenu setSidePanelContent={jest.fn()} />
    );
    expect(wrapper.find("AddHardwareMenu")).toMatchSnapshot();
  });

  it("can be disabled", () => {
    const wrapper = shallow(
      <AddHardwareMenu disabled setSidePanelContent={jest.fn()} />
    );
    expect(wrapper.find("ContextualMenu").prop("toggleDisabled")).toBe(true);
  });
});
