import { useGetURLId } from "app/base/hooks";
import APIKeyDeleteForm from "app/preferences/views/APIKeys/APIKeyDeleteForm/APIKeyDeleteForm";

const APIKeyDelete = () => {
  const id = useGetURLId("id");
  if (!id) {
    return <h4>API Key not found</h4>;
  }

  return <APIKeyDeleteForm id={id} />;
};

export default APIKeyDelete;
