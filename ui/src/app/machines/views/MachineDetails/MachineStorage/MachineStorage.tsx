import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import React from "react";

import { useSendAnalytics, useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Partition } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import AvailableStorageTable from "./AvailableStorageTable";
import FilesystemsTable from "./FilesystemsTable";

// From models/partition.py. This should ideally be available over the websocket.
// https://github.com/canonical-web-and-design/maas-ui/issues/1866
export const MIN_PARTITION_SIZE = 4 * 1024 * 1024;

export const storageDeviceInUse = (
  storageDevice: Disk | Partition
): boolean => {
  const { filesystem, type } = storageDevice;

  if (type === "cache-set") {
    return true;
  }
  if (!!filesystem) {
    return (
      (!!filesystem.is_format_fstype && !!filesystem.mount_point) ||
      !filesystem.is_format_fstype
    );
  }
  return (storageDevice as Disk).available_size < MIN_PARTITION_SIZE;
};

const MachineStorage = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const sendAnalytics = useSendAnalytics();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} storage`);

  if (machine && "disks" in machine && "special_filesystems" in machine) {
    return (
      <>
        <Strip shallow>
          <h4>Filesystems</h4>
          <FilesystemsTable
            disks={machine.disks}
            specialFilesystems={machine.special_filesystems}
          />
        </Strip>
        <Strip shallow>
          <h4>Available disks and partitions</h4>
          <AvailableStorageTable disks={machine.disks} />
        </Strip>
        <p>
          Learn more about deploying{" "}
          <a
            className="p-link--external"
            data-test="docs-footer-link"
            href="https://maas.io/docs/images"
            onClick={() =>
              sendAnalytics(
                "Machine storage",
                "Click link to MAAS docs",
                "Windows"
              )
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Windows
          </a>
        </p>
        <p>
          Change the default layout in{" "}
          <Link to="/settings/storage">Settings &rsaquo; Storage</Link>
        </p>
      </>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineStorage;
