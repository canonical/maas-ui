import { useGetURLId } from "app/base/hooks";
import PoolDeleteForm from "app/pools/components/PoolDeleteForm";

const PoolDelete = () => {
  const id = useGetURLId("id");

  if (!id) {
    return <h4>Resource pool not found</h4>;
  }

  return <PoolDeleteForm id={id} />;
};

export default PoolDelete;
