import urls from "@/app/base/urls";
import { NodeType } from "@/app/store/types/node";
import { ContextualMenu } from "@canonical/react-components";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from "react-router";
import type { Expanded } from "@/app/domains/views/DomainDetails/ResourceRecords/ResourceRecords";

export type ResourceRecordsColumnData = {
  name: string;
  node_type: NodeType | null;
  system_id: string;
  ttl: number | null;
  data: string | null;
};

export type ResourceRecordsColumnDef = ColumnDef<
  ResourceRecordsColumnData,
  Partial<ResourceRecordsColumnData>
>;

type Props = {
  setExpanded: React.Dispatch<React.SetStateAction<Expanded | null>>;

}

const useResourceRecordsColumns = ({setExpanded}: Props) => {
  return useMemo(
    (): ResourceRecordsColumnDef[] => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({
          row: {
            original: { node_type, system_id, name },
          },
        }) => {
          switch (node_type) {
            case NodeType.MACHINE:
              return (
                <Link to={urls.machines.machine.index({ id: system_id })}>
                  {name}
                </Link>
              );
            case NodeType.DEVICE:
              return (
                <Link to={urls.devices.device.index({ id: system_id })}>
                  {name}
                </Link>
              );
            case NodeType.RACK_CONTROLLER:
            case NodeType.REGION_CONTROLLER:
            case NodeType.REGION_AND_RACK_CONTROLLER:
              return (
                <Link
                  to={urls.controllers.controller.index({
                    id: system_id,
                  })}
                >
                  {name}
                </Link>
              );
            default:
              return <>{name}</>
          }
        },
      },
      {
        accessorKey: "node_type",
        header: "Type",
      },
      {
        accessorKey: "ttl",
        header: "TTL",
        cell: ({
          row: {
            original: { ttl },
          },
        }) => ttl || "(default)",
      },
      {
        accessorKey: "data",
        header: "Data"
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: () => null
      }
    ],
    []
  );
};

export default useResourceRecordsColumns;
