import LicenseKeyList from ".";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("LicenseKeyList", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = factory.rootState({
      general: factory.generalState({
        osInfo: factory.osInfoState({
          loaded: true,
          data: factory.osInfo({
            osystems: [
              ["ubuntu", "Ubuntu"],
              ["windows", "Windows"],
            ],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"],
            ],
          }),
        }),
      }),
      licensekeys: factory.licenseKeysState({
        loaded: true,
        items: [factory.licenseKeys()],
      }),
    });
  });

  it("displays a message when there are no licennse keys", async () => {
    const state = { ...initialState };
    state.licensekeys.items = [];

    renderWithProviders(<LicenseKeyList />, { state });
    await waitFor(() => {
      expect(
        screen.getByText("No license keys available.")
      ).toBeInTheDocument();
    });
  });

  it("disables the Add button without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_LICENSE_KEYS,
        }),
      ])
    );
    renderWithProviders(<LicenseKeyList />, { state: initialState });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add license key" })
      ).toBeAriaDisabled();
    });
  });
});
