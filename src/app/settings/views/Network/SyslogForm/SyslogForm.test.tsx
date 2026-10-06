import SyslogForm from "./SyslogForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  setupMockServer,
  mockIsPending,
  renderWithProviders,
  userEvent,
  waitFor,
} from "@/testing/utils";

const syslogLabel = "Remote syslog server to forward machine logs";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.REMOTE_SYSLOG,
    value: "",
  }),
  configurationsResolvers.setConfiguration.handler()
);
describe("SyslogForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
      }),
    });
  });

  it("renders the syslog form", async () => {
    renderWithProviders(<SyslogForm />, { state });
    expect(
      await screen.findByRole("textbox", { name: syslogLabel })
    ).toHaveValue("");
  });
  it("updates the syslog form", async () => {
    renderWithProviders(<SyslogForm />, { state });
    const syslogInput = await screen.findByRole("textbox", {
      name: syslogLabel,
    });
    await waitFor(() => {
      expect(syslogInput).not.toBeDisabled();
    });
    await userEvent.type(syslogInput, "0.0.0.0");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(configurationsResolvers.setConfiguration.resolved).toBe(true);
    });
  });

  it("displays a skeleton while the configuration is loading", () => {
    mockIsPending();
    renderWithProviders(<SyslogForm />, { state });

    expect(
      screen.getAllByRole("progressbar", { hidden: true }).length
    ).toBeGreaterThan(0);
  });

  it("shows an error message when fetching configurations fails", async () => {
    mockServer.use(
      configurationsResolvers.getConfiguration.error({
        code: 500,
        message: "Failed to fetch configurations",
      })
    );

    renderWithProviders(<SyslogForm />, { state });

    await waitFor(() => {
      expect(
        screen.getByText("Error while fetching network configurations")
      ).toBeInTheDocument();
    });
  });
  it("shows an error message when saving configurations fails", async () => {
    mockServer.use(
      configurationsResolvers.setConfiguration.error({
        code: 500,
        message: "Failed to save configurations",
      })
    );

    renderWithProviders(<SyslogForm />, { state });
    const syslogInput = await screen.findByRole("textbox", {
      name: syslogLabel,
    });
    await waitFor(() => {
      expect(syslogInput).not.toBeDisabled();
    });
    await userEvent.type(syslogInput, "0.0.0.0");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to save configurations")
      ).toBeInTheDocument();
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
    renderWithProviders(<SyslogForm />, { state });
    const syslogInput = await screen.findByRole("textbox", {
      name: syslogLabel,
    });
    await waitFor(() => {
      expect(syslogInput).toBeDisabled();
    });
    expect(
      screen.queryByRole("button", { name: "Save" })
    ).not.toBeInTheDocument();
  });
});
