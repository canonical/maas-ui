import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeployForm from "../DeployForm";

import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeployFormFields", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
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
      }),
      general: generalStateFactory({
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
              ["ubuntu/xenial", 'Ubuntu 16.04 LTS "Xenial Xerus"'],
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
                xenial: [
                  ["ga-16.04", "xenial (ga-16.04)"],
                  ["ga-16.04-lowlatency", "xenial (ga-16.04-lowlatency)"],
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
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
          }),
          machineFactory({
            system_id: "def456",
          }),
        ],
        selected: [],
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      }),
      user: userStateFactory({
        auth: authStateFactory({
          saved: false,
          user: userFactory({
            email: "test@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 1,
            username: "admin",
          }),
        }),
        loaded: true,
      }),
    });
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

  it("disables KVM checkbox if not Ubuntu 18.04 or 20.04", async () => {
    const state = { ...initialState };
    state.general.osInfo.data.default_release = "xenial";
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
    await act(async () => {
      wrapper
        .find("select[name='release']")
        .simulate("change", { target: { name: "release", value: "focal" } });
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

  it(`displays an error and disables form fields if there are no OSes or
    releases to choose from`, () => {
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
    expect(wrapper.find("FormikField[name='oSystem']").props().disabled).toBe(
      true
    );
    expect(wrapper.find("FormikField[name='release']").props().disabled).toBe(
      true
    );
    expect(
      wrapper.find("FormikField[name='installKVM']").props().disabled
    ).toBe(true);
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

  it("resets kernel selection on OS/release change", async () => {
    const state = { ...initialState };
    state.general.osInfo.data.default_release = "bionic";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <DeployForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Default release is Ubuntu 18.04. Change kernel to non-default.
    await act(async () => {
      wrapper
        .find("Select[name='kernel']")
        .simulate("change", { target: { name: "kernel", value: "ga-18.04" } });
    });
    wrapper.update();
    // Change release to Ubuntu 20.04.
    await act(async () => {
      wrapper.find("Select[name='release']").simulate("change", {
        target: { name: "release", value: "ubuntu/focal" },
      });
    });
    wrapper.update();
    // Previous kernel selection should be cleared.
    expect(wrapper.find("Select[name='kernel']").prop("value")).toBe("");
  });
});
