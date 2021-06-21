import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DiscoveriesList from "./DiscoveriesList";

import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DiscoveriesList", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      discovery: discoveryStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays the discoveries", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DiscoveriesList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.text().includes("my-discovery-test")).toBe(true);
    expect(wrapper.text().includes("another-test")).toBe(true);
  });
});
