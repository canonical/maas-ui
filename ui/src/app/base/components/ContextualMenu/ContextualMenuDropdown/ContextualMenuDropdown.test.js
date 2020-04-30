import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import React from "react";

import { THROTTLE_DELAY } from "app/base/hooks";
import ContextualMenuDropdown from "./ContextualMenuDropdown";

jest.useFakeTimers();

describe("ContextualMenuDropdown ", () => {
  it("renders", () => {
    const wrapper = mount(
      <ContextualMenuDropdown links={[{ children: "Link1" }]} />
    );
    expect(wrapper.find("ContextualMenuDropdown")).toMatchSnapshot();
  });

  it("recalculates styles when the window is resized", () => {
    const wrapper = mount(
      <ContextualMenuDropdown
        links={[{ children: "Link1" }]}
        wrapper={{
          children: [],
          getBoundingClientRect: () => ({ bottom: 10, left: 10, width: 10 }),
        }}
        wrapperClass="test-node"
      />
    );
    wrapper.setProps({
      wrapper: {
        children: [],
        getBoundingClientRect: () => ({ bottom: 20, left: 20, width: 20 }),
      },
    });
    global.dispatchEvent(new Event("resize"));
    act(() => {
      jest.advanceTimersByTime(THROTTLE_DELAY);
    });
    wrapper.update();
    expect(wrapper.find("span.test-node").prop("style")).toStrictEqual({
      position: "absolute",
      left: 20,
      top: 20,
    });
  });
});
