import configureStore from "redux-mock-store";

import { storageLayoutOptions } from "../ChangeStorageLayoutMenu/ChangeStorageLayoutMenu";

import ChangeStorageLayout from "./ChangeStorageLayout";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  getByTextContent,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ChangeStorageLayout", () => {
  const sampleStoragelayout = storageLayoutOptions[0][0];
  it("shows a confirmation form if a storage layout is selected", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [factory.machineDetails({ system_id: "abc123" })],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <ChangeStorageLayout
        clearSidePanelContent={vi.fn()}
        selectedLayout={sampleStoragelayout}
        systemId="abc123"
      />,
      {
        state,
      }
    );

    expect(
      getByTextContent(
        "Are you sure you want to change the storage layout to flat?"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Change storage layout" })
    ).toHaveAttribute("type", "submit");
  });

  it("can show errors", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        eventErrors: [
          factory.machineEventError({
            error: "not possible",
            event: "applyStorageLayout",
            id: "abc123",
          }),
        ],
        items: [factory.machineDetails({ system_id: "abc123" })],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <ChangeStorageLayout
        clearSidePanelContent={vi.fn()}
        selectedLayout={sampleStoragelayout}
        systemId="abc123"
      />,
      {
        state,
      }
    );

    expect(screen.getByText(/not possible/i)).toBeInTheDocument();
  });

  it("correctly dispatches an action to update a machine's storage layout", async () => {
    const handleClearSidePanelContent = vi.fn();
    const state = factory.rootState({
      machine: factory.machineState({
        items: [factory.machineDetails({ system_id: "abc123" })],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ChangeStorageLayout
        clearSidePanelContent={handleClearSidePanelContent}
        selectedLayout={sampleStoragelayout}
        systemId="abc123"
      />,
      {
        store,
      }
    );

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
    expect(handleClearSidePanelContent).toHaveBeenCalled();
  });
});
