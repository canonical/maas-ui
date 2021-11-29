import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDClusterHostsActionBar from "./LXDClusterHostsActionBar";

import {
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterHostsActionBar", () => {
  it("opens the refresh form on refresh button click", () => {
    const setHeaderContent = jest.fn();
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [vmClusterFactory({ id: 1, hosts: [vmHostFactory()] })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <LXDClusterHostsActionBar
          clusterId={1}
          currentPage={1}
          searchFilter=""
          setCurrentPage={jest.fn()}
          setSearchFilter={jest.fn()}
          setHeaderContent={setHeaderContent}
          hosts={[]}
        />
      </Provider>
    );
    wrapper.find("button[data-testid='refresh-hosts']").simulate("click");
    expect(setHeaderContent).toHaveBeenCalled();
  });
});
