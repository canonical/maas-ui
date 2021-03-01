import { mount } from "enzyme";

import KvmTypeSelect from "./KvmTypeSelect";

import { PodType } from "app/store/pod/types";

describe("KvmTypeSelect", () => {
  it("correctly shows when the Add LXD form is selected", () => {
    const wrapper = mount(
      <KvmTypeSelect kvmType={PodType.LXD} setKvmType={jest.fn()} />
    );

    expect(wrapper.find("input[id='add-lxd']").prop("checked")).toBe(true);
    expect(wrapper.find("input[id='add-virsh']").prop("checked")).toBe(false);
  });

  it("correctly shows when the Add virsh form is shown", () => {
    const wrapper = mount(
      <KvmTypeSelect kvmType={PodType.VIRSH} setKvmType={jest.fn()} />
    );

    expect(wrapper.find("input[id='add-virsh']").prop("checked")).toBe(true);
    expect(wrapper.find("input[id='add-lxd']").prop("checked")).toBe(false);
  });
});
