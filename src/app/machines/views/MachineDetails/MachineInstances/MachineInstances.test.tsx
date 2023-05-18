import { Route, Routes } from "react-router-dom-v5-compat";

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
import { renderWithBrowserRouter, screen } from "testing/utils";

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
    renderWithBrowserRouter(<MachineInstances />, {
      state,
      route: "/machine/fake123/instances",
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("displays the table when data is available", () => {
    renderWithBrowserRouter(
      <Routes>
        <Route element={<MachineInstances />} path="/machine/:id/instances" />
      </Routes>,
      {
        state,
        route: "/machine/abc123/instances",
      }
    );

    expect(
      screen.getByRole("grid", { name: /machine instances/i })
    ).toBeInTheDocument();
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

    renderWithBrowserRouter(
      <Routes>
        <Route element={<MachineInstances />} path="/machine/:id/instances" />
      </Routes>,
      {
        state,
        route: "/machine/abc123/instances",
      }
    );

    expect(screen.getByTestId("name")).toHaveTextContent("foo");
    expect(screen.getByTestId("mac")).toHaveTextContent("00:00:9b:7c:1b:85");
    expect(screen.getByTestId("ip")).toHaveTextContent("100.100.3.99");
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

    renderWithBrowserRouter(
      <Routes>
        <Route element={<MachineInstances />} path="/machine/:id/instances" />
      </Routes>,
      {
        state,
        route: "/machine/abc123/instances",
      }
    );

    expect(screen.getByTestId("name")).toHaveTextContent("foo");
    expect(screen.getByTestId("mac")).toHaveTextContent("00:00:9b:7c:1b:85");
    expect(screen.getByTestId("ip")).toHaveTextContent("");
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

    renderWithBrowserRouter(
      <Routes>
        <Route element={<MachineInstances />} path="/machine/:id/instances" />
      </Routes>,
      {
        state,
        route: "/machine/abc123/instances",
      }
    );

    expect(screen.getAllByTestId("name")).toHaveLength(3);
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

    renderWithBrowserRouter(
      <Routes>
        <Route element={<MachineInstances />} path="/machine/:id/instances" />
      </Routes>,
      {
        state,
        route: "/machine/abc123/instances",
      }
    );

    expect(screen.getAllByTestId("mac")).toHaveLength(2);
    expect(screen.getAllByTestId("name").at(0)).toHaveTextContent("foo");
    expect(screen.getAllByTestId("mac").at(0)).toHaveTextContent(
      "00:00:9b:7c:1b:85"
    );
    expect(screen.getAllByTestId("ip").at(0)).toHaveTextContent("");
    expect(screen.getAllByTestId("name").at(1)).toHaveTextContent("");
    expect(screen.getAllByTestId("mac").at(1)).toHaveTextContent(
      "00:00:9b:7c:1b:01"
    );
    expect(screen.getAllByTestId("ip").at(1)).toHaveTextContent("");
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

    renderWithBrowserRouter(
      <Routes>
        <Route element={<MachineInstances />} path="/machine/:id/instances" />
      </Routes>,
      {
        state,
        route: "/machine/abc123/instances",
      }
    );

    expect(screen.getAllByTestId("mac")).toHaveLength(2);
    expect(screen.getAllByTestId("name").at(0)).toHaveTextContent("foo");
    expect(screen.getAllByTestId("mac").at(0)).toHaveTextContent(
      "00:00:9b:7c:1b:85"
    );
    expect(screen.getAllByTestId("ip").at(0)).toHaveTextContent("1.2.3.4");
    expect(screen.getAllByTestId("name").at(1)).toHaveTextContent("");
    expect(screen.getAllByTestId("mac").at(1)).toHaveTextContent("");
    expect(screen.getAllByTestId("ip").at(1)).toHaveTextContent("1.2.3.5");
  });
});
