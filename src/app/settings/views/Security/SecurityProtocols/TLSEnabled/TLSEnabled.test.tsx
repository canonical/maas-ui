import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TLSEnabled, { Labels } from "./TLSEnabled";

import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { userEvent, fireEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

it("displays a spinner while loading config", () => {
  const state = factory.rootState({
    config: factory.configState({
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <TLSEnabled />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <TLSEnabled />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <TLSEnabled />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <TLSEnabled />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const slider = screen.getByRole("slider", { name: Labels.Interval });
  expect(slider).toBeDisabled();

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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <TLSEnabled />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const intervalInput = screen.getByRole("spinbutton", {
    name: Labels.Interval,
  });

  await userEvent.clear(intervalInput);
  await userEvent.tab();

  await waitFor(() => {
    expect(intervalInput).toHaveAccessibleErrorMessage(
      "Error: Notification interval is required."
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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <TLSEnabled />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <TLSEnabled />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const notificationCheckbox = screen.getByRole("checkbox", {
    name: Labels.NotificationCheckbox,
  });
  const intervalInput = screen.getByRole("spinbutton", {
    name: Labels.Interval,
  });

  // Change the notification interval, then disable the notification.
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
