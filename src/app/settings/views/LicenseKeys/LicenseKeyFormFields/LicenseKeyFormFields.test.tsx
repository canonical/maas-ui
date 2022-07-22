import { screen, render } from "@testing-library/react";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LicenseKeyFormFields, {
  Labels as FormFieldsLabels,
} from "./LicenseKeyFormFields";

import type { OSInfoOptions } from "app/store/general/selectors/osInfo";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  licenseKeysState as licenseKeysStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LicenseKeyFormFields", () => {
  let state: RootState;
  let osystems: string[][];
  let releases: OSInfoOptions;

  beforeEach(() => {
    osystems = [["windows", "Windows"]];
    releases = {
      windows: [{ value: "win2012", label: "Windows Server 2012" }],
    };
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
          loading: false,
          data: osInfoFactory({
            osystems: [
              ["ubuntu", "Ubuntu"],
              ["windows", "Windows"],
            ],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"],
            ],
          }),
        }),
      }),
      licensekeys: licenseKeysStateFactory({
        loaded: true,
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <LicenseKeyFormFields osystems={osystems} releases={releases} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("combobox", {
        name: FormFieldsLabels.OperatingSystem,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: FormFieldsLabels.Release,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: FormFieldsLabels.LicenseKey,
      })
    ).toBeInTheDocument();
  });
});
