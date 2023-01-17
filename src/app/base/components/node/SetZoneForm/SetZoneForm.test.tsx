import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import SetZoneForm from "./SetZoneForm";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    zone: zoneStateFactory({
      genericActions: zoneGenericActionsFactory({ fetch: "success" }),
      items: [
        zoneFactory({ id: 0, name: "default" }),
        zoneFactory({ id: 1, name: "zone-1" }),
      ],
    }),
  });
});

it("initialises zone value if exactly one node provided", () => {
  const nodes = [machineFactory({ zone: modelRefFactory({ id: 1 }) })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SetZoneForm
            clearSidePanelContent={jest.fn()}
            modelName="machine"
            nodes={nodes}
            onSubmit={jest.fn()}
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
    machineFactory({ zone: modelRefFactory({ id: 0 }) }),
    machineFactory({ zone: modelRefFactory({ id: 1 }) }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SetZoneForm
            clearSidePanelContent={jest.fn()}
            modelName="machine"
            nodes={nodes}
            onSubmit={jest.fn()}
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
  const onSubmit = jest.fn();
  const nodes = [
    machineFactory({ system_id: "abc123" }),
    machineFactory({ system_id: "def456" }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <SetZoneForm
            clearSidePanelContent={jest.fn()}
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
