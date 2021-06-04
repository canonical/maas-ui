import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ThirdPartyDrivers from "./ThirdPartyDrivers";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ThirdPartyDrivers", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: "enable_third_party_drivers", value: false }),
        ],
      }),
    });
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ThirdPartyDrivers />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the ThirdPartyDrivers form if config is loaded", () => {
    const state = { ...initialState };
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ThirdPartyDrivers />
      </Provider>
    );

    expect(wrapper.find("ThirdPartyDriversForm").exists()).toBe(true);
  });
});
