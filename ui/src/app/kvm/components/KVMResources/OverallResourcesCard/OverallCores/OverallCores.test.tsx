import { mount, shallow } from "enzyme";

import OverallCores from "./OverallCores";

import { podResource as podResourceFactory } from "testing/factories";

describe("OverallCores", () => {
  it("renders", () => {
    const cores = podResourceFactory({
      allocated_tracked: 1,
      allocated_other: 2,
      free: 3,
    });
    const wrapper = shallow(<OverallCores cores={cores} overCommit={2} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("can show whether cores have been over-committed", () => {
    const cores = podResourceFactory({
      allocated_tracked: 1,
      allocated_other: 2,
      free: -1,
    });
    const wrapper = mount(<OverallCores cores={cores} overCommit={1} />);

    expect(wrapper.find("[data-test='meter-overflow']").exists()).toBe(true);
  });
});
