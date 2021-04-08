import { shallow } from "enzyme";

import OverallRam from "./OverallRam";

import {
  podMemoryResource as podMemoryResourceFactory,
  podResource as podResourceFactory,
} from "testing/factories";

describe("OverallRam", () => {
  it("renders", () => {
    const memory = podMemoryResourceFactory({
      general: podResourceFactory({
        allocated_tracked: 1,
        allocated_other: 2,
        free: 3,
      }),
      hugepages: podResourceFactory({
        allocated_tracked: 4,
        allocated_other: 5,
        free: 6,
      }),
    });
    const wrapper = shallow(<OverallRam memory={memory} />);

    expect(wrapper).toMatchSnapshot();
  });
});
