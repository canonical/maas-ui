import { mount } from "enzyme";

import NodeTestDetailsLogs from "./NodeTestDetailsLogs";

import { scriptResultData as scriptResultDataFactory } from "testing/factories";

describe("NodeTestDetailsLogs", () => {
  it("displays combined content by default", () => {
    const log = scriptResultDataFactory();

    const wrapper = mount(<NodeTestDetailsLogs log={log} />);

    expect(wrapper.find("[data-testid='log-content'] code").text()).toEqual(
      "combined content"
    );
  });

  it("displays other content on click", () => {
    const log = scriptResultDataFactory();

    const wrapper = mount(<NodeTestDetailsLogs log={log} />);
    wrapper.find("a[data-testid='tab-link-yaml']").simulate("click");

    expect(wrapper.find("[data-testid='log-content'] code").text()).toEqual(
      "yaml result"
    );
  });

  it("displays 'no data' for empty content", () => {
    const log = scriptResultDataFactory();

    const wrapper = mount(<NodeTestDetailsLogs log={log} />);
    wrapper.find("a[data-testid='tab-link-stderr']").simulate("click");

    expect(wrapper.find("[data-testid='log-content'] code").text()).toEqual(
      "No data"
    );
  });
});
