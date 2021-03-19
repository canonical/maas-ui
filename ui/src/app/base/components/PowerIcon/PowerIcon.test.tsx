import { shallow } from "enzyme";

import PowerIcon from "./PowerIcon";

import { PowerState } from "app/store/machine/types";

describe("PowerIcon", () => {
  it("renders", () => {
    const wrapper = shallow(<PowerIcon powerState={PowerState.ON} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("can show a spinner regardless of the power state", () => {
    const wrapper = shallow(
      <PowerIcon powerState={PowerState.ON} showSpinner />
    );
    expect(wrapper.find("Icon").prop("name")).toBe("spinner");
    expect(wrapper.find("Icon").prop("className")).toBe("u-animation--spin");
  });

  it("makes the icon inline if children are provided", () => {
    const wrapper = shallow(
      <PowerIcon powerState={PowerState.ON}>On</PowerIcon>
    );
    expect(wrapper.find("Icon").prop("className")).toBe("is-inline");
  });
});
