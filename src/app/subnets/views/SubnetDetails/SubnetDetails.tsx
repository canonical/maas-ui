import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import StaticRoutes from "./StaticRoutes";
import SubnetDetailsHeader from "./SubnetDetailsHeader";
import SubnetSummary from "./SubnetSummary";
import SubnetUsedIPs from "./SubnetUsedIPs";
import Utilisation from "./Utilisation";

import ModelNotFound from "app/base/components/ModelNotFound";
import PageContent from "app/base/components/PageContent/PageContent";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import { useSidePanel } from "app/base/side-panel-context";
import type { RootState } from "app/store/root/types";
import { actions as staticRouteActions } from "app/store/staticroute";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { SubnetMeta } from "app/store/subnet/types";
import DHCPSnippets from "app/subnets/components/DHCPSnippets";
import ReservedRanges from "app/subnets/components/ReservedRanges";
import subnetURLs from "app/subnets/urls";
import SubnetActionForms from "app/subnets/views/SubnetDetails/SubnetDetailsHeader/SubnetActionForms/SubnetActionForms";
import {
  subnetActionLabels,
  SubnetActionTypes,
} from "app/subnets/views/SubnetDetails/constants";
import { isId } from "app/utils";

const SubnetDetails = (): JSX.Element => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const dispatch = useDispatch();
  const id = useGetURLId(SubnetMeta.PK);
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const isValidID = isId(id);
  useWindowTitle(`${subnet?.name || "Subnet"} details`);

  useEffect(() => {
    if (isValidID) {
      dispatch(subnetActions.get(id));
      dispatch(subnetActions.setActive(id));
      dispatch(staticRouteActions.fetch());
    }

    const unsetActiveSubnetAndCleanup = () => {
      dispatch(subnetActions.setActive(null));
      dispatch(subnetActions.cleanup());
    };
    return unsetActiveSubnetAndCleanup;
  }, [dispatch, id, isValidID]);

  if (subnetsLoading) {
    return (
      <PageContent
        header={<SectionHeader loading />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  if (!subnet || !isValidID) {
    return (
      <ModelNotFound
        id={id}
        linkURL={subnetURLs.indexWithParams({ by: "fabric" })}
        modelName="subnet"
      />
    );
  }

  const [, name] = sidePanelContent?.view || [];
  const activeForm =
    name && Object.keys(SubnetActionTypes).includes(name)
      ? (name as keyof typeof SubnetActionTypes)
      : null;

  return (
    <PageContent
      header={<SubnetDetailsHeader subnet={subnet} />}
      sidePanelContent={
        activeForm ? (
          <SubnetActionForms
            activeForm={activeForm}
            id={subnet.id}
            setActiveForm={setSidePanelContent}
          />
        ) : null
      }
      sidePanelTitle={activeForm ? subnetActionLabels[activeForm] : ""}
    >
      <SubnetSummary id={id} />
      <Utilisation statistics={subnet.statistics} />
      <StaticRoutes subnetId={id} />
      <ReservedRanges subnetId={id} />
      <DHCPSnippets modelName={SubnetMeta.MODEL} subnetIds={[id]} />
      <SubnetUsedIPs subnetId={id} />
    </PageContent>
  );
};

export default SubnetDetails;
