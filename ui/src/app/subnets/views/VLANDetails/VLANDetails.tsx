import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import DHCPStatus from "./DHCPStatus";
import VLANDetailsHeader from "./VLANDetailsHeader";
import VLANSubnets from "./VLANSubnets";
import VLANSummary from "./VLANSummary";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { VLANMeta } from "app/store/vlan/types";
import DHCPSnippets from "app/subnets/components/DHCPSnippets";
import ReservedRanges from "app/subnets/components/ReservedRanges";
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
  useWindowTitle(`${vlan?.name || "VLAN"} details`);

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
        <ModelNotFound id={id} linkURL={subnetURLs.index()} modelName="VLAN" />
      );
    }
    return <Section header={<SectionHeader loading />} />;
  }

  return (
    <Section header={<VLANDetailsHeader id={id} />}>
      <VLANSummary />
      <DHCPStatus />
      <ReservedRanges />
      <VLANSubnets />
      <DHCPSnippets />
    </Section>
  );
};

export default VLANDetails;
