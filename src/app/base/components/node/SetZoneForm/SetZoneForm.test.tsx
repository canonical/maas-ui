import SetZoneForm from "./SetZoneForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  waitFor,
  renderWithBrowserRouter,
} from "@/testing/utils";

let state: RootState;
const queryData = {
  zones: [
    factory.zone({ id: 0, name: "default" }),
    factory.zone({ id: 1, name: "zone-1" }),
  ],
};

beforeEach(() => {
  state = factory.rootState({
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({ fetch: "success" }),
    }),
  });
});

it("initialises zone value if exactly one node provided", () => {
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
    { state, queryData }
  );

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
    { state, queryData }
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
    { state, queryData }
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Zone" }),
    "1"
  );
  await userEvent.click(screen.getByRole("button", { name: /Set zone/ }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith("1");
  });
});
