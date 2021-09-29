import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMListHeader from "./KVMListHeader";

import kvmURLs from "app/kvm/urls";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
        items: [podFactory({ id: 1 }), podFactory({ id: 2 })],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loader if pods have not loaded", () => {
    state.pod.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader headerContent={null} setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a pod count if pods have loaded", () => {
    state.pod.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader headerContent={null} setHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-subtitle"]').text()).toBe(
      "2 VM hosts available"
    );
  });

  it("can show a LXD tab", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.lxd, key: "testKey" }]}
        >
          <KVMListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            showLXDtab
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='lxd-tab']").exists()).toBe(true);
  });

  it("can show a Virsh tab", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.virsh, key: "testKey" }]}
        >
          <KVMListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            showVirshtab
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='virsh-tab']").exists()).toBe(true);
  });

  it("sets the LXD tab as active when at the LXD URL", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.lxd, key: "testKey" }]}
        >
          <KVMListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            showLXDtab
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("a[data-test='lxd-tab']").prop("aria-selected")).toBe(
      true
    );
  });

  it("sets the Virsh tab as active when at the Virsh URL", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.virsh, key: "testKey" }]}
        >
          <KVMListHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            showVirshtab
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("a[data-test='virsh-tab']").prop("aria-selected")).toBe(
      true
    );
  });
});
