import type { Dispatch, ReactElement, SetStateAction } from "react";

import type { RowSelectionState } from "@tanstack/react-table";

import { useDeleteSelections } from "@/app/api/query/images";
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

  const imagesCount = Object.keys(rowSelection).filter(
    (key: string) => !isNaN(Number(key))
  ).length;

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
      errors={deleteSelections.error}
      initialValues={{}}
      message={deleteMessage}
      modelType="image"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteSelections.mutate({
          query: {
            id: Object.keys(rowSelection).map((id) => Number(id)),
          },
        });
      }}
      onSuccess={() => {
        if (setRowSelection) {
          setRowSelection({});
        }
        closeSidePanel();
      }}
      saved={deleteSelections.isSuccess}
      saving={deleteSelections.isPending}
    />
  );
};

export default DeleteImages;
