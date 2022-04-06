import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VirshSettings from "./VirshSettings";

import { ACTION_STATUS } from "app/base/constants";
import type { RootState } from "app/store/root/types";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VirshSettings", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, name: "pod1" })],
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
      tag: tagStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.success,
        }),
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <MemoryRouter>
        <Provider store={store}>
          <VirshSettings id={1} />
        </Provider>
      </MemoryRouter>
    );
    const expectedActionTypes = [
      "resourcepool/fetch",
      "tag/fetch",
      "zone/fetch",
    ];
    const actualActions = store.getActions();
    expectedActionTypes.forEach((expectedActionType) => {
      expect(
        actualActions.some(
          (actualAction) => actualAction.type === expectedActionType
        )
      );
    });
  });

  it("displays a spinner if data has not loaded", () => {
    state.resourcepool.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VirshSettings id={1} />
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });
});
