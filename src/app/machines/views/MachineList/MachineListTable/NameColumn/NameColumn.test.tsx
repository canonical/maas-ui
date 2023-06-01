import { NameColumn } from "./NameColumn";

import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  modelRef as modelRefFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  getByTextContent,
  renderWithBrowserRouter,
  screen,
} from "testing/utils";

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
            fqdn: "koala.example",
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
    const { container } = renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
    );
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(".p-icon--locked")).toBeInTheDocument();
  });

  it("can show the FQDN", () => {
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(getByTextContent("koala.example")).toBeInTheDocument();
  });

  it("can show a single ip address", () => {
    state.machine.items[0].ip_addresses = [{ ip: "127.0.0.1", is_boot: false }];
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getByTestId("ip-addresses")).toHaveTextContent("127.0.0.1");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("can show multiple ip addresses", () => {
    state.machine.items[0].ip_addresses = [
      { ip: "127.0.0.1", is_boot: false },
      { ip: "127.0.0.2", is_boot: false },
    ];
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getByTestId("ip-addresses")).toHaveTextContent("127.0.0.1");
    expect(screen.getByRole("button", { name: "+1" })).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("can show a PXE ip address", () => {
    state.machine.items[0].ip_addresses = [{ is_boot: true, ip: "127.0.0.1" }];
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
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
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getByTestId("ip-addresses")).toHaveTextContent("127.0.0.1");
    expect(screen.queryByTestId("Tooltip")).not.toBeInTheDocument();
  });

  it("can show a single mac address", () => {
    renderWithBrowserRouter(
      <NameColumn groupValue={null} showMAC={true} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(
      screen.getByRole("link", { name: "koala.example" })
    ).toHaveTextContent("00:11:22:33:44:55");
  });

  it("can show multiple mac address", () => {
    state.machine.items[0].extra_macs = ["aa:bb:cc:dd:ee:ff"];
    renderWithBrowserRouter(
      <NameColumn groupValue={null} showMAC={true} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByRole("link")[1]).toHaveTextContent(/\(\+1\)/);
  });

  it("can render a machine with minimal data", () => {
    state.machine.items[0] = machineFactory({
      domain: modelRefFactory({
        name: "example",
      }),
      fqdn: "koala.example",
      hostname: "koala",
      system_id: "abc123",
    });
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(
      screen.getByRole("link", { name: "koala.example" })
    ).toBeInTheDocument();
  });

  it("can render a machine in the MAC state with minimal data", () => {
    state.machine.items[0] = machineFactory({
      domain: modelRefFactory({
        name: "example",
      }),
      hostname: "koala",
      pxe_mac: "00:11:22:33:44:55",
      system_id: "abc123",
    });
    renderWithBrowserRouter(
      <NameColumn groupValue={null} showMAC={true} systemId="abc123" />,
      { route: "/machines", state }
    );

    expect(
      screen.getByText(`${state.machine.items[0].pxe_mac}`)
    ).toBeInTheDocument();
  });

  it("does not render checkbox if onToggleMenu not provided", () => {
    renderWithBrowserRouter(
      <NameColumn groupValue={null} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
