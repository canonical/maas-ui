import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { useState } from "react";

import "./APIKeyList.scss";
import Button from "app/base/components/Button";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Notification from "app/base/components/Notification";
import CopyButton from "app/base/components/CopyButton";
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

  return (
    <>
      {apikeyErrors && typeof apikeyErrors === "string" && (
        <Notification type="negative" status="Error:">
          {apikeyErrors}
        </Notification>
      )}
      {apikeyLoading && <Loader text="Loading..." />}
      <div className="p-table-actions">
        <div className="p-table-actions__space-left"></div>
        <Button element={Link} to="/account/prefs/api-keys/add">
          Generate MAAS API key
        </Button>
      </div>
      {apikeyLoaded && (
        <MainTable
          className="p-table-expanding--light apikey-list"
          expanding={true}
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
          paginate={20}
          rows={generateRows(
            apikeys,
            expandedId,
            setExpandedId,
            hideExpanded,
            dispatch
          )}
          sortable={true}
        />
      )}
    </>
  );
};

export default APIKeyList;
