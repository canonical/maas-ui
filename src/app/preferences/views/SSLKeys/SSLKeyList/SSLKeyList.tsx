import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TableActions from "@/app/base/components/TableActions";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import SettingsTable from "@/app/settings/components/SettingsTable";
import { sslkeyActions } from "@/app/store/sslkey";
import sslkeySelectors from "@/app/store/sslkey/selectors";
import type { SSLKey } from "@/app/store/sslkey/types";

export enum Label {
  Title = "SSL keys",
  DeleteConfirm = "Confirm or cancel deletion of SSL key",
}

const generateRows = (sslkeys: SSLKey[]) =>
  sslkeys.map(({ id, display, key }) => {
    return {
      "aria-label": key,
      className: "p-table__row is-active",
      columns: [
        {
          className: "u-truncate",
          content: <span title={display}></span>,
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
        key: display,
      },
    };
  });

const SSLKeyList = (): React.ReactElement => {
  const sslkeyErrors = useSelector(sslkeySelectors.errors);
  const sslkeyLoading = useSelector(sslkeySelectors.loading);
  const sslkeyLoaded = useSelector(sslkeySelectors.loaded);
  const sslkeys = useSelector(sslkeySelectors.all);

  useWindowTitle(Label.Title);

  useFetchActions([sslkeyActions.fetch]);

  return (
    <>
      {sslkeyErrors && typeof sslkeyErrors === "string" && (
        <Notification severity="negative" title="Error:">
          {sslkeyErrors}
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
