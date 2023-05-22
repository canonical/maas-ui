import configureStore from "redux-mock-store";

import EditInterface from "./EditInterface";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("EditInterface", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  it("displays a spinner when data is loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        close={jest.fn()}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      {
        route: "/machines",
        store,
      }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays a form for editing a physical interface", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        close={jest.fn()}
        nicId={nic.id}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      {
        route: "/machines",
        store,
      }
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit Physical/i)).toBeInTheDocument();
  });

  it("displays a form for editing an alias", () => {
    const link = networkLinkFactory();
    const nic = machineInterfaceFactory({
      links: [networkLinkFactory(), link],
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        close={jest.fn()}
        linkId={link.id}
        nicId={nic.id}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      {
        route: "/machines",
        store,
      }
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit Alias/i)).toBeInTheDocument();
  });

  it("displays a form for editing a VLAN", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.VLAN,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        close={jest.fn()}
        nicId={nic.id}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      {
        route: "/machines",
        store,
      }
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit VLAN/i)).toBeInTheDocument();
  });

  it("displays a form for editing a bridge", () => {
    const nic = machineInterfaceFactory({
      type: NetworkInterfaceTypes.BRIDGE,
    });
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces: [nic],
      }),
    ];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditInterface
        close={jest.fn()}
        nicId={nic.id}
        selected={[]}
        setSelected={jest.fn()}
        systemId="abc123"
      />,
      {
        route: "/machines",
        store,
      }
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit Bridge/i)).toBeInTheDocument();
  });
});
