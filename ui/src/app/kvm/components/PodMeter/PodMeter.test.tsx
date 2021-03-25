import { shallow } from "enzyme";

import PodMeter from "./PodMeter";

describe("PodMeter", () => {
  it("renders", () => {
    const wrapper = shallow(<PodMeter allocated={2} free={1} unit="GB" />);

    expect(wrapper).toMatchSnapshot();
  });

  it("can invert the position of the text", () => {
    const wrapper = shallow(<PodMeter allocated={0} free={0} inverted />);

    expect(wrapper.find(".pod-meter--inverted").exists()).toBe(true);
  });
});
