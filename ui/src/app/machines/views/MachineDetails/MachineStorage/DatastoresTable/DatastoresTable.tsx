import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { formatSize, isDatastore } from "../utils";

import type { TSFixMe } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const DatastoresTable = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (machine && "disks" in machine) {
    const rows = machine.disks.reduce<TSFixMe[]>((rows, disk) => {
      if (isDatastore(disk.filesystem)) {
        const fs = disk.filesystem;
        const rowId = `${fs.fstype}-${fs.id}`;
        rows.push({
          columns: [
            { content: disk.name },
            { content: "VMFS6" },
            { content: formatSize(disk.size) },
            { content: fs.mount_point },
            {
              content: "",
              className: "u-align--right",
            },
          ],
          key: rowId,
        });
      }
      return rows;
    }, []);

    return (
      <>
        <MainTable
          headers={[
            { content: "Name" },
            { content: "Filesystem" },
            { content: "Size" },
            { content: "Mount point" },
            {
              content: "Actions",
              className: "u-align--right",
            },
          ]}
          rows={rows}
        />
      </>
    );
  }
  return null;
};

export default DatastoresTable;
