import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineNetwork from "./MachineNetwork";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineNetwork", () => {
  it("displays a spinner if machine is loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineNetwork id="abc123" setHeaderContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
    expect(wrapper.find("NodeNetworkTab").exists()).toBe(false);
  });

  it("displays the network tab when loaded", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineNetwork id="abc123" setHeaderContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NodeNetworkTab").exists()).toBe(true);
    expect(wrapper.find("Spinner").exists()).toBe(false);
  });
});
