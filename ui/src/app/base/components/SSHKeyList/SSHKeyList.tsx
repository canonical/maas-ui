import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button, Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import { useAddMessage } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import type { Props as SettingsTableProps } from "app/settings/components/SettingsTable/SettingsTable";
import { actions as sshkeyActions } from "app/store/sshkey";
import sshkeySelectors from "app/store/sshkey/selectors";
import type {
  KeySource,
  SSHKey,
  SSHKeyMeta,
  SSHKeyState,
} from "app/store/sshkey/types";

type Props = {
  sidebar?: boolean;
} & Partial<SettingsTableProps>;

const formatKey = (key: SSHKey["key"]) => {
  const parts = key.split(" ");
  if (parts.length === 3) {
    return parts[2];
  }
  return `${key.slice(0, 20)}...`;
};

const groupBySource = (sshkeys: SSHKey[]) => {
  const groups = new Map();
  sshkeys.forEach((sshkey) => {
    const { keysource } = sshkey;
    let source: string;
    let id: KeySource["auth_id"] | null = null;
    let groupId: SSHKey["id"] | string;
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

const generateKeyCols = (keys: SSHKey[], deleteButton: ReactNode) => {
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
  sshkeys: SSHKey[],
  expandedId: SSHKey[SSHKeyMeta.PK] | null,
  setExpandedId: (id: SSHKey[SSHKeyMeta.PK] | null) => void,
  hideExpanded: () => void,
  dispatch: Dispatch,
  saved: SSHKeyState["saved"],
  saving: SSHKeyState["saving"],
  sidebar: boolean,
  setDeleting: (ids: SSHKey[SSHKeyMeta.PK][]) => void
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
      "data-testid": "sshkey-row",
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          deleted={saved}
          deleting={saving}
          message={`Are you sure you want to delete ${
            group.keys.length > 1 ? "these SSH keys" : "this SSH key"
          }?`}
          onClose={hideExpanded}
          onConfirm={() => {
            group.keys.forEach((key: SSHKey) => {
              dispatch(sshkeyActions.delete(key.id));
            });
            setDeleting(group.keys.map(({ id }: SSHKey) => id));
          }}
          sidebar={sidebar}
        />
      ),
      key: id,
      sortData: {
        id: group.id,
        source: group.source,
      },
    };
  });

const SSHKeyList = ({ sidebar = true, ...tableProps }: Props): JSX.Element => {
  const [expandedId, setExpandedId] = useState<SSHKey[SSHKeyMeta.PK] | null>(
    null
  );
  const [deleting, setDeleting] = useState<SSHKey[SSHKeyMeta.PK][]>([]);
  const sshkeyErrors = useSelector(sshkeySelectors.errors);
  const sshkeyLoading = useSelector(sshkeySelectors.loading);
  const sshkeyLoaded = useSelector(sshkeySelectors.loaded);
  const sshkeys = useSelector(sshkeySelectors.all);
  const saved = useSelector(sshkeySelectors.saved);
  const saving = useSelector(sshkeySelectors.saving);
  const dispatch = useDispatch();
  const sshKeysDeleted =
    deleting.length > 0 &&
    !deleting.some((id) => !sshkeys.find((key) => key.id === id));

  useAddMessage(
    saved && sshKeysDeleted,
    sshkeyActions.cleanup,
    "SSH key removed successfully.",
    () => setDeleting([])
  );

  const hideExpanded = () => {
    setExpandedId(null);
  };

  useEffect(() => {
    dispatch(sshkeyActions.fetch());
  }, [dispatch]);

  return (
    <>
      {sshkeyErrors && typeof sshkeyErrors === "string" && (
        <Notification severity="negative" title="Error:">
          {sshkeyErrors}
        </Notification>
      )}
      <SettingsTable
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
          dispatch,
          saved,
          saving,
          sidebar,
          setDeleting
        )}
        tableClassName="sshkey-list"
        {...tableProps}
      />
    </>
  );
};

export default SSHKeyList;
