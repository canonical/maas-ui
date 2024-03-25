import { useOnEscapePressed } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useAddMessage } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { resourcePoolActions } from "@/app/store/resourcepool";
import resourcePoolSelectors from "@/app/store/resourcepool/selectors";
import type { RootState } from "@/app/store/root/types";

const PoolDeleteForm = ({ id }: { id: number }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pool = useSelector((state: RootState) =>
    resourcePoolSelectors.getById(state, id)
  );
  const saved = useSelector(resourcePoolSelectors.saved);
  const saving = useSelector(resourcePoolSelectors.saving);
  const onCancel = () => navigate({ pathname: urls.pools.index });
  useOnEscapePressed(() => onCancel());
  useAddMessage(
    saved,
    resourcePoolActions.cleanup,
    `${pool?.name} removed successfully.`
  );

  return (
    <ModelActionForm
      aria-label="Confirm pool deletion"
      initialValues={{}}
      modelType="resource pool"
      onCancel={onCancel}
      onSubmit={() => {
        dispatch(resourcePoolActions.delete(id));
      }}
      saved={saved}
      savedRedirect={urls.pools.index}
      saving={saving}
    />
  );
};

export default PoolDeleteForm;
