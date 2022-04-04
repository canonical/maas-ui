import type { ReactNode } from "react";
import { useState, useMemo } from "react";

import type { ChipProps } from "@canonical/react-components";
import { Modal, Button, Icon, ModularTable } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import usePortal from "react-useportal";

import TagChip from "../TagChip";
import { useSelectedTags } from "../hooks";
import type { TagFormValues } from "../types";

import type { Machine } from "app/store/machine/types";
import type { TagIdCountMap } from "app/store/machine/utils";
import { getTagCountsForMachines } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import TagDetails from "app/tags/components/TagDetails";
import tagsURLs from "app/tags/urls";
import { toFormikNumber } from "app/utils";

type Props = {
  machines: Machine[];
};

export enum Label {
  Table = "Tag changes",
  Added = "To be added",
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
  toggleTagDetails: (tag: Tag | null) => void,
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

export const TagFormChanges = ({ machines }: Props): JSX.Element | null => {
  const { setFieldValue, values } = useFormikContext<TagFormValues>();
  const [tagDetails, setTagDetails] = useState<Tag | null>(null);
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const toggleTagDetails = (tag: Tag | null) => {
    // usePortal was originally design to work with click events, so to open the
    // portal programmatically we need to fake the event. This workaround can be
    // removed when this issue is resolved:
    // https://github.com/alex-cory/react-useportal/issues/36
    const NULL_EVENT = { currentTarget: { contains: () => false } };
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
  const manualTags = useSelector((state: RootState) =>
    tagSelectors.getManualByIDs(state, tagIds)
  );
  const addedTags = useSelectedTags();
  const machineCount = machines.length;
  const hasAutomaticTags = automaticTags.length > 0;
  const hasManualTags = manualTags.length > 0;
  const hasAddedTags = addedTags.length > 0;
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
  if (!hasAutomaticTags && !hasManualTags && !hasAddedTags) {
    return null;
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
            addedTags,
            machineCount,
            tagIdsAndCounts,
            Label.Added,
            toggleTagDetails,
            "positive",
            (tag) => {
              setFieldValue(
                "tags",
                values.tags.filter((id) => tag.id !== toFormikNumber(id))
              );
            },
            <>
              <span className="u-nudge-left--small">Discard</span>
              <Icon name="close" />
            </>
          ),
          ...generateRows(
            manualTags,
            machineCount,
            tagIdsAndCounts,
            Label.Manual,
            toggleTagDetails,
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
            Label.Automatic,
            toggleTagDetails
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
      {hasAutomaticTags && (
        <p className="u-text--muted u-nudge-right--small">
          These tags cannot be unassigned. Go to the{" "}
          <Link to={tagsURLs.tags.index}>Tags tab</Link> to manage automatic
          tags.
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
