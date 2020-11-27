import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { LicenseKeyForm } from "./LicenseKeyForm";
import { unmountComponentAtNode } from "react-dom";

const mockStore = configureStore();

describe("LicenseKeyForm", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      general: {
        osInfo: {
          loaded: true,
          loading: false,
          data: {
            osystems: [
              ["ubuntu", "Ubuntu"],
              ["windows", "Windows"],
            ],
            releases: [
              ["ubuntu/bionic", "Ubuntu 18.04 LTS 'Bionic Beaver'"],
              ["windows/win2012*", "Windows Server 2012"],
            ],
          },
        },
      },
      licensekeys: {
        loading: false,
        loaded: true,
        saved: false,
        errors: {},
        items: [],
      },
    };
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
      store
        .getActions()
        .some((action) => action.type === "CLEANUP_LICENSE_KEYS")
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
      store
        .getActions()
        .some((action) => action.type === "FETCH_GENERAL_OSINFO")
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
      store.getActions().some((action) => action.type === "FETCH_LICENSE_KEYS")
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
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        osystem: "windows",
        distro_series: "win2012",
        license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      })
    );

    expect(
      store.getActions().find((action) => action.type === "CREATE_LICENSE_KEY")
    ).toStrictEqual({
      type: "CREATE_LICENSE_KEY",
      payload: {
        osystem: "windows",
        distro_series: "win2012",
        license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      },
    });
  });

  it("can update a key", () => {
    const store = mockStore(state);
    const licenseKey = {
      osystem: "windows",
      distro_series: "win2012",
      license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <LicenseKeyForm licenseKey={licenseKey} />
        </MemoryRouter>
      </Provider>
    );
    act(() => wrapper.find("Formik").props().onSubmit(licenseKey));

    expect(
      store.getActions().find((action) => action.type === "UPDATE_LICENSE_KEY")
    ).toStrictEqual({
      type: "UPDATE_LICENSE_KEY",
      payload: {
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
      actions.some((action) => action.type === "CLEANUP_LICENSE_KEYS")
    ).toBe(true);
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
