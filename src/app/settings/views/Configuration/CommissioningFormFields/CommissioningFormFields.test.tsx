import CommissioningForm from "../CommissioningForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import {
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  configurationsResolvers.listConfigurations.handler({
    items: [
      { name: ConfigNames.COMMISSIONING_DISTRO_SERIES, value: "bionic" },
      {
        name: ConfigNames.DEFAULT_MIN_HWE_KERNEL,
        value: "hwe-18.04-lowlatency",
      },
    ],
  })
);

describe("CommissioningFormFields", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = factory.rootState({
      config: factory.configState({
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
      general: factory.generalState({
        osInfo: factory.osInfoState({
          loaded: true,
          loading: false,
          data: factory.osInfo({
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

  it("updates value for default distro series", async () => {
    const state = { ...initialState };

    renderWithProviders(<CommissioningForm />, { state });

    const bionic_option: HTMLOptionElement = await screen.findByRole("option", {
      name: 'Ubuntu 18.04 LTS "Bionic Beaver"',
    });
    await waitFor(() => {
      expect(bionic_option.selected).toBe(true);
    });
  });

  it("updates value for default min kernel", async () => {
    const state = { ...initialState };

    renderWithProviders(<CommissioningForm />, { state });

    const hwe_18_lowlatency_option: HTMLOptionElement = await screen.findByRole(
      "option",
      {
        name: "bionic (hwe-18.04-lowlatency)",
      }
    );
    expect(hwe_18_lowlatency_option.selected).toBe(true);
  });
});
