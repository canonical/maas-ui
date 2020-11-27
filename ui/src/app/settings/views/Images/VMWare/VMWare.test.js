import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMWare from "./VMWare";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("VMWare", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWare />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the VMWare form if config is loaded", () => {
    const state = { ...initialState };
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <VMWare />
      </Provider>
    );

    expect(wrapper.find("VMWareForm").exists()).toBe(true);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <VMWare />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.startsWith("FETCH"));

    expect(fetchActions).toEqual([
      {
        type: "FETCH_CONFIG",
        meta: {
          model: "config",
          method: "list",
        },
      },
    ]);
  });
});
