import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import "./SSHKeyList.scss";
import { sshkey as sshkeyActions } from "app/preferences/actions";
import { sshkey as sshkeySelectors } from "app/preferences/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
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
    if (group) {
      group.keys.push(sshkey);
      groups.set(groupId, group);
    } else {
      groups.set(groupId, {
        id,
        keys: [sshkey],
        source
      });
    }
  });
  return Array.from(groups);
};

const generateKeyCols = (keys, deleteButton) => {
  return (
    <ul className="p-table-sub-cols__list">
      {keys.map((key, i) => (
        <div className="p-table-sub-cols__item" key={key.key}>
          {formatKey(key.key)}
          {i === 0 && deleteButton}
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
          className: "p-table-sub-cols u-align-icons--top",
          content: generateKeyCols(
            group.keys,
            <Button
              appearance="base"
              className="is-small u-justify-table-icon sshkey-list__delete"
              onClick={() => {
                setExpandedId(id);
              }}
            >
              <i className="p-icon--delete">Delete</i>
            </Button>
          )
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          message={`Are you sure you want to delete ${
            group.keys.length > 1 ? "these SSH keys" : "this SSH key"
          }?`}
          onCancel={hideExpanded}
          onConfirm={() => {
            group.keys.forEach(key => {
              dispatch(sshkeyActions.delete(key.id));
            });
            hideExpanded();
          }}
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
  const saved = useSelector(sshkeySelectors.saved);
  const dispatch = useDispatch();

  useWindowTitle("SSH keys");

  useAddMessage(saved, sshkeyActions.cleanup, "SSH key removed successfully.");

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
              content: (
                <>
                  Key
                  <span className="sshkey-list__header-delete">Actions</span>
                </>
              )
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
