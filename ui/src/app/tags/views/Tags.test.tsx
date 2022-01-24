import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Tags from "./Tags";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Tags", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      tag: tagStateFactory({
        loaded: true,
        items: [tagFactory(), tagFactory()],
      }),
    });
  });

  it("displays a loading component if pools are loading", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
          <Tags />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.text().includes("Tags")).toBe(true);
  });
});
