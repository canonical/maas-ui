import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkDiscoveryFormFields from "./NetworkDiscoveryFormFields";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, render } from "testing/utils";

const mockStore = configureStore();

describe("NetworkDiscoveryFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: ConfigNames.ACTIVE_DISCOVERY_INTERVAL,
            value: "0",
            choices: [
              [0, "Never (disabled)"],
              [604800, "Every week"],
              [86400, "Every day"],
              [43200, "Every 12 hours"],
              [21600, "Every 6 hours"],
              [10800, "Every 3 hours"],
              [3600, "Every hour"],
              [1800, "Every 30 minutes"],
              [600, "Every 10 minutes"],
            ],
          },
          {
            name: ConfigNames.NETWORK_DISCOVERY,
            value: "enabled",
            choices: [
              ["enabled", "Enabled"],
              ["disabled", "Disabled"],
            ],
          },
        ],
      }),
    });
  });

  it("disables the interval field if discovery is disabled", async () => {
    state.config.loading = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <NetworkDiscoveryFormFields />
        </Formik>
      </Provider>
    );

    expect(
      screen.queryByRole("combobox", { name: "Active subnet mapping interval" })
    ).not.toBeDisabled();

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Network discovery" }),
      "Disabled"
    );

    expect(
      screen.getByRole("combobox", { name: "Active subnet mapping interval" })
    ).toBeDisabled();
  });
});
