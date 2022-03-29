import type { ReactNode } from "react";
import { useMemo } from "react";

import type { ChipProps } from "@canonical/react-components";
import { Button, Icon, ModularTable } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TagChip from "../TagChip";

import type { Machine } from "app/store/machine/types";
import type { TagIdCountMap } from "app/store/machine/utils";
import { getTagCountsForMachines } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import tagsURLs from "app/tags/urls";

type Props = {
  machines: Machine[];
};

export enum Label {
  Automatic = "Automatic tags",
  Manual = "Currently assigned",
}

export enum Column {
  Action = "action",
  Label = "label",
  Name = "name",
  Options = "options",
}

type LabelCol = { children: ReactNode; rowSpan: number };

const generateRows = (
  tags: Tag[],
  machineCount: number,
  tagIdsAndCounts: TagIdCountMap,
  label: ReactNode,
  chipAppearance?: ChipProps["appearance"],
  onRemove?: (tag: Tag) => void,
  removeLabel?: ReactNode
) => {
  return tags.map((tag, i) => ({
    label:
      i === 0
        ? {
            children: label,
            rowSpan: tags.length,
          }
        : null,
    name: (
      <TagChip
        appearance={chipAppearance}
        machineCount={machineCount}
        tag={tag}
        tagIdsAndCounts={tagIdsAndCounts}
      />
    ),
    options: tag.kernel_opts ? <Icon name="tick" /> : null,
    action: (
      <Button
        appearance="base"
        className="is-dense u-no-margin u-no-padding"
        onClick={() => onRemove?.(tag)}
      >
        {removeLabel}
      </Button>
    ),
  }));
};

export const TagFormChanges = ({ machines }: Props): JSX.Element | null => {
  const tagIdsAndCounts = getTagCountsForMachines(machines);
  const tagIds = Array.from(tagIdsAndCounts.keys());
  const automaticTags = useSelector((state: RootState) =>
    tagSelectors.getAutomaticByIDs(state, tagIds)
  );
  const manualTags = useSelector((state: RootState) =>
    tagSelectors.getManualByIDs(state, tagIds)
  );
  const machineCount = machines.length;
  const hasAutomaticTags = automaticTags.length > 0;
  const hasManualTags = manualTags.length > 0;
  const columns = useMemo(
    () => [
      {
        accessor: Column.Label,
        // The data for this column is supplied inside a children prop so that
        // the data can also return the appropriate rowspan (used in getCellProps).
        Cell: ({ value }: { value?: LabelCol }) => value?.children || null,
        className: "label-col",
        Header: "Tag changes",
      },
      {
        accessor: Column.Name,
        className: "name-col",
        Header: "Tag name",
      },
      {
        accessor: Column.Options,
        className: "options-col u-align-text--right",
        Header: "Kernel options",
      },
      {
        accessor: Column.Action,
        className: "action-col u-align-text--right u-no-padding--right",
        Header: "Action",
      },
    ],
    []
  );
  if (!hasAutomaticTags && !hasManualTags) {
    return null;
  }

  return (
    <ModularTable
      className="tag-form__changes"
      columns={columns}
      data={[
        ...generateRows(
          manualTags,
          machineCount,
          tagIdsAndCounts,
          Label.Manual,
          "information",
          () => {
            // TODO: Implement removing tags from machines:
            // https://github.com/canonical-web-and-design/app-tribe/issues/708
          },
          <>
            <span className="u-nudge-left--small">Remove</span>
            <Icon name="delete" />
          </>
        ),
        ...generateRows(
          automaticTags,
          machineCount,
          tagIdsAndCounts,
          <>
            {Label.Automatic}
            <p className="u-text--muted u-nudge-left">
              Automatic tags (cannot be unassigned. Go to the{" "}
              <Link to={tagsURLs.tags.index}>Tags tab</Link> to delete automatic
              tags).
            </p>
          </>
        ),
      ]}
      getCellProps={(props) => {
        if (props.column.id === Column.Label) {
          if (props.value?.rowSpan) {
            // Apply the rowspan prop to those that provide the prop. This will
            // appear as the first row in each type of tag change.
            return { rowSpan: props.value?.rowSpan };
          }
          // Hide all other label columns as this space will be taken up by the
          // rowspan column.
          return { className: "p-table--cell-collapse" };
        }
        return {};
      }}
    />
  );
};

export default TagFormChanges;
