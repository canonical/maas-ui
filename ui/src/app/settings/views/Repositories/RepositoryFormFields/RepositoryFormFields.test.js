import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import RepositoryForm from "../RepositoryForm";

const mockStore = configureStore();

describe("RepositoryFormFields", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      config: {
        items: []
      },
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
        saved: false,
        saving: false,
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
            default: false,
            enabled: true
          }
        ]
      }
    };
  });

  it("displays disitribution and component inputs if type is repository", () => {
    const state = { ...initialState };
    state.packagerepository.items[0].default = false;
    const store = mockStore(state);

    let wrapper = mount(
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
    expect(wrapper.find("input[name='distributions']").exists()).toBe(true);
    expect(wrapper.find("input[name='components']").exists()).toBe(true);

    wrapper = mount(
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
    expect(wrapper.find("input[name='distributions']").exists()).toBe(false);
    expect(wrapper.find("input[name='components']").exists()).toBe(false);
  });

  it("displays disabled pockets checkboxes if repository is default", () => {
    const state = { ...initialState };
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    state.packagerepository.items[0].default = false;
    state.packagerepository.items[0].disabled_pockets = ["updates"];
    const store = mockStore(state);

    let wrapper = mount(
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
    expect(wrapper.find("Input[name='disabled_pockets']").length).toBe(0);
    state.packagerepository.items[0].default = true;

    wrapper = mount(
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
    expect(wrapper.find("Input[name='disabled_pockets']").length).toBe(3);
  });

  it("displays disabled components checkboxes if repository is default", () => {
    const state = { ...initialState };
    state.general.componentsToDisable.data = [
      "restricted",
      "universe",
      "multiverse"
    ];
    state.packagerepository.items[0].default = false;
    state.packagerepository.items[0].disabled_components = ["universe"];
    const store = mockStore(state);

    let wrapper = mount(
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
    expect(wrapper.find("Input[name='disabled_components']").length).toBe(0);
    state.packagerepository.items[0].default = true;

    wrapper = mount(
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
    expect(wrapper.find("Input[name='disabled_components']").length).toBe(3);
  });

  it("correctly reflects repository name", () => {
    const state = { ...initialState };
    state.packagerepository.items[0].name = "repo-name";
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(wrapper.find("Input[name='name']").props().value).toBe("repo-name");
  });

  it("correctly reflects repository url", () => {
    const state = { ...initialState };
    state.packagerepository.items[0].url = "fake.url";
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(wrapper.find("Input[name='url']").props().value).toBe("fake.url");
  });

  it("correctly reflects repository key", () => {
    const state = { ...initialState };
    state.packagerepository.items[0].key = "fake-key";
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(wrapper.find("Textarea[name='key']").props().value).toBe("fake-key");
  });

  it("correctly reflects repository enabled state", () => {
    const state = { ...initialState };
    state.packagerepository.items[0].enabled = false;
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(
      wrapper
        .find("Input[name='enabled']")
        .at(0)
        .props().checked
    ).toBe(false);
  });

  it("correctly reflects repository disable_sources state by displaying the inverse", () => {
    const state = { ...initialState };
    state.packagerepository.items[0].disable_sources = false;
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(
      wrapper
        .find("Input[name='disable_sources']")
        .at(0)
        .props().checked
    ).toBe(true);
  });

  it("correctly reflects repository arches", () => {
    const state = { ...initialState };
    state.general.knownArchitectures.data = ["amd64", "i386", "ppc64el"];
    state.packagerepository.items[0].arches = ["amd64", "ppc64el"];
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(wrapper.find("Input[name='arches']").length).toBe(3);
    expect(wrapper.find("Input[value='amd64']").props().checked).toBe(true);
    expect(wrapper.find("Input[value='i386']").props().checked).toBe(false);
    expect(wrapper.find("Input[value='ppc64el']").props().checked).toBe(true);
  });

  it("correctly reflects repository disabled_pockets", () => {
    const state = { ...initialState };
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    state.packagerepository.items[0].default = true;
    state.packagerepository.items[0].disabled_pockets = ["updates"];
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(wrapper.find("Input[value='updates']").props().checked).toBe(true);
    expect(wrapper.find("Input[value='security']").props().checked).toBe(false);
    expect(wrapper.find("Input[value='backports']").props().checked).toBe(
      false
    );
  });

  it("correctly reflects repository disabled_components", () => {
    const state = { ...initialState };
    state.general.componentsToDisable.data = [
      "restricted",
      "universe",
      "multiverse"
    ];
    state.packagerepository.items[0].default = true;
    state.packagerepository.items[0].disabled_components = ["universe"];
    const store = mockStore(state);

    const wrapper = mount(
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

    expect(wrapper.find("Input[value='restricted']").props().checked).toBe(
      false
    );
    expect(wrapper.find("Input[value='universe']").props().checked).toBe(true);
    expect(wrapper.find("Input[value='multiverse']").props().checked).toBe(
      false
    );
  });
});
