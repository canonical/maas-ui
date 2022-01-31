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
import { actions as controllerActions } from "app/store/controller";
import { actions as fabricActions } from "app/store/fabric";
import type { RootState } from "app/store/root/types";
import { actions as spaceActions } from "app/store/space";
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
  useWindowTitle(`${vlan?.name || "VLAN"} details`);
  const fabricId = vlan?.fabric;
  const spaceId = vlan?.space;

  useEffect(() => {
    if (isId(id)) {
      dispatch(vlanActions.get(id));
      dispatch(vlanActions.setActive(id));
      dispatch(controllerActions.fetch());
    }

    const unsetActiveVLANAndCleanup = () => {
      dispatch(vlanActions.setActive(null));
      dispatch(vlanActions.cleanup());
    };
    return unsetActiveVLANAndCleanup;
  }, [dispatch, id]);

  useEffect(() => {
    if (isId(fabricId)) {
      dispatch(fabricActions.get(fabricId));
    }
  }, [dispatch, fabricId]);

  useEffect(() => {
    if (isId(spaceId)) {
      dispatch(spaceActions.get(spaceId));
    }
  }, [dispatch, spaceId]);

  if (!vlan) {
    const vlanNotFound = !isId(id) || !vlansLoading;

    if (vlanNotFound) {
      return (
        <ModelNotFound id={id} linkURL={subnetURLs.index} modelName="VLAN" />
      );
    }
    return <Section header={<SectionHeader loading />} />;
  }

  return (
    <Section header={<VLANDetailsHeader id={id} />}>
      <VLANSummary id={id} />
      <DHCPStatus />
      <ReservedRanges />
      <VLANSubnets />
      <DHCPSnippets />
    </Section>
  );
};

export default VLANDetails;
