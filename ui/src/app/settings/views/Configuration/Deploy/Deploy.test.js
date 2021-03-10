import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Deploy from "./Deploy";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Deploy", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  it("loads", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Deploy />
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it(`dispatches actions to fetch config and general os info if either has not
    already loaded`, () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <Deploy />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter(
        (action) =>
          action.type.startsWith("FETCH") ||
          action.type.startsWith("general/fetch")
      );

    expect(fetchActions).toEqual([
      { type: "FETCH_CONFIG", meta: { model: "config", method: "list" } },
      {
        type: "general/fetchOsInfo",
        meta: {
          model: "general",
          method: "osinfo",
        },
        payload: null,
      },
    ]);
  });
});
