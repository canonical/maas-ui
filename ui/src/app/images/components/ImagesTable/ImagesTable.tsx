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
    columns: [
      {
        className: "release-col",
        content: image.title,
        "data-testid": "new-image-title",
      },
      { className: "arch-col", content: image.arch },
      { className: "size-col", content: "—" },
      {
        className: "status-col",
        content: (
          <DoubleRow
            data-testid="new-image-status"
            icon={<Icon name="pending" />}
            primary="Selected for download"
          />
        ),
      },
      {
        className: "actions-col u-align--right",
        content: onClear ? (
          <TableActions
            clearDisabled={!canBeCleared}
            clearTooltip={
              !canBeCleared
                ? "At least one architecture must be selected for the default commissioning release."
                : null
            }
            data-testid="image-clear"
            onClear={onClear}
          />
        ) : (
          ""
        ),
      },
    ],
    key: `${image.os}-${image.release}-${image.arch}-${image.resourceId}`,
    sortData: {
      arch: image.arch,
      title: image.title,
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
    statusIcon = <Icon name="error" />;
    statusText = "Will be deleted";
  } else if (resource.complete) {
    statusIcon = <Icon name="success" />;
  }

  return {
    className: classNames("p-table__row", {
      "is-active": isExpanded,
    }),
    columns: [
      { className: "release-col", content: resource.title },
      { className: "arch-col", content: resource.arch },
      { className: "size-col", content: resource.size },
      {
        className: "status-col",
        content: (
          <DoubleRow
            data-testid="resource-status"
            icon={statusIcon}
            primary={statusText}
          />
        ),
      },
      {
        className: "actions-col u-align--right",
        content: (
          <TableActions
            data-testid="image-actions"
            deleteDisabled={!canBeDeleted}
            deleteTooltip={
              !canBeDeleted
                ? "Cannot delete images of the default commissioning release."
                : null
            }
            onDelete={() => setExpanded(resource.id)}
          />
        ),
      },
    ],
    expanded: isExpanded,
    expandedContent: isExpanded ? (
      <DeleteImageConfirm
        closeForm={() => setExpanded(null)}
        resource={resource}
      />
    ) : null,
    key: `resource-${resource.id}`,
    sortData: {
      arch: resource.arch,
      size: resource.size,
      status: resource.status,
      title: resource.title,
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
      className="images-table p-table-expanding--light"
      defaultSort="title"
      defaultSortDirection="descending"
      emptyStateMsg="No images have been selected."
      expanding
      headers={[
        { className: "release-col", content: "Release", sortKey: "title" },
        { className: "arch-col", content: "Architecture", sortKey: "arch" },
        { className: "size-col", content: "Size", sortKey: "size" },
        {
          className: "status-col",
          content: <span className="u-nudge-right--large">Status</span>,
          sortKey: "status",
        },
        { className: "actions-col u-align--right", content: "Actions" },
      ]}
      rows={rows}
      sortable
    />
  );
};

export default ImagesTable;
