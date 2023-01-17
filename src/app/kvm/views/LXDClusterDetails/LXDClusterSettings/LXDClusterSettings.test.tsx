import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDClusterSettings from "./LXDClusterSettings";

import { actions as podActions } from "app/store/pod";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  vmHost as vmHostFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterSettings", () => {
  it("sets the cluster's first host as active", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 11 }), podFactory({ id: 22 })],
      }),
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            hosts: [vmHostFactory({ id: 11 }), vmHostFactory({ id: 22 })],
          }),
        ],
      }),
    });
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <LXDClusterSettings clusterId={1} setSidePanelContent={jest.fn()} />
      </Provider>
    );

    const expectedAction = podActions.setActive(11);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
