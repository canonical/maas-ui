import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMHeaderForms from "./KVMHeaderForms";

import { KVMHeaderViews } from "app/kvm/constants";
import { MachineHeaderViews } from "app/machines/constants";
import { PodType } from "app/store/pod/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMHeaderForms", () => {
  let initialState = rootStateFactory();

  beforeEach(() => {
    initialState = rootStateFactory({
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
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMHeaderForms headerContent={null} setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='kvm-action-form-wrapper']").exists()).toBe(
      false
    );
  });

  it("renders AddKVM if Add KVM header content provided", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMHeaderForms
            headerContent={{ view: KVMHeaderViews.ADD_KVM }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("AddKVM").exists()).toBe(true);
  });

  it("renders ComposeForm if Compose header content provided", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMHeaderForms
            headerContent={{ view: KVMHeaderViews.COMPOSE_VM }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ComposeForm").exists()).toBe(true);
  });

  it("renders DeleteForm if delete header content provided", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMHeaderForms
            headerContent={{ view: KVMHeaderViews.DELETE_KVM }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeleteForm").exists()).toBe(true);
  });

  it("renders RefreshForm if refresh header content provided", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMHeaderForms
            headerContent={{ view: KVMHeaderViews.REFRESH_KVM }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("RefreshForm").exists()).toBe(true);
  });

  it("renders machine action forms if a machine action is selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMHeaderForms
            headerContent={{ view: MachineHeaderViews.COMMISSION_MACHINE }}
            setHeaderContent={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ActionFormWrapper CommissionForm").exists()).toBe(
      true
    );
  });
});
