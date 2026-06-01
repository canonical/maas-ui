import { Button } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import type { RootState } from "@/app/store/root/types";
import { scriptActions } from "@/app/store/script";
import scriptSelectors from "@/app/store/script/selectors";
import type { Script } from "@/app/store/script/types";

type Props = {
  id: Script["id"];
};

const DeleteScript = ({ id }: Props): React.ReactElement | null => {
  const { closeSidePanel } = useSidePanel();
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
        <Button appearance="base" onClick={closeSidePanel} type="button">
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
      onCancel={closeSidePanel}
      onSubmit={() => {
        dispatch(scriptActions.delete(id));
      }}
      onSuccess={closeSidePanel}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteScript;
