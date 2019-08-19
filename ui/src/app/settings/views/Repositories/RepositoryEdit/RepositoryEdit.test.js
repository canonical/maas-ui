import { MemoryRouter } from "react-router-dom";
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
      packagerepository: {
        loading: false,
        loaded: true,
        items: [
          {
            id: 1,
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            default: true,
            enabled: true
          },
          {
            id: 2,
            name: "ports_archive",
            url: "http://ports.ubuntu.com/ubuntu-ports",
            default: true,
            enabled: true
          },
          {
            id: 3,
            name: "extra_archive",
            url: "http://maas.io",
            default: false,
            enabled: true
          },
          {
            id: 4,
            name: "secret_archive",
            url: "http://www.website.com",
            default: false,
            enabled: false
          }
        ]
      }
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
            { pathname: "/settings/repositories/1/edit", key: "testKey" }
          ]}
        >
          <RepositoryEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("handles repository not found", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories/100/edit", key: "testKey" }
          ]}
        >
          <RepositoryEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("Repository not found");
  });
});
