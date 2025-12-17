import configureStore from "redux-mock-store";

import ToggleMembers from "./ToggleMembers";

import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ToggleMembers", () => {
  it("disables the edit button if there are no additional valid interfaces", () => {
    const interfaces = [
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    const selected = [{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }];
    const store = mockStore(factory.rootState());
    renderWithProviders(
      <ToggleMembers
        selected={selected}
        setEditingMembers={vi.fn()}
        validNics={interfaces}
      />,
      { store }
    );

    expect(screen.getByTestId("edit-members")).toBeAriaDisabled();
  });

  it("disables the update button if two interfaces aren't selected", () => {
    const interfaces = [
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      factory.machineInterface({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    const store = mockStore(factory.rootState());
    const {
      result: { unmount },
    } = renderWithProviders(
      <ToggleMembers
        editingMembers
        selected={[{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }]}
        setEditingMembers={vi.fn()}
        validNics={interfaces}
      />,
      { store }
    );

    expect(screen.getByTestId("edit-members")).not.toBeAriaDisabled();

    unmount();

    renderWithProviders(
      <ToggleMembers
        editingMembers
        selected={[]}
        setEditingMembers={vi.fn()}
        validNics={interfaces}
      />,
      { store }
    );
    expect(screen.getByTestId("edit-members")).toBeAriaDisabled();
  });
});
