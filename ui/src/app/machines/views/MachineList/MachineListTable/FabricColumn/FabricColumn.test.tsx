import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { FabricColumn } from "./FabricColumn";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";

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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FabricColumn")).toMatchSnapshot();
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="fabric"]').text()).toEqual("fabric-2");
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="fabric"]').text()).toEqual("-");
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="vlan"]').text()).toEqual("Wombat");
  });
});
