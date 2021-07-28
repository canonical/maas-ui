import { useEffect, useState } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import prefsURLs from "app/preferences/urls";
import SettingsTable from "app/settings/components/SettingsTable";
import { actions as tokenActions } from "app/store/token";
import tokenSelectors from "app/store/token/selectors";
import type { Token, TokenMeta, TokenState } from "app/store/token/types";

const generateRows = (
  tokens: Token[],
  expandedId: Token[TokenMeta.PK] | null,
  setExpandedId: (id: Token[TokenMeta.PK] | null) => void,
  hideExpanded: () => void,
  dispatch: Dispatch,
  saved: TokenState["saved"],
  saving: TokenState["saving"]
) =>
  tokens.map(({ consumer, id, key, secret }) => {
    const { name } = consumer;
    const expanded = expandedId === id;
    const token = `${consumer.key}:${key}:${secret}`;
    return {
      className: expanded ? "p-table__row is-active" : null,
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
              editPath={prefsURLs.apiKeys.edit({ id })}
              onDelete={() => setExpandedId(id)}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          deleted={saved}
          deleting={saving}
          modelName={name}
          modelType="API key"
          onClose={hideExpanded}
          onConfirm={() => {
            dispatch(tokenActions.delete(id));
          }}
        />
      ),
      key: id,
      sortData: {
        name: name,
      },
    };
  });

const APIKeyList = (): JSX.Element => {
  const [expandedId, setExpandedId] = useState<Token[TokenMeta.PK] | null>(
    null
  );
  const errors = useSelector(tokenSelectors.errors);
  const loading = useSelector(tokenSelectors.loading);
  const loaded = useSelector(tokenSelectors.loaded);
  const tokens = useSelector(tokenSelectors.all);
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);
  const dispatch = useDispatch();

  const hideExpanded = () => {
    setExpandedId(null);
  };

  useAddMessage(saved, tokenActions.cleanup, "API key deleted successfully.");

  useEffect(() => {
    dispatch(tokenActions.fetch());
  }, [dispatch]);

  useWindowTitle("API keys");

  return (
    <>
      {errors && typeof errors === "string" && (
        <Notification severity="negative" title="Error:">
          {errors}
        </Notification>
      )}
      <SettingsTable
        buttons={[
          {
            label: "Generate MAAS API key",
            url: prefsURLs.apiKeys.add,
          },
        ]}
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
        rows={generateRows(
          tokens,
          expandedId,
          setExpandedId,
          hideExpanded,
          dispatch,
          saved,
          saving
        )}
        tableClassName="apikey-list"
      />
    </>
  );
};

export default APIKeyList;
