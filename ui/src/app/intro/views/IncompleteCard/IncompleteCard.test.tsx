import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import IncompleteCard from "./IncompleteCard";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("IncompleteCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
        >
          <CompatRouter>
            <IncompleteCard />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("IncompleteCard")).toMatchSnapshot();
  });
});
