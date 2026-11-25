import { useMemo } from "react";

import { Icon } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import CodeBlock from "@/app/base/components/CodeBlock";
import type { HardeningRequirement } from "@/app/settings/views/Security/HardeningStatus/utils";

type HardeningStatusColumnDef = ColumnDef<
  HardeningRequirement,
  Partial<HardeningRequirement>
>;

const useHardeningStatusTableColumns = (): HardeningStatusColumnDef[] =>
  useMemo(
    () => [
      {
        id: "configKey",
        accessorKey: "configKey",
        enableSorting: true,
        header: "Requirement",
        cell: ({ row: { original } }) => original.configKey || <>&mdash;</>,
      },
      {
        id: "status",
        accessorKey: "id",
        enableSorting: false,
        header: "Status",
        cell: () => (
          <span>
            <Icon name="error" /> Not met
          </span>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        enableSorting: false,
        header: "Details",
        cell: ({ row: { original } }) => original.description || <>&mdash;</>,
      },
      {
        id: "command",
        accessorKey: "command",
        enableSorting: false,
        header: "Resolution",
        cell: ({ row: { original } }) =>
          original.command ? (
            <div className="hardening-status-table__command">
              <CodeBlock
                appearance="linux-prompt"
                className="hardening-status-table__command-snippet u-no-margin--bottom"
                copyable
              >
                {original.command}
              </CodeBlock>
            </div>
          ) : (
            <>&mdash;</>
          ),
      },
    ],
    []
  );

export default useHardeningStatusTableColumns;
