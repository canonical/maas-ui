import StorageForm from "../StorageForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  userEvent,
  screen,
  waitFor,
  setupMockServer,
  renderWithProviders,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler()
);
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
        ],
      }),
    });
  });

  it("displays a warning if blank storage layout chosen", async () => {
    renderWithProviders(<StorageForm />, { state });
    await waitForLoading();

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Default storage layout" })
      ).not.toBeDisabled();
    });
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
    renderWithProviders(<StorageForm />, { state });
    await waitForLoading();

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Default storage layout" })
      ).not.toBeDisabled();
    });
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Default storage layout" }),
      "VMFS6 layout"
    );
    await waitFor(() => {
      expect(screen.getByTestId("vmfs6-layout-warning")).toBeInTheDocument();
    });
  });

  it("disables fields without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ])
    );
    renderWithProviders(<StorageForm />, { state });
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Default storage layout" })
      ).toBeDisabled();
    });
  });
});
