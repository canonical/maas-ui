import type { ReactNode } from "react";

import { Button, Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";
import type { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useFetchActions } from "@/app/base/hooks";
import urls from "@/app/preferences/urls";
import SettingsTable from "@/app/settings/components/SettingsTable";
import type { Props as SettingsTableProps } from "@/app/settings/components/SettingsTable/SettingsTable";
import { sshkeyActions } from "@/app/store/sshkey";
import sshkeySelectors from "@/app/store/sshkey/selectors";
import type { KeySource, SSHKey } from "@/app/store/sshkey/types";

type Props = Partial<SettingsTableProps>;

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

const generateRows = (sshkeys: SSHKey[], navigate: NavigateFunction) =>
  groupBySource(sshkeys).map(([id, group]) => {
    const ids: number[] = group.keys.map((key: SSHKey) => key.id);
    return {
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
              onClick={() =>
                navigate({
                  pathname: urls.sshKeys.delete,
                  search: `?ids=${ids.join()}`,
                })
              }
            >
              <i className="p-icon--delete">Delete</i>
            </Button>
          ),
        },
      ],
      "data-testid": "sshkey-row",
      key: id,
      sortData: {
        source: group.source,
        id: group.id,
      },
    };
  });

const SSHKeyList = ({ ...tableProps }: Props): JSX.Element => {
  const sshkeyErrors = useSelector(sshkeySelectors.errors);
  const sshkeyLoading = useSelector(sshkeySelectors.loading);
  const sshkeyLoaded = useSelector(sshkeySelectors.loaded);
  const sshkeys = useSelector(sshkeySelectors.all);
  const navigate = useNavigate();

  useFetchActions([sshkeyActions.fetch]);

  return (
    <>
      {sshkeyErrors && typeof sshkeyErrors === "string" && (
        <Notification severity="negative" title="Error:">
          {sshkeyErrors}
        </Notification>
      )}
      <SettingsTable
        aria-label="SSH keys"
        emptyStateMsg="No SSH keys available."
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
        rows={generateRows(sshkeys, navigate)}
        tableClassName="sshkey-list"
        {...tableProps}
      />
    </>
  );
};

export default SSHKeyList;
