import SetZoneForm from "./SetZoneForm";

import { zoneResolvers } from "@/app/api/query/zones.test";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  waitFor,
  renderWithBrowserRouter,
  setupMockServer,
} from "@/testing/utils";

let state: RootState;
const mockServer = setupMockServer(zoneResolvers.listZones.handler());

beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => mockServer.close());

beforeEach(() => {
  state = factory.rootState({
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({ fetch: "success" }),
    }),
  });
});

describe("SetZoneForm", () => {
  it("initialises zone value if exactly one node provided", async () => {
    const nodes = [factory.machine({ zone: factory.modelRef({ id: 1 }) })];
    renderWithBrowserRouter(
      <SetZoneForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={vi.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      { state }
    );
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    expect(screen.getByRole("combobox", { name: "Zone" })).toHaveValue("1");
  });

  it("does not initialise zone value if more than one node provided", () => {
    const nodes = [
      factory.machine({ zone: factory.modelRef({ id: 0 }) }),
      factory.machine({ zone: factory.modelRef({ id: 1 }) }),
    ];
    renderWithBrowserRouter(
      <SetZoneForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={vi.fn()}
        processingCount={0}
        viewingDetails={false}
      />,
      { state }
    );

    expect(screen.getByRole("combobox", { name: "Zone" })).toHaveValue("");
  });

  it("correctly runs function to set zones of given nodes", async () => {
    const onSubmit = vi.fn();
    const nodes = [
      factory.machine({ system_id: "abc123" }),
      factory.machine({ system_id: "def456" }),
    ];
    renderWithBrowserRouter(
      <SetZoneForm
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={onSubmit} // Use the actual onSubmit function
        processingCount={0}
        viewingDetails={false}
      />,
      { state }
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
