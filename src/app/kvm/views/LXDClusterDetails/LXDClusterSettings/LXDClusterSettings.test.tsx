import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDClusterSettings from "./LXDClusterSettings";

import { actions as podActions } from "@/app/store/pod";
import * as factory from "@/testing/factories";
import { render } from "@/testing/utils";

const mockStore = configureStore();

describe("LXDClusterSettings", () => {
  it("sets the cluster's first host as active", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [factory.pod({ id: 11 }), factory.pod({ id: 22 })],
      }),
      vmcluster: factory.vmClusterState({
        items: [
          factory.vmCluster({
            id: 1,
            hosts: [factory.vmHost({ id: 11 }), factory.vmHost({ id: 22 })],
          }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <LXDClusterSettings clusterId={1} setSidePanelContent={vi.fn()} />
      </Provider>
    );

    const expectedAction = podActions.setActive(11);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
