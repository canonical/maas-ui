import { MainTable } from "@canonical/react-components";
import React from "react";

import { formatBytes } from "app/utils";
import { NormalisedFilesystem } from "../types";

type Props = { filesystems: NormalisedFilesystem[] };

const FilesystemsTable = ({ filesystems }: Props): JSX.Element => {
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
            content: "Size",
            sortKey: "size",
          },
          {
            content: "Filesystem",
            sortKey: "fstype",
          },
          {
            content: "Mount point",
            sortKey: "mountPoint",
          },
          {
            content: "Mount options",
          },
          {
            content: "Actions",
            className: "u-align--right",
          },
        ]}
        rows={filesystems.map((fs) => {
          const size = fs.size && formatBytes(fs.size, "B");
          return {
            columns: [
              { content: fs.name || "—" },
              {
                content: size ? `${size.value} ${size.unit}` : "—",
              },
              { content: fs.fstype },
              { content: fs.mountPoint },
              { content: fs.mountOptions },
              {
                content: "",
                className: "u-align--right",
              },
            ],
            key: fs.id,
            sortData: {
              mountPoint: fs.mountPoint,
              name: fs.name,
              size: fs.size,
              fstype: fs.fstype,
            },
          };
        })}
        sortable
      />
      {filesystems.length === 0 && (
        <div className="u-nudge-right--small" data-test="no-filesystems">
          No filesystems defined.
        </div>
      )}
    </>
  );
};

export default FilesystemsTable;
