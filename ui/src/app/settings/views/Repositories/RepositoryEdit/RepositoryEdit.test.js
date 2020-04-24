import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import RepositoryEdit from "./RepositoryEdit";

const mockStore = configureStore();

describe("RepositoryEdit", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [],
      },
      packagerepository: {
        loading: false,
        loaded: true,
        items: [
          {
            id: 1,
            created: "Fri, 23 Aug. 2019 09:17:44",
            updated: "Fri, 23 Aug. 2019 09:17:44",
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            distributions: [],
            disabled_pockets: ["security"],
            disabled_components: ["universe", "restricted"],
            disable_sources: true,
            components: [],
            arches: ["amd64", "i386"],
            key: "",
            default: true,
            enabled: true,
          },
          {
            id: 2,
            created: "Fri, 23 Aug. 2019 09:17:44",
            updated: "Fri, 23 Aug. 2019 09:17:44",
            name: "ports_archive",
            url: "http://ports.ubuntu.com/ubuntu-ports",
            distributions: [],
            disabled_pockets: [],
            disabled_components: [],
            disable_sources: true,
            components: [],
            arches: ["armhf", "arm64", "ppc64el", "s390x"],
            key: "",
            default: true,
            enabled: true,
          },
        ],
      },
      general: {
        componentsToDisable: {},
        knownArchitectures: {},
        pocketsToDisable: {},
      },
    };
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
