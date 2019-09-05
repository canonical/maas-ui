import { format, parse } from "date-fns";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Link } from "react-router-dom";

import "./ScriptsList.scss";
import Button from "app/base/components/Button";
import Code from "app/base/components/Code";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Row from "app/base/components/Row";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
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
    const expanded = expandedId === script.id;
    const showDelete = expandedType === "delete";

    const [lastHistory] = script.history.slice(-1);

    let scriptSrc;
    if (lastHistory.data) {
      try {
        scriptSrc = atob(lastHistory.data);
      } catch {
        console.error(`Unable to decode script src for ${script.name}.`);
      }
    }

    // history timestamps are in the format: Mon, 02 Sep 2019 02:02:39 -0000
    let uploadedOn;
    if (lastHistory && lastHistory.created) {
      try {
        uploadedOn = format(
          parse(
            lastHistory.created,
            "EEE, dd LLL yyyy HH:mm:ss xxxx",
            new Date()
          ),
          "yyyy-LL-dd H:mm"
        );
      } catch (error) {
        console.error(`Unable to parse timestamp for ${script.name}.`);
      }
    } else {
      uploadedOn = "Never";
    }

    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <Button
              appearance="link"
              className={classNames("scripts-list__toggle", {
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
              <span className="scripts-list__toggle-name">{script.name}</span>
            </Button>
          ),
          role: "rowheader"
        },
        {
          content: script.description
        },
        { content: uploadedOn },
        {
          content: (
            <>
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
          <TableDeleteConfirm
            modelName={script.name}
            modelType="Script"
            onCancel={hideExpanded}
            onConfirm={() => {
              // TODO: actually delete
              hideExpanded();
            }}
          />
        ) : (
          <Row>
            <Col size="10">
              <Code>{scriptSrc}</Code>
            </Col>
          </Row>
        )),
      key: script.id,
      sortData: {
        name: script.name,
        description: script.description,
        uploadedOn
      }
    };
  });

const ScriptsList = ({ type = "commissioning" }) => {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState();
  const [expandedType, setExpandedType] = useState();
  const [searchText, setSearchText] = useState("");
  const scriptsLoading = useSelector(selectors.scripts.loading);
  const scriptsLoaded = useSelector(selectors.scripts.loaded);
  const userScripts = useSelector(state =>
    selectors.scripts.search(state, searchText, type)
  );

  const hideExpanded = () => {
    setExpandedId();
    setExpandedType();
  };

  useEffect(() => {
    dispatch(actions.scripts.fetch());
  }, [dispatch, type]);

  return (
    <>
      {scriptsLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <SearchBox onChange={setSearchText} value={searchText} />
        <Button element={Link} to={`/scripts/${type}/upload`}>
          Upload script
        </Button>
      </div>
      {scriptsLoaded && (
        <MainTable
          className="p-table-expanding--light scripts-list"
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
              content: "Uploaded on",
              sortKey: "uploaded_on"
            },
            {
              content: "Actions",
              className: "u-align--right"
            }
          ]}
          paginate={20}
          rows={generateRows(
            userScripts,
            expandedId,
            setExpandedId,
            expandedType,
            setExpandedType,
            hideExpanded
          )}
          sortable={true}
        />
      )}
    </>
  );
};

ScriptsList.propTypes = {
  type: PropTypes.string
};

export default ScriptsList;
