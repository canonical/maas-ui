import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom-v5-compat";

import ModelDeleteForm from "@/app/base/components/ModelDeleteForm";
import urls from "@/app/base/urls";
import { actions as tokenActions } from "@/app/store/token";
import tokenSelectors from "@/app/store/token/selectors";

const APIKeyDeleteForm = ({ id }: { id: number }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);

  return (
    <ModelDeleteForm
      aria-label="Delete API Key"
      initialValues={{}}
      modelType="API key"
      onCancel={() => navigate({ pathname: urls.preferences.apiKeys.index })}
      onSubmit={() => {
        dispatch(tokenActions.delete(id));
      }}
      saved={saved}
      savedRedirect={urls.preferences.apiKeys.index}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete"
    />
  );
};

export default APIKeyDeleteForm;
