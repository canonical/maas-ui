import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineForm from "./MachineForm";

import { Labels } from "@/app/base/components/EditableSection";
import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

describe("MachineForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        architectures: factory.architecturesState({
          data: ["amd64"],
        }),
      }),
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
  });

  it("is not editable if machine does not have edit permission", () => {
    state.machine.items[0].permissions = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <MachineForm systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("button", { name: Labels.EditButton })
    ).not.toBeInTheDocument();
  });

  it("is editable if machine has edit permission", () => {
    state.machine.items[0].permissions = ["edit"];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <MachineForm systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getAllByRole("button", { name: Labels.EditButton }).length
    ).not.toBe(0);
  });

  it("renders read-only text fields until edit button is pressed", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <MachineForm systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getAllByRole("button", { name: Labels.EditButton })[0]
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("correctly dispatches an action to update a machine", async () => {
    const machine = factory.machineDetails({
      architecture: "amd64",
      permissions: ["edit"],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <MachineForm systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getAllByRole("button", { name: Labels.EditButton })[0]
    );
    const noteField = screen.getByRole("textbox", { name: "Note" });
    await userEvent.clear(noteField);
    await userEvent.type(noteField, "New note");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

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
