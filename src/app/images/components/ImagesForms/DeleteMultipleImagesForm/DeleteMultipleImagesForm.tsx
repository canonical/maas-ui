import type { ReactElement, Dispatch, SetStateAction } from "react";
import { useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import type { RowSelectionState } from "@tanstack/react-table";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import { BootResourceAction } from "@/app/store/bootresource/types";

type DeleteImagesProps = {
  readonly rowSelection: RowSelectionState;
  readonly setRowSelection:
    | Dispatch<SetStateAction<RowSelectionState>>
    | null
    | undefined;
  readonly closeForm: () => void;
};

const DeleteMultipleImagesForm = ({
  rowSelection,
  setRowSelection,
  closeForm,
}: DeleteImagesProps): ReactElement => {
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

  const imagesCountText = pluralize("image", imagesCount || 0, true);

  return (
    <ModelActionForm
      aria-label="Confirm image deletion"
      errors={error}
      initialValues={{}}
      message={
        <>
          Are you sure you want to delete <strong>{imagesCountText}</strong>?
        </>
      }
      modelType="image"
      onCancel={closeForm}
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
        closeForm();
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteMultipleImagesForm;
