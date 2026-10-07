import WindowsForm, { Labels as WindowsFormLabels } from "./WindowsForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.WINDOWS_KMS_HOST,
    value: "127.0.0.1",
  })
);

describe("WindowsForm", () => {
  it("sets windows_kms_host value", async () => {
    renderWithProviders(<WindowsForm />);

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: WindowsFormLabels.KMSHostLabel })
      ).toHaveValue("127.0.0.1");
    });
  });

  it("disables the field without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ])
    );
    renderWithProviders(<WindowsForm />);

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: WindowsFormLabels.KMSHostLabel })
      ).toBeDisabled();
    });
  });
});
