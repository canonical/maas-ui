import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import RepositoryForm from "../RepositoryForm";
import {
  componentsToDisableState as componentsToDisableStateFactory,
  knownArchitecturesState as knownArchitecturesStateFactory,
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  pocketsToDisableState as pocketsToDisableStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RepositoryFormFields", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        componentsToDisable: componentsToDisableStateFactory({
          loaded: true,
        }),
        knownArchitectures: knownArchitecturesStateFactory({
          loaded: true,
        }),
        pocketsToDisable: pocketsToDisableStateFactory({
          loaded: true,
        }),
      }),
      packagerepository: packageRepositoryStateFactory({
        loaded: true,
        items: [packageRepositoryFactory()],
      }),
    });
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
      "multiverse",
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

    expect(wrapper.find("Input[name='enabled']").at(0).props().checked).toBe(
      false
    );
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
      wrapper.find("Input[name='disable_sources']").at(0).props().checked
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
      "multiverse",
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
