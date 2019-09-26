import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { sshkey as sshkeyActions } from "app/preferences/actions";
import { sshkey as sshkeySelectors } from "app/preferences/selectors";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import ColumnToggle from "app/base/components/ColumnToggle";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Row from "app/base/components/Row";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const groupBySource = sshkeys => {
  const groups = new Map();
  sshkeys.forEach(sshkey => {
    const { keysource } = sshkey;
    let source, id, groupId;
    if (keysource) {
      const { protocol, auth_id } = keysource;
      groupId = `${protocol}/${auth_id}`;
      id = auth_id;
      source =
        (protocol === "lp" && "Launchpad") ||
        (protocol === "gh" && "GitHub") ||
        protocol;
    } else {
      source = "Upload";
      groupId = sshkey.id;
    }
    const group = groups.get(groupId);
    if (group) {
      group.keys.push(sshkey.display);
      groups.set(groupId, group);
    } else {
      groups.set(groupId, {
        id,
        keys: [sshkey.display],
        source
      });
    }
  });
  return Array.from(groups);
};

const generateRows = (
  sshkeys,
  expandedId,
  setExpandedId,
  expandedType,
  setExpandedType,
  hideExpanded,
  dispatch
) =>
  groupBySource(sshkeys).map(([id, group]) => {
    const expanded = expandedId === id;
    const showDelete = expandedType === "delete";
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <ColumnToggle
              isExpanded={expanded && !showDelete}
              label={group.source}
              onClose={hideExpanded}
              onOpen={() => {
                setExpandedId(id);
                setExpandedType("details");
              }}
            />
          ),
          role: "rowheader"
        },
        { content: group.id },
        { content: group.keys.length },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                to={`/account/prefs/sshkey/${id}/edit`}
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>

              <span className="p-tooltip p-tooltip--left">
                <Button
                  appearance="base"
                  className="is-small u-justify-table-icon"
                  onClick={() => {
                    setExpandedId(id);
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
            modelName={[group.source, group.id].join("/")}
            modelType={`SSH key${group.keys.length > 1 ? "s" : ""} for`}
            onCancel={hideExpanded}
            onConfirm={() => {}}
          />
        ) : (
          <Row>
            <Col size="10">
              {group.keys.map(key => (
                <p key={key}>{key}</p>
              ))}
            </Col>
          </Row>
        )),
      key: id,
      sortData: {
        source: group.source,
        id: group.id,
        count: group.keys.length
      }
    };
  });

const SSHKeyList = () => {
  const [expandedId, setExpandedId] = useState();
  const [expandedType, setExpandedType] = useState();
  const sshkeyLoading = useSelector(sshkeySelectors.loading);
  const sshkeyLoaded = useSelector(sshkeySelectors.loaded);
  const sshkeys = useSelector(sshkeySelectors.all);
  const dispatch = useDispatch();

  const hideExpanded = () => {
    setExpandedId();
    setExpandedType();
  };

  useEffect(() => {
    dispatch(sshkeyActions.fetch());
  }, [dispatch]);

  return (
    <>
      {sshkeyLoading && <Loader text="Loading..." />}
      {sshkeyLoaded && (
        <MainTable
          className="p-table-expanding--light sshkey-list"
          expanding={true}
          headers={[
            {
              content: "Source",
              sortKey: "source"
            },
            {
              content: "ID",
              sortKey: "id"
            },
            {
              content: "Number of keys",
              sortKey: "count"
            },
            {
              content: "Actions",
              className: "u-align--right"
            }
          ]}
          paginate={20}
          rows={generateRows(
            sshkeys,
            expandedId,
            setExpandedId,
            expandedType,
            setExpandedType,
            hideExpanded,
            dispatch
          )}
          sortable={true}
        />
      )}
    </>
  );
};

export default SSHKeyList;
