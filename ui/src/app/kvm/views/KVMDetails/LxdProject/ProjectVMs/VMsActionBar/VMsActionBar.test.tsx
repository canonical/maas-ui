import { shallow } from "enzyme";

import VMsActionBar from "./VMsActionBar";

import { machine as machineFactory } from "testing/factories";

describe("VMsActionBar", () => {
  it("renders", () => {
    const wrapper = shallow(<VMsActionBar vms={[machineFactory()]} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("shows a spinner instead of VM count if machines are loading", () => {
    const wrapper = shallow(<VMsActionBar loading vms={[]} />);

    expect(wrapper.find("[data-test='vms-count'] Spinner").exists()).toBe(true);
  });

  it("shows a VM count if machines have loaded", () => {
    const wrapper = shallow(
      <VMsActionBar loading={false} vms={[machineFactory()]} />
    );

    expect(wrapper.find("[data-test='vms-count']").text()).toBe("1 - 1 of 1");
  });
});
