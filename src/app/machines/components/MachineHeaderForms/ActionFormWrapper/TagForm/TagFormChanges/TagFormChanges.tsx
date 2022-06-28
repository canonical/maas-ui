import type { ReactNode } from "react";
import { useState, useMemo } from "react";

import type { ChipProps } from "@canonical/react-components";
import { Modal, Button, Icon, ModularTable } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";
import usePortal from "react-useportal";

import TagChip from "../TagChip";
import { useSelectedTags, useUnchangedTags } from "../hooks";
import type { TagFormValues } from "../types";

import { NULL_EVENT } from "app/base/constants";
import type { Machine } from "app/store/machine/types";
import type { TagIdCountMap } from "app/store/machine/utils";
import { getTagCountsForMachines } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import TagDetails from "app/tags/components/TagDetails";
import tagsURLs from "app/tags/urls";
import { toFormikNumber } from "app/utils";

type Props = {
  machines: Machine[];
  newTags: Tag[TagMeta.PK][];
};

export enum Label {
  Added = "To be added",
  Automatic = "Automatic tags",
  Discard = "Discard",
  Manual = "Currently assigned",
  Remove = "Remove",
  Removed = "To be removed",
  Table = "Tag changes",
  NoTags = "No tags are currently assigned to the selected machines.",
}

export enum RowType {
  Added = "added",
  Auto = "auto",
  Manual = "manual",
  Removed = "removed",
}

export enum Column {
  Action = "action",
  Label = "label",
  Name = "name",
  Options = "options",
}

type LabelCol = {
  children?: ReactNode;
  rowSpan?: number;
  row: {
    "aria-label": Label;
    "data-testid": RowType;
  };
};

const generateRows = (
  rowType: string,
  tags: Tag[],
  machineCount: number,
  tagIdsAndCounts: TagIdCountMap,
  label: ReactNode,
  toggleTagDetails: (tag: Tag | null) => void,
  newTags: Tag[TagMeta.PK][],
  chipAppearance?: ChipProps["appearance"],
  onRemove?: (tag: Tag) => void,
  removeLabel?: ReactNode
) => {
  return tags.map((tag, i) => ({
    label: {
      children: i === 0 ? label : null,
      rowSpan: i === 0 ? tags.length : null,
      row: {
        "aria-label": tag.name,
        "data-testid": rowType,
      },
    },
    name: (
      <TagChip
        appearance={chipAppearance}
        lead={
          rowType === RowType.Added && newTags.includes(tag.id)
            ? "NEW"
            : undefined
        }
        machineCount={machineCount}
        onClick={() => toggleTagDetails(tag)}
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
        type="button"
      >
        {removeLabel}
      </Button>
    ),
  }));
};

export const TagFormChanges = ({
  machines,
  newTags,
}: Props): JSX.Element | null => {
  const { setFieldValue, values } = useFormikContext<TagFormValues>();
  const [tagDetails, setTagDetails] = useState<Tag | null>(null);
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const toggleTagDetails = (tag: Tag | null) => {
    setTagDetails(tag);
    if (tag) {
      openPortal(NULL_EVENT);
    } else {
      closePortal(NULL_EVENT);
    }
  };
  const tagIdsAndCounts = getTagCountsForMachines(machines);
  const tagIds = Array.from(tagIdsAndCounts.keys());
  const automaticTags = useSelector((state: RootState) =>
    tagSelectors.getAutomaticByIDs(state, tagIds)
  );
  const allManualTags = useSelector((state: RootState) =>
    tagSelectors.getManualByIDs(state, tagIds)
  );
  const manualTags = useUnchangedTags(allManualTags);
  const addedTags = useSelectedTags("added");
  const removedTags = useSelectedTags("removed");
  const machineCount = machines.length;
  const hasAutomaticTags = automaticTags.length > 0;
  const hasManualTags = manualTags.length > 0;
  const hasAddedTags = addedTags.length > 0;
  const hasRemovedTags = removedTags.length > 0;
  const columns = useMemo(
    () => [
      {
        accessor: Column.Label,
        // The data for this column is supplied inside a children prop so that
        // the data can also return the appropriate rowspan (used in getCellProps).
        Cell: ({ value }: { value: LabelCol }) => value.children || null,
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
  if (!hasAutomaticTags && !hasManualTags && !hasAddedTags && !hasRemovedTags) {
    return <p className="u-text--muted">{Label.NoTags}</p>;
  }
  addedTags.forEach((tag) => {
    // Added tags will be applied to all machines.
    tagIdsAndCounts.set(tag.id, machineCount);
  });
  return (
    <>
      <ModularTable
        aria-label={Label.Table}
        className="tag-form__changes"
        columns={columns}
        data={[
          ...generateRows(
            RowType.Added,
            addedTags,
            machineCount,
            tagIdsAndCounts,
            Label.Added,
            toggleTagDetails,
            newTags,
            "positive",
            (tag) => {
              setFieldValue(
                "added",
                values.added.filter((id) => tag.id !== toFormikNumber(id))
              );
            },
            <>
              <span className="u-nudge-left--small">{Label.Discard}</span>
              <Icon name="close" />
            </>
          ),
          ...generateRows(
            RowType.Removed,
            removedTags,
            machineCount,
            tagIdsAndCounts,
            Label.Removed,
            toggleTagDetails,
            newTags,
            "negative",
            (tag) => {
              setFieldValue(
                "removed",
                values.removed.filter((id) => tag.id !== toFormikNumber(id))
              );
            },
            <>
              <span className="u-nudge-left--small">{Label.Discard}</span>
              <Icon aria-hidden="true" name="close" />
            </>
          ),
          ...generateRows(
            RowType.Manual,
            manualTags,
            machineCount,
            tagIdsAndCounts,
            Label.Manual,
            toggleTagDetails,
            newTags,
            "information",
            (tag) => {
              setFieldValue(
                "removed",
                values.removed.concat([tag.id.toString()])
              );
            },
            <>
              <span className="u-nudge-left--small">{Label.Remove}</span>
              <Icon aria-hidden="true" name="delete" />
            </>
          ),
          ...generateRows(
            RowType.Auto,
            automaticTags,
            machineCount,
            tagIdsAndCounts,
            Label.Automatic,
            toggleTagDetails,
            newTags
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
        getRowProps={(row) => row.values.label.row}
      />
      {hasAutomaticTags && (
        <p className="u-text--muted u-nudge-right--small">
          These tags cannot be unassigned. Go to the{" "}
          <Link to={tagsURLs.index}>Tags tab</Link> to manage automatic tags.
        </p>
      )}
      {isOpen && tagDetails ? (
        <Portal>
          <Modal
            className="tag-form__modal"
            close={() => toggleTagDetails(null)}
            title={tagDetails.name}
          >
            <TagDetails id={tagDetails.id} narrow />
          </Modal>
        </Portal>
      ) : null}
    </>
  );
};

export default TagFormChanges;
