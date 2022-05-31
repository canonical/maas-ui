import type { ReactNode } from "react";

import { Icon, MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";

import DoubleRow from "app/base/components/DoubleRow";
import Placeholder from "app/base/components/Placeholder";
import DiskNumaNodes from "app/base/components/node/DiskNumaNodes";
import type { MachineDetails } from "app/store/machine/types";
import {
  diskAvailable,
  formatSize,
  formatType,
  partitionAvailable,
} from "app/store/utils";

type Props = {
  loadingMachineDetails?: boolean;
  machine: MachineDetails | null;
  selected: boolean;
};

const normaliseColumns = ({
  available,
  model,
  name,
  size,
  type,
}: {
  available: ReactNode;
  model: ReactNode;
  name: ReactNode;
  size: ReactNode;
  type: ReactNode;
}) => [
  { className: "name-col", content: name },
  { className: "model-col", content: model },
  { className: "type-col", content: type },
  { className: "size-col", content: size },
  { className: "available-col u-align--center", content: available },
];

export const CloneStorageTable = ({
  loadingMachineDetails = false,
  machine,
  selected,
}: Props): JSX.Element => {
  let rows: MainTableRow[] = [];

  if (loadingMachineDetails) {
    rows = Array.from(Array(4)).map(() => ({
      columns: normaliseColumns({
        available: <Placeholder>Icon</Placeholder>,
        model: (
          <DoubleRow
            primary={<Placeholder>Model</Placeholder>}
            secondary={<Placeholder>1.0.0</Placeholder>}
          />
        ),
        name: <Placeholder>Disk name</Placeholder>,
        size: <Placeholder>1.23 GB</Placeholder>,
        type: (
          <DoubleRow
            primary={<Placeholder>Disk type</Placeholder>}
            secondary={<Placeholder>X, X</Placeholder>}
          />
        ),
      }),
    }));
  } else if (machine) {
    rows = [];
    machine.disks.forEach((disk) => {
      rows.push({
        columns: normaliseColumns({
          available: (
            <Icon
              data-testid="disk-available"
              name={diskAvailable(disk) ? "tick" : "close"}
            />
          ),
          model: (
            <DoubleRow
              primary={disk.model || "—"}
              primaryTitle={disk.model}
              secondary={disk.firmware_version}
              secondaryTitle={disk.firmware_version}
            />
          ),
          name: <DoubleRow primary={disk.name} primaryTitle={disk.name} />,
          size: formatSize(disk.size),
          type: (
            <DoubleRow
              primary={formatType(disk)}
              primaryTitle={formatType(disk)}
              secondary={<DiskNumaNodes disk={disk} />}
            />
          ),
        }),
      });

      if (disk.partitions) {
        disk.partitions.forEach((partition) => {
          rows.push({
            columns: normaliseColumns({
              available: (
                <Icon
                  data-testid="partition-available"
                  name={partitionAvailable(partition) ? "tick" : "close"}
                />
              ),
              model: "—",
              name: partition.name,
              size: formatSize(partition.size),
              type: (
                <DoubleRow
                  primary={formatType(partition)}
                  primaryTitle={formatType(partition)}
                  secondary={<DiskNumaNodes disk={disk} />}
                />
              ),
            }),
          });
        });
      }
    });
  }

  return (
    <MainTable
      className={classNames("clone-table--storage", {
        "not-selected": !selected,
      })}
      emptyStateMsg={machine ? "No storage information detected." : null}
      headers={normaliseColumns({
        available: "Available",
        model: (
          <>
            <div>Model</div>
            <div>Firmware</div>
          </>
        ),
        name: "Name",
        size: "Size",
        type: (
          <>
            <div>Type</div>
            <div>NUMA node</div>
          </>
        ),
      })}
      rows={rows}
    />
  );
};

export default CloneStorageTable;
