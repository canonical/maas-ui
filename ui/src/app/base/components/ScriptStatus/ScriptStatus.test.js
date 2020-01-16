import { shallow } from "enzyme";
import React from "react";

import { scriptStatus } from "app/base/enum";
import ScriptStatus from "./ScriptStatus";

describe("ScriptStatus ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: scriptStatus.PASSED }}>
        All tests have passed
      </ScriptStatus>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays a success icon if scripts passed", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: scriptStatus.PASSED }}>
        All tests have passed
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--success").exists()).toBe(true);
  });

  it(`does not display a success icon if scripts passed
    and hidePassedIcon is false`, () => {
    const wrapper = shallow(
      <ScriptStatus hidePassedIcon scriptType={{ status: scriptStatus.PASSED }}>
        All tests have passed
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--success").exists()).toBe(false);
  });

  it(`does not display an icon if no scripts have run and
    and hideNotRunIcon is true`, () => {
    const wrapper = shallow(
      <ScriptStatus hideNotRunIcon scriptType={{ status: scriptStatus.NONE }}>
        Tests have not run.
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--warning").exists()).toBe(false);
  });

  it("displays an error icon and tooltip if scripts have failed", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: scriptStatus.FAILED }}>
        Some or all tests have failed
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--error").exists()).toBe(true);
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });

  it("displays a timed out icon and tooltip if scripts have timed out", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: scriptStatus.TIMEDOUT }}>
        Some or all tests have timed out
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--timed-out").exists()).toBe(true);
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });

  it("displays a pending icon if scripts are pending", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: scriptStatus.PENDING }}>
        Some or all tests are pending
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--pending").exists()).toBe(true);
  });

  it("displays a running icon if scripts are running", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: scriptStatus.RUNNING }}>
        Some or all tests are running
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--running").exists()).toBe(true);
  });

  it("displays a warning icon and tooltip if scripts have not been run", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: scriptStatus.NONE }}>
        Some or all tests are running
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--warning").exists()).toBe(true);
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });
});
