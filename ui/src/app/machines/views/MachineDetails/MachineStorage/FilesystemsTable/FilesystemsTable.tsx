import { MainTable } from "@canonical/react-components";
import React from "react";

import { NormalisedFilesystem } from "../types";
import { formatSize } from "../utils";

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
          return {
            columns: [
              { content: fs.name || "—" },
              {
                content: formatSize(fs.size),
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
