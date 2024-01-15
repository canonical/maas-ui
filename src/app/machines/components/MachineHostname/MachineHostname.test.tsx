import MachineHostname from "./MachineHostname";

import {
  machineStateDetailsItem as machineStateDetailsItemFactory,
  machine as machineFactory,
  rootState,
} from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

it("displays machine systemId when hostname is not available", async () => {
  renderWithMockStore(<MachineHostname systemId="abc123" />);
  expect(screen.getByText(/abc123/i)).toBeInTheDocument();
});

it("displays machine hostname once loaded", () => {
  const state = rootState();
  state.machine.items = [
    machineFactory({
      system_id: "abc123",
      hostname: "test-machine",
    }),
  ];
  state.machine.details = {
    "mocked-nanoid": machineStateDetailsItemFactory({
      system_id: "abc123",
    }),
  };
  renderWithMockStore(<MachineHostname systemId="abc123" />, { state });
  expect(screen.getByText(/test-machine/i)).toBeInTheDocument();
});
