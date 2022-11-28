import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NotFound from "./NotFound";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("NotFound ", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/404", key: "testKey" }]}>
          <NotFound />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NotFound")).toMatchSnapshot();
  });

  it("can render in a section", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/404", key: "testKey" }]}>
          <NotFound includeSection />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainContentSection").exists()).toBe(true);
  });
});
