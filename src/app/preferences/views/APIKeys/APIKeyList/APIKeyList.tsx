import { Notification } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TableActions from "@/app/base/components/TableActions";
import {
  useFetchActions,
  useAddMessage,
  useWindowTitle,
} from "@/app/base/hooks";
import urls from "@/app/base/urls";
import SettingsTable from "@/app/settings/components/SettingsTable";
import { actions as tokenActions } from "@/app/store/token";
import tokenSelectors from "@/app/store/token/selectors";
import type { Token } from "@/app/store/token/types";

export enum Label {
  Title = "API keys",
  EmptyList = "No API keys available.",
}

const generateRows = (tokens: Token[]) =>
  tokens.map(({ consumer, id, key, secret }) => {
    const { name } = consumer;
    const token = `${consumer.key}:${key}:${secret}`;
    return {
      columns: [
        {
          content: name,
          role: "rowheader",
        },
        {
          content: token,
        },
        {
          content: (
            <TableActions
              copyValue={token}
              deletePath={urls.preferences.apiKeys.delete({ id })}
              editPath={urls.preferences.apiKeys.edit({ id })}
            />
          ),
          className: "u-align--right",
        },
      ],
      key: id,
      sortData: {
        name: name,
      },
    };
  });

const APIKeyList = (): JSX.Element => {
  const errors = useSelector(tokenSelectors.errors);
  const loading = useSelector(tokenSelectors.loading);
  const loaded = useSelector(tokenSelectors.loaded);
  const tokens = useSelector(tokenSelectors.all);
  const saved = useSelector(tokenSelectors.saved);

  useAddMessage(saved, tokenActions.cleanup, "API key deleted successfully.");

  useFetchActions([tokenActions.fetch]);

  useWindowTitle(Label.Title);

  return (
    <>
      {errors && typeof errors === "string" && (
        <Notification severity="negative" title="Error:">
          {errors}
        </Notification>
      )}
      <SettingsTable
        aria-label={Label.Title}
        buttons={[
          {
            label: "Generate MAAS API key",
            url: urls.preferences.apiKeys.add,
          },
        ]}
        emptyStateMsg={Label.EmptyList}
        headers={[
          {
            content: "Name",
            sortKey: "name",
          },
          {
            content: "Key",
          },
          {
            content: "Actions",
            className: "u-align--right",
          },
        ]}
        loaded={loaded}
        loading={loading}
        rows={generateRows(tokens)}
        tableClassName="apikey-list"
      />
    </>
  );
};

export default APIKeyList;
