import { useOnEscapePressed } from "@canonical/react-components";
import { useNavigate } from "react-router-dom";

import { useGetURLId } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import APIKeyDeleteForm from "@/app/preferences/views/APIKeys/APIKeyDeleteForm/APIKeyDeleteForm";
import { isId } from "@/app/utils";

const APIKeyDelete = () => {
  const id = useGetURLId("id");
  const navigate = useNavigate();
  const onCancel = () => navigate({ pathname: urls.preferences.apiKeys.index });
  useOnEscapePressed(() => onCancel());

  if (!isId(id)) {
    return <h4>API Key not found</h4>;
  }

  return <APIKeyDeleteForm id={id} />;
};

export default APIKeyDelete;
