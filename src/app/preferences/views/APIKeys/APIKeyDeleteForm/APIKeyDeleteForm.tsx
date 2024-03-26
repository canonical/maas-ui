import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useAddMessage } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { tokenActions } from "@/app/store/token";
import tokenSelectors from "@/app/store/token/selectors";

const APIKeyDeleteForm = ({ id }: { id: number }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);

  useAddMessage(saved, tokenActions.cleanup, "API key deleted successfully.");

  return (
    <ModelActionForm
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
