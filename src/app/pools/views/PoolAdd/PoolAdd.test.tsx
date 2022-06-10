import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { PoolAdd } from "./PoolAdd";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("PoolAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/pool/add", key: "testKey" }]}
        >
          <CompatRouter>
            <PoolAdd />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("PoolAdd").exists()).toBe(true);
  });
});
