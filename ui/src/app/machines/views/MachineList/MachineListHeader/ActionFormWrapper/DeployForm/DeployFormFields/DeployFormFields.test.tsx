import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import DeployForm from "../DeployForm";
import type { TSFixMe } from "app/base/types";

const mockStore = configureStore();

describe("DeployFormFields", () => {
  let initialState: TSFixMe;
  beforeEach(() => {
    initialState = {
      config: {
        items: [
          {
            name: "default_osystem",
            value: "ubuntu",
            choices: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
          },
        ],
        errors: {},
        loaded: true,
        loading: false,
      },
      general: {
        defaultMinHweKernel: {
          data: "",
          errors: {},
          loaded: true,
          loading: false,
        },
        osInfo: {
          data: {
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
              ["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"'],
            ],
            kernels: {
              ubuntu: {
                bionic: [
                  ["ga-18.04", "bionic (ga-18.04)"],
                  ["ga-18.04-lowlatency", "bionic (ga-18.04-lowlatency)"],
                  ["hwe-18.04", "bionic (hwe-18.04)"],
                  ["hwe-18.04-edge", "bionic (hwe-18.04-edge)"],
                  ["hwe-18.04-lowlatency", "bionic (hwe-18.04-lowlatency)"],
                  [
                    "hwe-18.04-lowlatency-edge",
                    "bionic (hwe-18.04-lowlatency-edge)",
                  ],
                ],
                focal: [
                  ["ga-20.04", "focal (ga-20.04)"],
                  ["ga-20.04-lowlatency", "focal (ga-20.04-lowlatency)"],
                ],
              },
            },
            default_osystem: "ubuntu",
            default_release: "focal",
          },
          errors: {},
          loaded: true,
          loading: false,
        },
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
          },
          {
            system_id: "def456",
          },
        ],
        selected: [],
        statuses: {
          abc123: {},
          def456: {},
        },
      },
      user: {
        auth: {
          saved: false,
          user: {
            email: "test@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 1,
            username: "admin",
          },
        },
        errors: {},
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      },
    };
  });

  it("correctly sets operating system to default", () => {
    const state = { ...initialState };
    state.general.osInfo.data.default_osystem = "centos";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Select[name='oSystem']").props().value).toBe("centos");
  });

  it("correctly sets release to default", () => {
    const state = { ...initialState };
    state.general.osInfo.data.default_release = "bionic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Select[name='release']").props().value).toBe("bionic");
  });

  it("correctly sets minimum kernel to default", () => {
    const state = { ...initialState };
    state.general.defaultMinHweKernel.data = "ga-18.04";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Select[name='kernel']").props().value).toBe(
      "ga-18.04"
    );
  });

  it("disables KVM checkbox with warning if not Ubuntu 18.04", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input[name='installKVM']").props().disabled).toBe(
      true
    );
    await act(async () => {
      wrapper
        .find("select[name='release']")
        .simulate("change", { target: { name: "release", value: "bionic" } });
    });
    wrapper.update();
    expect(wrapper.find("Input[name='installKVM']").props().disabled).toBe(
      false
    );
  });

  it("enables KVM checkbox when switching to Ubuntu 18.04 from a different OS/Release", async () => {
    const state = { ...initialState };
    state.general.osInfo.data.default_release = "bionic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Initial selection is Ubuntu 18.04. Switch to CentOS 6 to CentOS 7 back to
    // Ubuntu 18.04 and checkbox should be enabled.
    await act(async () => {
      wrapper
        .find("Select[name='oSystem']")
        .simulate("change", { target: { name: "oSystem", value: "centos" } });
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find("Select[name='release']")
        .simulate("change", { target: { name: "release", value: "centos70" } });
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find("Select[name='oSystem']")
        .simulate("change", { target: { name: "oSystem", value: "ubuntu" } });
    });
    wrapper.update();
    expect(wrapper.find("Input[name='installKVM']").props().disabled).toBe(
      false
    );
  });

  it("displays a warning if user has no SSH keys", () => {
    const state = { ...initialState };
    state.user.auth.user.sshkeys_count = 0;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='sshkeys-warning']").exists()).toBe(true);
  });

  it("displays an error if there are no OSes or releases to choose from", () => {
    const state = { ...initialState };
    state.general.osInfo.data.osystems = [];
    state.general.osInfo.data.releases = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='images-error']").exists()).toBe(true);
  });

  it("can display the user data input", async () => {
    const state = { ...initialState };
    state.general.osInfo.data.default_release = "bionic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikField[name='userData']").exists()).toBe(false);
    await act(async () => {
      wrapper.find("input[name='includeUserData']").simulate("change", {
        target: { name: "includeUserData", checked: true },
      });
    });
    wrapper.update();
    expect(wrapper.find("FormikField[name='userData']").exists()).toBe(true);
  });
});
