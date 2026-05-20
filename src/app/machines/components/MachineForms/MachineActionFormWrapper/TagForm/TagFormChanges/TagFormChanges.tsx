import { GenericTable } from "@canonical/maas-react-components";
import { Icon } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router";

import { useSelectedTags, useUnchangedTags } from "../hooks";
import type { TagFormValues } from "../types";

import useTagFormChangesTableColumns, {
  type TagFormChangesRowData,
  filterCells,
  filterHeaders,
} from "./useTagFormChangesTableColumns";

import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import urls from "@/app/base/urls";
import type { MachineActionFormProps } from "@/app/machines/types";
import type { TagIdCountMap } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import tagSelectors from "@/app/store/tag/selectors";
import type { Tag, TagMeta } from "@/app/store/tag/types";
import { getTagCounts } from "@/app/store/tag/utils";
import { toFormikNumber } from "@/app/utils";

type Props = Pick<MachineActionFormProps, "selectedCount"> & {
  tags: Tag[];
  newTags: Tag[TagMeta.PK][];
  toggleTagDetails: (tag: Tag | null) => void;
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
  Options = "kernel options",
}

const buildRowData = (
  rowType: RowType,
  tags: Tag[],
  machineCount: number,
  tagIdsAndCounts: TagIdCountMap | null,
  toggleTagDetails: (tag: Tag | null) => void,
  newTags: Tag[TagMeta.PK][],
  chipAppearance?: TagFormChangesRowData["chipAppearance"],
  onRemove?: (tag: Tag) => void,
  removeLabel?: React.ReactNode
): TagFormChangesRowData[] => {
  let categoryLabel: Label;
  switch (rowType) {
    case RowType.Added:
      categoryLabel = Label.Added;
      break;
    case RowType.Auto:
      categoryLabel = Label.Automatic;
      break;
    case RowType.Manual:
      categoryLabel = Label.Manual;
      break;
    case RowType.Removed:
      categoryLabel = Label.Removed;
      break;
  }
  return tags.map((tag) => ({
    id: `${rowType}-${tag.id}`,
    tagId: tag.id,
    tagName: tag.name,
    category: rowType,
    categoryLabel: categoryLabel,
    kernelOpts: tag.kernel_opts,
    isNew: rowType === RowType.Added && newTags.includes(tag.id),
    chipAppearance,
    onRemove: onRemove
      ? () => {
          onRemove(tag);
        }
      : undefined,
    removeLabel,
    machineCount,
    tagIdsAndCounts,
    toggleTagDetails,
    tag,
  }));
};

export const TagFormChanges = ({
  tags,
  selectedCount,
  newTags,
  toggleTagDetails,
}: Props): React.ReactElement | null => {
  const { setFieldValue, values } = useFormikContext<TagFormValues>();
  const tagIdsAndCounts = getTagCounts(tags);
  const tagIds = tagIdsAndCounts ? Array.from(tagIdsAndCounts?.keys()) : [];
  const automaticTags = useSelector((state: RootState) =>
    tagSelectors.getAutomaticByIDs(state, tagIds)
  );
  const allManualTags = useSelector((state: RootState) =>
    tagSelectors.getManualByIDs(state, tagIds)
  );
  const machineCount = selectedCount ?? 0;
  const manualTags = useUnchangedTags(allManualTags);
  const addedTags = useSelectedTags("added");
  const removedTags = useSelectedTags("removed");
  const hasAutomaticTags = automaticTags.length > 0;
  const hasManualTags = manualTags.length > 0;
  const hasAddedTags = addedTags.length > 0;
  const hasRemovedTags = removedTags.length > 0;

  const columns = useTagFormChangesTableColumns();

  if (!hasAutomaticTags && !hasManualTags && !hasAddedTags && !hasRemovedTags) {
    return <p className="u-text--muted">{Label.NoTags}</p>;
  }

  addedTags.forEach((tag) => {
    // Added tags will be applied to all machines.
    tagIdsAndCounts?.set(tag.id, machineCount);
  });

  const data: TagFormChangesRowData[] = [
    ...buildRowData(
      RowType.Added,
      addedTags,
      machineCount,
      tagIdsAndCounts,
      toggleTagDetails,
      newTags,
      "positive",
      (tag) => {
        setFieldValue(
          "added",
          values.added.filter((id) => tag.id !== toFormikNumber(id))
        ).catch((reason: unknown) => {
          throw new FormikFieldChangeError(
            "added",
            "setFieldValue",
            reason as string
          );
        });
      },
      <>
        <span className="u-nudge-left--small">{Label.Discard}</span>
        <Icon name="close" />
      </>
    ),
    ...buildRowData(
      RowType.Removed,
      removedTags,
      machineCount,
      tagIdsAndCounts,
      toggleTagDetails,
      newTags,
      "negative",
      (tag) => {
        setFieldValue(
          "removed",
          values.removed.filter((id) => tag.id !== toFormikNumber(id))
        ).catch((reason: unknown) => {
          throw new FormikFieldChangeError(
            "removed",
            "setFieldValue",
            reason as string
          );
        });
      },
      <>
        <span className="u-nudge-left--small">{Label.Discard}</span>
        <Icon aria-hidden="true" name="close" />
      </>
    ),
    ...buildRowData(
      RowType.Manual,
      manualTags,
      machineCount,
      tagIdsAndCounts,
      toggleTagDetails,
      newTags,
      "information",
      (tag) => {
        setFieldValue(
          "removed",
          values.removed.concat([tag.id.toString()])
        ).catch((reason: unknown) => {
          throw new FormikFieldChangeError(
            "removed",
            "setFieldValue",
            reason as string
          );
        });
      },
      <>
        <span className="u-nudge-left--small">{Label.Remove}</span>
        <Icon aria-hidden="true" name="delete" />
      </>
    ),
    ...buildRowData(
      RowType.Auto,
      automaticTags,
      machineCount,
      tagIdsAndCounts,
      toggleTagDetails,
      newTags
    ),
  ];

  return (
    <>
      <GenericTable
        aria-label={Label.Table}
        className="tag-form__changes"
        columns={columns}
        data={data}
        filterCells={filterCells}
        filterHeaders={filterHeaders}
        groupBy={["categoryLabel"]}
        isLoading={false}
        noData={Label.NoTags}
        showChevron
        variant="regular"
      />
      {hasAutomaticTags && (
        <p className="u-text--muted u-nudge-right--small">
          These tags cannot be unassigned. Go to the{" "}
          <Link to={urls.tags.index}>Tags tab</Link> to manage automatic tags.
        </p>
      )}
    </>
  );
};

export default TagFormChanges;
