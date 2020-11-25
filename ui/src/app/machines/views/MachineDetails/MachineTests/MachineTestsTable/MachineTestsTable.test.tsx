import { mount } from "enzyme";

import MachineTestsTable from ".";

import { nodeResult as nodeResultFactory } from "testing/factories";

describe("MachineTestsTable", () => {
  it("renders", () => {
    const wrapper = mount(
      <MachineTestsTable
        nodeResults={[nodeResultFactory(), nodeResultFactory()]}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
