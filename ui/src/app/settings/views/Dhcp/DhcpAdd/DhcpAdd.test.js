import { shallow } from "enzyme";

import { DhcpAdd } from "./DhcpAdd";

describe("DhcpAdd", () => {
  it("can render", () => {
    const wrapper = shallow(<DhcpAdd />);
    expect(wrapper).toMatchSnapshot();
  });
});
