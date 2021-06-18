import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DashboardConfigurationSubnetForm from "../DashboardConfigurationSubnetForm";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DashboardConfigurationSubnetForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        loaded: true,
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(initialState);

    const wrapper = shallow(
      <Provider store={store}>
        <DashboardConfigurationSubnetForm />
      </Provider>
    );
    expect(wrapper.find("DashboardConfigurationSubnetForm").exists()).toBe(
      true
    );
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DashboardConfigurationSubnetForm />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
