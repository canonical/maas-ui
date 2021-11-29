import { mount } from "enzyme";

import Popover from "./Popover";

describe("Popover", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  if (body && app) {
    app.setAttribute("id", "app");
    body.appendChild(app);
  }

  it("renders popover content when focused", () => {
    const wrapper = mount(
      <Popover content={<span data-testid="test">Test</span>}>Child</Popover>
    );
    expect(wrapper.find("[data-testid='test']").exists()).toBe(false);
    wrapper.find("Popover").simulate("focus");
    expect(wrapper.find("[data-testid='test']").exists()).toBe(true);
  });
});
