import { Icon, MainTable, Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";

import DoubleRow from "app/base/components/DoubleRow";
import type { ImageValue } from "app/images/types";
import type { BootResource } from "app/store/bootresource/types";
import { splitResourceName } from "app/store/bootresource/utils";

type Props = {
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
): boolean => {
  const { os, release } = splitResourceName(resource.name);
  return (
    image.os === os && image.release === release && image.arch === resource.arch
  );
};

/**
 * Generates a row based on a form image value.
 * @param image - the image value from which to generate the row.
 * @param releases - the list of releases known by the source.
 * @returns row generated from form image value.
 */
const generateImageRow = (image: ImageValue) => {
  return {
    columns: [
      {
        content: image.title,
        className: "release-col",
        "data-test": "new-image-title",
      },
      { content: image.arch, className: "arch-col" },
      { content: "—", className: "size-col" },
      {
        content: (
          <DoubleRow
            data-test="new-image-status"
            icon={<Icon name="pending" />}
            primary="Selected for download"
          />
        ),
        className: "status-col",
      },
      { content: "", className: "actions-col u-align--right" },
    ],
    key: `${image.os}-${image.release}-${image.arch}`,
    sortData: {
      title: image.title,
      arch: image.arch,
    },
  };
};
/**
 * Generates a row based on a resource.
 * @param resource - the resource from which to generate the row.
 * @param toDelete - whether the resource is slated for deletion.
 * @returns row generated from resource.
 */
const generateResourceRow = (resource: BootResource, toDelete = false) => {
  let statusIcon = <Spinner />;
  let statusText = resource.status;

  if (toDelete) {
    statusIcon = <Icon name="error" />;
    statusText = "Will be deleted";
  } else if (resource.complete) {
    statusIcon = <Icon name="success" />;
  }

  return {
    columns: [
      { content: resource.title, className: "release-col" },
      { content: resource.arch, className: "arch-col" },
      { content: resource.size, className: "size-col" },
      {
        content: (
          <DoubleRow
            data-test="resource-status"
            icon={statusIcon}
            primary={statusText}
          />
        ),
        className: "status-col",
      },
      { content: "", className: "actions-col u-align--right" },
    ],
    key: `resource-${resource.id}`,
    sortData: {
      title: resource.title,
      arch: resource.arch,
      size: resource.size,
      status: resource.status,
    },
  };
};

const ImagesTable = ({ resources }: Props): JSX.Element => {
  const { values } = useFormikContext<{ images: ImageValue[] }>();
  const headers = [
    { content: "Release", className: "release-col", sortKey: "title" },
    { content: "Architecture", className: "arch-col", sortKey: "arch" },
    { content: "Size", className: "size-col", sortKey: "size" },
    {
      content: <span className="u-nudge-right--large">Status</span>,
      className: "status-col",
      sortKey: "status",
    },
    { content: "Actions", className: "actions-col u-align--right" },
  ];
  // Resources set for deletion are those that exist in the database, but do not
  // exist in the form's images value, i.e. the checkbox was unchecked.
  const resourcesToDelete = resources.filter((resource) =>
    values.images.every((image) => !resourceMatchesImage(resource, image))
  );
  const rows = values.images
    .map((image) => {
      const resource = resources.find((resource) =>
        resourceMatchesImage(resource, image)
      );
      if (resource) {
        return generateResourceRow(resource);
      } else {
        return generateImageRow(image);
      }
    })
    .concat(
      resourcesToDelete.map((resource) => generateResourceRow(resource, true))
    );

  return (
    <MainTable
      className="images-table"
      defaultSort="title"
      defaultSortDirection="descending"
      headers={headers}
      rows={rows}
      sortable
    />
  );
};

export default ImagesTable;
