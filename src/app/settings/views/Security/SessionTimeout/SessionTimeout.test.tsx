import { screen } from "@testing-library/react";

import SessionTimeout, {
  Labels as SessionTimeoutLabels,
} from "./SessionTimeout";

import * as configurationsQueryHooks from "@/app/api/query/configurations";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { mockFormikFormSaved } from "@/testing/mockFormikFormSaved";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  userEvent,
  renderWithProviders,
  setupMockServer,
  mockIsPending,
  waitForLoading,
  waitFor,
  spyOnMutation,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler(),
  configurationsResolvers.setBulkConfigurations.handler()
);

describe("SessionTimeout", () => {
  const configItems = [
    factory.config({
      name: ConfigNames.SESSION_LENGTH,
      value: 1209600,
    }),
  ];

  it("displays a spinner while loading", () => {
    mockIsPending();
    renderWithProviders(<SessionTimeout />);

    expect(screen.getByText(SessionTimeoutLabels.Loading)).toBeInTheDocument();
  });

  it("displays the form with correct values", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<SessionTimeout />);
    await waitForLoading();
    expect(
      screen.getByRole("form", {
        name: SessionTimeoutLabels.ConfigureTokenExpiration,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    ).toHaveValue("14 days");
  });

  it("displays the updated timeout length when the value is saved", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<SessionTimeout />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
      ).not.toBeDisabled();
    });
    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "3 hours"
    );

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );

    mockFormikFormSaved();
    await waitFor(() => {
      expect(configurationsResolvers.setBulkConfigurations.resolved).toBe(true);
    });
    expect(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    ).toHaveValue("3 hours");
  });

  it("disables the submit button if an invalid value is entered", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );
    renderWithProviders(<SessionTimeout />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
      ).not.toBeDisabled();
    });
    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "randomtext"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeAriaDisabled();

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "2hrs 3mins"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeAriaDisabled();

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "20 weeks and 12 nanoseconds"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeAriaDisabled();

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );
    // Minimum boundary
    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "5 minutes"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeAriaDisabled();

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );
    // Maximum boundary
    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "90 days"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeAriaDisabled();
  });

  it("correctly converts time values to seconds on save", async () => {
    mockServer.use(
      configurationsResolvers.listConfigurations.handler({ items: configItems })
    );

    const mockMutate = spyOnMutation(
      configurationsQueryHooks,
      "useBulkSetConfigurations"
    );
    renderWithProviders(<SessionTimeout />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
      ).not.toBeDisabled();
    });
    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "1 week 5 days 2 hours"
    );

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            configurations: [
              {
                name: "refresh_token_duration",
                value: 1044000,
              },
            ],
          }),
        }),
        expect.anything()
      );
    });
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
    renderWithProviders(<SessionTimeout />);
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
      ).toBeDisabled();
    });
  });
});
