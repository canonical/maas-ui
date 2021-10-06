import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import OverallResourcesCard from "./OverallResourcesCard";

import {
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("OverallResourcesCard", () => {
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
        <OverallResourcesCard id={1} />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
