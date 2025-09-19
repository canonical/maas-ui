import MachineNetwork from "./MachineNetwork";

import * as factory from "@/testing/factories";
import { screen, renderWithProviders } from "@/testing/utils";

it("displays a spinner if machine is loading", () => {
  const state = factory.rootState({
    machine: factory.machineState({
      items: [],
    }),
  });
  renderWithProviders(
    <MachineNetwork id="abc123" setSidePanelContent={vi.fn()} />,
    { state }
  );
  expect(screen.getByLabelText("Loading machine")).toBeInTheDocument();
  expect(screen.queryByLabelText("Machine network")).not.toBeInTheDocument();
});

it("displays the network tab when loaded", () => {
  const state = factory.rootState({
    machine: factory.machineState({
      items: [factory.machineDetails({ system_id: "abc123" })],
    }),
  });
  renderWithProviders(
    <MachineNetwork id="abc123" setSidePanelContent={vi.fn()} />,
    { state }
  );
  expect(screen.queryByLabelText("Loading machine")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Machine network")).toBeInTheDocument();
});
