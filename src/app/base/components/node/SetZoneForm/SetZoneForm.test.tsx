import SetZoneForm from "./SetZoneForm";

import * as factory from "@/testing/factories";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  userEvent,
  screen,
  waitFor,
  setupMockServer,
  renderWithProviders,
} from "@/testing/utils";

setupMockServer(zoneResolvers.listZones.handler());

describe("SetZoneForm", () => {
  it("initialises zone value if exactly one node provided", async () => {
    const nodes = [factory.machine({ zone: factory.modelRef({ id: 1 }) })];
    renderWithProviders(
      <SetZoneForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={vi.fn()}
        processingCount={0}
        viewingDetails={false}
      />
    );
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    expect(screen.getByRole("combobox", { name: "Zone" })).toHaveValue("1");
  });

  it("does not initialise zone value if more than one node provided", () => {
    const nodes = [
      factory.machine({ zone: factory.modelRef({ id: 0 }) }),
      factory.machine({ zone: factory.modelRef({ id: 1 }) }),
    ];
    renderWithProviders(
      <SetZoneForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={vi.fn()}
        processingCount={0}
        viewingDetails={false}
      />
    );

    expect(screen.getByRole("combobox", { name: "Zone" })).toHaveValue("");
  });

  it("correctly runs function to set zones of given nodes", async () => {
    const onSubmit = vi.fn();
    const nodes = [
      factory.machine({ system_id: "abc123" }),
      factory.machine({ system_id: "def456" }),
    ];
    renderWithProviders(
      <SetZoneForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={onSubmit} // Use the actual onSubmit function
        processingCount={0}
        viewingDetails={false}
      />
    );
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Zone" }),
      "1"
    );
    await userEvent.click(screen.getByRole("button", { name: /Set zone/ }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("1");
    });
  });
});
