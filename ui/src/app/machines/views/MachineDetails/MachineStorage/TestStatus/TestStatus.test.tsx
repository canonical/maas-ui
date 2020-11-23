import { mount } from "enzyme";
import React from "react";

import TestStatus from "./TestStatus";

import { scriptStatus } from "app/base/enum";

describe("TestStatus", () => {
  it("can show passed test status", () => {
    const wrapper = mount(<TestStatus testStatus={scriptStatus.PASSED} />);

    expect(wrapper.find(".p-icon--success").exists()).toBe(true);
  });

  it("can show running test status", () => {
    const wrapper = mount(<TestStatus testStatus={scriptStatus.RUNNING} />);

    expect(wrapper.find(".p-icon--running").exists()).toBe(true);
  });

  it("can show pending test status", () => {
    const wrapper = mount(<TestStatus testStatus={scriptStatus.PENDING} />);

    expect(wrapper.find(".p-icon--pending").exists()).toBe(true);
  });

  it("can show error test status", () => {
    const wrapper = mount(<TestStatus testStatus={scriptStatus.FAILED} />);

    expect(wrapper.find(".p-icon--error").exists()).toBe(true);
  });

  it("can show timed out test status", () => {
    const wrapper = mount(<TestStatus testStatus={scriptStatus.TIMEDOUT} />);

    expect(wrapper.find(".p-icon--timed-out").exists()).toBe(true);
  });

  it("can show warning test status", () => {
    const wrapper = mount(<TestStatus testStatus={scriptStatus.SKIPPED} />);

    expect(wrapper.find(".p-icon--warning").exists()).toBe(true);
  });

  it("can show unknown test status", () => {
    const wrapper = mount(<TestStatus testStatus={scriptStatus.NONE} />);

    expect(wrapper.find(".p-icon--power-unknown").exists()).toBe(true);
  });
});
