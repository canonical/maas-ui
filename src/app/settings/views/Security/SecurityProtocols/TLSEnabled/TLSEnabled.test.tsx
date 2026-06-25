import TLSEnabled, { Labels } from "./TLSEnabled";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  fireEvent,
  screen,
  setupMockServer,
  waitFor,
  renderWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(authResolvers.getCurrentUser.handler());

it("displays a spinner while loading config", () => {
  const state = factory.rootState({
    config: factory.configState({
      loading: true,
    }),
  });
  renderWithProviders(<TLSEnabled />, { state });

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

it("renders certificate content", () => {
  const tlsCertificate = factory.tlsCertificate();
  const state = factory.rootState({
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  renderWithProviders(<TLSEnabled />, { state });

  expect(screen.getByRole("textbox", { name: Labels.Textarea })).toHaveValue(
    tlsCertificate.certificate
  );
});

it("disables the interval field if notification is not enabled", async () => {
  const tlsCertificate = factory.tlsCertificate();
  const state = factory.rootState({
    config: factory.configState({
      items: [
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_ENABLED,
          value: false,
        }),
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_INTERVAL,
          value: 45,
        }),
      ],
    }),
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  renderWithProviders(<TLSEnabled />, { state });
  const slider = screen.getByRole("slider", { name: Labels.Interval });
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
  const tlsCertificate = factory.tlsCertificate();
  const state = factory.rootState({
    config: factory.configState({
      items: [
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_ENABLED,
          value: true,
        }),
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_INTERVAL,
          value: 45,
        }),
      ],
    }),
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  renderWithProviders(<TLSEnabled />, { state });
  const intervalInput = screen.getByRole("spinbutton", {
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
  const tlsCertificate = factory.tlsCertificate();
  const state = factory.rootState({
    config: factory.configState({
      items: [
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_ENABLED,
          value: false,
        }),
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_INTERVAL,
          value: 60,
        }),
      ],
    }),
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  const { store } = renderWithProviders(<TLSEnabled />, { state });

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
  const tlsCertificate = factory.tlsCertificate();
  const state = factory.rootState({
    config: factory.configState({
      items: [
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_ENABLED,
          value: true,
        }),
        factory.config({
          name: ConfigNames.TLS_CERT_EXPIRATION_NOTIFICATION_INTERVAL,
          value: 45,
        }),
      ],
    }),
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  const { store } = renderWithProviders(<TLSEnabled />, { state });
  const notificationCheckbox = screen.getByRole("checkbox", {
    name: Labels.NotificationCheckbox,
  });
  const intervalInput = screen.getByRole("spinbutton", {
    name: Labels.Interval,
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
  const state = factory.rootState({
    general: factory.generalState({
      tlsCertificate: factory.tlsCertificateState({
        data: factory.tlsCertificate(),
        loaded: true,
      }),
    }),
  });
  renderWithProviders(<TLSEnabled />, { state });
  await waitFor(() => {
    expect(
      screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
    ).toBeDisabled();
  });
});
