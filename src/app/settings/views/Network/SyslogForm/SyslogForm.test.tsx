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
  waitForLoading,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
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
    await waitForLoading();
    expect(
      screen.getByRole("textbox", {
        name: "Remote syslog server to forward machine logs",
      })
    ).toHaveValue("");
  });
  it("updates the syslog form", async () => {
    renderWithProviders(<SyslogForm />, { state });
    await waitForLoading();
    const syslogInput = screen.getByRole("textbox", {
      name: "Remote syslog server to forward machine logs",
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

  it("displays a spinner if config is loading", () => {
    mockIsPending();
    renderWithProviders(<SyslogForm />, { state });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
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
    await waitForLoading();
    const syslogInput = screen.getByRole("textbox", {
      name: "Remote syslog server to forward machine logs",
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
      authResolvers.getCurrentUser.handler(
        factory.userInfo({
          entitlements: [
            factory.entitlement({
              entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
            }),
          ],
        })
      )
    );
    renderWithProviders(<SyslogForm />, { state });
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", {
          name: "Remote syslog server to forward machine logs",
        })
      ).toBeDisabled();
    });
    expect(
      screen.queryByRole("button", { name: "Save" })
    ).not.toBeInTheDocument();
  });
});
