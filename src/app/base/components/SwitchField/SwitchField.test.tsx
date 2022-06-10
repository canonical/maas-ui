import { shallow } from "enzyme";

import SwitchField from "./SwitchField";

describe("SwitchField", () => {
  it("renders", () => {
    const wrapper = shallow(<SwitchField />);

    expect(wrapper).toMatchSnapshot();
  });

  it("can add additional classes", () => {
    const wrapper = shallow(
      <SwitchField type="text" className="extra-class" />
    );
    const className = wrapper.find("Switch").prop("className") || "";
    expect(className.includes("p-form-validation__input")).toBe(true);
    expect(className.includes("extra-class")).toBe(true);
  });
});
