import { shallow } from "enzyme";

import { ScriptResultStatus } from "app/store/scriptresult/types";
import ScriptStatus from "./ScriptStatus";

describe("ScriptStatus ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: ScriptResultStatus.PASSED }}>
        All tests have passed
      </ScriptStatus>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays a success icon if scripts passed", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: ScriptResultStatus.PASSED }}>
        All tests have passed
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--success").exists()).toBe(true);
  });

  it(`does not display a success icon if scripts passed
    and hidePassedIcon is false`, () => {
    const wrapper = shallow(
      <ScriptStatus
        hidePassedIcon
        scriptType={{ status: ScriptResultStatus.PASSED }}
      >
        All tests have passed
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--success").exists()).toBe(false);
  });

  it("displays an error icon and tooltip if scripts have failed", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: ScriptResultStatus.FAILED }}>
        Some or all tests have failed
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--error").exists()).toBe(true);
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });

  it("displays a timed out icon and tooltip if scripts have timed out", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: ScriptResultStatus.TIMEDOUT }}>
        Some or all tests have timed out
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--timed-out").exists()).toBe(true);
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });

  it("displays a pending icon if scripts are pending", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: ScriptResultStatus.PENDING }}>
        Some or all tests are pending
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--pending").exists()).toBe(true);
  });

  it("displays a running icon if scripts are running", () => {
    const wrapper = shallow(
      <ScriptStatus scriptType={{ status: ScriptResultStatus.RUNNING }}>
        Some or all tests are running
      </ScriptStatus>
    );
    expect(wrapper.find(".p-icon--running").exists()).toBe(true);
  });
});
