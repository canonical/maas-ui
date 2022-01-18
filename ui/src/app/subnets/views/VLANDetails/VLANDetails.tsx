import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import VLANDetailsHeader from "./VLANDetailsHeader";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId } from "app/base/hooks/urls";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { VLANMeta } from "app/store/vlan/types";
import subnetURLs from "app/subnets/urls";
import { isId } from "app/utils";

const VLANDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(VLANMeta.PK);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const vlansLoading = useSelector(vlanSelectors.loading);
  const isValidID = isId(id);

  useEffect(() => {
    if (isValidID) {
      dispatch(vlanActions.get(id));
      dispatch(vlanActions.setActive(id));
    }

    const unsetActiveVLANAndCleanup = () => {
      dispatch(vlanActions.setActive(null));
      dispatch(vlanActions.cleanup());
    };
    return unsetActiveVLANAndCleanup;
  }, [dispatch, id, isValidID]);

  if (!vlan) {
    const vlanNotFound = !isValidID || !vlansLoading;

    if (vlanNotFound) {
      return (
        <ModelNotFound id={id} linkURL={subnetURLs.index} modelName="VLAN" />
      );
    }
    return <Section header={<SectionHeader loading />} />;
  }

  return <Section header={<VLANDetailsHeader vlan={vlan} />} />;
};

export default VLANDetails;
