import configureStore from "redux-mock-store";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("FabricColumn", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            network_test_status: testStatusFactory({
              status: 1,
            }),
            vlan: {
              id: 1,
              name: "Default VLAN",
              fabric_id: 0,
              fabric_name: "fabric-0",
            },
          }),
        ],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<FabricColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.getByTestId("fabricColumn")).toMatchSnapshot();
  });

  it("displays the fabric name", () => {
    state.machine.items[0] = machineFactory({
      system_id: "abc123",
      network_test_status: testStatusFactory({
        status: 1,
      }),
      vlan: {
        id: 1,
        name: "Default VLAN",
        fabric_id: 0,
        fabric_name: "fabric-2",
      },
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<FabricColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.getByTestId("fabric")).toHaveTextContent(/fabric-2/i);
  });

  it("displays '-' with no fabric present", () => {
    state.machine.items[0] = machineFactory({
      system_id: "abc123",
      network_test_status: testStatusFactory({
        status: 1,
      }),
      vlan: null,
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<FabricColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.getByTestId("fabric")).toHaveTextContent("-");
  });

  it("displays VLAN name", () => {
    state.machine.items[0] = machineFactory({
      system_id: "abc123",
      network_test_status: testStatusFactory({
        status: 1,
      }),
      vlan: {
        id: 1,
        name: "Wombat",
        fabric_id: 0,
        fabric_name: "fabric-2",
      },
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<FabricColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.getByTestId("vlan")).toHaveTextContent(/Wombat/i);
  });
});
