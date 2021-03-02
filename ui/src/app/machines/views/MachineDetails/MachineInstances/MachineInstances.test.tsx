import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineInstances from "./MachineInstances";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
  machineInterface as machineInterfaceFactory,
  networkLink as networkLinkFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineInstances", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            devices: [
              machineDeviceFactory({
                fqdn: "instance1",
                interfaces: [
                  machineInterfaceFactory({
                    mac_address: "f5:f6:9b:7c:1b:85",
                    links: [
                      networkLinkFactory({
                        ip_address: "1.2.3.99",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  });

  it("displays the spinner on load", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/fake123/instances", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/instances"
            component={() => <MachineInstances />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the table when data is available", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/instances", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/instances"
            component={() => <MachineInstances />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("displays instance with mac address and ip address correctly", () => {
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        devices: [
          machineDeviceFactory({
            fqdn: "foo",
            interfaces: [
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:85",
                links: [
                  networkLinkFactory({
                    ip_address: "100.100.3.99",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/instances", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/instances"
            component={() => <MachineInstances />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='name']").text()).toBe("foo");
    expect(wrapper.find("[data-test='mac']").text()).toBe("00:00:9b:7c:1b:85");
    expect(wrapper.find("[data-test='ip']").text()).toBe("100.100.3.99");
  });

  it("displays instance with mac address correctly", () => {
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        devices: [
          machineDeviceFactory({
            fqdn: "foo",
            interfaces: [
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:85",
              }),
            ],
          }),
        ],
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/instances", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/instances"
            component={() => <MachineInstances />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='name']").text()).toBe("foo");
    expect(wrapper.find("[data-test='mac']").text()).toBe("00:00:9b:7c:1b:85");
    expect(wrapper.find("[data-test='ip']").text()).toBe("");
  });

  it("displays multiple instances", () => {
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        devices: [
          machineDeviceFactory({
            fqdn: "foo",
            interfaces: [
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:85",
              }),
            ],
          }),
          machineDeviceFactory({
            fqdn: "bar",
            interfaces: [
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:85",
              }),
            ],
          }),
          machineDeviceFactory({
            fqdn: "baz",
            interfaces: [
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:85",
              }),
            ],
          }),
        ],
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/instances", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/instances"
            component={() => <MachineInstances />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='name']").length).toBe(3);
  });

  it("displays instances with multiple mac addresses", () => {
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        devices: [
          machineDeviceFactory({
            fqdn: "foo",
            interfaces: [
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:85",
              }),
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:01",
              }),
            ],
          }),
        ],
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/instances", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/instances"
            component={() => <MachineInstances />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='mac']").length).toBe(2);
    expect(wrapper.find("[data-test='name']").at(0).text()).toBe("foo");
    expect(wrapper.find("[data-test='mac']").at(0).text()).toBe(
      "00:00:9b:7c:1b:85"
    );
    expect(wrapper.find("[data-test='ip']").at(0).text()).toBe("");
    expect(wrapper.find("[data-test='name']").at(1).text()).toBe("");
    expect(wrapper.find("[data-test='mac']").at(1).text()).toBe(
      "00:00:9b:7c:1b:01"
    );
    expect(wrapper.find("[data-test='ip']").at(1).text()).toBe("");
  });

  it("displays instances with multiple ip addresses", () => {
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        devices: [
          machineDeviceFactory({
            fqdn: "foo",
            interfaces: [
              machineInterfaceFactory({
                mac_address: "00:00:9b:7c:1b:85",
                links: [
                  networkLinkFactory({
                    ip_address: "1.2.3.4",
                  }),
                  networkLinkFactory({
                    ip_address: "1.2.3.5",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/instances", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/instances"
            component={() => <MachineInstances />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='mac']").length).toBe(2);
    expect(wrapper.find("[data-test='name']").at(0).text()).toBe("foo");
    expect(wrapper.find("[data-test='mac']").at(0).text()).toBe(
      "00:00:9b:7c:1b:85"
    );
    expect(wrapper.find("[data-test='ip']").at(0).text()).toBe("1.2.3.4");
    expect(wrapper.find("[data-test='name']").at(1).text()).toBe("");
    expect(wrapper.find("[data-test='mac']").at(1).text()).toBe("");
    expect(wrapper.find("[data-test='ip']").at(1).text()).toBe("1.2.3.5");
  });
});
