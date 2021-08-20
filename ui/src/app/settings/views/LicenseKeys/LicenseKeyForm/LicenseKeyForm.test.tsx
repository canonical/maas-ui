import { mount } from "enzyme";
import type { FormikHelpers } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { LicenseKeyForm } from "./LicenseKeyForm";

import FormikForm from "app/base/components/FormikForm";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  licenseKeys as licenseKeysFactory,
  licenseKeysState as licenseKeysStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LicenseKeyForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          loaded: true,
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("LicenseKeyForm").exists()).toBe(true);
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(
      store.getActions().some((action) => action.type === "licensekeys/cleanup")
    ).toBe(true);
  });

  it("fetches OsInfo if not loaded", () => {
    state.general.osInfo.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "general/fetchOsInfo")
    ).toBe(true);
  });

  it("fetches license keys if not loaded", () => {
    state.licensekeys.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "licensekeys/fetch")
    ).toBe(true);
  });

  it("redirects when the snippet is saved", () => {
    state.licensekeys.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can add a key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find(FormikForm).invoke("onSubmit")(
      {
        osystem: "windows",
        distro_series: "win2012",
        license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      },
      {} as FormikHelpers<unknown>
    );

    expect(
      store.getActions().find((action) => action.type === "licensekeys/create")
    ).toStrictEqual({
      type: "licensekeys/create",
      payload: {
        osystem: "windows",
        distro_series: "win2012",
        license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      },
    });
  });

  it("can update a key", () => {
    const store = mockStore(state);
    const licenseKey = licenseKeysFactory({
      id: 1,
      osystem: "windows",
      distro_series: "win2012",
      license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm licenseKey={licenseKey} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find(FormikForm).invoke("onSubmit")(
      licenseKey,
      {} as FormikHelpers<unknown>
    );

    expect(
      store.getActions().find((action) => action.type === "licensekeys/update")
    ).toStrictEqual({
      type: "licensekeys/update",
      payload: {
        id: 1,
        osystem: "windows",
        distro_series: "win2012",
        license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      },
    });
  });

  it("adds a message when a license key is created", () => {
    state.licensekeys.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();

    expect(
      actions.some((action) => action.type === "licensekeys/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
