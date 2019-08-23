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
        items: []
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
          <RepositoryForm title="Add repository" />
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
          <RepositoryForm title="Add repository" />
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
          <RepositoryForm title="Add repository" />
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
          <RepositoryForm title="Add repository" />
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
});
