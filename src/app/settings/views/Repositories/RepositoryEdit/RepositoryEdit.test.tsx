import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import RepositoryEdit from "./RepositoryEdit";

import type { RootState } from "app/store/root/types";
import {
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RepositoryEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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
    state.packagerepository.loading = true;
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
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryEdit />}
                path="/settings/repositories/edit/:type/:id"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("handles repository not found", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/repositories/edit/repository/100",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryEdit />}
                path="/settings/repositories/edit/:type/:id"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("Repository not found");
  });

  it("can display a repository edit form with correct repo data", () => {
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
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryEdit />}
                path="/settings/repositories/edit/:type/:id"
              />
            </Routes>
          </CompatRouter>
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
