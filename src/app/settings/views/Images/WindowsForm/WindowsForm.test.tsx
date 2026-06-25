import WindowsForm, { Labels as WindowsFormLabels } from "./WindowsForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(authResolvers.getCurrentUser.handler());

describe("WindowsForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loading: false,
        loaded: true,
        items: [
          {
            name: ConfigNames.WINDOWS_KMS_HOST,
            value: "127.0.0.1",
          },
        ],
      }),
    });
  });

  it("sets windows_kms_host value", () => {
    renderWithProviders(<WindowsForm />, { state });
    expect(
      screen.getByRole("textbox", { name: WindowsFormLabels.KMSHostLabel })
    ).toHaveValue("127.0.0.1");
  });

  it("disables the field without edit permissions", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.userInfo({
          entitlements: [
            factory.entitlement({
              entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES,
            }),
          ],
        })
      )
    );
    renderWithProviders(<WindowsForm />, { state });
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: WindowsFormLabels.KMSHostLabel })
      ).toBeDisabled();
    });
  });
});
