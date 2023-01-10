import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import { Labels as FormFieldsLabels } from "./IpmiFormFields/IpmiFormFields";
import IpmiSettings, { Labels as IpmiSettingsLabels } from "./IpmiSettings";

import { Labels as FormikButtonLabels } from "app/base/components/FormikFormButtons/FormikFormButtons";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  configState as configStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("IpmiSettings", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        loading: false,
        loaded: true,
      }),
    });
  });

  it("displays a spinner while loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    state.config.loaded = false;
    const store = mockStore(state);
    renderWithBrowserRouter(<IpmiSettings />, { store });

    expect(screen.getByText(IpmiSettingsLabels.Loading)).toBeInTheDocument();
  });

  it("dispatched an action to update config on save button click", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithBrowserRouter(<IpmiSettings />, { store });

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

    await userEvent.click(
      screen.getByRole("button", { name: FormikButtonLabels.Submit })
    );

    const updateConfigAction = store
      .getActions()
      .find((action) => action.type === "config/update");
    expect(updateConfigAction).toEqual({
      type: "config/update",
      payload: {
        params: [
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
