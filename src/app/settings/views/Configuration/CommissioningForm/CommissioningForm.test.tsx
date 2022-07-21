import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Labels as FormFieldsLabels } from "../CommissioningFormFields/CommissioningFormFields";

import CommissioningForm from "./CommissioningForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CommissioningForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "bionic",
            choices: [
              ["precise", 'Ubuntu 12.04 LTS "Precise Pangolin"'],
              ["trusty", 'Ubuntu 14.04 LTS "Trusty Tahr"'],
              ["xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
              ["bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
            ],
          },
          {
            name: ConfigNames.DEFAULT_MIN_HWE_KERNEL,
            value: "ga-16.04-lowlatency",
            choices: [
              ["", "--- No minimum kernel ---"],
              ["ga-16.04-lowlatency", "xenial (ga-16.04-lowlatency)"],
              ["ga-16.04", "xenial (ga-16.04)"],
              ["hwe-16.04-lowlatency", "xenial (hwe-16.04-lowlatency)"],
              ["hwe-16.04", "xenial (hwe-16.04)"],
              ["hwe-16.04-edge", "xenial (hwe-16.04-edge)"],
              [
                "hwe-16.04-lowlatency-edge",
                "xenial (hwe-16.04-lowlatency-edge)",
              ],
            ],
          },
        ],
      }),
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loading: false,
          loaded: true,
          data: osInfoFactory(),
        }),
      }),
    });
  });

  it("dispatched an action to update config on save button click", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <CommissioningForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const maasAutoIpmiUserInput = screen.getByRole("textbox", {
      name: FormFieldsLabels.IPMIUsername,
    });
    await userEvent.clear(maasAutoIpmiUserInput);
    await userEvent.type(maasAutoIpmiUserInput, "maas");

    const maasAutoIpmiKGBmcKeyInput = screen.getByLabelText(
      FormFieldsLabels.KGBMCKeyLabel
    );
    await userEvent.clear(maasAutoIpmiKGBmcKeyInput);
    await userEvent.type(maasAutoIpmiKGBmcKeyInput, "password");

    await userEvent.click(
      screen.getByRole("radio", { name: FormFieldsLabels.UserRadio })
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const updateConfigAction = store
      .getActions()
      .find((action) => action.type === "config/update");
    expect(updateConfigAction).toEqual({
      type: "config/update",
      payload: {
        params: [
          { name: "commissioning_distro_series", value: "bionic" },
          { name: "default_min_hwe_kernel", value: "ga-16.04-lowlatency" },
          { name: "maas_auto_ipmi_user", value: "maas" },
          { name: "maas_auto_ipmi_k_g_bmc_key", value: "password" },
          { name: "maas_auto_ipmi_user_privilege_level", value: "USER" },
        ],
      },
      meta: {
        dispatchMultiple: true,
        model: "config",
        method: "update",
      },
    });
  });
});
