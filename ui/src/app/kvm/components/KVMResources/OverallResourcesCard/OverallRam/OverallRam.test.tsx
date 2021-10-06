import { shallow } from "enzyme";

import OverallRam from "./OverallRam";

import { COLOURS } from "app/base/constants";
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
    const wrapper = shallow(<OverallRam memory={memory} overCommit={2} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("can show whether RAM has been over-committed", () => {
    const memory = podMemoryResourceFactory({
      general: podResourceFactory({
        allocated_tracked: 1,
        allocated_other: 2,
        free: -1,
      }),
      hugepages: podResourceFactory({
        allocated_tracked: 4,
        allocated_other: 5,
        free: -1,
      }),
    });
    const wrapper = shallow(<OverallRam memory={memory} overCommit={1} />);

    expect(wrapper.find("DoughnutChart").prop("segments")).toStrictEqual([
      { color: COLOURS.CAUTION, value: 1 },
    ]);
  });
});
