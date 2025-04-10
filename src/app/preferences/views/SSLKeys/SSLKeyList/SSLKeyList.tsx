import { Notification } from "@canonical/react-components";

import { useGetSslKeys } from "@/app/api/query/sslKeys";
import type { SslKeyResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import SettingsTable from "@/app/settings/components/SettingsTable";

export enum Label {
  Title = "SSL keys",
  DeleteConfirm = "Confirm or cancel deletion of SSL key",
}

const generateRows = (sslkeys: SslKeyResponse[]) =>
  sslkeys!.map(({ id, key }) => {
    return {
      "aria-label": key,
      className: "p-table__row is-active",
      columns: [
        {
          className: "u-truncate",
          content: <span title={key}></span>,
          role: "rowheader",
        },
        {
          content: (
            <TableActions
              copyValue={key}
              deletePath={urls.preferences.sslKeys.delete({ id })}
            />
          ),
          className: "u-align--right",
        },
      ],
      "data-testid": "sslkey-row",
      key: id,
      sortData: {
        key: key,
      },
    };
  });

const SSLKeyList = (): React.ReactElement => {
  const {
    data,
    failureReason: sslkeyErrors,
    isPending: sslkeyLoading,
    isFetched: sslkeyLoaded,
  } = useGetSslKeys();

  useWindowTitle(Label.Title);
  const sslkeys = data?.items ?? [];

  return (
    <>
      {sslkeyErrors && (
        <Notification severity="negative" title="Error:">
          {sslkeyErrors.message}
        </Notification>
      )}
      <SettingsTable
        aria-label={Label.Title}
        buttons={[{ label: "Add SSL key", url: urls.preferences.sslKeys.add }]}
        emptyStateMsg="No SSL keys available."
        headers={[
          {
            content: "Key",
            sortKey: "key",
          },
          {
            content: "Actions",
            className: "u-align--right",
          },
        ]}
        loaded={sslkeyLoaded}
        loading={sslkeyLoading}
        rows={generateRows(sslkeys)}
        tableClassName="sslkey-list"
      />
    </>
  );
};

export default SSLKeyList;
