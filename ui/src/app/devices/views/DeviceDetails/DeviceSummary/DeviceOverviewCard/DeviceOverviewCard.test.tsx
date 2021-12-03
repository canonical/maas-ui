import { mount, shallow } from "enzyme";

import DeviceOverviewCard from "./DeviceOverviewCard";

import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
} from "testing/factories";

describe("DeviceOverviewCard", () => {
  it("renders", () => {
    const device = deviceDetailsFactory({
      description: "description",
      domain: { id: 1, name: "domain" },
      owner: "Owner",
      tags: ["tag1", "tag2"],
      zone: { id: 1, name: "zone" },
    });
    const wrapper = shallow(<DeviceOverviewCard device={device} />);

    expect(wrapper.children()).toMatchSnapshot();
  });

  it("shows a spinner for the note if not device details", () => {
    const device = deviceFactory();
    const wrapper = mount(<DeviceOverviewCard device={device} />);

    expect(wrapper.find("[data-testid='loading-note']").exists()).toBe(true);
  });
});
