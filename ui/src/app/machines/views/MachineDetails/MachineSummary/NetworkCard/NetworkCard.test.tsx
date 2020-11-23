import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import NetworkCard from "./NetworkCard";

import {
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  vlanState as vlanStateFactory,
  testStatus as testStatusFactory,
} from "testing/factories";

import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("NetworkCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({ loaded: true }),
      machine: machineStateFactory(),
      vlan: vlanStateFactory({ loaded: true }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/abc123/summary"
            component={() => (
              <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();

    expect(actions.some((action) => action.type === "fabric/fetch"));
    expect(actions.some((action) => action.type === "vlan/fetch"));
  });

  it("displays product, vendor and firmware information, if they exist", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            firmware_version: "1.0.0",
            product: "Product 1",
            vendor: "Vendor 1",
          }),
          machineInterfaceFactory({
            firmware_version: null,
            product: null,
            vendor: null,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/abc123/summary"
            component={() => (
              <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ul [data-test='nic-vendor']").at(0).text()).toBe(
      "Vendor 1"
    );
    expect(wrapper.find("ul [data-test='nic-product']").at(0).text()).toBe(
      "Product 1"
    );
    expect(
      wrapper.find("ul [data-test='nic-firmware-version']").at(0).text()
    ).toBe("1.0.0");
    expect(wrapper.find("ul [data-test='nic-vendor']").at(1).text()).toBe(
      "Unknown network card"
    );
  });

  it("groups interfaces by vendor, product and firmware version", () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          ...Array.from(Array(4)).map(() =>
            machineInterfaceFactory({
              firmware_version: "1.0.0",
              product: "Product 1",
              vendor: "Vendor 1",
            })
          ),
          ...Array.from(Array(3)).map(() =>
            machineInterfaceFactory({
              firmware_version: "2.0.0",
              product: "Product 1",
              vendor: "Vendor 1",
            })
          ),
          ...Array.from(Array(2)).map(() =>
            machineInterfaceFactory({
              firmware_version: "2.0.0",
              product: "Product 2",
              vendor: "Vendor 1",
            })
          ),
          machineInterfaceFactory({
            firmware_version: "2.0.0",
            product: "Product 2",
            vendor: "Vendor 2",
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/summary", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/abc123/summary"
            component={() => (
              <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
            )}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Table").at(0).find("tbody TableRow").length).toBe(4);
    expect(wrapper.find("Table").at(1).find("tbody TableRow").length).toBe(3);
    expect(wrapper.find("Table").at(2).find("tbody TableRow").length).toBe(2);
    expect(wrapper.find("Table").at(3).find("tbody TableRow").length).toBe(1);
  });

  describe("test results", () => {
    it("renders a link with a count of passed tests", () => {
      const machine = machineDetailsFactory({
        system_id: "abc123",
      });

      machine.network_test_status = testStatusFactory({
        passed: 2,
      });
      state.machine.items = [machine];

      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
          </MemoryRouter>
        </Provider>
      );

      expect(
        wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
      ).toEqual("2");
    });

    it("renders a link with a count of pending and running tests", () => {
      const machine = machineDetailsFactory({
        system_id: "abc123",
      });

      machine.network_test_status = testStatusFactory({
        running: 1,
        pending: 2,
      });
      state.machine.items = [machine];

      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
          </MemoryRouter>
        </Provider>
      );

      expect(
        wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
      ).toEqual("3");
    });

    it("renders a link with a count of failed tests", () => {
      const machine = machineDetailsFactory({
        system_id: "abc123",
      });
      machine.network_test_status = testStatusFactory({
        failed: 5,
      });
      state.machine.items = [machine];

      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
          </MemoryRouter>
        </Provider>
      );

      expect(
        wrapper.find("[data-test='tests']").childAt(0).find("Link").text()
      ).toEqual("5");
    });

    it("renders a results link", () => {
      const machine = machineDetailsFactory({
        system_id: "abc123",
      });
      machine.network_test_status = testStatusFactory({
        failed: 5,
      });
      state.machine.items = [machine];

      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
          </MemoryRouter>
        </Provider>
      );

      expect(
        wrapper.find("[data-test='tests']").childAt(1).find("Link").text()
      ).toContain("View results");
    });

    it("renders a test storage link if no tests run", () => {
      const machine = machineDetailsFactory({
        system_id: "abc123",
      });
      machine.network_test_status = testStatusFactory();
      state.machine.items = [machine];

      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkCard id="abc123" setSelectedAction={jest.fn()} />
          </MemoryRouter>
        </Provider>
      );

      expect(
        wrapper.find("[data-test='tests']").childAt(0).find("Button").text()
      ).toContain("Test network");
    });
  });
});
