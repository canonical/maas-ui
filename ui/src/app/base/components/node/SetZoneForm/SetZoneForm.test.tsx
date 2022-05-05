import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SetZoneForm from "./SetZoneForm";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    zone: zoneStateFactory({
      items: [
        zoneFactory({ id: 0, name: "default" }),
        zoneFactory({ id: 1, name: "zone-1" }),
      ],
      loaded: true,
    }),
  });
});

it("initialises zone value if exactly one node provided", () => {
  const nodes = [machineFactory({ zone: modelRefFactory({ id: 1 }) })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <SetZoneForm
        clearHeaderContent={jest.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      />
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
      <SetZoneForm
        clearHeaderContent={jest.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      />
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
      <SetZoneForm
        clearHeaderContent={jest.fn()}
        modelName="machine"
        nodes={nodes}
        onSubmit={onSubmit}
        processingCount={0}
        viewingDetails={false}
      />
    </Provider>
  );

  userEvent.selectOptions(screen.getByRole("combobox", { name: "Zone" }), "1");
  userEvent.click(screen.getByRole("button", { name: /Set zone/ }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith("1");
  });
});
