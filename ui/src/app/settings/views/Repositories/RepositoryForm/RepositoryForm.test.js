import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import RepositoryForm from "./RepositoryForm";

const mockStore = configureStore();

describe("RepositoryForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      general: {
        componentsToDisable: {
          data: [],
          loaded: true,
          loading: false
        },
        knownArchitectures: {
          data: [],
          loaded: true,
          loading: false
        },
        pocketsToDisable: {
          data: [],
          loaded: true,
          loading: false
        }
      },
      packagerepository: {
        errors: {},
        loading: false,
        loaded: true,
        saving: false,
        saved: false,
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
            enabled: true
          }
        ]
      }
    };
  });

  it(`dispatches actions to fetch repos, components to disable,
    known architectures and pockets to disable if not already loaded`, () => {
    const state = { ...initialState };
    state.packagerepository.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm type="repository" />
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toEqual([
      {
        type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE",
        meta: {
          model: "general",
          method: "components_to_disable"
        }
      },
      {
        type: "FETCH_GENERAL_KNOWN_ARCHITECTURES",
        meta: {
          model: "general",
          method: "known_architectures"
        }
      },
      {
        type: "FETCH_GENERAL_POCKETS_TO_DISABLE",
        meta: {
          model: "general",
          method: "pockets_to_disable"
        }
      },
      {
        type: "FETCH_PACKAGEREPOSITORY",
        meta: {
          model: "packagerepository",
          method: "list"
        },
        payload: {
          params: {
            limit: 50
          }
        }
      },
      {
        type: "CLEANUP_PACKAGEREPOSITORY"
      }
    ]);
  });

  it("correctly sets title given type and repository props", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    let component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm type="repository" />
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Add repository");

    component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm type="ppa" />
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Add PPA");

    component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm
            type="repository"
            repository={state.packagerepository.items[0]}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Edit repository");

    component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm
            type="ppa"
            repository={state.packagerepository.items[0]}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Edit PPA");
  });

  it("cleans up when unmounting", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm type="repository" />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(store.getActions()).toEqual([
      {
        type: "CLEANUP_PACKAGEREPOSITORY"
      }
    ]);
  });

  it("redirects when the repository is saved", () => {
    const state = { ...initialState };
    state.packagerepository.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <RepositoryForm type="repository" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can update a repository", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const repository = {
      id: 9,
      created: "Tue, 27 Aug. 2019 12:39:12",
      updated: "Tue, 27 Aug. 2019 12:39:12",
      name: "name",
      url: "http://www.website.com",
      distributions: [],
      disabled_pockets: [],
      disabled_components: [],
      disable_sources: false,
      components: [],
      arches: ["i386", "amd64"],
      key: "",
      default: false,
      enabled: true
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm type="repository" repository={repository} />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          name: "newName",
          url: "http://www.website.com",
          distributions: "",
          disabled_pockets: [],
          disabled_components: [],
          disable_sources: false,
          components: "",
          arches: ["i386", "amd64"],
          key: "",
          default: false,
          enabled: true
        });
    });
    expect(store.getActions()[2]).toEqual({
      type: "UPDATE_PACKAGEREPOSITORY",
      payload: {
        params: {
          id: 9,
          name: "newName",
          url: "http://www.website.com",
          distributions: [],
          disable_sources: false,
          components: [],
          arches: ["i386", "amd64"],
          key: "",
          default: false,
          enabled: true
        }
      },
      meta: {
        model: "packagerepository",
        method: "update"
      }
    });
  });

  it("can create a repository", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm type="repository" />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          name: "name",
          url: "http://www.website.com",
          distributions: "",
          disabled_pockets: [],
          disabled_components: [],
          disable_sources: false,
          components: "",
          arches: ["i386", "amd64"],
          key: "",
          default: false,
          enabled: true
        });
    });
    expect(store.getActions()[2]).toEqual({
      type: "CREATE_PACKAGEREPOSITORY",
      payload: {
        params: {
          name: "name",
          url: "http://www.website.com",
          distributions: [],
          disable_sources: false,
          components: [],
          arches: ["i386", "amd64"],
          key: "",
          default: false,
          enabled: true
        }
      },
      meta: {
        model: "packagerepository",
        method: "create"
      }
    });
  });

  it("adds a message and cleans up packagerepository state when a repo is added", () => {
    const state = { ...initialState };
    state.packagerepository.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <RepositoryForm type="repository" />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some(action => action.type === "CLEANUP_PACKAGEREPOSITORY")
    ).toBe(true);
    expect(actions.some(action => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
