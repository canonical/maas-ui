import { screen } from "@testing-library/react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KVMHeaderForms from "./KVMHeaderForms";

import { KVMHeaderViews } from "app/kvm/constants";
import { MachineHeaderViews } from "app/machines/constants";
import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("KVMHeaderForms", () => {
  let state = rootStateFactory();

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({ id: 1, name: "pod-1", type: PodType.LXD }),
          podFactory({ id: 2, name: "pod-2", type: PodType.VIRSH }),
        ],
        statuses: {
          1: podStatusFactory(),
          2: podStatusFactory(),
        },
      }),
    });
  });

  it("does not render if headerContent is not defined", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms headerContent={null} setHeaderContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-testid='kvm-action-form-wrapper']").exists()
    ).toBe(false);
  });

  it("renders AddLxd if Add LXD host header content provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms
              headerContent={{ view: KVMHeaderViews.ADD_LXD_HOST }}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("AddLxd").exists()).toBe(true);
  });

  it("renders AddVirsh if Add Virsh host header content provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms
              headerContent={{ view: KVMHeaderViews.ADD_VIRSH_HOST }}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("AddVirsh").exists()).toBe(true);
  });

  it("renders ComposeForm if Compose header content and host id provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms
              headerContent={{
                view: KVMHeaderViews.COMPOSE_VM,
                extras: { hostId: 1 },
              }}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ComposeForm").exists()).toBe(true);
  });

  it("renders DeleteForm if delete header content and host id provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms
              headerContent={{
                view: KVMHeaderViews.DELETE_KVM,
                extras: { hostId: 1 },
              }}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeleteForm").exists()).toBe(true);
  });

  it("renders DeleteForm if delete header content and cluster id provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms
              headerContent={{
                view: KVMHeaderViews.DELETE_KVM,
                extras: { clusterId: 1 },
              }}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeleteForm").exists()).toBe(true);
  });

  it("renders RefreshForm if refresh header content and host ids provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms
              headerContent={{
                view: KVMHeaderViews.REFRESH_KVM,
                extras: { hostIds: [1] },
              }}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("RefreshForm").exists()).toBe(true);
  });

  it("renders machine action forms if a machine action is selected", () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMHeaderForms
              headerContent={{ view: MachineHeaderViews.COMMISSION_MACHINE }}
              setHeaderContent={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper.find("MachineActionFormWrapper CommissionForm").exists()
    ).toBe(true);
  });

  it("renders machine action forms with selected machine count", () => {
    state.machine.selectedMachines = { items: ["abc123", "def456"] };
    renderWithBrowserRouter(
      <KVMHeaderForms
        headerContent={{ view: MachineHeaderViews.DELETE_MACHINE }}
        setHeaderContent={jest.fn()}
      />,
      { route: "/kvm", state }
    );

    expect(
      screen.getByRole("button", { name: /Delete 2 machines/i })
    ).toBeInTheDocument();
  });
});
