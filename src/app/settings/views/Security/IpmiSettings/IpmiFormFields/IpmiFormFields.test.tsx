import IpmiSettings from "../IpmiSettings";

import { Labels as FormFieldsLabels } from "./IpmiFormFields";

import { AutoIpmiPrivilegeLevel, ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  setupMockServer,
  renderWithProviders,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  configurationsResolvers.listConfigurations.handler()
);
describe("IpmiFormFields", () => {
  let initialState: RootState;
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
  beforeEach(() => {
    initialState = factory.rootState({
      config: factory.configState({
        loaded: true,
      }),
    });
  });

  it("updates value for ipmi username", async () => {
    const state = { ...initialState };
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<IpmiSettings />, { state });
    await waitForLoading();
    expect(
      screen.getByRole("textbox", { name: FormFieldsLabels.IPMIUsername })
    ).toHaveValue("maas");
  });

  it("updates value for ipmi user privilege level", async () => {
    const state = { ...initialState };
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<IpmiSettings />, { state });
    await waitForLoading();
    expect(
      screen.getByRole("radio", { name: FormFieldsLabels.OperatorRadio })
    ).toHaveProperty("checked", true);
  });
});
