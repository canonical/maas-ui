import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ChangeStorageLayout from "./ChangeStorageLayout";

import {
  machineDetails as machineDetailsFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  submitFormikForm,
} from "testing/utils";

const mockStore = configureStore();

describe("ChangeStorageLayout", () => {
  it("shows a confirmation form if a storage layout is selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <ChangeStorageLayout systemId="abc123" />
      </Provider>,
      { route: "/path/to/route" }
    );

    // Open storage layout dropdown
    userEvent.click(
      screen.getByRole("button", { name: "Select Storage Layout" })
    );
    // Select flat storage layout
    userEvent.click(screen.getByRole("menuitem", { name: "Flat" }));

    expect(screen.getByTestId("confirmation-form")).toBeInTheDocument();
  });

  it("can show errors", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            error: "not possible",
            event: "applyStorageLayout",
            id: "abc123",
          }),
        ],
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <ChangeStorageLayout systemId="abc123" />
      </Provider>,
      { route: "/path/to/route" }
    );

    // Open storage layout dropdown
    const storageLayoutButton = screen.getByRole("button", {
      name: "Select Storage Layout",
    });
    userEvent.click(storageLayoutButton);

    // Select flat storage layout
    userEvent.click(screen.getByRole("menuitem", { name: "Flat" }));

    expect(screen.getByText(/not possible/i)).toBeInTheDocument();
  });

  it("correctly dispatches an action to update a machine's storage layout", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <ChangeStorageLayout systemId="abc123" />
      </Provider>,
      { route: "/path/to/route" }
    );

    // Open storage layout dropdown
    userEvent.click(
      screen.getByRole("button", { name: "Select Storage Layout" })
    );

    // Select flat storage layout
    userEvent.click(screen.getByRole("menuitem", { name: "Flat" }));

    // Submit the form
    submitFormikForm(screen.getByTestId("confirmation-form"));

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/applyStorageLayout")
    ).toStrictEqual({
      meta: {
        method: "apply_storage_layout",
        model: "machine",
      },
      payload: {
        params: {
          storage_layout: "flat",
          system_id: "abc123",
        },
      },
      type: "machine/applyStorageLayout",
    });
  });
});
