import { shallow } from "enzyme";

import ScriptResultStatus from "./ScriptResultStatus";

import { ScriptResultStatus as ScriptStatus } from "app/store/scriptresult/types";
import { scriptResult as scriptResultFactory } from "testing/factories";

describe("ScriptResultStatus", () => {
  it("renders", () => {
    const scriptResult = scriptResultFactory({
      status: ScriptStatus.PASSED,
      status_name: "Passed",
    });
    const wrapper = shallow(<ScriptResultStatus scriptResult={scriptResult} />);
    expect(wrapper).toMatchSnapshot();
  });
});
