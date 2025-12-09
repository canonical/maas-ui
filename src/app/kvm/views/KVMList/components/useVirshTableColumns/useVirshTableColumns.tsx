import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DoubleRow from "@/app/base/components/DoubleRow";
import urls from "@/app/base/urls";
import CPUColumn from "@/app/kvm/components/CPUColumn";
import NameColumn from "@/app/kvm/components/NameColumn";
import PoolColumn from "@/app/kvm/components/PoolColumn";
import RAMColumn from "@/app/kvm/components/RAMColumn";
import StorageColumn from "@/app/kvm/components/StorageColumn";
import TagsColumn from "@/app/kvm/components/TagsColumn";
import VMsColumn from "@/app/kvm/components/VMsColumn";
import type { Pod } from "@/app/store/pod/types";

type VirshColumnDef = ColumnDef<Pod, Partial<Pod>>;

const useVirshTableColumns = (): VirshColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "fqdn",
        header: () => (
          <DoubleRow
            primary="Name"
            primaryTitle="Name"
            secondary="Address"
            secondaryTitle="Address"
          />
        ),
        accessorKey: "fqdn",
        enableSorting: true,
        cell: ({ row }) => (
          <NameColumn
            name={row.original.name}
            secondary={row.original.power_parameters?.power_address}
            url={urls.kvm.virsh.details.index({ id: row.original.id })}
          />
        ),
      },
      {
        id: "vms",
        header: "VMs",
        accessorKey: "vms",
        enableSorting: true,
        cell: ({ row }) => (
          <VMsColumn vms={row.original.resources.vm_count.tracked} />
        ),
      },
      {
        id: "tags",
        header: "TAGS",
        accessorKey: "tags",
        enableSorting: false,
        cell: ({ row }) => <TagsColumn tags={row.original.tags} />,
      },
      {
        id: "pools",
        header: () => (
          <DoubleRow
            primary="Resource Pool"
            primaryTitle="Resource Pool"
            secondary="AZ"
            secondaryTitle="AZ"
          />
        ),
        accessorKey: "pools",
        enableSorting: true,
        cell: ({ row }) => (
          <PoolColumn poolId={row.original.pool} zoneId={row.original.zone} />
        ),
      },
      {
        id: "cpu",
        header: "CPU CORES",
        accessorKey: "cpu",
        enableSorting: true,
        cell: ({ row }) => (
          <CPUColumn
            cores={row.original.resources.cores}
            overCommit={row.original.cpu_over_commit_ratio}
          />
        ),
      },
      {
        id: "ram",
        header: "RAM",
        accessorKey: "ram",
        enableSorting: true,
        cell: ({ row }) => (
          <RAMColumn
            memory={row.original.resources.memory}
            overCommit={row.original.memory_over_commit_ratio}
          />
        ),
      },
      {
        id: "storage",
        header: "STORAGE",
        accessorKey: "storage",
        enableSorting: true,
        cell: ({ row }) => (
          <StorageColumn
            pools={row.original.resources.storage_pools}
            storage={row.original.resources.storage}
          />
        ),
      },
    ],
    []
  );
};
export default useVirshTableColumns;
