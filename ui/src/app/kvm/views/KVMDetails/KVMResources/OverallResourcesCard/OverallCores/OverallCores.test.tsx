import { shallow } from "enzyme";

import OverallCores from "./OverallCores";

import { podResource as podResourceFactory } from "testing/factories";

describe("OverallCores", () => {
  it("renders", () => {
    const cores = podResourceFactory({
      allocated_tracked: 1,
      allocated_other: 2,
      free: 3,
    });
    const wrapper = shallow(<OverallCores cores={cores} />);

    expect(wrapper).toMatchSnapshot();
  });
});
