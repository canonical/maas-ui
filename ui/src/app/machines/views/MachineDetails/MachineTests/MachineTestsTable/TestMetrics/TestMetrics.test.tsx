import { mount } from "enzyme";

import TestMetrics from "./TestMetrics";

import {
  scriptResult as scriptResultFactory,
  scriptResultResult as scriptResultResultFactory,
} from "testing/factories";

describe("TestMetrics", () => {
  it("shows a metrics table if the test has metrics", () => {
    const scriptResult = scriptResultFactory({
      results: [scriptResultResultFactory()],
    });
    const wrapper = mount(
      <TestMetrics close={jest.fn()} scriptResult={scriptResult} />
    );

    expect(wrapper.find("[data-test='metrics-table']").exists()).toBe(true);
  });
});
