import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import RepositoryForm from "./RepositoryForm";

import type { RootState } from "app/store/root/types";
import {
  componentsToDisableState as componentsToDisableStateFactory,
  knownArchitecturesState as knownArchitecturesStateFactory,
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  pocketsToDisableState as pocketsToDisableStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("RepositoryForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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

  it(`dispatches actions to fetch repos, components to disable,
    known architectures and pockets to disable if not already loaded`, () => {
    state.packagerepository.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm type="repository" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toEqual([
      {
        type: "general/fetchComponentsToDisable",
        meta: {
          cache: true,
          model: "general",
          method: "components_to_disable",
        },
        payload: null,
      },
      {
        type: "general/fetchKnownArchitectures",
        meta: {
          cache: true,
          model: "general",
          method: "known_architectures",
        },
        payload: null,
      },
      {
        type: "general/fetchPocketsToDisable",
        meta: {
          cache: true,
          model: "general",
          method: "pockets_to_disable",
        },
        payload: null,
      },
      {
        type: "packagerepository/fetch",
        meta: {
          model: "packagerepository",
          method: "list",
        },
        payload: null,
      },
    ]);
  });

  it("correctly sets title given type and repository props", () => {
    const store = mockStore(state);
    let component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm type="repository" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Add repository");

    component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm type="ppa" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Add PPA");

    component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm
              type="repository"
              repository={state.packagerepository.items[0]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Edit repository");

    component = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm
              type="ppa"
              repository={state.packagerepository.items[0]}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(component.find("h4").text()).toBe("Edit PPA");
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm type="repository" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

    expect(store.getActions()).toEqual([
      {
        type: "packagerepository/cleanup",
      },
    ]);
  });

  it("redirects when the repository is saved", () => {
    state.packagerepository.saved = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <RepositoryForm type="repository" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can update a repository", () => {
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
      enabled: true,
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm type="repository" repository={repository} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      name: "newName",
      url: "http://www.website.com",
      distributions: "",
      disabled_pockets: [],
      disabled_components: [],
      disable_sources: false,
      components: "",
      arches: ["i386", "amd64"],
      key: "",
      enabled: true,
    });
    const action = store
      .getActions()
      .find((action) => action.type === "packagerepository/update");
    expect(action).toEqual({
      type: "packagerepository/update",
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
          enabled: true,
        },
      },
      meta: {
        model: "packagerepository",
        method: "update",
      },
    });
  });

  it("can create a repository", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm type="repository" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
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
      enabled: true,
    });
    const action = store
      .getActions()
      .find((action) => action.type === "packagerepository/create");
    expect(action).toEqual({
      type: "packagerepository/create",
      payload: {
        params: {
          name: "name",
          url: "http://www.website.com",
          distributions: [],
          disable_sources: false,
          components: [],
          arches: ["i386", "amd64"],
          key: "",
          enabled: true,
        },
      },
      meta: {
        model: "packagerepository",
        method: "create",
      },
    });
  });

  it("adds a message and cleans up packagerepository state when a repo is added", () => {
    state.packagerepository.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
        >
          <CompatRouter>
            <RepositoryForm type="repository" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "packagerepository/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});
