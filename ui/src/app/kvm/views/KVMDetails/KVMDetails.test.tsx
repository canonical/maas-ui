import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMDetails from "./KVMDetails";

import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMDetails", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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

  it("redirects to KVM list if pods have loaded but pod is not in state", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/2", key: "testKey" }]}>
          <KVMDetails />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").props().to).toBe("/kvm");
  });

  it("sets the search filter from the URL", () => {
    state.pod.items[0] = podFactory({ id: 1, type: PodType.LXD });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              key: "testKey",
              pathname: "/kvm/1/project",
              search: "?q=test+search",
            },
          ]}
        >
          <Route
            exact
            path="/kvm/:id/project"
            component={() => <KVMDetails />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LxdProject").prop("searchFilter")).toBe("test search");
  });

  it("renders LXD resources component if pod is a LXD pod", () => {
    state.pod.items[0] = podFactory({ id: 1, type: PodType.LXD });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <Route
            exact
            path="/kvm/:id/resources"
            component={() => <KVMDetails />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("LxdResources").exists()).toBe(true);
    expect(wrapper.find("KVMResources").exists()).toBe(false);
  });

  it("renders KVM resources component if pod is a not a LXD pod", () => {
    state.pod.items[0] = podFactory({ id: 1, type: PodType.VIRSH });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/resources", key: "testKey" }]}
        >
          <Route
            exact
            path="/kvm/:id/resources"
            component={() => <KVMDetails />}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("KVMResources").exists()).toBe(true);
    expect(wrapper.find("LxdResources").exists()).toBe(false);
  });
});
