import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMDetailsHeader from "./KVMDetailsHeader";

import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMDetailsHeader", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          podFactory({
            id: 1,
            name: "pod-1",
            composed_machines_count: 10,
          }),
        ],
      }),
    });
  });

  it("displays a spinner if pods are loading", () => {
    const state = { ...initialState };
    state.pod.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMDetailsHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays pod name in header strip when loaded", () => {
    const state = { ...initialState };
    state.pod.items = [podFactory({ id: 1, name: "pod-name" })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <KVMDetailsHeader />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-test="section-header-title"]').text()).toBe(
      "pod-name"
    );
  });

  it("can display composed machines count", () => {
    const state = { ...initialState };
    state.pod.items = [podFactory({ id: 1, composed_machines_count: 5 })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <Route
            exact
            path="/kvm/:id/resources"
            component={() => <KVMDetailsHeader />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "5 composed machines"
    );
    expect(
      wrapper.find("[data-test='section-header-tabs'] Link").at(0).props()[
        "aria-selected"
      ]
    ).toBe(true);
  });

  it("shows a tab for project if the pod is a LXD pod", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <KVMDetailsHeader />} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='projects-tab']").exists()).toBe(true);
  });

  it("does not show a tab for project if the pod is not a LXD pod", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.VIRSH })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <KVMDetailsHeader />} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='projects-tab']").exists()).toBe(false);
  });
});
