import type { ReactElement } from "react";

import { GenericTable } from "@canonical/maas-react-components";

import { useControllerVLANsTable } from "./hooks";

import useControllerVLANsTableColumns from "@/app/controllers/views/ControllerDetails/ControllerVLANs/ControllerVLANsTable/useControllerVLANsTableColumns/useControllerVLANsTableColumns";
import type { Controller, ControllerMeta } from "@/app/store/controller/types";

import "./_index.scss";

type ControllerVLANsTableProps = {
  systemId: Controller[ControllerMeta.PK];
};

const ControllerVLANsTable = ({
  systemId,
}: ControllerVLANsTableProps): ReactElement => {
  const { data, loaded } = useControllerVLANsTable({ systemId });

  const columns = useControllerVLANsTableColumns();

  return (
    <GenericTable
      aria-label="Controller VLANs"
      className="controller-vlans-table"
      columns={columns}
      data={data}
      filterCells={(row, column) =>
        row.getIsGrouped()
          ? ["fabric"].includes(column.id)
          : !["fabric"].includes(column.id)
      }
      filterHeaders={(header) => !["fabric"].includes(header.column.id)}
      groupBy={["fabric"]}
      isLoading={!loaded}
      noData="No VLANs found."
      showChevron
      variant="full-height"
    />
  );
};

export default ControllerVLANsTable;
