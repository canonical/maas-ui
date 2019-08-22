import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import RepositoryForm from "./RepositoryForm";

const mockStore = configureStore();

describe("RepositoryForm", () => {
  it("dispatches action to fetch repos if not already loaded", () => {
    const store = mockStore({
      general: {
        loaded: true,
        componentsToDisable: [],
        knownArchitectures: [],
        pocketsToDisable: []
      },
      packagerepository: {
        loading: false,
        loaded: false,
        items: []
      }
    });

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
          method: "list",
          type: 0
        },
        payload: {
          params: {
            limit: 50
          }
        }
      }
    ]);
  });

  it("dispatches actions to fetch general data if not already loaded", () => {
    const store = mockStore({
      general: {
        loading: false,
        loaded: false,
        componentsToDisable: [],
        knownArchitectures: [],
        pocketsToDisable: []
      },
      packagerepository: {
        loaded: true
      }
    });

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
          method: "components_to_disable",
          type: 0
        }
      },
      {
        type: "FETCH_GENERAL_KNOWN_ARCHITECTURES",
        meta: {
          model: "general",
          method: "known_architectures",
          type: 0
        }
      },
      {
        type: "FETCH_GENERAL_POCKETS_TO_DISABLE",
        meta: {
          model: "general",
          method: "pockets_to_disable",
          type: 0
        }
      }
    ]);
  });
});
