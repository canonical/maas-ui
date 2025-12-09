import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import IPColumn from "./IPColumn";

import type { NodeIpAddress } from "@/app/store/types/node";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("IPColumn", () => {
  let ipAddresses: NodeIpAddress[] = [];

  beforeEach(() => {
    ipAddresses = [
      factory.machineIpAddress({ ip: "192.168.1.1", is_boot: true }),
      factory.machineIpAddress({ ip: "192.168.1.2:8000", is_boot: false }),
      factory.machineIpAddress({
        ip: "2001:db8::ff00:42:8329",
        is_boot: false,
      }),
    ];
  });

  it("shows a spinner if the machine is still loading", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <IPColumn systemId="abc123" version={4} />
        </MemoryRouter>
      </Provider>
    );

    const spinner = screen.getByText(/loading/i);

    expect(spinner).toBeInTheDocument();
  });

  it("can show a list of the machine's ipv4s", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machine({
            ip_addresses: ipAddresses,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <IPColumn systemId="abc123" version={4} />
        </MemoryRouter>
      </Provider>
    );

    const ips = screen.getAllByTestId("ip");

    expect(ips.length).toBe(2);
    expect(ips[0]).toHaveTextContent("192.168.1.1");
    expect(ips[1]).toHaveTextContent("192.168.1.2:8000");
  });

  it("can show a list of the machine's ipv6s", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machine({
            ip_addresses: ipAddresses,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <IPColumn systemId="abc123" version={6} />
        </MemoryRouter>
      </Provider>
    );

    const ips = screen.getAllByTestId("ip");

    expect(ips.length).toBe(1);
    expect(ips[0]).toHaveTextContent("2001:db8::ff00:42:8329");
  });
});
