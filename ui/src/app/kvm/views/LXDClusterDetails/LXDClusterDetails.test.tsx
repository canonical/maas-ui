import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterDetails from "./LXDClusterDetails";

import kvmURLs from "app/kvm/urls";
import {
  vmClusterState as vmClusterStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterDetails", () => {
  it("displays a message if the cluster does not exist", () => {
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
    expect(wrapper.find("[data-test='not-found']").exists()).toBe(true);
  });

  it("sets the search filter from the URL", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              key: "testKey",
              pathname: kvmURLs.lxd.cluster.vms.host({
                clusterId: 1,
                hostId: 2,
              }),
              search: "?q=test+search",
            },
          ]}
        >
          <Route
            exact
            path={kvmURLs.lxd.cluster.vms.host(null, true)}
            component={() => <LXDClusterDetails />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LXDClusterHostVMs").prop("searchFilter")).toBe(
      "test search"
    );
  });
});
