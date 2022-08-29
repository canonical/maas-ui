import { useState } from "react";

import { Icon, MainTable, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import { useSelector } from "react-redux";

import DeleteImageConfirm from "./DeleteImageConfirm";

import DoubleRow from "app/base/components/DoubleRow";
import TableActions from "app/base/components/TableActions";
import type { ImageValue } from "app/images/types";
import type { BootResource } from "app/store/bootresource/types";
import { splitResourceName } from "app/store/bootresource/utils";
import configSelectors from "app/store/config/selectors";

type Props = {
  handleClear?: (image: ImageValue) => void;
  images: ImageValue[];
  resources: BootResource[];
};

export enum Labels {
  Table = "Images",
  Pending = "pending",
  Success = "success",
  Error = "error",
  Selected = "Selected for download",
  CannotBeCleared = "At least one architecture must be selected for the default commissioning release.",
  WillBeDeleted = "Will be deleted",
  CannotDelete = "Cannot delete images of the default commissioning release.",
  EmptyState = "No images have been selected.",
  DeleteImageConfirm = "Confirm image deletion",
}

/**
 * Check whether a given resource matches a form image value.
 * @param resource - the resource to check.
 * @param image - the form image value to check against.
 * @returns resource matches form image value.
 */
const resourceMatchesImage = (
  resource: BootResource,
  image: ImageValue
): boolean => image.resourceId === resource.id;

/**
 * Generates a row based on a form image value.
 * @param image - the image value from which to generate the row.
 * @param onClear - function to clear the selected image from selection.
 * @returns row generated from form image value.
 */
const generateImageRow = (
  image: ImageValue,
  onClear: (() => void) | null,
  canBeCleared: boolean
) => {
  return {
    "aria-label": image.title,
    columns: [
      {
        content: image.title,
        className: "release-col",
        "data-testid": "new-image-title",
      },
      { content: image.arch, className: "arch-col" },
      { content: "—", className: "size-col" },
      {
        content: (
          <DoubleRow
            data-testid="new-image-status"
            icon={<Icon aria-label={Labels.Pending} name={Labels.Pending} />}
            primary={Labels.Selected}
          />
        ),
        className: "status-col",
      },
      {
        content: onClear ? (
          <TableActions
            clearDisabled={!canBeCleared}
            clearTooltip={!canBeCleared ? Labels.CannotBeCleared : null}
            data-testid="image-clear"
            onClear={onClear}
          />
        ) : (
          ""
        ),
        className: "actions-col u-align--right",
      },
    ],
    key: `${image.os}-${image.release}-${image.arch}-${image.resourceId}`,
    sortData: {
      title: image.title,
      arch: image.arch,
    },
  };
};
/**
 * Generates a row based on a resource.
 * @param resource - the resource from which to generate the row.
 * @param commissioningRelease - the name of the default commissioning release.
 * @param expanded - the resource id of the expanded row.
 * @param setExpanded - function to expand the row of a resource.
 * @param unchecked - whether the resource checkbox is unchecked.
 * @returns row generated from resource.
 */
const generateResourceRow = (
  resource: BootResource,
  commissioningRelease: string | null,
  expanded: BootResource["id"] | null,
  setExpanded: (id: BootResource["id"] | null) => void,
  unchecked = false
) => {
  const { os, release } = splitResourceName(resource.name);
  const canBeDeleted = !(os === "ubuntu" && release === commissioningRelease);
  const isExpanded = expanded === resource.id;
  let statusIcon = <Spinner />;
  let statusText = resource.status;

  if (unchecked) {
    statusIcon = <Icon aria-label={Labels.Error} name={Labels.Error} />;
    statusText = Labels.WillBeDeleted;
  } else if (resource.complete) {
    statusIcon = <Icon aria-label={Labels.Success} name={Labels.Success} />;
  }

  return {
    "aria-label": resource.title,
    className: classNames("p-table__row", {
      "is-active": isExpanded,
    }),
    columns: [
      { content: resource.title, className: "release-col" },
      { content: resource.arch, className: "arch-col" },
      { content: resource.size, className: "size-col" },
      {
        content: (
          <DoubleRow
            data-testid="resource-status"
            icon={statusIcon}
            primary={statusText}
          />
        ),
        className: "status-col",
      },
      {
        content: (
          <TableActions
            data-testid="image-actions"
            deleteDisabled={!canBeDeleted}
            deleteTooltip={!canBeDeleted ? Labels.CannotDelete : null}
            onDelete={() => setExpanded(resource.id)}
          />
        ),
        className: "actions-col u-align--right",
      },
    ],
    expanded: isExpanded,
    expandedContent: isExpanded ? (
      <div aria-label={Labels.DeleteImageConfirm}>
        <DeleteImageConfirm
          closeForm={() => setExpanded(null)}
          resource={resource}
        />
      </div>
    ) : null,
    key: `resource-${resource.id}`,
    sortData: {
      title: resource.title,
      arch: resource.arch,
      size: resource.size,
      status: resource.status,
    },
  };
};

const ImagesTable = ({
  handleClear,
  images,
  resources,
}: Props): JSX.Element => {
  const commissioningRelease = useSelector(
    configSelectors.commissioningDistroSeries
  );
  const [expanded, setExpanded] = useState<BootResource["id"] | null>(null);
  const isCommissioningImage = (image: ImageValue) =>
    image.os === "ubuntu" && image.release === commissioningRelease;
  // Resources set for deletion are those that exist in the database, but do not
  // exist in the form's images value, i.e. the checkbox was unchecked.
  const uncheckedResources = resources.filter((resource) =>
    images.every((image) => !resourceMatchesImage(resource, image))
  );
  const rows = images
    .map((image) => {
      const resource = resources.find((resource) =>
        resourceMatchesImage(resource, image)
      );
      if (resource) {
        return generateResourceRow(
          resource,
          commissioningRelease,
          expanded,
          setExpanded,
          false
        );
      } else {
        const commissioningImages = images.filter(isCommissioningImage);
        const canBeCleared = !(
          isCommissioningImage(image) && commissioningImages.length === 1
        );
        const onClear = handleClear ? () => handleClear(image) : null;
        return generateImageRow(image, onClear, canBeCleared);
      }
    })
    .concat(
      uncheckedResources.map((resource) =>
        generateResourceRow(
          resource,
          commissioningRelease,
          expanded,
          setExpanded,
          true
        )
      )
    );

  return (
    <MainTable
      aria-label={Labels.Table}
      className="images-table p-table-expanding--light"
      defaultSort="title"
      defaultSortDirection="descending"
      emptyStateMsg={Labels.EmptyState}
      expanding
      headers={[
        { content: "Release", className: "release-col", sortKey: "title" },
        { content: "Architecture", className: "arch-col", sortKey: "arch" },
        { content: "Size", className: "size-col", sortKey: "size" },
        {
          content: <span className="u-nudge-right--large">Status</span>,
          className: "status-col",
          sortKey: "status",
        },
        { content: "Actions", className: "actions-col u-align--right" },
      ]}
      rows={rows}
      sortable
    />
  );
};

export default ImagesTable;
