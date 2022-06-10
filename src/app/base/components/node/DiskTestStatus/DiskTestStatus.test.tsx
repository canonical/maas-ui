import { mount } from "enzyme";

import DiskTestStatus from "./DiskTestStatus";

import { ScriptResultStatus } from "app/store/scriptresult/types";

describe("DiskTestStatus", () => {
  it("can show passed test status", () => {
    const wrapper = mount(
      <DiskTestStatus testStatus={ScriptResultStatus.PASSED} />
    );

    expect(wrapper.find(".p-icon--success").exists()).toBe(true);
  });

  it("can show running test status", () => {
    const wrapper = mount(
      <DiskTestStatus testStatus={ScriptResultStatus.RUNNING} />
    );

    expect(wrapper.find(".p-icon--running").exists()).toBe(true);
  });

  it("can show pending test status", () => {
    const wrapper = mount(
      <DiskTestStatus testStatus={ScriptResultStatus.PENDING} />
    );

    expect(wrapper.find(".p-icon--pending").exists()).toBe(true);
  });

  it("can show error test status", () => {
    const wrapper = mount(
      <DiskTestStatus testStatus={ScriptResultStatus.FAILED} />
    );

    expect(wrapper.find(".p-icon--error").exists()).toBe(true);
  });

  it("can show timed out test status", () => {
    const wrapper = mount(
      <DiskTestStatus testStatus={ScriptResultStatus.TIMEDOUT} />
    );

    expect(wrapper.find(".p-icon--timed-out").exists()).toBe(true);
  });

  it("can show warning test status", () => {
    const wrapper = mount(
      <DiskTestStatus testStatus={ScriptResultStatus.SKIPPED} />
    );

    expect(wrapper.find(".p-icon--warning").exists()).toBe(true);
  });

  it("can show unknown test status", () => {
    const wrapper = mount(
      <DiskTestStatus testStatus={ScriptResultStatus.NONE} />
    );

    expect(wrapper.find(".p-icon--power-unknown").exists()).toBe(true);
  });
});
