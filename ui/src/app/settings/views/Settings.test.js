import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import { routerState as routerStateFactory } from "testing/factories";
import Settings from "./Settings";

const mockStore = configureStore();

describe("Settings", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        loading: false,
        loaded: false,
        items: [],
      },
      message: {
        items: [],
      },
      notification: {
        items: [],
      },
      router: routerStateFactory(),
      status: {},
      user: {
        auth: {
          user: {
            is_superuser: true,
          },
        },
      },
    };
  });

  it("dispatches action to fetch config on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        >
          <Settings />
        </MemoryRouter>
      </Provider>
    );

    const fetchConfigAction = store
      .getActions()
      .find((action) => action.type === "config/fetch");

    expect(fetchConfigAction).toEqual({
      type: "config/fetch",
      meta: {
        model: "config",
        method: "list",
      },
      payload: null,
    });
  });

  it("displays a message if not an admin", () => {
    state.user.auth.user.is_superuser = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        >
          <Settings />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("header")).toEqual(
      "You do not have permission to view this page."
    );
  });
});
