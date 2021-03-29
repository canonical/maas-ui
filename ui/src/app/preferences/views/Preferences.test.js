import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { routerState as routerStateFactory } from "testing/factories";
import Preferences from "./Preferences";

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
          <Preferences />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Section").exists()).toBe(true);
  });
});
