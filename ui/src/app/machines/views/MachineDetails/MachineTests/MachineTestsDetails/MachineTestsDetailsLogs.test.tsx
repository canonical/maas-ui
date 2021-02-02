import { mount } from "enzyme";

import MachineTestsDetailsLogs from "./MachineTestsDetailsLogs";

describe("MachineTestsDetailsLogs", () => {
  it("displays combined content by default", () => {
    const log = {
      combined: "combined content",
      stdout: "stdout content",
      stderr: "",
      result: "yaml result",
    };

    const wrapper = mount(<MachineTestsDetailsLogs log={log} />);

    expect(wrapper.find("[data-test='log-content'] code").text()).toEqual(
      "combined content"
    );
  });

  it("displays other content on click", () => {
    const log = {
      combined: "combined content",
      stdout: "stdout content",
      stderr: "",
      result: "yaml result",
    };

    const wrapper = mount(<MachineTestsDetailsLogs log={log} />);
    wrapper.find("a[data-test='tab-link-yaml']").simulate("click");

    expect(wrapper.find("[data-test='log-content'] code").text()).toEqual(
      "yaml result"
    );
  });

  it("displays 'no data' for empty content", () => {
    const log = {
      combined: "combined content",
      stdout: "stdout content",
      stderr: "",
      result: "yaml result",
    };

    const wrapper = mount(<MachineTestsDetailsLogs log={log} />);
    wrapper.find("a[data-test='tab-link-stderr']").simulate("click");

    expect(wrapper.find("[data-test='log-content'] code").text()).toEqual(
      "No data"
    );
  });
});
