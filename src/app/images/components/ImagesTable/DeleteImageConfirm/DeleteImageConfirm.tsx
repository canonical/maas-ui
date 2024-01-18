import { useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { actions as bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import type { BootResource } from "@/app/store/bootresource/types";
import { BootResourceAction } from "@/app/store/bootresource/types";

type Props = {
  closeForm: () => void;
  resource: BootResource;
};

export enum Labels {
  AreYouSure = "Are you sure you want to delete this image?",
}

const DeleteImageConfirm = ({
  closeForm,
  resource,
}: Props): JSX.Element | null => {
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

  return (
    <ModelActionForm
      aria-label="Confirm image deletion"
      errors={error}
      initialValues={{}}
      message={Labels.AreYouSure}
      modelType="image"
      onCancel={closeForm}
      onSubmit={() => {
        dispatch(bootResourceActions.cleanup());
        dispatch(bootResourceActions.deleteImage({ id: resource.id }));
      }}
      onSuccess={() => {
        dispatch(bootResourceActions.poll({ continuous: false }));
        closeForm();
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteImageConfirm;
