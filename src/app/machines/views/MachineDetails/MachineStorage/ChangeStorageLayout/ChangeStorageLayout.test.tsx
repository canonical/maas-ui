import configureStore from "redux-mock-store";

import ChangeStorageLayout from "./ChangeStorageLayout";

import type { RootState } from "app/store/root/types";
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
  getByTextContent,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("ChangeStorageLayout", () => {
  it("shows a confirmation form if a storage layout is selected", async () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(<ChangeStorageLayout systemId="abc123" />, {
      state,
    });

    // Open storage layout dropdown
    await userEvent.click(
      screen.getByRole("button", { name: "Change storage layout" })
    );
    // Select flat storage layout
    await userEvent.click(screen.getByRole("button", { name: "Flat" }));

    expect(
      getByTextContent(
        "Are you sure you want to change the storage layout to flat?"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Change storage layout" })
    ).toHaveAttribute("type", "submit");
  });

  it("can show errors", async () => {
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
    renderWithBrowserRouter(<ChangeStorageLayout systemId="abc123" />, {
      state,
    });

    // Open storage layout dropdown
    await userEvent.click(
      screen.getByRole("button", { name: "Change storage layout" })
    );
    // Select flat storage layout
    await userEvent.click(screen.getByRole("button", { name: "Flat" }));

    expect(screen.getByText(/not possible/i)).toBeInTheDocument();
  });

  it("correctly dispatches an action to update a machine's storage layout", async () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<ChangeStorageLayout systemId="abc123" />, {
      store,
    });

    // Open storage layout dropdown
    await userEvent.click(
      screen.getByRole("button", { name: "Change storage layout" })
    );

    // Select flat storage layout
    await userEvent.click(screen.getByRole("button", { name: "Flat" }));

    // Submit the form
    await userEvent.click(
      screen.getByRole("button", { name: "Change storage layout" })
    );

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
