import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SetZoneForm from "./SetZoneForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = factory.rootState({
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({ fetch: "success" }),
      items: [
        factory.zone({ id: 0, name: "default" }),
        factory.zone({ id: 1, name: "zone-1" }),
      ],
    }),
  });
});

it("initialises zone value if exactly one node provided", () => {
  const nodes = [factory.machine({ zone: factory.modelRef({ id: 1 }) })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SetZoneForm
            clearSidePanelContent={vi.fn()}
            modelName="machine"
            nodes={nodes}
            onSubmit={vi.fn()}
            processingCount={0}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("combobox", { name: "Zone" })).toHaveValue("1");
});

it("does not initialise zone value if more than one node provided", () => {
  const nodes = [
    factory.machine({ zone: factory.modelRef({ id: 0 }) }),
    factory.machine({ zone: factory.modelRef({ id: 1 }) }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SetZoneForm
            clearSidePanelContent={vi.fn()}
            modelName="machine"
            nodes={nodes}
            onSubmit={vi.fn()}
            processingCount={0}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("combobox", { name: "Zone" })).toHaveValue("");
});

it("correctly runs function to set zones of given nodes", async () => {
  const onSubmit = vi.fn();
  const nodes = [
    factory.machine({ system_id: "abc123" }),
    factory.machine({ system_id: "def456" }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SetZoneForm
            clearSidePanelContent={vi.fn()}
            modelName="machine"
            nodes={nodes}
            onSubmit={onSubmit}
            processingCount={0}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
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
