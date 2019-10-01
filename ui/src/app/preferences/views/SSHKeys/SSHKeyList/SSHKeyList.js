import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import "./SSHKeyList.scss";
import { sshkey as sshkeyActions } from "app/preferences/actions";
import { sshkey as sshkeySelectors } from "app/preferences/selectors";
import Button from "app/base/components/Button";
import VanillaLink from "app/base/components/Link";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Notification from "app/base/components/Notification";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const formatKey = key => {
  const parts = key.split(" ");
  if (parts.length === 3) {
    return parts[2];
  }
  return `${key.slice(0, 20)}...`;
};

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
    const keyDisplay = formatKey(sshkey.key);
    if (group) {
      group.keys.push(keyDisplay);
      groups.set(groupId, group);
    } else {
      groups.set(groupId, {
        id,
        keys: [keyDisplay],
        source
      });
    }
  });
  return Array.from(groups);
};

const generateKeyCols = keys => {
  if (keys.length === 1) {
    return keys[0];
  }
  return (
    <ul className="p-table-sub-cols__list">
      {keys.map(key => (
        <div className="p-table-sub-cols__item" key={key}>
          {key}
        </div>
      ))}
    </ul>
  );
};

const generateRows = (
  sshkeys,
  expandedId,
  setExpandedId,
  hideExpanded,
  dispatch
) =>
  groupBySource(sshkeys).map(([id, group]) => {
    const expanded = expandedId === id;
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: group.source,
          role: "rowheader"
        },
        { content: group.id },
        {
          className: "p-table-sub-cols",
          content: generateKeyCols(group.keys)
        },
        {
          content: (
            <Button
              appearance="base"
              className="is-small u-justify-table-icon"
              onClick={() => {
                setExpandedId(id);
              }}
            >
              <i className="p-icon--delete">Delete</i>
            </Button>
          ),
          className: "u-align--right u-align-icons--top"
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          modelName={[group.source, group.id].join("/")}
          modelType={`SSH key${group.keys.length > 1 ? "s" : ""} for`}
          onCancel={hideExpanded}
          onConfirm={() => {}}
        />
      ),
      key: id,
      sortData: {
        source: group.source,
        id: group.id
      }
    };
  });

const SSHKeyList = () => {
  const [expandedId, setExpandedId] = useState();
  const sshkeyErrors = useSelector(sshkeySelectors.errors);
  const sshkeyLoading = useSelector(sshkeySelectors.loading);
  const sshkeyLoaded = useSelector(sshkeySelectors.loaded);
  const sshkeys = useSelector(sshkeySelectors.all);
  const dispatch = useDispatch();

  const hideExpanded = () => {
    setExpandedId();
  };

  useEffect(() => {
    dispatch(sshkeyActions.fetch());
  }, [dispatch]);

  return (
    <>
      {sshkeyErrors && typeof sshkeyErrors === "string" && (
        <Notification type="negative" status="Error:">
          {sshkeyErrors}
        </Notification>
      )}
      {sshkeyLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <div className="p-table-actions__space-left"></div>
        <Button element={Link} to="/account/prefs/ssh-keys/add">
          Import SSH key
        </Button>
      </div>
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
              content: "Key"
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
            hideExpanded,
            dispatch
          )}
          sortable={true}
        />
      )}
      <VanillaLink
        external
        href="https://maas.io/docs/user-accounts#heading--ssh-keys"
      >
        About SSH keys
      </VanillaLink>
    </>
  );
};

export default SSHKeyList;
