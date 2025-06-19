import RepositoryForm from "../RepositoryForm";

import { Labels as RepositoryFormLabels } from "./RepositoryFormFields";

import type { PackageRepositoryResponse } from "@/app/apiclient";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithProviders } from "@/testing/utils";

describe("RepositoryFormFields", () => {
  let state: RootState;
  let mockRepo: PackageRepositoryResponse;

  beforeEach(() => {
    mockRepo = factory.packageRepository();
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
    });
  });

  it("displays distribution and component inputs if type is repository", () => {
    mockRepo.name = "not default";

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
    mockRepo.name = "not default";

    renderWithProviders(<RepositoryForm repository={mockRepo} type="ppa" />, {
      state,
    });
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
    mockRepo.name = "not default";
    mockRepo.disabled_pockets = ["updates"];

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
      { state }
    );

    expect(
      screen.queryByRole("list", { name: RepositoryFormLabels.DisabledPockets })
    ).not.toBeInTheDocument();
  });

  it("displays disabled pockets checkboxes if repository is default", () => {
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    mockRepo.name = "main_archive";
    mockRepo.disabled_pockets = ["updates"];

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
    mockRepo.name = "not default";
    mockRepo.disabled_components = ["universe"];

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
    mockRepo.name = "main_archive";
    mockRepo.disabled_components = ["universe"];

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
    mockRepo.name = "repo-name";

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Name })
    ).toHaveValue("repo-name");
  });

  it("correctly reflects repository url", () => {
    mockRepo.url = "fake.url";

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.URL })
    ).toHaveValue("fake.url");
  });

  it("correctly reflects repository key", () => {
    mockRepo.key = "fake-key";

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Key })
    ).toHaveValue("fake-key");
  });

  it("correctly reflects repository enabled state", () => {
    mockRepo.enabled = false;

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
      { state }
    );

    expect(
      screen.getAllByRole("checkbox", {
        name: RepositoryFormLabels.EnableRepo,
      })[0]
    ).not.toBeChecked();
  });

  it("correctly reflects repository disable_sources state by displaying the inverse", () => {
    mockRepo.disable_sources = false;

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
    mockRepo.arches = ["amd64", "ppc64el"];

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
    mockRepo.name = "main_archive";
    mockRepo.disabled_pockets = ["updates"];

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
    mockRepo.name = "main_archive";
    mockRepo.disabled_components = ["universe"];

    renderWithProviders(
      <RepositoryForm repository={mockRepo} type="repository" />,
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
