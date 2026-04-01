import { useMemo } from "react";

import { ContextualMenu, Icon, Tooltip } from "@canonical/react-components";
import type { Column, ColumnDef, Header, Row } from "@tanstack/react-table";
import pluralize from "pluralize";

import { useSidePanel } from "@/app/base/side-panel-context";
import { MAAS_IO_URLS } from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";
import { DiscoveryDeleteForm } from "@/app/networkDiscovery/components";
import DeleteSource from "@/app/settings/views/Images/Sources/DeleteSource";
import EditSource from "@/app/settings/views/Images/Sources/EditSource";
import type { ImageSource } from "@/app/settings/views/Images/Sources/Sources";

type SourcesColumnDef = ColumnDef<ImageSource, Partial<ImageSource>>;

export const filterCells = (
  row: Row<ImageSource>,
  column: Column<ImageSource>
): boolean => {
  if (row.getIsGrouped()) {
    return ["type"].includes(column.id);
  } else {
    return !["type"].includes(column.id);
  }
};

export const filterHeaders = (header: Header<ImageSource, unknown>): boolean =>
  header.column.id !== "type";

const useSourcesTableColumns = (): SourcesColumnDef[] => {
  const { openSidePanel } = useSidePanel();

  return useMemo(
    () =>
      [
        {
          id: "type",
          accessorKey: "type",
          cell: ({ row }: { row: Row<ImageSource> }) => {
            return (
              <div>
                <div>
                  <strong>
                    {row.original.type === BootResourceSourceType.MAAS_IO
                      ? "MAAS Images"
                      : "Custom Images"}
                  </strong>
                </div>
                <small className="u-text--muted">
                  {pluralize("source", row.getLeafRows().length ?? 0, true)}
                </small>
              </div>
            );
          },
        },
        // TODO: add the disabled source styling and tooltip
        {
          id: "name",
          accessorKey: "name",
          enableSorting: true,
          header: "Name",
          cell: ({
            row: {
              original: { type, url },
            },
          }: {
            row: Row<ImageSource>;
          }) => {
            if (type === BootResourceSourceType.MAAS_IO) {
              return new RegExp(MAAS_IO_URLS.stable).test(url)
                ? "MAAS Stable"
                : "MAAS Candidate";
            }
            // TODO: implement the proper name return when available
            return "—";
          },
        },
        {
          id: "url",
          accessorKey: "url",
          enableSorting: true,
          header: "Source URL",
        },
        {
          id: "priority",
          accessorKey: "priority",
          enableSorting: true,
          header: () => {
            return (
              <>
                Priority
                <Tooltip
                  message="If the same image is available from several sources,
                           the image from the source with the higher priority
                           takes precedence. 1 is the highest priority."
                >
                  <Icon name="help" />
                </Tooltip>
              </>
            );
          },
        },
        {
          id: "signed",
          accessorKey: "signed",
          enableSorting: true,
          header: "Signed with GPG key",
          cell: ({
            row: {
              original: { keyring_filename, keyring_data },
            },
          }) =>
            keyring_filename?.length || keyring_data?.length ? (
              <Icon name="success-grey" />
            ) : (
              <Icon name="error-grey" />
            ),
        },
        {
          id: "actions",
          accessorKey: "id",
          enableSorting: false,
          header: "Actions",
          cell: ({ row: { original } }) => {
            return (
              <ContextualMenu
                hasToggleIcon={true}
                links={[
                  {
                    children: "Edit source...",
                    onClick: () => {
                      openSidePanel({
                        component: EditSource,
                        title: `Edit ${original.type === BootResourceSourceType.MAAS_IO ? "default" : "custom"} source`,
                        props: {
                          source: original,
                        },
                      });
                    },
                  },
                  original.type === BootResourceSourceType.MAAS_IO
                    ? {
                        children: "Disable source",
                        onClick: () => {
                          openSidePanel({
                            component: DiscoveryDeleteForm,
                            title: "Disable source",
                            props: { discovery: original },
                          });
                        },
                      }
                    : {
                        children: "Delete source...",
                        onClick: () => {
                          openSidePanel({
                            component: DeleteSource,
                            title: "Delete custom source",
                            props: { id: original.id },
                          });
                        },
                      },
                ]}
                toggleAppearance="base"
                toggleClassName="row-menu-toggle u-no-margin--bottom"
              />
            );
          },
        },
      ] as SourcesColumnDef[],
    [openSidePanel]
  );
};

export default useSourcesTableColumns;
