import { Button } from "@canonical/react-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import "./RepositoriesList.scss";
import { packagerepository as repositoryActions } from "app/base/actions";
import { packagerepository as repositorySelectors } from "app/base/selectors";
import { getRepoDisplayName } from "../utils";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import Tooltip from "app/base/components/Tooltip";

const generateRepositoryRows = (
  dispatch,
  expandedId,
  repositories,
  setDeletedRepo,
  setExpandedId
) =>
  repositories.map(repo => {
    const name = getRepoDisplayName(repo);
    const type = repo.url.startsWith("ppa:") ? "ppa" : "repository";

    const expanded = expandedId === repo.id;
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: name,
          role: "rowheader"
        },
        { content: repo.url },
        {
          content: repo.enabled ? "Yes" : "No"
        },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                to={`/settings/repositories/edit/${type}/${repo.id}`}
                className="is-dense u-table-cell-padding-overlap"
                hasIcon
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              <Tooltip
                position="left"
                message={repo.default && "Default repos cannot be deleted."}
              >
                <Button
                  appearance="base"
                  className="is-dense u-table-cell-padding-overlap"
                  hasIcon
                  onClick={() => setExpandedId(repo.id)}
                  disabled={repo.default}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
              </Tooltip>
            </>
          ),
          className: "u-align--right"
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          modelName={repo.name}
          modelType="repository"
          onCancel={setExpandedId}
          onConfirm={() => {
            dispatch(repositoryActions.delete(repo.id));
            setDeletedRepo(repo.name);
            setExpandedId();
          }}
        />
      ),
      key: repo.id,
      sortData: {
        name: repo.name,
        url: repo.url,
        enabled: repo.enabled
      }
    };
  });

export const Repositories = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [deletedRepo, setDeletedRepo] = useState();
  const loaded = useSelector(repositorySelectors.loaded);
  const loading = useSelector(repositorySelectors.loading);
  const saved = useSelector(repositorySelectors.saved);
  const repositories = useSelector(state =>
    repositorySelectors.search(state, searchText)
  );
  const dispatch = useDispatch();

  useWindowTitle("Package repos");

  useAddMessage(
    saved,
    repositoryActions.cleanup,
    `${deletedRepo} removed successfully.`,
    setDeletedRepo
  );

  // Fetch repositories on load
  useEffect(() => {
    dispatch(repositoryActions.fetch());
  }, [dispatch]);

  // Clean up saved and error states on unmount.
  useEffect(() => {
    dispatch(repositoryActions.cleanup());
  }, [dispatch]);

  return (
    <SettingsTable
      buttons={[
        { label: "Add PPA", url: "/settings/repositories/add/ppa" },
        {
          label: "Add repository",
          url: "/settings/repositories/add/repository"
        }
      ]}
      defaultSort="id"
      headers={[
        { content: "Name", sortKey: "name" },
        { content: "URL", sortKey: "url" },
        { content: "Enabled", sortKey: "enabled" },
        { content: "Actions", className: "u-align--right" }
      ]}
      loaded={loaded}
      loading={loading}
      rows={generateRepositoryRows(
        dispatch,
        expandedId,
        repositories,
        setDeletedRepo,
        setExpandedId
      )}
      searchOnChange={setSearchText}
      searchPlaceholder="Search package repositories"
      searchText={searchText}
      tableClassName="repo-list"
    />
  );
};

export default Repositories;
