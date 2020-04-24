import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import NameColumn from "./NameColumn";

const mockStore = configureStore();

describe("NameColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            domain: {
              name: "example",
            },
            extra_macs: [],
            hostname: "koala",
            ip_addresses: [],
            permissions: ["edit", "delete"],
            pool: {},
            pxe_mac: "00:11:22:33:44:55",
            status: "Releasing",
            system_id: "abc123",
            zone: {},
          },
        ],
      },
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NameColumn")).toMatchSnapshot();
  });

  it("can be locked", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-icon--locked").exists()).toBe(true);
  });

  it("can show the FQDN", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("a").text()).toEqual("koala.example");
  });

  it("can show a single ip address", () => {
    state.machine.items[0].ip_addresses = [{ ip: "127.0.0.1" }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="ip-addresses"]').text()).toBe("127.0.0.1");
    // Doesn't show tooltip.
    expect(wrapper.find("Tooltip").exists()).toBe(false);
  });

  it("can show multiple ip addresses", () => {
    state.machine.items[0].ip_addresses = [
      { ip: "127.0.0.1" },
      { ip: "127.0.0.2" },
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="ip-addresses"]').text()).toBe(
      "127.0.0.1 (+1)"
    );
    // Shows a tooltip.
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });

  it("can show a PXE ip address", () => {
    state.machine.items[0].ip_addresses = [{ is_boot: true, ip: "127.0.0.1" }];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="ip-addresses"]').text()).toBe(
      "127.0.0.1 (PXE)"
    );
  });

  it("doesn't show duplicate ip addresses", () => {
    state.machine.items[0].ip_addresses = [
      { ip: "127.0.0.1" },
      { ip: "127.0.0.1" },
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="ip-addresses"]').text()).toBe("127.0.0.1");
    // Doesn't show toolip.
    expect(wrapper.find("Tooltip").exists()).toBe(false);
  });

  it("can show a single mac address", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn showMAC={true} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("a").text()).toEqual("00:11:22:33:44:55");
  });

  it("can show multiple mac address", () => {
    state.machine.items[0].extra_macs = ["aa:bb:cc:dd:ee:ff"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn showMAC={true} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("a").length).toEqual(2);
    expect(wrapper.find("a").at(1).text()).toEqual(" (+1)");
  });

  it("can render a machine with minimal data", () => {
    state.machine.items[0] = {
      domain: {
        name: "example",
      },
      hostname: "koala",
      permissions: ["edit", "delete"],
      system_id: "abc123",
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NameColumn").exists()).toBe(true);
  });

  it("can render a machine in the MAC state with minimal data", () => {
    state.machine.items[0] = {
      domain: {
        name: "example",
      },
      hostname: "koala",
      permissions: ["edit", "delete"],
      system_id: "abc123",
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn showMAC={true} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NameColumn").exists()).toBe(true);
  });

  it("sets checkbox to checked if selected is true", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn
            handleCheckbox={jest.fn()}
            selected
            showMAC={true}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input").props().checked).toBe(true);
  });
});
