import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMDetails from "./KVMDetails";

import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVmCount as podVmCountFactory,
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
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 10 }),
            }),
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
              pathname: "/kvm/lxd/1/vms",
              search: "?q=test+search",
            },
          ]}
        >
          <Route
            exact
            path="/kvm/lxd/:id/vms"
            component={() => <KVMDetails />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LxdProject").prop("searchFilter")).toBe("test search");
  });
});
