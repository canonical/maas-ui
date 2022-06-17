import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeployForm from "../DeployForm";

import { ConfigNames } from "app/store/config/types";
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
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: ConfigNames.DEFAULT_OSYSTEM,
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
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_osystem = "centos";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("combobox", { name: "OS" })).toHaveValue("centos");
  });

  it("correctly sets release to default", () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_release = "bionic";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("combobox", { name: "Release" })).toHaveValue(
      "bionic"
    );
  });

  it("correctly sets minimum kernel to default", async () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_release = "bionic";
      state.general.defaultMinHweKernel.data = "ga-18.04";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Kernel" })).toHaveValue(
        "ga-18.04"
      )
    );
  });

  it("disables KVM host checkbox if not Ubuntu 18.04 or 20.04", async () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_release = "xenial";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("checkbox", { name: /Register as MAAS KVM host/ })
    ).toBeDisabled();
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Release" }),
      'Ubuntu 18.04 LTS "Bionic Beaver"'
    );

    await waitFor(() =>
      expect(
        screen.getByRole("checkbox", { name: /Register as MAAS KVM host/ })
      ).toBeEnabled()
    );
  });

  it("enables KVM host checkbox when switching to Ubuntu 18.04 from a different OS/Release", async () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_release = "bionic";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Initial selection is Ubuntu 18.04. Switch to CentOS 6 to CentOS 7 back to
    // Ubuntu 18.04 and checkbox should be enabled.
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "OS" }),
      "CentOS"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Release" }),
      "CentOS 7"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "OS" }),
      "Ubuntu"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Release" }),
      "bionic"
    );
    await waitFor(() =>
      expect(
        screen.getByRole("checkbox", { name: /Register as MAAS KVM host/ })
      ).not.toBeDisabled()
    );
  });

  it("shows KVM host type options when the KVM host checkbox is checked", async () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_release = "bionic";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.queryByRole("radio", { name: /LXD/ })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: /libvirt/ })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("checkbox", { name: /Register as MAAS KVM host/ })
    );
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: /LXD/ })).toBeInTheDocument()
    );
    expect(screen.getByRole("radio", { name: /libvirt/ })).toBeInTheDocument();
  });

  it("displays a warning if user has no SSH keys", () => {
    if (state.user.auth.user) {
      state.user.auth.user.sshkeys_count = 0;
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("sshkeys-warning")).toBeInTheDocument();
  });

  it(`displays an error and disables form fields if there are no OSes or
    releases to choose from`, () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.osystems = [];
      state.general.osInfo.data.releases = [];
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("images-error")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "OS" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "Release" })).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: /Register as MAAS KVM host/ })
    ).toBeDisabled();
  });

  it("can display the user data input", async () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_release = "bionic";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.queryByPlaceholderText(/Paste or drop script here/)
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Cloud-init user-data/ })
    );
    await waitFor(() =>
      expect(
        screen.getByPlaceholderText(/Paste or drop script here/)
      ).toBeInTheDocument()
    );
  });

  it("resets kernel selection on OS/release change", async () => {
    if (state.general.osInfo.data) {
      state.general.osInfo.data.default_release = "bionic";
    }
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Default release is Ubuntu 18.04. Change kernel to non-default.
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Kernel" }),
      "ga-18.04"
    );
    // Change release to Ubuntu 20.04.
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Release" }),
      'Ubuntu 20.04 LTS "Focal Fossa"'
    );
    // Previous kernel selection should be cleared.
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Kernel" })).toHaveValue("")
    );
  });

  it("displays 'periodically sync hardware' checkbox with global setting and additional tooltip information", async () => {
    state.config.items.push({
      name: ConfigNames.HARDWARE_SYNC_INTERVAL,
      value: "15m",
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("checkbox", { name: /Periodically sync hardware/ })
    ).toHaveAccessibleDescription(/Hardware sync interval: 15 minutes/);
    expect(
      screen.getByRole("tooltip", {
        name: /Enable this to make MAAS periodically check the hardware/,
      })
    ).toBeInTheDocument();
  });

  it("displays a correct description text for an invalid sync interval", () => {
    state.config.items.push({
      name: ConfigNames.HARDWARE_SYNC_INTERVAL,
      value: "",
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("checkbox", { name: /Periodically sync hardware/ })
    ).toHaveAccessibleDescription(/Hardware sync interval: Invalid/i);
  });

  it("'Periodically sync hardware' is unchecked by default", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("checkbox", { name: /Periodically sync hardware/ })
    ).not.toBeChecked();
    await userEvent.click(
      screen.getByRole("button", { name: /Start deployment for machine/ })
    );

    await waitFor(() => {
      const action = store
        .getActions()
        .find((action) => action.type === "machine/deploy");
      return expect(
        action?.payload?.params?.extra?.enable_hw_sync
      ).toBeUndefined();
    });
  });

  it("adds a enable_hw_sync field to the request on submit", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <CompatRouter>
            <DeployForm
              clearHeaderContent={jest.fn()}
              machines={[state.machine.items[0]]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: /Periodically sync hardware/ })
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Start deployment for machine/ })
    );
    await waitFor(() =>
      expect(
        screen.getByRole("checkbox", { name: /Periodically sync hardware/ })
      ).toBeChecked()
    );

    await waitFor(() => {
      const action = store
        .getActions()
        .find((action) => action.type === "machine/deploy");
      return expect(action?.payload?.params?.extra?.enable_hw_sync).toEqual(
        true
      );
    });
  });
});
