import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import TLSEnabled, { Labels } from "./TLSEnabled";

import { actions as configActions } from "app/store/config";
import {
  config as configFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  tlsCertificate as tlsCertificateFactory,
  tlsCertificateState as tlsCertificateStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders certificate content", () => {
  const tlsCertificate = tlsCertificateFactory();
  const state = rootStateFactory({
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <TLSEnabled />
    </Provider>
  );

  expect(screen.getByRole("textbox", { name: Labels.Textarea })).toHaveValue(
    tlsCertificate.certificate
  );
});

it("disables the interval field if notification is not enabled", async () => {
  const tlsCertificate = tlsCertificateFactory();
  const state = rootStateFactory({
    config: configStateFactory({
      items: [
        configFactory({
          name: "tls_cert_expiration_notification_enabled",
          value: false,
        }),
        configFactory({
          name: "tls_cert_expiration_notification_interval",
          value: 45,
        }),
      ],
    }),
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <TLSEnabled />
    </Provider>
  );
  const slider = screen.getByRole("slider", { name: Labels.Interval });
  expect(slider).toBeDisabled();

  userEvent.click(
    screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
  );

  await waitFor(() => {
    expect(slider).not.toBeDisabled();
  });
});

it("dispatches an action to update TLS notification config", async () => {
  const tlsCertificate = tlsCertificateFactory();
  const state = rootStateFactory({
    config: configStateFactory({
      items: [
        configFactory({
          name: "tls_cert_expiration_notification_enabled",
          value: false,
        }),
        configFactory({
          name: "tls_cert_expiration_notification_interval",
          value: 60,
        }),
      ],
    }),
    general: generalStateFactory({
      tlsCertificate: tlsCertificateStateFactory({
        data: tlsCertificate,
        loaded: true,
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <TLSEnabled />
    </Provider>
  );

  userEvent.click(
    screen.getByRole("checkbox", { name: Labels.NotificationCheckbox })
  );
  fireEvent.change(screen.getByRole("slider", { name: Labels.Interval }), {
    target: { value: 45 },
  });
  userEvent.click(screen.getByRole("button", { name: /Save/ }));

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
