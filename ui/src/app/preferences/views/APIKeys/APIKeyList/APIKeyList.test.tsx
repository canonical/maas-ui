import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import APIKeyList from "./APIKeyList";

import type { RootState } from "app/store/root/types";
import {
  token as tokenFactory,
  tokenState as tokenStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("APIKeyList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      token: tokenStateFactory({
        items: [
          tokenFactory({
            id: 1,
            key: "ssh-rsa aabb",
            consumer: { key: "abc", name: "Name" },
          }),
          tokenFactory({
            id: 2,
            key: "ssh-rsa ccdd",
            consumer: { key: "abc", name: "Name" },
          }),
        ],
      }),
    });
  });

  it("can render the table", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/account/prefs/api-keys", key: "testKey" },
          ]}
        >
          <APIKeyList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });
});
