import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMList from "./KVMList";

import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["pod/fetch", "resourcepool/fetch", "zone/fetch"];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a LXD table when viewing the LXD tab", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.lxd, key: "testKey" }]}
        >
          <KVMList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='lxd-table']").exists()).toBe(true);
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
          initialEntries={[{ pathname: kvmURLs.virsh, key: "testKey" }]}
        >
          <KVMList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='virsh-table']").exists()).toBe(true);
  });

  it("redirects to the LXD tab if there are LXD pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.kvm, key: "testKey" }]}
        >
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(Router).prop("history").location.pathname).toBe(
      kvmURLs.lxd
    );
  });

  it("redirects to the Virsh tab if there are Virsh pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.VIRSH })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.kvm, key: "testKey" }]}
        >
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(Router).prop("history").location.pathname).toBe(
      kvmURLs.virsh
    );
  });

  it("displays a message if there are no pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: kvmURLs.kvm, key: "testKey" }]}
        >
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(false);
    expect(wrapper.find("[data-test='no-hosts']").exists()).toBe(true);
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
          initialEntries={[{ pathname: kvmURLs.kvm, key: "testKey" }]}
        >
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(false);
    expect(wrapper.find("[data-test='no-hosts']").exists()).toBe(false);
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
