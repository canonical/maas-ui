import configureStore from "redux-mock-store";

import IpmiSettings from "../IpmiSettings";

import { Labels as FormFieldsLabels } from "./IpmiFormFields";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("IpmiFormFields", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: ConfigNames.MAAS_AUTO_IPMI_USER,
            value: "maas",
          },
          {
            name: ConfigNames.MAAS_AUTO_IPMI_USER_PRIVILEGE_LEVEL,
            value: "OPERATOR",
          },
        ],
      }),
    });
  });

  it("updates value for ipmi username", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    renderWithBrowserRouter(<IpmiSettings />, { store });

    expect(
      screen.getByRole("textbox", { name: FormFieldsLabels.IPMIUsername })
    ).toHaveValue("maas");
  });

  it("updates value for ipmi user privilege level", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    renderWithBrowserRouter(<IpmiSettings />, { store });

    expect(
      screen.getByRole("radio", { name: FormFieldsLabels.OperatorRadio })
    ).toHaveProperty("checked", true);
  });
});
