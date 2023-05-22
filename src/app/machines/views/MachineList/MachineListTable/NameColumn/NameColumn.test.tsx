import configureStore from "redux-mock-store";

import { NameColumn } from "./NameColumn";

import { NodeStatus } from "app/store/types/node";
import {
  modelRef as modelRefFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("NameColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            domain: modelRefFactory({
              name: "example",
            }),
            extra_macs: [],
            hostname: "koala",
            ip_addresses: [],
            pool: modelRefFactory(),
            pxe_mac: "00:11:22:33:44:55",
            status: NodeStatus.RELEASING,
            system_id: "abc123",
            zone: modelRefFactory(),
          }),
        ],
      }),
    });
  });

  it("can be locked", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("p-icon--locked")).toBeInTheDocument();
  });

  it("can show the FQDN", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByText(/koala.example/i)).toBeInTheDocument();
  });

  it("can show a single ip address", () => {
    state.machine.items[0].ip_addresses = [{ ip: "127.0.0.1", is_boot: false }];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("ip-addresses")).toHaveTextContent("127.0.0.1");
    expect(screen.queryByTestId("Tooltip")).not.toBeInTheDocument();
  });

  it("can show multiple ip addresses", () => {
    state.machine.items[0].ip_addresses = [
      { ip: "127.0.0.1", is_boot: false },
      { ip: "127.0.0.2", is_boot: false },
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("ip-addresses")).toHaveTextContent("127.0.0.1");
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.getByTestId("Tooltip")).toBeInTheDocument();
  });

  it("can show a PXE ip address", () => {
    state.machine.items[0].ip_addresses = [{ is_boot: true, ip: "127.0.0.1" }];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("ip-addresses")).toHaveTextContent(
      "127.0.0.1 (PXE)"
    );
  });

  it("doesn't show duplicate ip addresses", () => {
    state.machine.items[0].ip_addresses = [
      { ip: "127.0.0.1", is_boot: false },
      { ip: "127.0.0.1", is_boot: false },
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("ip-addresses")).toHaveTextContent("127.0.0.1");
    expect(screen.queryByTestId("Tooltip")).not.toBeInTheDocument();
  });

  it("can show a single mac address", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} showMAC={true} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByText(/00:11:22:33:44:55/i)).toBeInTheDocument();
  });

  it("can show multiple mac address", () => {
    state.machine.items[0].extra_macs = ["aa:bb:cc:dd:ee:ff"];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} showMAC={true} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByRole("link")[1]).toHaveTextContent(" (+1)");
  });

  it("can render a machine with minimal data", () => {
    state.machine.items[0] = machineFactory({
      domain: modelRefFactory({
        name: "example",
      }),
      hostname: "koala",
      system_id: "abc123",
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(
      screen.getByRole("columnheader", { name: "Name" })
    ).toBeInTheDocument();
  });

  it("can render a machine in the MAC state with minimal data", () => {
    state.machine.items[0] = machineFactory({
      domain: modelRefFactory({
        name: "example",
      }),
      hostname: "koala",
      system_id: "abc123",
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} showMAC={true} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(
      screen.getByRole("columnheader", { name: "Name" })
    ).toBeInTheDocument();
  });

  it("does not render checkbox if onToggleMenu not provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
