import type { ReactElement, Dispatch, SetStateAction } from "react";
import { useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import { BootResourceAction } from "@/app/store/bootresource/types";

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
  const dispatch = useDispatch();
  const saving = useSelector(bootResourceSelectors.deletingImage);
  const previousSaving = usePrevious(saving);
  const eventErrors = useSelector(bootResourceSelectors.eventErrors);
  const error = eventErrors.find(
    (error) => error.event === BootResourceAction.DELETE_IMAGE
  )?.error;
  const saved = previousSaving && !saving && !error;

  useEffect(() => {
    return () => {
      dispatch(bootResourceActions.cleanup());
    };
  }, [dispatch]);

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
      errors={error}
      initialValues={{}}
      message={deleteMessage}
      modelType="image"
      onCancel={closeSidePanel}
      onSubmit={() => {
        dispatch(bootResourceActions.cleanup());
        Object.keys(rowSelection).forEach((key) => {
          if (!isNaN(Number(key))) {
            dispatch(bootResourceActions.deleteImage({ id: Number(key) }));
          }
        });
      }}
      onSuccess={() => {
        dispatch(bootResourceActions.poll({ continuous: false }));
        if (setRowSelection) {
          setRowSelection({});
        }
        closeSidePanel();
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteImages;
