import { useMemo, type ReactNode } from "react";

import type { ChipProps } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import TagChip from "../../TagChip";
import { type RowType, Column } from "../TagFormChanges";

import type { TagIdCountMap } from "@/app/store/machine/utils";
import type { Tag, TagMeta } from "@/app/store/tag/types";

export type TagFormChangesRowData = {
  id: string;
  tagId: Tag[TagMeta.PK];
  tagName: string;
  category: RowType;
  categoryLabel: string;
  kernelOpts: string | null;
  isNew: boolean;
  chipAppearance?: ChipProps["appearance"];
  onRemove?: () => void;
  removeLabel?: ReactNode;
  machineCount: number;
  tagIdsAndCounts: TagIdCountMap | null;
  toggleTagDetails: (tag: Tag | null) => void;
  tag: Tag;
};

const useTagFormChangesTableColumns = (): ColumnDef<
  TagFormChangesRowData,
  Partial<TagFormChangesRowData>
>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "categoryLabel",
        header: Column.Label,
        cell: ({ row: { original } }) => original.categoryLabel || null,
      },
      {
        accessorKey: "tagName",
        header: Column.Name,
        cell: ({
          row: {
            original: {
              tag,
              chipAppearance,
              isNew,
              machineCount,
              tagIdsAndCounts,
              toggleTagDetails,
            },
          },
        }) => (
          <TagChip
            appearance={chipAppearance}
            lead={isNew ? "NEW" : undefined}
            machineCount={machineCount}
            onClick={() => {
              toggleTagDetails(tag);
            }}
            tag={tag}
            tagIdsAndCounts={tagIdsAndCounts}
          />
        ),
      },
      {
        accessorKey: "kernelOpts",
        header: Column.Options,
        cell: ({
          row: {
            original: { kernelOpts },
          },
        }) => (kernelOpts ? <Icon aria-label="ticked" name="tick" /> : null),
      },
      {
        accessorKey: "id",
        header: Column.Action,
        enableSorting: false,
        cell: ({
          row: {
            original: { onRemove, removeLabel },
          },
        }) =>
          onRemove && removeLabel ? (
            <Button
              appearance="base"
              className="is-dense u-no-margin u-no-padding"
              onClick={onRemove}
              type="button"
            >
              {removeLabel}
            </Button>
          ) : null,
      },
    ],
    []
  );
};

export default useTagFormChangesTableColumns;
