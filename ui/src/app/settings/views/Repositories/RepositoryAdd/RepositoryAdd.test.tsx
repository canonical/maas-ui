import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import RepositoryAdd from "./RepositoryAdd";

import type { RootState } from "app/store/root/types";
import {
  packageRepositoryState as packageRepositoryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RepositoryAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        loaded: true,
      }),
    });
  });

  it("can display a repository add form with type ppa", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories/add/ppa", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <Route
              exact
              path="/settings/repositories/add/:type"
              render={() => <RepositoryAdd />}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("RepositoryForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("type")).toStrictEqual("ppa");
  });

  it("can display a repository add form with type repository", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/repositories/add/repository",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Route
              exact
              path="/settings/repositories/add/:type"
              render={() => <RepositoryAdd />}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("RepositoryForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("type")).toStrictEqual("repository");
  });
});
