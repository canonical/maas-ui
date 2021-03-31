import { shallow } from "enzyme";

import VMsActionBar from "./VMsActionBar";

import { KVMAction } from "app/kvm/views/KVMDetails";
import { machine as machineFactory } from "testing/factories";

describe("VMsActionBar", () => {
  it("renders", () => {
    const wrapper = shallow(
      <VMsActionBar setSelectedAction={jest.fn()} vms={[machineFactory()]} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("shows a spinner instead of VM count if machines are loading", () => {
    const wrapper = shallow(
      <VMsActionBar loading setSelectedAction={jest.fn()} vms={[]} />
    );

    expect(wrapper.find("[data-test='vms-count'] Spinner").exists()).toBe(true);
  });

  it("shows a VM count if machines have loaded", () => {
    const wrapper = shallow(
      <VMsActionBar
        loading={false}
        setSelectedAction={jest.fn()}
        vms={[machineFactory()]}
      />
    );

    expect(wrapper.find("[data-test='vms-count']").text()).toBe("1 - 1 of 1");
  });

  it("can open the 'Compose VM' form", () => {
    const setSelectedAction = jest.fn();
    const wrapper = shallow(
      <VMsActionBar
        loading={false}
        setSelectedAction={setSelectedAction}
        vms={[machineFactory()]}
      />
    );

    wrapper.find("[data-test='compose-vm']").simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith(KVMAction.COMPOSE);
  });

  it("can open the 'Refresh KVM' form", () => {
    const setSelectedAction = jest.fn();
    const wrapper = shallow(
      <VMsActionBar
        loading={false}
        setSelectedAction={setSelectedAction}
        vms={[machineFactory()]}
      />
    );

    wrapper.find("[data-test='refresh-kvm']").simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith(KVMAction.REFRESH);
  });
});
