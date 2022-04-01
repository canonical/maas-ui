import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import PowerForm, { Labels } from "./PowerForm";

import { PowerTypeNames } from "app/store/general/constants";
import { PowerFieldScope, PowerFieldType } from "app/store/general/types";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    general: generalStateFactory({
      powerTypes: powerTypesStateFactory({
        data: [
          powerTypeFactory({
            fields: [
              powerFieldFactory({
                name: "amt-field",
                label: "AMT field",
                field_type: PowerFieldType.STRING,
                scope: PowerFieldScope.NODE,
              }),
            ],
            name: PowerTypeNames.AMT,
          }),
          powerTypeFactory({
            fields: [
              powerFieldFactory({
                name: "apc-field",
                label: "APC field",
                field_type: PowerFieldType.STRING,
                scope: PowerFieldScope.NODE,
              }),
            ],
            name: PowerTypeNames.APC,
          }),
        ],
        loaded: true,
      }),
    }),
    machine: machineStateFactory({
      items: [
        machineDetailsFactory({
          permissions: ["edit"],
          power_type: PowerTypeNames.AMT,
          system_id: "abc123",
        }),
      ],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
});

it("is not editable if machine does not have edit permission", () => {
  state.machine.items[0].permissions = [];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <PowerForm systemId="abc123" />
    </Provider>
  );

  expect(
    screen.queryByRole("button", { name: Labels.Edit })
  ).not.toBeInTheDocument();
});

it("is editable if machine has edit permission", () => {
  state.machine.items[0].permissions = ["edit"];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <PowerForm systemId="abc123" />
    </Provider>
  );

  expect(screen.getAllByRole("button", { name: Labels.Edit }).length).not.toBe(
    0
  );
});

it("renders read-only text fields until edit button is pressed", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <PowerForm systemId="abc123" />
    </Provider>
  );

  expect(
    screen.queryByRole("combobox", { name: "Power type" })
  ).not.toBeInTheDocument();

  userEvent.click(screen.getAllByRole("button", { name: Labels.Edit })[0]);

  expect(
    screen.getByRole("combobox", { name: "Power type" })
  ).toBeInTheDocument();
});

it("correctly dispatches an action to update a machine's power", async () => {
  const machine = machineDetailsFactory({
    permissions: ["edit"],
    power_type: PowerTypeNames.AMT,
    system_id: "abc123",
  });
  state.machine.items = [machine];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <PowerForm systemId="abc123" />
    </Provider>
  );

  userEvent.click(screen.getAllByRole("button", { name: Labels.Edit })[0]);
  fireEvent.change(screen.getByRole("combobox", { name: "Power type" }), {
    target: { value: PowerTypeNames.APC },
  });
  await waitFor(() => {
    expect(
      screen.getByRole("textbox", { name: "APC field" })
    ).toBeInTheDocument();
  });
  userEvent.clear(screen.getByRole("textbox", { name: "APC field" }));
  userEvent.type(screen.getByRole("textbox", { name: "APC field" }), "abcde");
  userEvent.click(screen.getByRole("button", { name: "Save changes" }));

  const expectedAction = machineActions.update({
    extra_macs: machine.extra_macs,
    power_parameters: {
      "apc-field": "abcde",
    },
    power_type: PowerTypeNames.APC,
    pxe_mac: machine.pxe_mac,
    system_id: machine.system_id,
  });
  const actualActions = store.getActions();
  await waitFor(() => {
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
