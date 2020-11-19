import { MainTable } from "@canonical/react-components";
import React from "react";

import { NormalisedFilesystem } from "../types";
import { formatSize, formatType } from "../utils";

type Props = { datastores: NormalisedFilesystem[] };

const DatastoresTable = ({ datastores }: Props): JSX.Element => {
  return (
    <>
      <MainTable
        defaultSort="name"
        defaultSortDirection="ascending"
        headers={[
          {
            content: "Name",
            sortKey: "name",
          },
          {
            content: "Filesystem",
            sortKey: "fstype",
          },
          {
            content: "Size",
            sortKey: "size",
          },
          {
            content: "Mount point",
            sortKey: "mountPoint",
          },
          {
            content: "Actions",
            className: "u-align--right",
          },
        ]}
        rows={datastores.map((datastore) => {
          return {
            columns: [
              {
                content: <span data-test="name">{datastore.name || "—"}</span>,
              },
              {
                content: (
                  <span data-test="type">{formatType(datastore.fstype)}</span>
                ),
              },
              {
                content: (
                  <span data-test="size">{formatSize(datastore.size)}</span>
                ),
              },
              {
                content: (
                  <span data-test="mount-point">{datastore.mountPoint}</span>
                ),
              },
              {
                content: "",
                className: "u-align--right",
              },
            ],
            key: datastore.id,
            sortData: {
              mountPoint: datastore.mountPoint,
              name: datastore.name,
              size: datastore.size,
            },
          };
        })}
        sortable
      />
    </>
  );
};

export default DatastoresTable;
