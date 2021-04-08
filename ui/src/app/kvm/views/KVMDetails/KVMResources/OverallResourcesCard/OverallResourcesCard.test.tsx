import { shallow } from "enzyme";

import OverallResourcesCard from "./OverallResourcesCard";

import {
  podMemoryResource as podMemoryResourceFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
} from "testing/factories";

describe("OverallResourcesCard", () => {
  it("renders", () => {
    const resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_tracked: 1,
        allocated_other: 2,
        free: 3,
      }),
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_tracked: 4,
          allocated_other: 5,
          free: 6,
        }),
        hugepages: podResourceFactory({
          allocated_tracked: 7,
          allocated_other: 8,
          free: 9,
        }),
      }),
    });
    const wrapper = shallow(<OverallResourcesCard resources={resources} />);

    expect(wrapper).toMatchSnapshot();
  });
});
