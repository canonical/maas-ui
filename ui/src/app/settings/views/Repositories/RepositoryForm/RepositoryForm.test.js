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
            enabled: true
          }
        ]
      }
    };
  });

  it("dispatches action to fetch repos if not already loaded", () => {
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
      }
    ]);
  });

  it("dispatches action to fetch components to disable if not already loaded", () => {
    const state = { ...initialState };
    state.general.componentsToDisable.loaded = false;
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
      }
    ]);
  });

  it("dispatches action to fetch known architectures if not already loaded", () => {
    const state = { ...initialState };
    state.general.knownArchitectures.loaded = false;
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
        type: "FETCH_GENERAL_KNOWN_ARCHITECTURES",
        meta: {
          model: "general",
          method: "known_architectures"
        }
      }
    ]);
  });

  it("dispatches action to fetch pockets to disable if not already loaded", () => {
    const state = { ...initialState };
    state.general.pocketsToDisable.loaded = false;
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
        type: "FETCH_GENERAL_POCKETS_TO_DISABLE",
        meta: {
          model: "general",
          method: "pockets_to_disable"
        }
      }
    ]);
  });

  it("correctly sets title given type and repository props", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    let component = mount(
      <Provider store={store}>
        <RepositoryForm type="repository" />
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Add repository");

    component = mount(
      <Provider store={store}>
        <RepositoryForm type="ppa" />
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Add PPA");

    component = mount(
      <Provider store={store}>
        <RepositoryForm
          type="repository"
          repository={state.packagerepository.items[0]}
        />
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Edit repository");

    component = mount(
      <Provider store={store}>
        <RepositoryForm
          type="ppa"
          repository={state.packagerepository.items[0]}
        />
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Edit PPA");
  });
});
