import MarkConnectedForm, { ConnectionState } from "./MarkConnectedForm";

import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

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

it("renders a mark connected form", () => {
  const nic = machineInterfaceFactory({
    type: NetworkInterfaceTypes.PHYSICAL,
    link_connected: false,
  });
  state.machine.items = [
    machineDetailsFactory({
      system_id: "abc123",
      interfaces: [nic],
    }),
  ];
  renderWithBrowserRouter(
    <MarkConnectedForm
      close={vi.fn()}
      connectionState={ConnectionState.MARK_CONNECTED}
      nic={nic}
      systemId="abc123"
    />,
    { state }
  );

  expect(
    screen.getByRole("form", { name: "Mark connected" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Mark as connected" })
  ).toBeInTheDocument();
});

it("renders a mark disconnected form", () => {
  const nic = machineInterfaceFactory({
    type: NetworkInterfaceTypes.PHYSICAL,
    link_connected: true,
  });
  state.machine.items = [
    machineDetailsFactory({
      system_id: "abc123",
      interfaces: [nic],
    }),
  ];
  renderWithBrowserRouter(
    <MarkConnectedForm
      close={vi.fn()}
      connectionState={ConnectionState.MARK_DISCONNECTED}
      nic={nic}
      systemId="abc123"
    />,
    { state }
  );

  expect(
    screen.getByRole("form", { name: "Mark disconnected" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Mark as disconnected" })
  ).toBeInTheDocument();
});

it("displays a disconnected warning", () => {
  const nic = machineInterfaceFactory({
    type: NetworkInterfaceTypes.PHYSICAL,
    link_connected: false,
  });
  state.machine.items = [
    machineDetailsFactory({
      system_id: "abc123",
      interfaces: [nic],
    }),
  ];
  renderWithBrowserRouter(
    <MarkConnectedForm
      close={vi.fn()}
      connectionState={ConnectionState.DISCONNECTED_WARNING}
      nic={nic}
      systemId="abc123"
    />,
    { state }
  );

  expect(
    screen.getByRole("form", { name: "Mark connected" })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/If this is no longer true, mark cable as connected/i) // using this phrase because the warning is broken into different lines
  ).toBeInTheDocument();
});
