import ThirdPartyDriversForm, {
  Labels as TPDFormLabels,
} from "./ThirdPartyDriversForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.ENABLE_THIRD_PARTY_DRIVERS,
    value: false,
  }),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
describe("ThirdPartyDriversForm", () => {
  it("sets enable_third_party_drivers value", async () => {
    mockServer.use(
      configurationsResolvers.getConfiguration.handler({
        name: ConfigNames.ENABLE_THIRD_PARTY_DRIVERS,
        value: false,
      })
    );
    renderWithProviders(<ThirdPartyDriversForm />);
    await waitForLoading();
    expect(
      screen.getByRole("checkbox", { name: TPDFormLabels.CheckboxLabel })
    ).toHaveProperty("checked", false);
  });

  it("disables the checkbox without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES,
        }),
      ])
    );
    renderWithProviders(<ThirdPartyDriversForm />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: TPDFormLabels.CheckboxLabel })
      ).toBeDisabled();
    });
  });
});
