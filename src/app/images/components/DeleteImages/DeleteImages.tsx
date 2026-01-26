import type { Dispatch, ReactElement, SetStateAction } from "react";

import type { RowSelectionState } from "@tanstack/react-table";

import {
  useDeleteCustomImages,
  useDeleteSelections,
} from "@/app/api/query/images";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

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
  const { closeSidePanel } = useSidePanel();

  const deleteSelections = useDeleteSelections();
  const deleteCustomImages = useDeleteCustomImages();

  const imagesCount = Object.keys(rowSelection).length;

  const deleteMessage =
    imagesCount === 1 ? (
      <>
        Are you sure you want to delete <strong>this image</strong>?
      </>
    ) : (
      <>
        Are you sure you want to delete <strong>{imagesCount} images</strong>?
      </>
    );

  return (
    <ModelActionForm
      aria-label="Confirm image deletion"
      errors={deleteSelections.error || deleteCustomImages.error}
      initialValues={{}}
      message={deleteMessage}
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
    />
  );
};

export default DeleteImages;
