import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import "./SSLKeyList.scss";
import { sslkey as sslkeyActions } from "app/preferences/actions";
import { sslkey as sslkeySelectors } from "app/preferences/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import SettingsTable from "app/settings/components/SettingsTable";
import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const generateRows = (
  sslkeys,
  expandedId,
  setExpandedId,
  hideExpanded,
  dispatch
) =>
  sslkeys.map(({ id, display, key }) => {
    const expanded = expandedId === id;
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          className: "u-truncate",
          content: display,
          role: "rowheader"
        },
        {
          content: (
            <TableActions copyValue={key} onDelete={() => setExpandedId(id)} />
          ),
          className: "u-align--right"
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          modelName={display}
          modelType="SSL key"
          onCancel={hideExpanded}
          onConfirm={() => {
            dispatch(sslkeyActions.delete(id));
            hideExpanded();
          }}
        />
      ),
      key: id,
      sortData: {
        key: display
      }
    };
  });

const SSLKeyList = () => {
  const [expandedId, setExpandedId] = useState();
  const sslkeyErrors = useSelector(sslkeySelectors.errors);
  const sslkeyLoading = useSelector(sslkeySelectors.loading);
  const sslkeyLoaded = useSelector(sslkeySelectors.loaded);
  const sslkeys = useSelector(sslkeySelectors.all);
  const saved = useSelector(sslkeySelectors.saved);
  const dispatch = useDispatch();

  useWindowTitle("SSL keys");

  useAddMessage(saved, sslkeyActions.cleanup, "SSL key removed successfully.");

  const hideExpanded = () => {
    setExpandedId();
  };

  useEffect(() => {
    dispatch(sslkeyActions.fetch());
  }, [dispatch]);

  return (
    <>
      {sslkeyErrors && typeof sslkeyErrors === "string" && (
        <Notification type="negative" status="Error:">
          {sslkeyErrors}
        </Notification>
      )}
      <SettingsTable
        buttons={[{ label: "Add SSL key", url: "/account/prefs/ssl-keys/add" }]}
        headers={[
          {
            content: "Key",
            sortKey: "key"
          },
          {
            content: "Actions",
            className: "u-align--right"
          }
        ]}
        loaded={sslkeyLoaded}
        loading={sslkeyLoading}
        rows={generateRows(
          sslkeys,
          expandedId,
          setExpandedId,
          hideExpanded,
          dispatch
        )}
        tableClassName="sslkey-list"
      />
    </>
  );
};

export default SSLKeyList;
