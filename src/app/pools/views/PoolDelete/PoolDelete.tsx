import { useOnEscapePressed } from "@canonical/react-components";
import { useNavigate } from "react-router-dom";

import { useGetURLId } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import PoolDeleteForm from "@/app/pools/components/PoolDeleteForm";
import { isId } from "@/app/utils";

const PoolDelete = () => {
  const id = useGetURLId("id");
  const navigate = useNavigate();
  const onCancel = () => navigate({ pathname: urls.pools.index });
  useOnEscapePressed(() => onCancel());

  if (!isId(id)) {
    return <h4>Resource pool not found</h4>;
  }

  return <PoolDeleteForm id={id} />;
};

export default PoolDelete;
