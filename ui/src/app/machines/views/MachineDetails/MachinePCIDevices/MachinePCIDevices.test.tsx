import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachinePCIDevices from "./MachinePCIDevices";

import { NodeActions } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  nodeDeviceState as nodeDeviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachinePCIDevices", () => {
  it("shows placeholder rows while PCI devices are loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
      }),
      nodedevice: nodeDeviceStateFactory({ loading: true }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/pci-devices", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/pci-devices"
            component={() => (
              <MachinePCIDevices setSelectedAction={jest.fn()} />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Placeholder").exists()).toBe(true);
  });

  it(`prompts user to commission machine if no PCI info available and machine
  can be commissioned`, () => {
    const setSelectedAction = jest.fn();
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            actions: [NodeActions.COMMISSION],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/pci-devices", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/pci-devices"
            component={() => (
              <MachinePCIDevices setSelectedAction={setSelectedAction} />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='information-unavailable']").exists()).toBe(
      true
    );

    wrapper.find("[data-test='commission-machine'] button").simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith({
      name: NodeActions.COMMISSION,
    });
  });
});
