import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDVMsSummaryCard from "./LXDVMsSummaryCard";

import {
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDVMsSummaryCard", () => {
  it("shows a spinner if pod has not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <LXDVMsSummaryCard id={1} />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
