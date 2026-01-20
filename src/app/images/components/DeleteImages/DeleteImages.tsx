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
      errors={deleteSelections.error}
      initialValues={{}}
      message={deleteMessage}
      modelType="image"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteSelections.mutate({
          query: {
            id: Object.keys(rowSelection)
              .filter((id) => id.endsWith("-selection"))
              .map((id) => Number(id.split("-")[0])),
          },
        });
        // TODO: add custom image deletion when v3 API ready https://warthogs.atlassian.net/browse/MAASENG-5983
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
