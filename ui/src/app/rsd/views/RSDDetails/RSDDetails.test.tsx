import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RSDDetails from "./RSDDetails";

import {
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RSDDetails", () => {
  it("redirects to RSD list if pods have loaded but pod is not in state", () => {
    const state = rootStateFactory({ pod: podStateFactory({ loaded: true }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd/1", key: "testKey" }]}>
          <RSDDetails />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").props().to).toBe("/rsd");
  });
});
