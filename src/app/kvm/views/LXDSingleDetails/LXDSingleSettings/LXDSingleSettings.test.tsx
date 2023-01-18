import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDSingleSettings from "./LXDSingleSettings";

import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDSingleSettings", () => {
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
      zone: zoneStateFactory({}),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <MemoryRouter>
        <Provider store={store}>
          <MemoryRouter>
            <CompatRouter>
              <LXDSingleSettings id={1} setSidePanelContent={jest.fn()} />
            </CompatRouter>
          </MemoryRouter>
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
        <MemoryRouter>
          <CompatRouter>
            <LXDSingleSettings id={1} setSidePanelContent={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });
});
