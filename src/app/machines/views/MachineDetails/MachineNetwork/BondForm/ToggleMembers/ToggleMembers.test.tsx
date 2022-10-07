import { screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import ToggleMembers from "./ToggleMembers";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  machineInterface as machineInterfaceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("ToggleMembers", () => {
  it("disables the edit button if there are no additional valid interfaces", () => {
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
    renderWithBrowserRouter(
      <ToggleMembers
        selected={selected}
        setEditingMembers={jest.fn()}
        validNics={interfaces}
      />,
      { route: "/machines", wrapperProps: { store } }
    );

    expect(screen.getByTestId("edit-members")).toBeDisabled();
  });

  it("disables the update button if two interfaces aren't selected", () => {
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
    const { unmount } = renderWithBrowserRouter(
      <ToggleMembers
        editingMembers
        selected={[{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }]}
        setEditingMembers={jest.fn()}
        validNics={interfaces}
      />,
      { route: "/machines", wrapperProps: { store } }
    );

    expect(screen.getByTestId("edit-members")).not.toBeDisabled();

    unmount();

    renderWithBrowserRouter(
      <ToggleMembers
        editingMembers
        selected={[]}
        setEditingMembers={jest.fn()}
        validNics={interfaces}
      />,
      { route: "/machines", wrapperProps: { store } }
    );
    expect(screen.getByTestId("edit-members")).toBeDisabled();
  });
});
