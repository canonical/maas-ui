import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StorageForm from "./StorageForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render, waitFor } from "@/testing/utils";

const mockStore = configureStore();

describe("StorageForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
        items: [
          {
            name: ConfigNames.DEFAULT_STORAGE_LAYOUT,
            value: "flat",
            choices: [
              ["bcache", "Bcache layout"],
              ["blank", "No storage (blank) layout"],
              ["flat", "Flat layout"],
              ["lvm", "LVM layout"],
              ["vmfs6", "VMFS6 layout"],
            ],
          },
          {
            name: ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE,
            value: false,
          },
          {
            name: ConfigNames.DISK_ERASE_WITH_SECURE_ERASE,
            value: false,
          },
          {
            name: ConfigNames.DISK_ERASE_WITH_QUICK_ERASE,
            value: false,
          },
        ],
      }),
    });
  });

  it("dispatches an action to update config on save button click", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <StorageForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Default storage layout" }),
      "Bcache layout"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(store.getActions()).toEqual([
        {
          type: "config/update",
          payload: {
            params: {
              items: {
                [ConfigNames.DEFAULT_STORAGE_LAYOUT]: "bcache",
                [ConfigNames.DISK_ERASE_WITH_QUICK_ERASE]: false,
                [ConfigNames.DISK_ERASE_WITH_SECURE_ERASE]: false,
                [ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE]: false,
              },
            },
          },
          meta: {
            model: "config",
            method: "bulk_update",
          },
        },
      ]);
    });
  });

  it("dispatches action to fetch config if not already loaded", () => {
    state.config.loaded = false;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <StorageForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.endsWith("fetch"));

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: {
          model: "config",
          method: "list",
        },
        payload: null,
      },
    ]);
  });
});
