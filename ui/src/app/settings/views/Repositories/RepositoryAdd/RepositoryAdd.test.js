import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import RepositoryAdd from "./RepositoryAdd";
import {
  packageRepositoryState as packageRepositoryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RepositoryAdd", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        loaded: true,
      }),
    });
  });

  it("can display a repository add form with type ppa", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories/add/ppa", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/settings/repositories/add/:type"
            component={(props) => <RepositoryAdd {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("RepositoryForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("type")).toStrictEqual("ppa");
  });

  it("can display a repository add form with type repository", () => {
    const state = { ...initialState };
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
          <Route
            exact
            path="/settings/repositories/add/:type"
            component={(props) => <RepositoryAdd {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("RepositoryForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("type")).toStrictEqual("repository");
  });
});
