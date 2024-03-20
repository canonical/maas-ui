import * as reduxToolkit from "@reduxjs/toolkit";
import { Formik } from "formik";
import configureStore from "redux-mock-store";

import CloneFormFields from "./CloneFormFields";

import { actions as machineActions } from "@/app/store/machine";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithMockStore,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();
const callId = "mocked-nanoid";

vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});

describe("CloneFormFields", () => {
  let state: RootState;
  const machine = factory.machineDetails({
    pod: { id: 11, name: "podrick" },
    system_id: "abc123",
  });
  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue(callId);
    vi.spyOn(reduxToolkit, "nanoid").mockReturnValue(callId);
    state = factory.rootState({
      fabric: factory.fabricState({ loaded: true }),

      machine: factory.machineState({
        loaded: true,
        lists: {
          [callId]: factory.machineStateList({
            loaded: true,
            groups: [
              factory.machineStateListGroup({
                items: [machine.system_id],
              }),
            ],
          }),
        },
      }),
      subnet: factory.subnetState({ loaded: true }),
      vlan: factory.vlanState({ loaded: true }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches action to fetch data on load", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <Formik
        initialValues={{ interfaces: false, source: "", storage: false }}
        onSubmit={vi.fn()}
      >
        <CloneFormFields selectedMachine={null} setSelectedMachine={vi.fn()} />
      </Formik>,
      { store }
    );

    const expectedActions = [
      "fabric/fetch",
      "machine/fetch",
      "subnet/fetch",
      "vlan/fetch",
    ];

    await waitFor(() => {
      const actualActions = store.getActions();
      return expect(
        expectedActions.every((expected) =>
          actualActions.some((actual) => actual.type === expected)
        )
      ).toBe(true);
    });
  });

  it("dispatches action to get full machine details on machine click", async () => {
    const machine = factory.machineDetails({ system_id: "abc123" });
    state.machine.items = [machine];
    const store = mockStore(state);
    renderWithMockStore(
      <Formik
        initialValues={{ interfaces: false, source: "", storage: false }}
        onSubmit={vi.fn()}
      >
        <CloneFormFields selectedMachine={null} setSelectedMachine={vi.fn()} />
      </Formik>,
      { store }
    );
    await userEvent.click(screen.getAllByTestId("machine-select-row")[0]);
    const expectedAction = machineActions.get(machine.system_id, callId);

    await waitFor(() => {
      const actualActions = store.getActions();
      return expect(
        actualActions.find((action) => action.type === expectedAction.type)
      ).toStrictEqual(expectedAction);
    });
  });

  it("applies different styling depending on clone selection state", async () => {
    const machine = factory.machineDetails({ system_id: "abc123" });
    state.machine.items = [machine];
    renderWithMockStore(
      <Formik
        initialValues={{ interfaces: false, source: "", storage: false }}
        onSubmit={vi.fn()}
      >
        <CloneFormFields
          selectedMachine={machine}
          setSelectedMachine={vi.fn()}
        />
      </Formik>,
      { state }
    );
    let table = screen.getByRole("grid", { name: "Clone network" });
    // Table has unselected styling by default
    expect(table).toHaveClass("not-selected");

    // Check the checkbox for the table.
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Clone network configuration" })
    );

    await waitFor(() => {
      table = screen.getByRole("grid", { name: "Clone network" });
      expect(table).not.toHaveClass("not-selected");
    });
  });
});
