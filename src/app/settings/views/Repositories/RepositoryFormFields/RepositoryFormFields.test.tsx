import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import RepositoryForm from "../RepositoryForm";
import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithMockStore } from "@/testing/utils";

describe("RepositoryFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        componentsToDisable: factory.componentsToDisableState({
          loaded: true,
        }),
        knownArchitectures: factory.knownArchitecturesState({
          loaded: true,
        }),
        pocketsToDisable: factory.pocketsToDisableState({
          loaded: true,
        }),
      }),
      packagerepository: factory.packageRepositoryState({
        loaded: true,
        items: [factory.packageRepository()],
      }),
    });
  });

  it("displays distribution and component inputs if type is repository", () => {
    state.packagerepository.items[0].default = false;

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Distributions })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Components })
    ).toBeInTheDocument();
  });

  it("doesn't display distribution and component inputs if type is ppa", () => {
    state.packagerepository.items[0].default = false;

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="ppa"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.queryByRole("textbox", {
        name: RepositoryFormLabels.Distributions,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("textbox", { name: RepositoryFormLabels.Components })
    ).not.toBeInTheDocument();
  });

  it("doesn't display disabled pockets checkboxes if repository is not default", () => {
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    state.packagerepository.items[0].default = false;
    state.packagerepository.items[0].disabled_pockets = ["updates"];

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.queryByRole("list", { name: RepositoryFormLabels.DisabledPockets })
    ).not.toBeInTheDocument();
  });

  it("displays disabled pockets checkboxes if repository is default", () => {
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    state.packagerepository.items[0].default = true;
    state.packagerepository.items[0].disabled_pockets = ["updates"];

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    const disabled_pockets_list = screen.getByRole("list", {
      name: RepositoryFormLabels.DisabledPockets,
    });
    expect(disabled_pockets_list).toBeInTheDocument();
    expect(within(disabled_pockets_list).getAllByRole("checkbox").length).toBe(
      3
    );
  });

  it("doesn't display disabled components checkboxes if repository is not default", () => {
    state.general.componentsToDisable.data = [
      "restricted",
      "universe",
      "multiverse",
    ];
    state.packagerepository.items[0].default = false;
    state.packagerepository.items[0].disabled_components = ["universe"];

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.queryByRole("list", {
        name: RepositoryFormLabels.DisabledComponents,
      })
    ).not.toBeInTheDocument();
  });

  it("displays disabled components checkboxes if repository is default", () => {
    state.general.componentsToDisable.data = [
      "restricted",
      "universe",
      "multiverse",
    ];
    state.packagerepository.items[0].default = true;
    state.packagerepository.items[0].disabled_components = ["universe"];

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    const disabled_components_list = screen.getByRole("list", {
      name: RepositoryFormLabels.DisabledComponents,
    });
    expect(disabled_components_list).toBeInTheDocument();
    expect(
      within(disabled_components_list).getAllByRole("checkbox").length
    ).toBe(3);
  });

  it("correctly reflects repository name", () => {
    state.packagerepository.items[0].name = "repo-name";

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Name })
    ).toHaveValue("repo-name");
  });

  it("correctly reflects repository url", () => {
    state.packagerepository.items[0].url = "fake.url";

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.URL })
    ).toHaveValue("fake.url");
  });

  it("correctly reflects repository key", () => {
    state.packagerepository.items[0].key = "fake-key";

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Key })
    ).toHaveValue("fake-key");
  });

  it("correctly reflects repository enabled state", () => {
    state.packagerepository.items[0].enabled = false;

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getAllByRole("checkbox", {
        name: RepositoryFormLabels.EnableRepo,
      })[0]
    ).not.toBeChecked();
  });

  it("correctly reflects repository disable_sources state by displaying the inverse", () => {
    state.packagerepository.items[0].disable_sources = false;

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getAllByRole("checkbox", {
        name: RepositoryFormLabels.EnableSources,
      })[0]
    ).toBeChecked();
  });

  it("correctly reflects repository arches", () => {
    state.general.knownArchitectures.data = ["amd64", "i386", "ppc64el"];
    state.packagerepository.items[0].arches = ["amd64", "ppc64el"];

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    const arches_list = screen.getByRole("list", {
      name: RepositoryFormLabels.Arches,
    });
    const arches_list_items = within(arches_list).getAllByRole("checkbox");

    expect(arches_list).toBeInTheDocument();

    expect(arches_list_items.length).toBe(3);
    expect(arches_list_items[0]).toBeChecked();
    expect(arches_list_items[1]).not.toBeChecked();
    expect(arches_list_items[2]).toBeChecked();
  });

  it("correctly reflects repository disabled_pockets", () => {
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    state.packagerepository.items[0].default = true;
    state.packagerepository.items[0].disabled_pockets = ["updates"];

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    const disabled_pockets_list = within(
      screen.getByRole("list", {
        name: RepositoryFormLabels.DisabledPockets,
      })
    ).getAllByRole("checkbox");

    expect(disabled_pockets_list.length).toBe(3);
    expect(disabled_pockets_list[0]).toBeChecked();
    expect(disabled_pockets_list[1]).not.toBeChecked();
    expect(disabled_pockets_list[2]).not.toBeChecked();
  });

  it("correctly reflects repository disabled_components", () => {
    state.general.componentsToDisable.data = [
      "restricted",
      "universe",
      "multiverse",
    ];
    state.packagerepository.items[0].default = true;
    state.packagerepository.items[0].disabled_components = ["universe"];

    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/repositories/add", key: "testKey" }]}
      >
        <CompatRouter>
          <RepositoryForm
            repository={state.packagerepository.items[0]}
            type="repository"
          />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    const disabled_components_list = within(
      screen.getByRole("list", {
        name: RepositoryFormLabels.DisabledComponents,
      })
    ).getAllByRole("checkbox");

    expect(disabled_components_list.length).toBe(3);
    expect(disabled_components_list[0]).not.toBeChecked();
    expect(disabled_components_list[1]).toBeChecked();
    expect(disabled_components_list[2]).not.toBeChecked();
  });
});
