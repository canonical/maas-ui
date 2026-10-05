import GeneralForm from "./GeneralForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const configItems = [
  factory.config({ name: ConfigNames.MAAS_NAME, value: "bionic-maas" }),
  factory.config({ name: ConfigNames.THEME, value: "default" }),
  factory.config({ name: ConfigNames.ENABLE_ANALYTICS, value: true }),
  factory.config({ name: ConfigNames.RELEASE_NOTIFICATIONS, value: true }),
  factory.config({
    name: ConfigNames.EXPERIMENTAL_SWITCH_PROVISIONING,
    value: false,
  }),
];

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({ items: configItems })
);

describe("GeneralForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({ items: configItems }),
    });
  });

  it("can render", async () => {
    renderWithProviders(<GeneralForm />, { state });

    expect(
      await screen.findByRole("form", { name: "Configuration - General" })
    ).toBeInTheDocument();
  });

  it("sets maas_name value", async () => {
    renderWithProviders(<GeneralForm />, { state });

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "MAAS name" })).toHaveValue(
        "bionic-maas"
      );
    });
  });

  it("sets theme value", async () => {
    renderWithProviders(<GeneralForm />, { state });

    expect(
      await screen.findByRole("radio", {
        name: "Default",
      })
    ).toHaveProperty("checked", true);
  });

  it("sets enable_analytics value", async () => {
    renderWithProviders(<GeneralForm />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", {
          name: "Enable analytics to shape improvements to user experience",
        })
      ).toHaveProperty("checked", true);
    });
  });

  it("sets release_notifications value", async () => {
    renderWithProviders(<GeneralForm />, { state });

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", {
          name: "Enable new release notifications",
        })
      ).toHaveProperty("checked", true);
    });
  });

  it("can change the MAAS theme colour", async () => {
    renderWithProviders(<GeneralForm />, { state });

    const redRadioButton = await screen.findByRole("radio", { name: "Red" });
    const saveButton = await screen.findByRole("button", { name: "Save" });

    await userEvent.click(redRadioButton);
    await userEvent.click(saveButton);

    expect(redRadioButton).toHaveProperty("checked", true);
  });

  it("sets experimental_switch_provisioning value", async () => {
    renderWithProviders(<GeneralForm />, { state });

    expect(
      await screen.findByRole("checkbox", { name: "Switch commissioning" })
    ).toHaveProperty("checked", false);
  });

  it("can trigger usabilla when the notifications are turned off", async () => {
    window.usabilla_live = vi.fn();
    renderWithProviders(<GeneralForm />, { state });

    const release_notifications_checkbox = await screen.findByRole("checkbox", {
      name: "Enable new release notifications",
    });
    await waitFor(() => {
      expect(release_notifications_checkbox).toHaveProperty("checked", true);
    });

    const saveButton = await screen.findByRole("button", { name: "Save" });

    await userEvent.click(release_notifications_checkbox);
    await userEvent.click(saveButton);

    expect(window.usabilla_live).toHaveBeenCalled();
  });

  it("disables fields without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ])
    );

    renderWithProviders(<GeneralForm />, { state });

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "MAAS name" })).toBeDisabled();
    });
  });
});
