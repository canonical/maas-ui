import { MainTable } from "@canonical/react-components";
import React from "react";

import { formatBytes } from "app/utils";
import type { Disk, Filesystem, Partition } from "app/store/machine/types";

type FilesystemDetails = {
  fstype: Filesystem["fstype"];
  id: Filesystem["id"];
  mountOptions: Filesystem["mount_options"];
  mountPoint: Filesystem["mount_point"];
  name: string;
  size: number;
};

type Props = {
  disks: Disk[];
  specialFilesystems: Filesystem[];
};

/**
 * Returns whether a storage device has a mounted filesystem. If a filesystem is
 * unmounted, it will show in the "Available disks and partitions" table.
 * @param storageDevice - the storage device to check.
 * @returns whether the storage device has a mounted filesystem.
 */
const hasMountedFilesystem = (storageDevice: Disk | Partition) =>
  !!storageDevice?.filesystem?.mount_point;

/**
 * Formats a filesystem for use in the filesystems table.
 * @param filesystem - the base filesystem object.
 * @param name - the name to give the filesystem.
 * @param size - the size to give the filesystem.
 * @returns formatted filesystem object.
 */
const formatFilesystem = (
  filesystem: Filesystem,
  name: string,
  size: number
): FilesystemDetails => ({
  fstype: filesystem.fstype,
  id: filesystem.id,
  mountPoint: filesystem.mount_point,
  mountOptions: filesystem.mount_options,
  name,
  size,
});

/**
 * Returns a combined list of special filesystems, and filesystems associated
 * with disks and partitions.
 * @param disks - disks to check for filesystems
 * @param specialFilesystems - tmpfs or ramfs filesystems
 * @returns list of filesystems with extra details for use in table
 */
const getFilesystems = (
  disks: Disk[],
  specialFilesystems: Filesystem[]
): FilesystemDetails[] => {
  const filesystems = disks.reduce(
    (diskFilesystems: FilesystemDetails[], disk: Disk) => {
      if (hasMountedFilesystem(disk)) {
        diskFilesystems.push(
          formatFilesystem(disk.filesystem, disk.name, disk.size)
        );
      }

      if (disk.partitions) {
        disk.partitions.forEach((partition) => {
          if (hasMountedFilesystem(partition)) {
            diskFilesystems.push(
              formatFilesystem(
                partition.filesystem,
                partition.name,
                partition.size
              )
            );
          }
        });
      }

      return diskFilesystems;
    },
    []
  );

  specialFilesystems.forEach((fs) => {
    filesystems.push(formatFilesystem(fs, "—", 0));
  });

  return filesystems;
};

const FilesystemsTable = ({
  disks,
  specialFilesystems,
}: Props): JSX.Element => {
  const filesystems = getFilesystems(disks, specialFilesystems);

  return (
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
      rows={
        filesystems.length > 0
          ? filesystems.map((fs) => {
              const size = formatBytes(fs.size, "B");
              return {
                columns: [
                  { content: fs.name },
                  {
                    content: fs.size === 0 ? "—" : `${size.value} ${size.unit}`,
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
            })
          : [{ columns: [{ content: "No filesystems defined." }] }]
      }
      sortable
    />
  );
};

export default FilesystemsTable;
