import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom-v5-compat";

import ModelDeleteForm from "app/base/components/ModelDeleteForm";
import urls from "app/base/urls";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";

const PoolDeleteForm = ({ id }: { id: number }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = useSelector(resourcePoolSelectors.saved);
  const saving = useSelector(resourcePoolSelectors.saving);

  return (
    <ModelDeleteForm
      aria-label="Confirm pool deletion"
      initialValues={{}}
      modelType="resource pool"
      onCancel={() => navigate({ pathname: urls.pools.index })}
      onSubmit={() => {
        dispatch(resourcePoolActions.delete(id));
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default PoolDeleteForm;
