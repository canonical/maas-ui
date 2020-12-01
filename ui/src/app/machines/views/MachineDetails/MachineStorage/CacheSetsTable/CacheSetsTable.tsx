import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { formatSize, isCacheSet } from "../utils-new";

import type { TSFixMe } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const CacheSetsTable = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (machine && "disks" in machine) {
    const rows = machine.disks.reduce<TSFixMe[]>((rows, disk) => {
      if (isCacheSet(disk)) {
        const rowId = `${disk.type}-${disk.id}`;
        rows.push({
          columns: [
            { content: disk.name },
            { content: formatSize(disk.size) },
            { content: disk.used_for },
            { content: "" },
          ],
          key: rowId,
        });
      }
      return rows;
    }, []);

    return (
      <MainTable
        headers={[
          { content: "Name" },
          { content: "Size" },
          { content: "Used for" },
          {
            className: "u-align--right",
            content: "Actions",
          },
        ]}
        rows={rows}
      />
    );
  }
  return null;
};

export default CacheSetsTable;
