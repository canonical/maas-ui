import MachineHostname from "./MachineHostname";

import { callId, enableCallIdMocks } from "@/testing/callId-mock";
import {
  machineStateDetailsItem as machineStateDetailsItemFactory,
  machine as machineFactory,
  rootState,
} from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

enableCallIdMocks();

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
    [callId]: machineStateDetailsItemFactory({
      system_id: "abc123",
    }),
  };
  renderWithMockStore(<MachineHostname systemId="abc123" />, { state });
  expect(screen.getByText(/test-machine/i)).toBeInTheDocument();
});
