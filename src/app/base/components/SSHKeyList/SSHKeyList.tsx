import { Button, Notification } from "@canonical/react-components";
import type { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useListSshKeys } from "@/app/api/query/sshKeys";
import type { SshKeyResponse } from "@/app/apiclient";
import urls from "@/app/preferences/urls";
import SettingsTable from "@/app/settings/components/SettingsTable";
import type { Props as SettingsTableProps } from "@/app/settings/components/SettingsTable/SettingsTable";

type Props = Partial<SettingsTableProps>;

const formatKey = (key: SshKeyResponse["key"]) => {
  const parts = key.split(" ");
  if (parts.length >= 3) {
    return parts.slice(2).join(" ");
  }
  return key;
};

const groupBySource = (sshkeys: SshKeyResponse[]) => {
  const groups = new Map();
  sshkeys.forEach((sshkey) => {
    const { protocol, auth_id } = sshkey;
    let source: string;
    let id: SshKeyResponse["auth_id"] | null = null;
    let groupId: SshKeyResponse["id"] | string;
    if (protocol && auth_id) {
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

const generateKeyCols = (keys: SshKeyResponse[]) => {
  return (
    <ul className="p-table-sub-cols__list">
      {keys.map((key) => (
        <div className="p-table-sub-cols__item sshkey-list__keys" key={key.key}>
          <div className="sshkey-list__keys-key" title={key.key}>
            {formatKey(key.key)}
          </div>
        </div>
      ))}
    </ul>
  );
};

const generateRows = (sshkeys: SshKeyResponse[], navigate: NavigateFunction) =>
  groupBySource(sshkeys).map(([id, group]) => {
    const ids: number[] = group.keys.map((key: SshKeyResponse) => key.id);
    return {
      columns: [
        {
          content: group.source,
          role: "rowheader",
        },
        { content: group.id },
        {
          className: "p-table-sub-cols",
          content: generateKeyCols(group.keys),
        },
        {
          content: (
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
          className: "u-align--right",
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
  const { data, failureReason, isPending, isFetched } = useListSshKeys();
  const navigate = useNavigate();
  const sshkeys = data?.items ?? [];

  return (
    <>
      {failureReason && (
        <Notification severity="negative" title="Error:">
          {failureReason.message}
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
            content: "Key",
          },
          { content: "Actions", className: "u-align--right" },
        ]}
        loaded={isFetched}
        loading={isPending}
        rows={generateRows(sshkeys, navigate)}
        tableClassName="sshkey-list"
        {...tableProps}
      />
    </>
  );
};

export default SSHKeyList;
