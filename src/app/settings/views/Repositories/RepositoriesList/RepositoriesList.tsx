import { useState } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import TableActions from "@/app/base/components/TableActions";
import TableDeleteConfirm from "@/app/base/components/TableDeleteConfirm";
import {
  useFetchActions,
  useAddMessage,
  useWindowTitle,
} from "@/app/base/hooks";
import SettingsTable from "@/app/settings/components/SettingsTable";
import settingsURLs from "@/app/settings/urls";
import { repositoryActions } from "@/app/store/packagerepository";
import repositorySelectors from "@/app/store/packagerepository/selectors";
import type {
  PackageRepository,
  PackageRepositoryMeta,
  PackageRepositoryState,
} from "@/app/store/packagerepository/types";
import { getRepoDisplayName } from "@/app/store/packagerepository/utils";
import type { RootState } from "@/app/store/root/types";

export enum Labels {
  Actions = "Table actions",
  SearchboxPlaceholder = "Search package repositories",
}

const generateRepositoryRows = (
  dispatch: Dispatch,
  expandedId: PackageRepository[PackageRepositoryMeta.PK] | null,
  repositories: PackageRepository[],
  setDeletedRepo: (deletedRepo: PackageRepository["name"] | null) => void,
  setExpandedId: (
    expandedId: PackageRepository[PackageRepositoryMeta.PK] | null
  ) => void,
  saved: PackageRepositoryState["saved"],
  saving: PackageRepositoryState["saving"]
) =>
  repositories.map((repo) => {
    const name = getRepoDisplayName(repo);
    const type = repo.url.startsWith("ppa:") ? "ppa" : "repository";

    const expanded = expandedId === repo.id;
    return {
      "aria-label": name,
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: name,
          role: "rowheader",
        },
        { content: repo.url },
        {
          content: repo.enabled ? "Yes" : "No",
        },
        {
          "aria-label": Labels.Actions,
          content: (
            <TableActions
              deleteDisabled={repo.default}
              deleteTooltip={
                repo.default ? "Default repos cannot be deleted." : null
              }
              editPath={settingsURLs.repositories.edit({ id: repo.id, type })}
              onDelete={() => setExpandedId(repo.id)}
            />
          ),
          className: "u-align--right",
        },
      ],
      "data-testid": "repository-row",
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          deleted={saved}
          deleting={saving}
          modelName={repo.name}
          modelType="repository"
          onClose={() => setExpandedId(null)}
          onConfirm={() => {
            dispatch(repositoryActions.delete(repo.id));
            setDeletedRepo(repo.name);
          }}
        />
      ),
      key: repo.id,
      sortData: {
        name: repo.name,
        url: repo.url,
        enabled: repo.enabled,
      },
    };
  });

export const RepositoriesList = (): React.ReactElement => {
  const [expandedId, setExpandedId] = useState<
    PackageRepository[PackageRepositoryMeta.PK] | null
  >(null);
  const [searchText, setSearchText] = useState("");
  const [deletedRepo, setDeletedRepo] = useState<
    PackageRepository["name"] | null
  >(null);
  const loaded = useSelector(repositorySelectors.loaded);
  const loading = useSelector(repositorySelectors.loading);
  const saved = useSelector(repositorySelectors.saved);
  const saving = useSelector(repositorySelectors.saving);
  const repositories = useSelector((state: RootState) =>
    repositorySelectors.search(state, searchText)
  );
  const dispatch = useDispatch();

  useWindowTitle("Package repos");

  useAddMessage(
    saved,
    repositoryActions.cleanup,
    `${deletedRepo} removed successfully.`,
    () => setDeletedRepo(null)
  );

  // Fetch repositories on load
  useFetchActions([repositoryActions.fetch]);

  // Clean up saved and error states on unmount.
  useFetchActions([repositoryActions.cleanup]);

  return (
    <ContentSection>
      <ContentSection.Content>
        <SettingsTable
          aria-label="Package repositories"
          buttons={[
            {
              label: "Add PPA",
              url: settingsURLs.repositories.add({ type: "ppa" }),
            },
            {
              label: "Add repository",
              url: settingsURLs.repositories.add({ type: "repository" }),
            },
          ]}
          defaultSort="id"
          emptyStateMsg="No repositories available."
          headers={[
            { content: "Name", sortKey: "name" },
            { content: "URL", sortKey: "url" },
            { content: "Enabled", sortKey: "enabled" },
            { content: "Actions", className: "u-align--right" },
          ]}
          loaded={loaded}
          loading={loading}
          rows={generateRepositoryRows(
            dispatch,
            expandedId,
            repositories,
            setDeletedRepo,
            setExpandedId,
            saved,
            saving
          )}
          searchOnChange={setSearchText}
          searchPlaceholder={Labels.SearchboxPlaceholder}
          searchText={searchText}
          tableClassName="repo-list"
          title="Package repos"
        />
      </ContentSection.Content>
    </ContentSection>
  );
};

export default RepositoriesList;
