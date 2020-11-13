import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import React from "react";

import { scriptStatus } from "app/base/enum";
import { useSendAnalytics, useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import { filtersToQueryString } from "app/machines/search";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import type { NormalisedStorageDevice as StorageDevice } from "./types";
import { separateStorageData } from "./utils";
import AvailableStorageTable from "./AvailableStorageTable";
import FilesystemsTable from "./FilesystemsTable";
import UsedStorageTable from "./UsedStorageTable";

export const formatTags = (tags: StorageDevice["tags"]): JSX.Element[] =>
  tags.map((tag, i) => {
    const filter = filtersToQueryString({ storage_tags: `=${tag}` });
    return (
      <span key={tag}>
        <Link to={`/machines${filter}`}>{tag}</Link>
        {i !== tags.length - 1 && ", "}
      </span>
    );
  });

export const formatTestStatus = (
  testStatus: StorageDevice["testStatus"]
): JSX.Element => {
  switch (testStatus) {
    case scriptStatus.PENDING:
      return <i className="p-icon--pending"></i>;
    case scriptStatus.RUNNING:
    case scriptStatus.APPLYING_NETCONF:
    case scriptStatus.INSTALLING:
      return <i className="p-icon--running"></i>;
    case scriptStatus.PASSED:
      return (
        <>
          <i className="p-icon--success is-inline"></i>
          <span>OK</span>
        </>
      );
    case scriptStatus.FAILED:
    case scriptStatus.ABORTED:
    case scriptStatus.DEGRADED:
    case scriptStatus.FAILED_APPLYING_NETCONF:
    case scriptStatus.FAILED_INSTALLING:
      return (
        <>
          <i className="p-icon--error is-inline"></i>
          <span>Error</span>
        </>
      );
    case scriptStatus.TIMEDOUT:
      return (
        <>
          <i className="p-icon--timed-out is-inline"></i>
          <span>Timed out</span>
        </>
      );
    case scriptStatus.SKIPPED:
      return (
        <>
          <i className="p-icon--warning is-inline"></i>
          <span>Skipped</span>
        </>
      );
    default:
      return (
        <>
          <i className="p-icon--power-unknown is-inline"></i>
          <span>Unknown</span>
        </>
      );
  }
};

export const formatType = (
  type: StorageDevice["type"],
  parentType?: StorageDevice["parentType"]
): string => {
  let typeToFormat = type;
  if (type === "virtual" && !!parentType) {
    if (parentType === "lvm-vg") {
      return "Logical volume";
    } else if (parentType.includes("raid-")) {
      return `RAID ${parentType.split("-")[1]}`;
    }
    typeToFormat = parentType;
  }

  switch (typeToFormat) {
    case "iscsi":
      return "ISCSI";
    case "lvm-vg":
      return "Volume group";
    case "partition":
      return "Partition";
    case "physical":
      return "Physical";
    case "virtual":
      return "Virtual";
    default:
      return type;
  }
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
    const { available, filesystems, used } = separateStorageData(
      machine.disks,
      machine.special_filesystems
    );

    return (
      <>
        <Strip shallow>
          <h4>Filesystems</h4>
          <FilesystemsTable filesystems={filesystems} />
        </Strip>
        <Strip shallow>
          <h4>Available disks and partitions</h4>
          <AvailableStorageTable storageDevices={available} />
        </Strip>
        <Strip shallow>
          <h4>Used disks and partitions</h4>
          <UsedStorageTable storageDevices={used} />
        </Strip>
        <Strip shallow>
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
        </Strip>
      </>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineStorage;
