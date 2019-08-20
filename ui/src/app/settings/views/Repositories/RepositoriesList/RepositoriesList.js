import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "./RepositoriesList.scss";
import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Pagination from "app/base/components/Pagination";
import Row from "app/base/components/Row";
import SearchBox from "app/base/components/SearchBox";

const generateRepositoryRows = (repositories, expandedId, setExpandedId) =>
  repositories.map(repo => {
    let name = "";
    if (repo.name === "main_archive") {
      name = "Ubuntu archive";
    } else if (repo.name === "ports_archive") {
      name = "Ubuntu extra architectures";
    } else {
      name = repo.name;
    }

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
                to={`/repositories/${repo.id}/edit`}
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
                    This repo cannot be deleted.
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
        <Row>
          <Col size="7">
            Are you sure you want to delete repository "{repo.name}"?{" "}
            <span className="u-text--light">
              This action is permanent and can not be undone.
            </span>
          </Col>
          <Col size="3" className="u-align--right">
            <Button onClick={() => setExpandedId()}>Cancel</Button>
            <Button appearance="negative">Delete</Button>
          </Col>
        </Row>
      ),
      key: repo.id,
      sortData: {
        name: repo.name,
        url: repo.url,
        enabled: repo.enabled
      }
    };
  });

export const Repositories = ({ initialCount = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [itemsPerPage] = useState(initialCount);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.repositories.fetch());
  }, [dispatch]);

  const loaded = useSelector(selectors.repositories.loaded);
  const loading = useSelector(selectors.repositories.loading);
  const repositories = useSelector(state =>
    selectors.repositories.search(state, searchText)
  );
  const repositoryCount = useSelector(selectors.repositories.count);

  // pagination
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
      <div className="p-table-actions">
        <SearchBox
          onChange={setSearchText}
          placeholder="Search package repositories"
          value={searchText}
        />
        <Button element={Link} to="/repositories/add">
          Add PPA
        </Button>
        <Button element={Link} to="/repositories/add">
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
          rowLimit={itemsPerPage}
          rows={generateRepositoryRows(repositories, expandedId, setExpandedId)}
          rowStartIndex={indexOfFirstItem}
          sortable
        />
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={repositoryCount}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
};

export default Repositories;
