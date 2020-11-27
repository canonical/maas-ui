import {
  Button,
  Link as VanillaLink,
  Notification,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { actions as sshkeyActions } from "app/store/sshkey";
import sshkeySelectors from "app/store/sshkey/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const formatKey = (key) => {
  const parts = key.split(" ");
  if (parts.length === 3) {
    return parts[2];
  }
  return `${key.slice(0, 20)}...`;
};

const groupBySource = (sshkeys) => {
  const groups = new Map();
  sshkeys.forEach((sshkey) => {
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
        source,
      });
    }
  });
  return Array.from(groups);
};

const generateKeyCols = (keys, deleteButton) => {
  return (
    <ul className="p-table-sub-cols__list">
      {keys.map((key, i) => (
        <div className="p-table-sub-cols__item sshkey-list__keys" key={key.key}>
          <div className="sshkey-list__keys-key">{formatKey(key.key)}</div>
          <div className="sshkey-list__keys-delete">
            {i === 0 && deleteButton}
          </div>
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
          role: "rowheader",
        },
        { content: group.id },
        {
          className: "p-table-sub-cols",
          content: generateKeyCols(
            group.keys,
            <Button
              appearance="base"
              className="is-dense u-table-cell-padding-overlap"
              hasIcon
              onClick={() => {
                setExpandedId(id);
              }}
            >
              <i className="p-icon--delete">Delete</i>
            </Button>
          ),
        },
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          message={`Are you sure you want to delete ${
            group.keys.length > 1 ? "these SSH keys" : "this SSH key"
          }?`}
          onCancel={hideExpanded}
          onConfirm={() => {
            group.keys.forEach((key) => {
              dispatch(sshkeyActions.delete(key.id));
            });
            hideExpanded();
          }}
        />
      ),
      key: id,
      sortData: {
        source: group.source,
        id: group.id,
      },
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
      <SettingsTable
        buttons={[
          { label: "Import SSH key", url: "/account/prefs/ssh-keys/add" },
        ]}
        headers={[
          {
            content: "Source",
            sortKey: "source",
          },
          {
            content: "ID",
            sortKey: "id",
          },
          {
            content: (
              <>
                Key
                <span className="sshkey-list__header-action">Actions</span>
              </>
            ),
          },
        ]}
        loaded={sshkeyLoaded}
        loading={sshkeyLoading}
        rows={generateRows(
          sshkeys,
          expandedId,
          setExpandedId,
          hideExpanded,
          dispatch
        )}
        tableClassName="sshkey-list"
      />
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
