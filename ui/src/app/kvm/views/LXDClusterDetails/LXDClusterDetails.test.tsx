import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterDetails from "./LXDClusterDetails";

import kvmURLs from "app/kvm/urls";
import {
  vmClusterState as vmClusterStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterDetails", () => {
  it("redirects to KVM list if clusters have loaded but cluster is not in state", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <LXDClusterDetails />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").props().to).toBe(kvmURLs.kvm);
  });
});
