import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import ConfigureDHCP from "./ConfigureDHCP";
import DHCPStatus from "./DHCPStatus";
import VLANDetailsHeader from "./VLANDetailsHeader";
import VLANSubnets from "./VLANSubnets";
import VLANSummary from "./VLANSummary";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
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
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getByVLAN(state, id)
  );
  const [showDHCPForm, setShowDHCPForm] = useState(false);
  useWindowTitle(`${vlan?.name || "VLAN"} details`);

  useEffect(() => {
    if (isId(id)) {
      dispatch(vlanActions.get(id));
      dispatch(vlanActions.setActive(id));
    }

    const unsetActiveVLANAndCleanup = () => {
      dispatch(vlanActions.setActive(null));
      dispatch(vlanActions.cleanup());
    };
    return unsetActiveVLANAndCleanup;
  }, [dispatch, id]);

  if (!vlan) {
    const vlanNotFound = !isId(id) || !vlansLoading;

    if (vlanNotFound) {
      return (
        <ModelNotFound
          id={id}
          linkURL={subnetURLs.indexWithParams({ by: "fabric" })}
          modelName="VLAN"
        />
      );
    }
    return <Section header={<SectionHeader loading />} />;
  }

  return (
    <Section header={<VLANDetailsHeader id={id} />}>
      {showDHCPForm ? (
        <ConfigureDHCP closeForm={() => setShowDHCPForm(false)} id={id} />
      ) : (
        <>
          <VLANSummary id={id} />
          <DHCPStatus id={id} openForm={() => setShowDHCPForm(true)} />
          <ReservedRanges hasVLANSubnets={subnets.length > 0} vlanId={id} />
          <VLANSubnets id={id} />
        </>
      )}
      <DHCPSnippets
        modelName={VLANMeta.MODEL}
        subnetIds={subnets.map(({ id }) => id)}
      />
    </Section>
  );
};

export default VLANDetails;
