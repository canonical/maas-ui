import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { useState } from "react";

import "./APIKeyList.scss";
import { useWindowTitle } from "app/base/hooks";
import { Button } from "@canonical/react-components";
import { Notification } from "@canonical/react-components";
import CopyButton from "app/base/components/CopyButton";
import SettingsTable from "app/settings/components/SettingsTable";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const generateRows = (
  apikeys,
  expandedId,
  setExpandedId,
  hideExpanded,
  dispatch
) =>
  apikeys.map(({ key, consumer }) => {
    const expanded = expandedId === key;
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: consumer.name,
          role: "rowheader"
        },
        {
          content: key
        },
        {
          content: (
            <>
              <CopyButton value={key} />
              <Button
                appearance="base"
                element={Link}
                to={`/account/prefs/api-keys/${key}/edit`}
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              <Button
                appearance="base"
                className="is-small u-justify-table-icon"
                onClick={() => {
                  setExpandedId(key);
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
          modelName={consumer.name}
          modelType="API key"
          onCancel={hideExpanded}
          onConfirm={() => {}}
        />
      ),
      key: key,
      sortData: {
        key,
        name: consumer.name
      }
    };
  });

const APIKeyList = () => {
  const [expandedId, setExpandedId] = useState();
  const apikeyErrors = null;
  const apikeyLoading = false;
  const apikeyLoaded = true;
  const apikeys = [
    {
      key: "aaa",
      secret: "aaa",
      consumer: {
        key: "aaa",
        name: "aaa"
      }
    },
    {
      key: "bbb",
      secret: "bbb",
      consumer: {
        key: "bbb",
        name: "bbb"
      }
    }
  ];
  const dispatch = useDispatch();

  const hideExpanded = () => {
    setExpandedId();
  };

  useWindowTitle("API keys");

  return (
    <>
      {apikeyErrors && typeof apikeyErrors === "string" && (
        <Notification type="negative" status="Error:">
          {apikeyErrors}
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
            content: "Key",
            sortKey: "key"
          },
          {
            content: "Actions",
            className: "u-align--right"
          }
        ]}
        loaded={apikeyLoaded}
        loading={apikeyLoading}
        rows={generateRows(
          apikeys,
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
