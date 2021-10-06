import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import IPColumn from "./IPColumn";

import type { MachineIpAddress } from "app/store/machine/types";
import {
  machine as machineFactory,
  machineIpAddress as ipAddressFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("IPColumn", () => {
  let ipAddresses: MachineIpAddress[] = [];

  beforeEach(() => {
    ipAddresses = [
      ipAddressFactory({ ip: "192.168.1.1", is_boot: true }),
      ipAddressFactory({ ip: "192.168.1.2:8000", is_boot: false }),
      ipAddressFactory({ ip: "2001:db8::ff00:42:8329", is_boot: false }),
    ];
  });

  it("shows a spinner if the machine is still loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <IPColumn systemId="abc123" version={4} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can show a list of the machine's ipv4s", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            ip_addresses: ipAddresses,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <IPColumn systemId="abc123" version={4} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='ip']").length).toBe(2);
    expect(wrapper.find("[data-test='ip']").at(0).text()).toBe("192.168.1.1");
    expect(wrapper.find("[data-test='ip']").at(1).text()).toBe(
      "192.168.1.2:8000"
    );
  });

  it("can show a list of the machine's ipv6s", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            ip_addresses: ipAddresses,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <IPColumn systemId="abc123" version={6} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='ip']").length).toBe(1);
    expect(wrapper.find("[data-test='ip']").text()).toBe(
      "2001:db8::ff00:42:8329"
    );
  });
});
