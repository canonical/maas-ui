import { shallow } from "enzyme";

import DoubleRow from "./DoubleRow";

describe("DoubleRow ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <DoubleRow primary="Top row" secondary="Bottom row" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can render without a secondary row", () => {
    const wrapper = shallow(<DoubleRow primary="Top row" />);
    expect(wrapper.find(".p-double-row__secondary-row").exists()).toBe(false);
  });

  it("can display an icon", () => {
    const wrapper = shallow(
      <DoubleRow
        icon={<i className="p-icon"></i>}
        primary="Top row"
        secondary="Bottom row"
      />
    );
    expect(wrapper.find(".p-double-row--with-icon").exists()).toBe(true);
    expect(wrapper.find(".p-double-row__icon").exists()).toBe(true);
  });

  it("can display the space for an icon", () => {
    const wrapper = shallow(
      <DoubleRow iconSpace={true} primary="Top row" secondary="Bottom row" />
    );
    expect(wrapper.find(".p-double-row--with-icon").exists()).toBe(true);
    expect(wrapper.find(".p-double-row__icon").exists()).toBe(true);
  });

  it("can have a menu", () => {
    const wrapper = shallow(
      <DoubleRow
        menuLinks={[{ children: "Link1" }, { children: "Link2" }]}
        menuTitle="Take action:"
        primary="Top row"
        secondary="Bottom row"
      />
    );
    expect(wrapper.find("TableMenu").exists()).toBe(true);
  });
});
