import NtpForm from "./NtpForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  mockIsPending,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({
    items: [
      { name: ConfigNames.NTP_EXTERNAL_ONLY, value: false },
      { name: ConfigNames.NTP_SERVERS, value: "" },
    ],
  }),
  configurationsResolvers.setBulkConfigurations.handler()
);

describe("NtpForm", () => {
  it("displays a spinner if config is loading", () => {
    mockIsPending();

    renderWithProviders(<NtpForm />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows errors encountered when fetching configurations", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.error({
        message: "Uh oh!",
        code: 500,
      })
    );

    renderWithProviders(<NtpForm />);

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });

  it("updates config on save button click", async () => {
    renderWithProviders(<NtpForm />);

    await waitForLoading();

    const ntpServersInput = screen.getByRole("textbox", {
      name: "Addresses of NTP servers",
    });
    await waitFor(() => {
      expect(ntpServersInput).not.toBeDisabled();
    });

    await userEvent.type(ntpServersInput, "ntp.test");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(configurationsResolvers.setBulkConfigurations.resolved).toBe(true);
  });

  it("disables fields without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ])
    );
    renderWithProviders(<NtpForm />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: "Addresses of NTP servers" })
      ).toBeDisabled();
    });
    expect(
      screen.queryByRole("button", { name: "Save" })
    ).not.toBeInTheDocument();
  });
});
