import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Labels as LicenseKeyFormLabels } from "../LicenseKeyForm/LicenseKeyForm";
import { Labels as FormFieldsLabels } from "../LicenseKeyFormFields/LicenseKeyFormFields";

import { LicenseKeyEdit, Labels as LicenseKeyLabels } from "./LicenseKeyEdit";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("LicenseKeyEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        osInfo: factory.osInfoState({
          loaded: true,
          loading: false,
          data: factory.osInfo({
            osystems: [
              ["ubuntu", "Ubuntu"],
              ["windows", "Windows"],
            ],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"],
              ["windows/win2019*", "Windows Server 2019"],
            ],
          }),
        }),
      }),
      licensekeys: factory.licenseKeysState({
        errors: {},
        items: [
          factory.licenseKeys({
            osystem: "windows",
            distro_series: "win2012",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXA",
            resource_uri: "/MAAS/api/2.0/license-key/windows/win2012",
          }),
          factory.licenseKeys({
            osystem: "windows",
            distro_series: "win2019",
            license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXX7",
            resource_uri: "/MAAS/api/2.0/license-key/windows/win2019",
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.licensekeys.loading = true;
    state.licensekeys.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/license-keys/window/windows2012/edit",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LicenseKeyEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(LicenseKeyLabels.Loading)).toBeInTheDocument();
  });

  it("handles license key not found", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/license-keys/foo/bar/edit", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <LicenseKeyEdit />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(LicenseKeyLabels.KeyNotFound)).toBeInTheDocument();
  });

  it("can display a license key edit form", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/license-keys/windows/win2012/edit",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<LicenseKeyEdit />}
                path="/settings/license-keys/:osystem/:distro_series/edit"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("form", {
        name: LicenseKeyFormLabels.FormLabel,
      })
    ).toBeInTheDocument();

    const operatingSystem = screen.getByRole("option", {
      name: "Windows",
    }) as HTMLOptionElement;
    expect(operatingSystem.selected).toBe(true);

    const release = screen.getByRole("option", {
      name: "Windows Server 2012",
    }) as HTMLOptionElement;
    expect(release.selected).toBe(true);

    expect(
      screen.getByRole("textbox", { name: FormFieldsLabels.LicenseKey })
    ).toHaveValue("XXXXX-XXXXX-XXXXX-XXXXX-XXXXA");
  });
});
