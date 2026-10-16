import TLSEnabled, { Labels } from "./TLSEnabled";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  userEvent,
  fireEvent,
  screen,
  setupMockServer,
  waitFor,
  mockIsPending,
  renderWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler()
);

const tlsCertificate = factory.tlsCertificate();

const certificateState = (): RootState =>
  factory.rootState({
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });

const mockConfigs = (enabled: boolean, interval: number) => {
  mockServer.use(
    configurationsResolvers.listConfigurations.handler({
      items: [
        {
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_ENABLED,
          value: enabled,
        },
        {
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_INTERVAL,
          value: interval,
        },
      ],
    })
  );
};

it("displays a spinner while loading config", () => {
  mockIsPending();
  renderWithProviders(<TLSEnabled />, { state: certificateState() });

  expect(screen.getByLabelText(Labels.Loading)).toBeInTheDocument();
});

it("displays a spinner while loading the certificate", () => {
  const state = factory.rootState({
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        loading: true,
      }),
    }),
  });
  renderWithProviders(<TLSEnabled />, { state });

  expect(screen.getByLabelText(Labels.Loading)).toBeInTheDocument();
});

it("renders certificate content", async () => {
  renderWithProviders(<TLSEnabled />, { state: certificateState() });

  expect(
    await screen.findByRole("textbox", { name: Labels.Textarea })
  ).toHaveValue(tlsCertificate.certificate);
});

it("disables the interval field if notification is not enabled", async () => {
  mockConfigs(false, 45);
  renderWithProviders(<TLSEnabled />, { state: certificateState() });

  const slider = await screen.findByRole("slider", { name: Labels.Interval });
  expect(slider).toBeDisabled();

  await waitFor(() => {
    expect(
      screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
    ).not.toBeDisabled();
  });
  await userEvent.click(
    screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
  );

  await waitFor(() => {
    expect(slider).not.toBeDisabled();
  });
});

it("shows an error if TLS notification is enabled but interval is invalid", async () => {
  mockConfigs(true, 45);
  renderWithProviders(<TLSEnabled />, { state: certificateState() });

  const intervalInput = await screen.findByRole("spinbutton", {
    name: Labels.Interval,
  });

  await waitFor(() => {
    expect(intervalInput).not.toBeDisabled();
  });
  await userEvent.clear(intervalInput);
  await userEvent.tab();

  await waitFor(() => {
    expect(intervalInput).toHaveAccessibleErrorMessage(
      "Notification interval is required."
    );
  });
});

it("dispatches an action to update TLS notification config with notification enabled", async () => {
  mockConfigs(false, 60);
  const { store } = renderWithProviders(<TLSEnabled />, {
    state: certificateState(),
  });

  await waitFor(() => {
    expect(
      screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
    ).not.toBeDisabled();
  });
  await userEvent.click(
    screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
  );
  fireEvent.change(screen.getByRole("slider", { name: Labels.Interval }), {
    target: { value: 45 },
  });
  await userEvent.click(screen.getByRole("button", { name: /Save/ }));

  await waitFor(() => {
    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      tls_cert_expiration_notification_enabled: true,
      tls_cert_expiration_notification_interval: 45,
    });
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});

it("dispatches an action to update TLS notification config with notification disabled", async () => {
  mockConfigs(true, 45);
  const { store } = renderWithProviders(<TLSEnabled />, {
    state: certificateState(),
  });

  const intervalInput = await screen.findByRole("spinbutton", {
    name: Labels.Interval,
  });
  const notificationCheckbox = screen.getByRole("checkbox", {
    name: Labels.NotificationCheckbox,
  });

  // Change the notification interval, then disable the notification.
  await waitFor(() => {
    expect(intervalInput).not.toBeDisabled();
  });
  await userEvent.clear(intervalInput);
  await userEvent.type(intervalInput, "90");
  await userEvent.click(notificationCheckbox);
  await userEvent.click(screen.getByRole("button", { name: /Save/ }));

  // Dispatched action shouldn't include interval.
  await waitFor(() => {
    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      tls_cert_expiration_notification_enabled: false,
    });
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
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
  renderWithProviders(<TLSEnabled />, { state: certificateState() });

  await waitFor(() => {
    expect(
      screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
    ).toBeDisabled();
  });
});

it("enables fields with the configurations edit entitlement", async () => {
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({
        entitlement: Entitlement.CAN_EDIT_CONFIGURATIONS,
      }),
    ])
  );
  renderWithProviders(<TLSEnabled />, { state: certificateState() });

  await waitFor(() => {
    expect(
      screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
    ).toBeEnabled();
  });
});
