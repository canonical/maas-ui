import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric, FabricMeta } from "app/store/fabric/types";
import { getFabricDisplay } from "app/store/fabric/utils";
import type { RootState } from "app/store/root/types";
import subnetsURLs from "app/subnets/urls";

type Props = {
  id?: Fabric[FabricMeta.PK] | null;
};

const FabricLink = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, id)
  );
  const fabricsLoading = useSelector(fabricSelectors.loading);
  const fabricDisplay = getFabricDisplay(fabric);

  useEffect(() => {
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  if (fabricsLoading) {
    return <Spinner aria-label="Loading fabrics" />;
  }
  if (!fabric) {
    return <>{fabricDisplay}</>;
  }
  return (
    <Link to={subnetsURLs.fabric.index({ id: fabric.id })}>
      {fabricDisplay}
    </Link>
  );
};

export default FabricLink;
