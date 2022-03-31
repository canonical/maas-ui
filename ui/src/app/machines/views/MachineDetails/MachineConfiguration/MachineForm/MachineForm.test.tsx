import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MachineForm from "./MachineForm";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64"],
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            permissions: ["edit"],
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
        <MachineForm systemId="abc123" />
      </Provider>
    );

    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument();
  });

  it("is editable if machine has edit permission", () => {
    state.machine.items[0].permissions = ["edit"];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MachineForm systemId="abc123" />
      </Provider>
    );

    expect(screen.getAllByRole("button", { name: "Edit" }).length).not.toBe(0);
  });

  it("renders read-only text fields until edit button is pressed", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MachineForm systemId="abc123" />
      </Provider>
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("correctly dispatches an action to update a machine", async () => {
    const machine = machineDetailsFactory({
      architecture: "amd64",
      permissions: ["edit"],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MachineForm systemId="abc123" />
      </Provider>
    );

    userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    const noteField = screen.getByRole("textbox", { name: "Note" });
    userEvent.clear(noteField);
    userEvent.type(noteField, "New note");
    userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    const expectedAction = machineActions.update({
      architecture: machine.architecture,
      description: "New note",
      extra_macs: machine.extra_macs,
      min_hwe_kernel: machine.min_hwe_kernel,
      pool: { name: machine.pool.name },
      pxe_mac: machine.pxe_mac,
      system_id: machine.system_id,
      zone: { name: machine.zone.name },
    });
    const actualActions = store.getActions();
    await waitFor(() => {
      expect(
        actualActions.find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction);
    });
  });
});
