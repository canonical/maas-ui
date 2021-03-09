import { shallow } from "enzyme";

import MachineTestStatus from "./MachineTestStatus";

import { TestStatusStatus } from "app/store/types/node";

describe("MachineTestStatus", () => {
  it("renders", () => {
    const wrapper = shallow(
      <MachineTestStatus status={TestStatusStatus.PENDING}>
        Tests are pending
      </MachineTestStatus>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("does not display an icon if tests have passed", () => {
    const wrapper = shallow(
      <MachineTestStatus status={TestStatusStatus.PASSED}>
        Tests have passed
      </MachineTestStatus>
    );
    expect(wrapper.find("ScriptStatus").exists()).toBe(false);
  });

  it("shows a failed icon with tooltip if tests have failed", () => {
    const wrapper = shallow(
      <MachineTestStatus status={TestStatusStatus.FAILED}>
        Tests have failed
      </MachineTestStatus>
    );
    expect(wrapper.find("ScriptStatus").prop("status")).toBe(
      TestStatusStatus.FAILED
    );
    expect(wrapper.find("Tooltip").prop("message")).toBe(
      "Machine has failed tests."
    );
  });
});
