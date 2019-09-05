import { format, parse } from "date-fns";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Link } from "react-router-dom";

import Button from "app/base/components/Button";
import Code from "app/base/components/Code";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Pagination from "app/base/components/Pagination";
import Row from "app/base/components/Row";
import SearchBox from "app/base/components/SearchBox";
import actions from "app/settings/actions";
import selectors from "app/settings/selectors";

const generateRows = (
  scripts,
  expandedId,
  setExpandedId,
  expandedType,
  setExpandedType,
  hideExpanded
) =>
  scripts.map(script => {
    console.log("script", script);
    const expanded = expandedId === script.id;
    // Dates are in the format: Thu, 15 Aug. 2019 06:21:39.
    const updated = script.updated
      ? format(
          parse(script.updated, "E, dd LLL. yyyy HH:mm:ss", new Date()),
          "yyyy-LL-dd H:mm"
        )
      : "Never";
    const showDelete = expandedType === "delete";

    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <Button
              appearance="link"
              className={classNames("dhcp-list__toggle", {
                "is-active": expanded && !showDelete
              })}
              inline
              onClick={() => {
                if (expandedId && !showDelete) {
                  hideExpanded();
                } else {
                  setExpandedId(script.id);
                  setExpandedType("details");
                }
              }}
            >
              <span className="dhcp-list__toggle-name">{script.name}</span>
            </Button>
          ),
          role: "rowheader"
        },
        {
          content: script.description
        },
        { content: updated },
        { content: updated },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                to={`/script/${script.id}/edit`}
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>

              <span className="p-tooltip p-tooltip--left">
                <Button
                  appearance="base"
                  className="is-small u-justify-table-icon"
                  onClick={() => {
                    setExpandedId(script.id);
                    setExpandedType("delete");
                  }}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
              </span>
            </>
          ),
          className: "u-align--right u-align-icons--top"
        }
      ],
      expanded: expanded,
      expandedContent:
        expanded &&
        (showDelete ? (
          <Row>
            <Col size="7">
              Are you sure you want to delete script "{script.name}"?{" "}
              <span className="u-text--light">
                This action is permanent and can not be undone.
              </span>
            </Col>
            <Col size="3" className="u-align--right">
              <Button onClick={hideExpanded}>Cancel</Button>
              <Button appearance="negative" onClick={hideExpanded}>
                Delete
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col size="10">
              <Code>{script.value}</Code>
            </Col>
          </Row>
        )),
      key: script.id,
      sortData: {
        name: script.name,
        description: script.description,
        updated
      }
    };
  });

const ScriptsList = ({ type = "commissioning", initialCount = 20 }) => {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState();
  const [expandedType, setExpandedType] = useState();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(initialCount);
  const scriptsLoading = useSelector(selectors.scripts.loading);
  const scriptsLoaded = useSelector(selectors.scripts.loaded);
  const scripts = useSelector(state =>
    selectors.scripts.search(state, searchText, type)
  );
  const scriptsCount = useSelector(selectors.scripts.count);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const hideExpanded = () => {
    setExpandedId();
    setExpandedType();
  };

  const scriptsSelector =
    type === "commissioning"
      ? selectors.scripts.commissioning
      : selectors.scripts.testing;
  const userScripts = useSelector(scriptsSelector);

  useEffect(() => {
    dispatch(actions.scripts.fetch());
  }, [dispatch, type]);

  return (
    <>
      {scriptsLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <SearchBox onChange={setSearchText} value={searchText} />
        <Button element={Link} to="/scripts/upload">
          Upload script
        </Button>
      </div>
      {scriptsLoaded && (
        <MainTable
          className="p-table-expanding--light"
          expanding={true}
          headers={[
            {
              content: "Script name",
              sortKey: "name"
            },
            {
              content: "Description",
              sortKey: "description"
            },
            {
              content: "Uploaded by",
              sortKey: "author"
            },
            {
              content: "Uploaded on",
              sortKey: "uploaded_on"
            },
            {
              content: "Actions",
              className: "u-align--right"
            }
          ]}
          rowLimit={itemsPerPage}
          rows={generateRows(
            userScripts,
            expandedId,
            setExpandedId,
            expandedType,
            setExpandedType,
            hideExpanded
          )}
          rowStartIndex={indexOfFirstItem}
          sortable={true}
        />
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={scriptsCount}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
};

ScriptsList.propTypes = {
  type: PropTypes.string
};

export default ScriptsList;
