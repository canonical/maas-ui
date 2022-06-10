import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import Preferences from "./Preferences";

import { routerState as routerStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Preferences", () => {
  it("renders", () => {
    const store = mockStore({
      config: {
        items: [],
      },
      message: {
        items: [],
      },
      notification: {
        items: [],
      },
      router: routerStateFactory(),
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/preferences", key: "testKey" }]}
        >
          <CompatRouter>
            <Preferences />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Section").exists()).toBe(true);
  });
});
