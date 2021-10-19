import { shallow } from "enzyme";

import SettingsBackLink from "./SettingsBackLink";

describe("SettingsBackLink", () => {
  it("renders", () => {
    const wrapper = shallow(<SettingsBackLink returnToList={"lxd"} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("links to lxd list", () => {
    const returnToList = "lxd";
    const wrapper = shallow(<SettingsBackLink returnToList={returnToList} />);

    expect(wrapper.find("Link").prop("to")).toBe(`/kvm/${returnToList}`);
  });

  it("links to virsh list", () => {
    const returnToList = "virsh";
    const wrapper = shallow(<SettingsBackLink returnToList={returnToList} />);

    expect(wrapper.find("Link").prop("to")).toBe(`/kvm/${returnToList}`);
  });
});
