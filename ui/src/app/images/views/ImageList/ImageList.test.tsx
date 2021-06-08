import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageList from "./ImageList";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ImageList", () => {
  it("renders", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").exists()).toBe(true);
  });
});
