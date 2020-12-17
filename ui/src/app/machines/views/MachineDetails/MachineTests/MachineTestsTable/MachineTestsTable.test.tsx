import { mount } from "enzyme";

import MachineTestsTable from ".";

import { scriptResult as scriptResultFactory } from "testing/factories";

describe("MachineTestsTable", () => {
  it("renders", () => {
    const wrapper = mount(
      <MachineTestsTable
        scriptResults={[scriptResultFactory(), scriptResultFactory()]}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
