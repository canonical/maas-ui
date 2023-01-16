import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import CommissioningForm from "../CommissioningForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, render } from "testing/utils";

const mockStore = configureStore();

describe("CommissioningFormFields", () => {
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
            value: "hwe-18.04-lowlatency",
          },
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
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
          loading: false,
          data: osInfoFactory({
            kernels: {
              ubuntu: {
                trusty: [
                  ["hwe-14.04-edge", "xenial (hwe-14.04-edge)"],
                  ["hwe-14.04", "trusty (hwe-14.04)"],
                ],
                xenial: [
                  ["hwe-16.04-edge", "xenial (hwe-16.04-edge)"],
                  ["hwe-16.04", "xenial (hwe-16.04)"],
                ],
                bionic: [
                  ["hwe-18.04-lowlatency", "bionic (hwe-18.04-lowlatency)"],
                  ["hwe-18.04-edge", "xenial (hwe-18.04-edge)"],
                  ["hwe-18.04", "xenial (hwe-18.04)"],
                ],
              },
            },
          }),
        }),
      }),
    });
  });

  it("updates value for default distro series", () => {
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

    const bionic_option = screen.getByRole("option", {
      name: 'Ubuntu 18.04 LTS "Bionic Beaver"',
    }) as HTMLOptionElement;
    expect(bionic_option.selected).toBe(true);
  });

  it("updates value for default min kernel", () => {
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

    const hwe_18_lowlatency_option = screen.getByRole("option", {
      name: "bionic (hwe-18.04-lowlatency)",
    }) as HTMLOptionElement;
    expect(hwe_18_lowlatency_option.selected).toBe(true);
  });
});
