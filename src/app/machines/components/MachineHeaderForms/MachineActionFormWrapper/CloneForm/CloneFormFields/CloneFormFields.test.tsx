import { waitFor } from "@testing-library/react";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CloneFormFields from "./CloneFormFields";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  fabricState as fabricStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  rootState as rootStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("CloneFormFields", () => {
  let state: RootState;
  const machine = machineFactory({
    pod: { id: 11, name: "podrick" },
    system_id: "abc123",
  });
  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");

    state = rootStateFactory({
      fabric: fabricStateFactory({ loaded: true }),

      machine: machineStateFactory({
        loaded: true,
        lists: {
          "mocked-nanoid": machineStateListFactory({
            loaded: true,
            groups: [
              machineStateListGroupFactory({
                items: [machine.system_id],
              }),
            ],
          }),
        },
      }),
      subnet: subnetStateFactory({ loaded: true }),
      vlan: vlanStateFactory({ loaded: true }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("dispatches action to fetch data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik
          initialValues={{ interfaces: false, source: "", storage: false }}
          onSubmit={jest.fn()}
        >
          <CloneFormFields
            selectedMachine={null}
            setSelectedMachine={jest.fn()}
          />
        </Formik>
      </Provider>,
      { route: "/machines" }
    );

    const expectedActions = [
      "fabric/fetch",
      "machine/fetch",
      "subnet/fetch",
      "vlan/fetch",
    ];
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.some((actual) => actual.type === expectedAction)
      ).toBe(true);
    });
  });

  it("dispatches action to get full machine details on machine click", async () => {
    const machine = machineFactory({ system_id: "abc123" });
    state.machine.items = [machine];
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <Provider store={store}>
        <Formik
          initialValues={{ interfaces: false, source: "", storage: false }}
          onSubmit={jest.fn()}
        >
          <CloneFormFields
            selectedMachine={null}
            setSelectedMachine={jest.fn()}
          />
        </Formik>
      </Provider>,
      { route: "/machines" }
    );
    const machineSelectRow = container.querySelector(
      "[data-testid='machine-select-row']"
    );
    userEvent.click(machineSelectRow);
    await waitFor(() =>
      expect(
        store
          .getActions()
          .some((action) => action.type === machineActions.get.type)
      ).toBe(true)
    );
  });

  it("applies different styling depending on clone selection state", async () => {
    const machine = machineFactory({ system_id: "abc123" });
    state.machine.items = [machine];
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <Provider store={store}>
        <Formik
          initialValues={{ interfaces: false, source: "", storage: false }}
          onSubmit={jest.fn()}
        >
          <CloneFormFields
            selectedMachine={null}
            setSelectedMachine={jest.fn()}
          />
        </Formik>
      </Provider>,
      { route: "/machines" }
    );
    const table = container.querySelector(".MainTable.clone-table--network");
    // Table has unselected styling by default
    expect(table).toHaveClass("not-selected");

    // Check the checkbox for the table.
    const checkbox = screen.getByRole("checkbox", { name: /interfaces/i });
    userEvent.click(checkbox);
    await waitFor(() => expect(table).not.toHaveClass("not-selected"));
  });
});
