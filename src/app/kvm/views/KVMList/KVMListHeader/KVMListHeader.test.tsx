import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KVMListHeader from "./KVMListHeader";

import urls from "app/base/urls";
import { KVMHeaderViews } from "app/kvm/constants";
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
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
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
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-subtitle"]').text()).toBe(
      "2 KVM hosts available"
    );
  });

  it("sets the LXD tab as active when at the LXD URL", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.lxd.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("a[data-testid='lxd-tab']").prop("aria-selected")).toBe(
      true
    );
  });

  it("sets the Virsh tab as active when at the Virsh URL", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.virsh.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("a[data-testid='virsh-tab']").prop("aria-selected")
    ).toBe(true);
  });

  it("can open the add LXD form at the LXD URL", () => {
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.lxd.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={setSidePanelContent}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("button[data-testid='add-kvm']").text()).toBe(
      "Add LXD host"
    );
    wrapper.find("button[data-testid='add-kvm']").simulate("click");
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.ADD_LXD_HOST,
    });
  });

  it("can open the add Virsh form at the Virsh URL", () => {
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.virsh.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={setSidePanelContent}
              sidePanelContent={null}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("button[data-testid='add-kvm']").text()).toBe(
      "Add Virsh host"
    );
    wrapper.find("button[data-testid='add-kvm']").simulate("click");
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.ADD_VIRSH_HOST,
    });
  });
});
