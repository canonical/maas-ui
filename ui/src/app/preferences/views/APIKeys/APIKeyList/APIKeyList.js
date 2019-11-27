import { Button, Notification } from "@canonical/react-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import "./APIKeyList.scss";
import { token as tokenActions } from "app/preferences/actions";
import { token as tokenSelectors } from "app/preferences/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import CopyButton from "app/base/components/CopyButton";
import SettingsTable from "app/settings/components/SettingsTable";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const generateRows = (
  tokens,
  expandedId,
  setExpandedId,
  hideExpanded,
  dispatch
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
          role: "rowheader"
        },
        {
          content: token
        },
        {
          content: (
            <>
              <CopyButton value={token} />
              <Button
                appearance="base"
                element={Link}
                to={`/account/prefs/api-keys/${id}/edit`}
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              <Button
                appearance="base"
                className="is-small u-justify-table-icon"
                onClick={() => {
                  setExpandedId(id);
                }}
              >
                <i className="p-icon--delete">Delete</i>
              </Button>
            </>
          ),
          className: "u-align--right u-align-icons--top"
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          modelName={name}
          modelType="API key"
          onCancel={hideExpanded}
          onConfirm={() => {
            dispatch(tokenActions.delete(id));
            hideExpanded();
          }}
        />
      ),
      key: id,
      sortData: {
        name: name
      }
    };
  });

const APIKeyList = () => {
  // TODO:
  // the displayed key and the copied value should be:
  // {$ token.consumer.key $}:{$ token.key $}:{$ token.secret $}
  // ALSO
  // check the responsive view.
  const [expandedId, setExpandedId] = useState();
  const errors = useSelector(tokenSelectors.errors);
  const loading = useSelector(tokenSelectors.loading);
  const loaded = useSelector(tokenSelectors.loaded);
  const tokens = useSelector(tokenSelectors.all);
  const saved = useSelector(tokenSelectors.saved);
  const dispatch = useDispatch();

  const hideExpanded = () => {
    setExpandedId();
  };

  useAddMessage(saved, tokenActions.cleanup, "API key removed successfully.");

  useEffect(() => {
    dispatch(tokenActions.fetch());
  }, [dispatch]);

  useWindowTitle("API keys");

  return (
    <>
      {errors && typeof errors === "string" && (
        <Notification type="negative" status="Error:">
          {errors}
        </Notification>
      )}
      <SettingsTable
        buttons={[
          { label: "Generate MAAS API key", url: "/account/prefs/api-keys/add" }
        ]}
        headers={[
          {
            content: "Name",
            sortKey: "name"
          },
          {
            content: "Key"
          },
          {
            content: "Actions",
            className: "u-align--right"
          }
        ]}
        loaded={loaded}
        loading={loading}
        rows={generateRows(
          tokens,
          expandedId,
          setExpandedId,
          hideExpanded,
          dispatch
        )}
        tableClassName="apikey-list"
      />
    </>
  );
};

export default APIKeyList;
