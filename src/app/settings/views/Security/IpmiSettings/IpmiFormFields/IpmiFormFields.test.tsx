import IpmiSettings from "../IpmiSettings";

import { Labels as FormFieldsLabels } from "./IpmiFormFields";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { AutoIpmiPrivilegeLevel, ConfigNames } from "@/app/store/config/types";
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
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler()
);
describe("IpmiFormFields", () => {
  const configItems = [
    {
      name: ConfigNames.MAAS_AUTO_IPMI_USER,
      value: "maas",
    },
    {
      name: ConfigNames.MAAS_AUTO_IPMI_K_G_BMC_KEY,
      value: "",
    },
    {
      name: ConfigNames.MAAS_AUTO_IPMI_USER_PRIVILEGE_LEVEL,
      value: AutoIpmiPrivilegeLevel.OPERATOR,
    },
  ];

  it("updates value for ipmi username", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<IpmiSettings />);
    await waitForLoading();
    expect(
      screen.getByRole("textbox", { name: FormFieldsLabels.IPMIUsername })
    ).toHaveValue("maas");
  });

  it("updates value for ipmi user privilege level", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<IpmiSettings />);
    await waitForLoading();
    expect(
      screen.getByRole("radio", { name: FormFieldsLabels.OperatorRadio })
    ).toHaveProperty("checked", true);
  });

  it("disables fields without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ]),
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<IpmiSettings />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: FormFieldsLabels.IPMIUsername })
      ).toBeDisabled();
    });
  });
});
