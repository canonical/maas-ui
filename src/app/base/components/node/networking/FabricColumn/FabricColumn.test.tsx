import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import FabricColumn from "./FabricColumn";

import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FabricColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("displays a spinner if the data is loading", () => {
    state.fabric.loaded = false;
    const nic = machineInterfaceFactory();
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FabricColumn nic={nic} node={state.machine.items[0]} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can display fabric and vlan details", () => {
    const fabric = fabricFactory({ name: "fabric-name" });
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state.vlan.items = [vlan];
    const nic = machineInterfaceFactory({
      vlan_id: vlan.id,
    });
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [nic],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FabricColumn nic={nic} node={state.machine.items[0]} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("fabric-name")).toBeInTheDocument();
    expect(screen.getByText("2 (vlan-name)")).toBeInTheDocument();
  });
});
