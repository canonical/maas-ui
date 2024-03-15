import { Icon, MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "@/app/base/components/DoubleRow";
import TableActions from "@/app/base/components/TableActions";
import TooltipButton from "@/app/base/components/TooltipButton/TooltipButton";
import { useSidePanel } from "@/app/base/side-panel-context";
import { ImageSidePanelViews } from "@/app/images/constants";
import type { ImageSetSidePanelContent, ImageValue } from "@/app/images/types";
import type { BootResource } from "@/app/store/bootresource/types";
import { splitResourceName } from "@/app/store/bootresource/utils";
import configSelectors from "@/app/store/config/selectors";
import { sizeStringToNumber } from "@/app/utils/formatBytes";
import { getTimeDistanceString, parseUtcDatetime } from "@/app/utils/time";

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
  CannotDeleteDefault = "Cannot delete images of the default commissioning release.",
  CannotDeleteImporting = "Cannot delete images that are currently being imported.",
  EmptyState = "No images have been selected.",
  DeleteImageConfirm = "Confirm image deletion",
  LastDeployed = "Last deployed",
  MachineCount = "Machine count",
}

const EphemeralSupportIcon = ({
  canDeployToMemory,
}: {
  canDeployToMemory: boolean | null;
}) => {
  return canDeployToMemory ? (
    <TooltipButton
      iconName="task-outstanding"
      iconProps={{ "aria-label": "supported" }}
      message="This image can be deployed in memory."
    />
  ) : (
    <TooltipButton
      iconName="close"
      iconProps={{ "aria-label": "not supported" }}
      message="This image cannot be deployed in memory."
    />
  );
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
    "aria-label": image.title,
    columns: [
      {
        content: image.title,
        className: "release-col",
        "data-testid": "new-image-title",
      },
      { content: image.arch, className: "arch-col" },
      { content: "—", className: "size-col" },
      { content: "—", className: "diskless-col" },
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
        content: "—",
        className: "last-deployed-col",
      },
      {
        content: "—",
        className: "machines-col",
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
 * @param unchecked - whether the resource checkbox is unchecked.
 * @returns row generated from resource.
 */
const generateResourceRow = ({
  resource,
  commissioningRelease,
  unchecked,
  setSidePanelContent,
}: {
  resource: BootResource;
  commissioningRelease: string | null;
  unchecked: boolean;
  setSidePanelContent: ImageSetSidePanelContent;
}) => {
  const { os, release } = splitResourceName(resource.name);
  const isCommissioningImage =
    os === "ubuntu" && release === commissioningRelease;
  const canBeDeleted = !isCommissioningImage && resource.complete;
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
    className: "p-table__row",
    columns: [
      { content: resource.title, className: "release-col" },
      { content: resource.arch, className: "arch-col" },
      { content: resource.size, className: "size-col" },
      {
        content: (
          <EphemeralSupportIcon
            canDeployToMemory={resource.canDeployToMemory}
          />
        ),
        className: "diskless-col",
      },
      {
        content: (
          <DoubleRow
            data-testid="resource-status"
            icon={statusIcon}
            primary={statusText}
            secondary={resource.lastUpdate ? resource.lastUpdate : "—"}
          />
        ),
        className: "status-col",
      },
      {
        content: resource.lastDeployed ? (
          <DoubleRow
            primary={getTimeDistanceString(resource.lastDeployed)}
            secondary={resource.lastDeployed}
          />
        ) : (
          "—"
        ),
        className: "last-deployed-col",
      },
      {
        content: `${resource.machineCount || "—"}`,
        className: "machines-col",
      },
      {
        content: (
          <TableActions
            data-testid="image-actions"
            deleteDisabled={!canBeDeleted}
            deleteTooltip={
              !canBeDeleted
                ? isCommissioningImage
                  ? Labels.CannotDeleteDefault
                  : Labels.CannotDeleteImporting
                : null
            }
            onDelete={() =>
              setSidePanelContent({
                view: ImageSidePanelViews.DELETE_IMAGE,
                extras: {
                  bootResource: resource,
                },
              })
            }
          />
        ),
        className: "actions-col u-align--right",
      },
    ],
    key: `resource-${resource.id}`,
    sortData: {
      title: resource.title,
      arch: resource.arch,
      size: sizeStringToNumber(resource.size),
      status: resource.status,
      lastDeployed: parseUtcDatetime(resource.lastDeployed),
      machineCount: resource.machineCount,
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
  const { setSidePanelContent } = useSidePanel();
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
        return generateResourceRow({
          resource,
          commissioningRelease,
          unchecked: false,
          setSidePanelContent: setSidePanelContent,
        });
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
        generateResourceRow({
          resource,
          commissioningRelease,
          unchecked: true,
          setSidePanelContent: setSidePanelContent,
        })
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
        { content: "Deployable in memory", className: "diskless-col" },
        {
          content: <span className="p-double-row__header-spacer">Status</span>,
          className: "status-col",
          sortKey: "status",
        },
        {
          content: "Last deployed",
          className: "last-deployed-col",
          sortKey: "lastDeployed",
        },
        {
          content: "Machines",
          className: "machines-col",
          sortKey: "machineCount",
        },
        { content: "Actions", className: "actions-col u-align--right" },
      ]}
      rows={rows}
      sortable
    />
  );
};

export default ImagesTable;
