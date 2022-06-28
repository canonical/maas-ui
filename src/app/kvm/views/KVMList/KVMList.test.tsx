import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KVMList from "./KVMList";

import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "pod/fetch",
      "resourcepool/fetch",
      "vmcluster/fetch",
      "zone/fetch",
    ];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a LXD table when viewing the LXD tab and there are LXD pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.lxd.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='lxd-table']").exists()).toBe(true);
  });

  it("shows a LXD table when viewing the LXD tab and there are clusters", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory()],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.lxd.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='lxd-table']").exists()).toBe(true);
  });

  it("shows a virsh table when viewing the Virsh tab", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.VIRSH })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.virsh.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='virsh-table']").exists()).toBe(true);
  });

  it("redirects to the LXD tab if not already on a tab", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(Router).prop("history").location.pathname).toBe(
      kvmURLs.lxd.index
    );
  });

  it("displays a message if there are no LXD KVMs", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.lxd.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(Router).prop("history").location.pathname).toBe(
      kvmURLs.lxd.index
    );
    expect(wrapper.find("[data-testid='no-hosts']").exists()).toBe(true);
    expect(
      wrapper.find("[data-testid='no-hosts'] h4").text().includes("LXD")
    ).toBe(true);
    expect(
      wrapper.find("[data-testid='no-hosts'] p").text().includes("LXD")
    ).toBe(true);
  });

  it("displays a message if there are no Virsh KVMs", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.virsh.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(Router).prop("history").location.pathname).toBe(
      kvmURLs.virsh.index
    );
    expect(wrapper.find("[data-testid='no-hosts']").exists()).toBe(true);
    expect(
      wrapper.find("[data-testid='no-hosts'] h4").text().includes("Virsh")
    ).toBe(true);
    expect(
      wrapper.find("[data-testid='no-hosts'] p").text().includes("Virsh")
    ).toBe(true);
  });

  it("displays a spinner when loading pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loading: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(Router).prop("history").location.pathname).toBe(
      kvmURLs.lxd.index
    );
    expect(wrapper.find("[data-testid='no-hosts']").exists()).toBe(false);
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
