import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import ScriptRunTime from "./ScriptRunTime";

import {
  ScriptResultStatus,
  ScriptResultEstimated,
} from "app/store/scriptresult/types";
import { scriptResult as scriptResultFactory } from "testing/factories";

describe("ScriptRunTime", () => {
  beforeEach(() => {
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("Thu Apr 01 2021 05:21:58 GMT+0000").getTime());
  });

  it("displays the elapsed time when running and runtime is not known", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: ScriptResultEstimated.UNKNOWN,
      status: ScriptResultStatus.RUNNING,
      starttime: 1617254218,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:05:00");
  });

  it("displays the elapsed time when running and runtime is known", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: "0:10:00",
      status: ScriptResultStatus.RUNNING,
      starttime: 1617254218,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:05:00 of ~0:10:00");
  });

  it("displays the elapsed time when the the start time is not known", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: "0:10:00",
      status: ScriptResultStatus.RUNNING,
      // Use undefined here so that the factory does not set the start time.
      starttime: undefined,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:00:00 of ~0:10:00");
  });

  it("displays the elapsed and estimated times when installing and runtime is not known", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: ScriptResultEstimated.UNKNOWN,
      status: ScriptResultStatus.INSTALLING,
      starttime: 1617254218,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:05:00");
  });

  it("displays the elapsed and estimated times when installing and runtime is known", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: "0:10:00",
      status: ScriptResultStatus.INSTALLING,
      starttime: 1617254218,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:05:00 of ~0:10:00");
  });

  it("updates the elapsed time every second", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: ScriptResultEstimated.UNKNOWN,
      status: ScriptResultStatus.RUNNING,
      starttime: 1617254218,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:05:00");
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    wrapper.update();
    expect(wrapper.text()).toBe("0:05:01");
  });

  it("only shows the time if less than a day has elapsed", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: ScriptResultEstimated.UNKNOWN,
      status: ScriptResultStatus.RUNNING,
      starttime: 1617254218,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:05:00");
  });

  it("shows the day and time if one day has elapsed", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: ScriptResultEstimated.UNKNOWN,
      status: ScriptResultStatus.RUNNING,
      starttime: 1617167818,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("1 day, 0:05:00");
  });

  it("shows the days and time if more than one day has elapsed", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: ScriptResultEstimated.UNKNOWN,
      status: ScriptResultStatus.RUNNING,
      starttime: 1617081418,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("2 days, 0:05:00");
  });

  it("displays the estimated time when pending and runtime is known", () => {
    const scriptResult = scriptResultFactory({
      estimated_runtime: "0:10:00",
      status: ScriptResultStatus.PENDING,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("~0:10:00");
  });

  it("displays the runtime for other statuses", () => {
    const scriptResult = scriptResultFactory({
      runtime: "0:15:00",
      status: ScriptResultStatus.FAILED_APPLYING_NETCONF,
    });
    const wrapper = mount(<ScriptRunTime scriptResult={scriptResult} />);
    expect(wrapper.text()).toBe("0:15:00");
  });
});
