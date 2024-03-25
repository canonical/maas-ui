import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StorageForm from "../StorageForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render, waitFor } from "@/testing/utils";

const mockStore = configureStore();

describe("StorageFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
        items: [
          {
            name: ConfigNames.DEFAULT_STORAGE_LAYOUT,
            value: "bcache",
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

  it("displays a warning if blank storage layout chosen", async () => {
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
      "No storage (blank) layout"
    );

    // Writing a matcher function for getByText turned out to be too complex here, using a test ID was the only sensible option
    await waitFor(() => {
      expect(screen.getByTestId("blank-layout-warning")).toBeInTheDocument();
    });
  });

  it("displays a warning if a VMFS storage layout chosen", async () => {
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
      "VMFS6 layout"
    );
    await waitFor(() => {
      expect(screen.getByTestId("vmfs6-layout-warning")).toBeInTheDocument();
    });
  });
});
