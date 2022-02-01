import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { getSubnetDisplay } from "app/store/subnet/utils";
import subnetsURLs from "app/subnets/urls";

type Props = {
  id?: Subnet[SubnetMeta.PK] | null;
};

const SubnetLink = ({ id }: Props): JSX.Element => {
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const subnetDisplay = getSubnetDisplay(subnet);

  if (subnetsLoading) {
    // TODO: Put aria-label directly on Spinner component when issue is fixed.
    // https://github.com/canonical-web-and-design/react-components/issues/651
    return (
      <span aria-label="Loading subnets">
        <Spinner />
      </span>
    );
  }
  if (!subnet) {
    return <>{subnetDisplay}</>;
  }
  return (
    <Link to={subnetsURLs.subnet.index({ id: subnet.id })}>
      {subnetDisplay}
    </Link>
  );
};

export default SubnetLink;
