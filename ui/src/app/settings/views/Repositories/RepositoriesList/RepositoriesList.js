import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "./RepositoriesList.scss";
import { packagerepository as repositoryActions } from "app/base/actions";
import { packagerepository as repositorySelectors } from "app/base/selectors";
import { getRepoDisplayName } from "../utils";
import { useAddMessage } from "app/base/hooks";
import Button from "app/base/components/Button";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import SearchBox from "app/base/components/SearchBox";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

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
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              <span className="p-tooltip p-tooltip--left">
                <Button
                  appearance="base"
                  className="is-small u-justify-table-icon"
                  onClick={() => setExpandedId(repo.id)}
                  disabled={repo.default}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
                {repo.default && (
                  <span className="p-tooltip__message">
                    Default repos cannot be deleted.
                  </span>
                )}
              </span>
            </>
          ),
          className: "u-align--right u-align-icons--top"
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
    <>
      <div className="p-table-actions">
        <SearchBox
          onChange={setSearchText}
          placeholder="Search package repositories"
          value={searchText}
        />
        <Button element={Link} to="/settings/repositories/add/ppa">
          Add PPA
        </Button>
        <Button element={Link} to="/settings/repositories/add/repository">
          Add repository
        </Button>
      </div>
      {loading && <Loader text="Loading..." />}
      {loaded && (
        <MainTable
          className="p-table-expanding--light repo-list"
          defaultSort="id"
          defaultSortDirection="ascending"
          expanding={true}
          headers={[
            { content: "Name", sortKey: "name" },
            { content: "URL", sortKey: "url" },
            { content: "Enabled", sortKey: "enabled" },
            { content: "Actions", className: "u-align--right" }
          ]}
          paginate={20}
          rows={generateRepositoryRows(
            dispatch,
            expandedId,
            repositories,
            setDeletedRepo,
            setExpandedId
          )}
          sortable
        />
      )}
    </>
  );
};

export default Repositories;
