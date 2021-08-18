import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { UserAdd } from "./UserAdd";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("UserAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/add", key: "testKey" }]}
        >
          <UserAdd />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("UserAdd").exists()).toBe(true);
  });
});
