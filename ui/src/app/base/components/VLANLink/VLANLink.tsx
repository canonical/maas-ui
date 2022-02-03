import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { getVLANDisplay } from "app/store/vlan/utils";
import subnetsURLs from "app/subnets/urls";

type Props = {
  id?: VLAN[VLANMeta.PK] | null;
};

const VLANLink = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const vlansLoading = useSelector(vlanSelectors.loading);
  const vlanDisplay = getVLANDisplay(vlan);

  useEffect(() => {
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (vlansLoading) {
    // TODO: Put aria-label directly on Spinner component when issue is fixed.
    // https://github.com/canonical-web-and-design/react-components/issues/651
    return (
      <span aria-label="Loading VLANs">
        <Spinner />
      </span>
    );
  }
  if (!vlan) {
    return <>{vlanDisplay}</>;
  }
  return (
    <Link to={subnetsURLs.vlan.index({ id: vlan.id })}>{vlanDisplay}</Link>
  );
};

export default VLANLink;
