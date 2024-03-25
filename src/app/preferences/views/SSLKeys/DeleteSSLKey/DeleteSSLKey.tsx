import { useOnEscapePressed } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useAddMessage, useGetURLId } from "@/app/base/hooks";
import urls from "@/app/preferences/urls";
import { Label } from "@/app/preferences/views/SSLKeys/SSLKeyList/SSLKeyList";
import { sslkeyActions } from "@/app/store/sslkey";
import sslkeySelectors from "@/app/store/sslkey/selectors";
import { isId } from "@/app/utils";

const DeleteSSLKey = () => {
  const id = useGetURLId("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector(sslkeySelectors.saved);
  const saving = useSelector(sslkeySelectors.saving);
  const onClose = () => navigate({ pathname: urls.sslKeys.index });
  useOnEscapePressed(() => onClose());
  useAddMessage(saved, sslkeyActions.cleanup, "SSL key removed successfully.");

  if (!isId(id)) {
    return <h4>SSL key not found</h4>;
  }

  return (
    <ModelActionForm
      aria-label={Label.DeleteConfirm}
      initialValues={{}}
      modelType="SSL key"
      onCancel={onClose}
      onSubmit={() => {
        dispatch(sslkeyActions.delete(id));
      }}
      saved={saved}
      savedRedirect={urls.sslKeys.index}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Delete"
    />
  );
};

export default DeleteSSLKey;
