import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import RepositoryEdit from "./RepositoryEdit";
import {
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RepositoryEdit", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory(),
      packagerepository: packageRepositoryStateFactory({
        loaded: true,
        items: [
          packageRepositoryFactory({
            id: 1,
          }),
        ],
      }),
    });
  });

  it("displays a loading component if loading", () => {
    const state = { ...initialState };
    state.packagerepository.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories/1/edit", key: "testKey" },
          ]}
        >
          <RepositoryEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("handles repository not found", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories/100/edit", key: "testKey" },
          ]}
        >
          <RepositoryEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("Repository not found");
  });

  it("can display a repository edit form with correct repo data", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/repositories/edit/repository/1",
              key: "testKey",
            },
          ]}
        >
          <Route
            exact
            path="/settings/repositories/edit/:type/:id"
            component={(props) => <RepositoryEdit {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("RepositoryForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("type")).toStrictEqual("repository");
    expect(form.prop("repository")).toStrictEqual(
      state.packagerepository.items[0]
    );
  });
});
