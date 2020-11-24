import React, { useState } from "react";

import { Button, MainTable, Tooltip } from "@canonical/react-components";

import { NormalisedFilesystem } from "../types";
import { formatSize } from "../utils";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

type Props = {
  editable: boolean;
  filesystems: NormalisedFilesystem[];
};

const FilesystemsTable = ({ editable, filesystems }: Props): JSX.Element => {
  const [addSpecialFormOpen, setAddSpecialFormOpen] = useState<boolean>(false);

  const closeAddSpecialForm = () => setAddSpecialFormOpen(false);

  return (
    <>
      <MainTable
        defaultSort="name"
        defaultSortDirection="ascending"
        expanding={true}
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
        <p className="u-nudge-right--small u-sv1" data-test="no-filesystems">
          No filesystems defined.
        </p>
      )}
      {editable && !addSpecialFormOpen && (
        <Tooltip message="Create a tmpfs or ramfs filesystem.">
          <Button
            appearance="neutral"
            data-test="add-special-fs-button"
            onClick={() => setAddSpecialFormOpen(true)}
          >
            Add special filesystem
          </Button>
        </Tooltip>
      )}
      {addSpecialFormOpen && (
        <AddSpecialFilesystem closeForm={closeAddSpecialForm} />
      )}
    </>
  );
};

export default FilesystemsTable;
