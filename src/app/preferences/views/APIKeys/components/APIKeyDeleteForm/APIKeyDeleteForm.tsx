import type { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { tokenActions } from "@/app/store/token";
import tokenSelectors from "@/app/store/token/selectors";

const APIKeyDeleteForm = ({ id }: { id: number }): ReactElement => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);

  return (
    <ModelActionForm
      aria-label="Delete API Key"
      initialValues={{}}
      modelType="API key"
      onCancel={closeModal}
      onSubmit={() => {
        dispatch(tokenActions.delete(id));
      }}
      onSuccess={closeModal}
      saved={saved}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete"
    />
  );
};

export default APIKeyDeleteForm;
