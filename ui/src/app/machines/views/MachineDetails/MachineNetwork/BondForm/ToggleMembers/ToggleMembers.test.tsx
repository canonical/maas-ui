import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ToggleMembers from "./ToggleMembers";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import {
  machineInterface as machineInterfaceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

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
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ToggleMembers
            selected={selected}
            setEditingMembers={jest.fn()}
            validNics={interfaces}
          />
        </MemoryRouter>
      </Provider>
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
    const store = mockStore(rootStateFactory());
    const PassProps = ({ ...props }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ToggleMembers
            editingMembers
            selected={[
              { nicId: interfaces[0].id },
              { nicId: interfaces[1].id },
            ]}
            setEditingMembers={jest.fn()}
            validNics={interfaces}
            {...props}
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<PassProps />);
    wrapper.find("button[data-test='edit-members']").simulate("click");
    await waitForComponentToPaint(wrapper);
    wrapper.setProps({ selected: [] });
    await waitForComponentToPaint(wrapper);
    expect(
      wrapper.find("Button[data-test='edit-members']").prop("disabled")
    ).toBe(true);
  });
});
