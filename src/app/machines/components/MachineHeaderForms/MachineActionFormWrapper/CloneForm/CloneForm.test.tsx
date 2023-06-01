import reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import CloneForm from "./CloneForm";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as nicFactory,
  machineState as machineStateFactory,
  machineStateList,
  machineStateListGroup,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("CloneForm", () => {
  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be submittable only when a machine and cloning config are selected", async () => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineDetailsFactory({
        disks: [diskFactory()],
        interfaces: [nicFactory()],
        system_id: "def456",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: machines,
        loaded: true,
        selected: ["abc123"],

        lists: {
          "123456": machineStateList({
            groups: [
              machineStateListGroup({
                items: [machines[1].system_id],
              }),
            ],
            loaded: true,
          }),
        },
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        }),
      }),
    });
    state.fabric.loaded = true;
    state.subnet.loaded = true;
    state.vlan.loaded = true;
    renderWithBrowserRouter(
      <CloneForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", state }
    );

    // Checkboxes and submit should be disabled at first.
    expect(
      screen.getByRole("button", { name: "Clone to machine" })
    ).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: "Clone network configuration" })
    ).toBeDisabled();

    // Select a source machine - form should update
    await userEvent.click(
      screen.getByRole("row", { name: machines[1].hostname })
    );

    expect(
      screen.getByRole("button", { name: "Clone to machine" })
    ).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: "Clone network configuration" })
    ).toBeEnabled();

    // Select config to clone - submit should be re-disabled.
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Clone network configuration" })
    );

    expect(
      screen.getByRole("checkbox", { name: "Clone network configuration" })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Clone to machine" })
    ).toBeEnabled();
  });

  it("shows cloning results when the form is successfully submitted", async () => {
    const machines = [
      machineFactory({ system_id: "abc123", hostname: "a-machine-name" }),
      machineDetailsFactory({
        disks: [diskFactory()],
        interfaces: [nicFactory()],
        system_id: "def456",
        hostname: "another-machine",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: machines,
        loaded: true,
        selected: ["abc123"],

        lists: {
          "123456": machineStateList({
            groups: [
              machineStateListGroup({
                items: [machines[1].system_id],
              }),
            ],
            loaded: true,
          }),
        },
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        }),
      }),
    });
    state.fabric.loaded = true;
    state.subnet.loaded = true;
    state.vlan.loaded = true;

    const store = mockStore(state);

    const { rerender } = renderWithBrowserRouter(
      <CloneForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        selectedMachines={{ items: [machines[1].system_id] }}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("row", { name: machines[1].hostname })
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Clone network configuration" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Clone to machine" })
    );

    mockFormikFormSaved();
    rerender(
      <CloneForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />
    );

    expect(screen.getByText("Cloning complete")).toBeInTheDocument();
  });

  it("can dispatch an action to clone to the given machines", async () => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
      machineDetailsFactory({
        disks: [diskFactory()],
        interfaces: [nicFactory()],
        system_id: "ghi789",
        hostname: "another-machine",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: machines,
        loaded: true,
        selected: ["abc123", "def456"],

        lists: {
          "123456": machineStateList({
            groups: [
              machineStateListGroup({
                items: [machines[2].system_id],
              }),
            ],
            loaded: true,
          }),
        },
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
          ghi789: machineStatusFactory(),
        }),
      }),
    });
    state.fabric.loaded = true;
    state.subnet.loaded = true;
    state.vlan.loaded = true;

    const store = mockStore(state);
    renderWithBrowserRouter(
      <CloneForm
        clearSidePanelContent={jest.fn()}
        machines={state.machine.items}
        selectedMachines={{
          items: [machines[0].system_id, machines[1].system_id],
        }}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("row", { name: machines[2].hostname })
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Clone network configuration" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Clone to machine" })
    );

    const expectedAction = machineActions.clone(
      {
        filter: { id: ["abc123", "def456"] },
        interfaces: true,
        storage: false,
        system_id: "ghi789",
      },
      "123456"
    );
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(expectedAction).toStrictEqual(actualAction);
  });
});
