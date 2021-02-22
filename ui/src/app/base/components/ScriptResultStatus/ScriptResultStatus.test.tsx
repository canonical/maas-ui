import { shallow } from "enzyme";

import ScriptResultStatus from "./ScriptResultStatus";

import { scriptStatus } from "app/base/enum";
import { scriptResult as scriptResultFactory } from "testing/factories";

describe("ScriptResultStatus", () => {
  it("renders", () => {
    const scriptResult = scriptResultFactory({
      status: scriptStatus.PASSED,
      status_name: "Passed",
    });
    const wrapper = shallow(<ScriptResultStatus scriptResult={scriptResult} />);
    expect(wrapper).toMatchSnapshot();
  });
});
