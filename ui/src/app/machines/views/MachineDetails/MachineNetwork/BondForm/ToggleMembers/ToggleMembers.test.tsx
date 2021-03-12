import { mount } from "enzyme";

import ToggleMembers from "./ToggleMembers";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import { machineInterface as machineInterfaceFactory } from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

describe("ToggleMembers", () => {
  it("disables the edit button if there are no additional valid interfaces", async () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    const selected = [{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }];
    const wrapper = mount(
      <ToggleMembers
        selected={selected}
        setEditingMembers={jest.fn()}
        validNics={interfaces}
      />
    );
    await waitForComponentToPaint(wrapper);
    expect(
      wrapper.find("Button[data-test='edit-members']").prop("disabled")
    ).toBe(true);
  });

  it("disables the update button if two interfaces aren't selected", async () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    const wrapper = mount(
      <ToggleMembers
        editingMembers
        selected={[{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }]}
        setEditingMembers={jest.fn()}
        validNics={interfaces}
      />
    );
    wrapper.find("button[data-test='edit-members']").simulate("click");
    await waitForComponentToPaint(wrapper);
    wrapper.setProps({ selected: [] });
    await waitForComponentToPaint(wrapper);
    expect(
      wrapper.find("Button[data-test='edit-members']").prop("disabled")
    ).toBe(true);
    expect(wrapper.find("FormikForm").prop("submitDisabled")).toBe(true);
  });
});
