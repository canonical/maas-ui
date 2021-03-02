import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineNetwork from "./MachineNetwork";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
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
          <MachineNetwork setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the add interface form when expanded", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/network", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/network"
            component={() => <MachineNetwork setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button[children='Add interface']").simulate("click");
    expect(wrapper.find("AddInterface").exists()).toBe(true);
  });

  it("can display the edit interface form", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [
              machineInterfaceFactory({
                type: NetworkInterfaceTypes.PHYSICAL,
              }),
            ],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/network", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/network"
            component={() => <MachineNetwork setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    // Open an interface row menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    wrapper.update();
    wrapper
      .findWhere(
        (n) =>
          n.type() === "button" &&
          n.hasClass("p-contextual-menu__link") &&
          n.text() === "Edit Physical"
      )
      .simulate("click");
    wrapper.update();
    expect(wrapper.find("EditInterface").exists()).toBe(true);
    expect(wrapper.find("NetworkActions").exists()).toBe(false);
    expect(wrapper.find("AddInterface").exists()).toBe(false);
    expect(wrapper.find("DHCPTable").exists()).toBe(false);
  });
});
