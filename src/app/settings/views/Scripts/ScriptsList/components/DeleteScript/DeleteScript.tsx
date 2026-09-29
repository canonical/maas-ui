import { Button } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import type { RootState } from "@/app/store/root/types";
import { scriptActions } from "@/app/store/script";
import scriptSelectors from "@/app/store/script/selectors";
import type { Script } from "@/app/store/script/types";

type Props = {
  id: Script["id"];
};

const DeleteScript = ({ id }: Props): React.ReactElement | null => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);
  const saving = useSelector(scriptSelectors.saving);
  const script = useSelector((state: RootState) =>
    scriptSelectors.getById(state, id)
  );

  if (!script) {
    return (
      <>
        <p>Script could not be found.</p>
        <Button appearance="base" onClick={closeModal} type="button">
          Close
        </Button>
      </>
    );
  }

  return (
    <ModelActionForm
      aria-label="Confirm script deletion"
      errors={errors}
      initialValues={{}}
      message={`Are you sure you want to delete script "${script.name}"? This action is permanent and cannot be undone.`}
      modelType="script"
      onCancel={closeModal}
      onSubmit={() => {
        dispatch(scriptActions.delete(id));
      }}
      onSuccess={closeModal}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteScript;
