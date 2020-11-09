import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import React from "react";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import FilesystemsTable from "./FilesystemsTable";

const MachineStorage = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} storage`);

  if (machine && "disks" in machine && "special_filesystems" in machine) {
    return (
      <>
        <h4>Filesystems</h4>
        <FilesystemsTable
          disks={machine.disks}
          specialFilesystems={machine.special_filesystems}
        />
      </>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineStorage;
