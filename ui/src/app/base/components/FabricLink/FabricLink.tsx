import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric, FabricMeta } from "app/store/fabric/types";
import { getFabricDisplay } from "app/store/fabric/utils";
import type { RootState } from "app/store/root/types";
import subnetsURLs from "app/subnets/urls";

type Props = {
  id?: Fabric[FabricMeta.PK] | null;
};

const FabricLink = ({ id }: Props): JSX.Element => {
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, id)
  );
  const fabricsLoading = useSelector(fabricSelectors.loading);
  const fabricDisplay = getFabricDisplay(fabric);

  if (fabricsLoading) {
    // TODO: Put aria-label directly on Spinner component when issue is fixed.
    // https://github.com/canonical-web-and-design/react-components/issues/651
    return (
      <span aria-label="Loading fabrics">
        <Spinner />
      </span>
    );
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
