import { useOnEscapePressed } from "@canonical/react-components";
import { useNavigate } from "react-router-dom";

import urls from "@/app/base/urls";
import PoolForm from "@/app/pools/components/PoolForm";

export enum Label {
  Title = "Add pool form",
}

export const PoolAdd = (): JSX.Element => {
  const navigate = useNavigate();
  const onCancel = () => navigate({ pathname: urls.pools.index });
  useOnEscapePressed(() => onCancel());
  return <PoolForm aria-label={Label.Title} onClose={onCancel} />;
};

export default PoolAdd;
