import type { Dispatch, ReactElement, SetStateAction } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import {
  Icon,
  Notification as NotificationBanner,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import pluralize from "pluralize";

import { useGetConfiguration } from "@/app/api/query/configurations";
import {
  useDeleteCustomImages,
  useDeleteSelections,
  useImages,
} from "@/app/api/query/images";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { ConfigNames } from "@/app/store/config/types";

type DeleteImagesProps = {
  rowSelection: RowSelectionState;
  setRowSelection:
    | Dispatch<SetStateAction<RowSelectionState>>
    | null
    | undefined;
};

const DeleteImages = ({
  rowSelection,
  setRowSelection,
}: DeleteImagesProps): ReactElement => {
  const commissioningRelease =
    (useGetConfiguration({
      path: { name: ConfigNames.COMMISSIONING_DISTRO_SERIES },
    }).data?.value as string) ?? "";

  const { closeSidePanel } = useSidePanel();

  const deleteSelections = useDeleteSelections();
  const deleteCustomImages = useDeleteCustomImages();
  const images = useImages();

  const imagesCount = Object.keys(rowSelection).length;

  const selectedImages = images.data.items
    .filter((image) => rowSelection[image.id])
    .toSorted((a, b) => (b.title ?? "").localeCompare(a.title ?? ""));

  return (
    <>
      {images.isLoading && <Spinner text="Loading..." />}
      {images.isError && (
        <NotificationBanner severity="negative">
          {images.stages.images.error?.message}
        </NotificationBanner>
      )}
      <ModelActionForm
        aria-label="Confirm image deletion"
        errors={deleteSelections.error || deleteCustomImages.error}
        initialValues={{}}
        message={
          <>
            {selectedImages.some(
              (image) => image.release === commissioningRelease
            ) && (
              <NotificationBanner
                severity="caution"
                title="Deleting default commissioning release image"
              >
                Machine commissioning will fail if there are no default
                commissioning images with the appropriate architecture.
              </NotificationBanner>
            )}
            <NotificationBanner
              severity="caution"
              title="Machines will be affected"
            >
              Deleting images will affect machines using those images for
              commissioning.
            </NotificationBanner>
            <p>
              Are you sure you want to delete the following{" "}
              {pluralize("image", imagesCount)}?
            </p>
            <ul>
              {selectedImages.map((image) => (
                <li key={image.id}>
                  {image.title} ({image.architecture})
                  {image.release === commissioningRelease && (
                    <>
                      {" "}
                      <Tooltip message="Default commissioning release">
                        <Icon name="warning" />
                      </Tooltip>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        }
        modelType="image"
        onCancel={closeSidePanel}
        onSubmit={() => {
          const selectionIds = Object.keys(rowSelection)
            .filter((id) => id.endsWith("-selection"))
            .map((id) => Number(id.split("-")[0]));
          const customImageIds = Object.keys(rowSelection)
            .filter((id) => id.endsWith("-custom"))
            .map((id) => Number(id.split("-")[0]));

          if (selectionIds.length) {
            deleteSelections.mutate({
              query: {
                id: selectionIds,
              },
            });
          }

          if (customImageIds.length) {
            deleteCustomImages.mutate({
              query: {
                id: customImageIds,
              },
            });
          }
        }}
        onSuccess={() => {
          if (setRowSelection) {
            setRowSelection({});
          }
          closeSidePanel();
        }}
        saved={deleteSelections.isSuccess || deleteCustomImages.isSuccess}
        saving={deleteSelections.isPending || deleteCustomImages.isPending}
        submitAppearance="negative"
        submitLabel={`Delete ${pluralize("image", imagesCount, true)}`}
      />
    </>
  );
};

export default DeleteImages;
