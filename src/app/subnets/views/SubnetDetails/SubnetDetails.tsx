import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import StaticRoutes from "./StaticRoutes";
import SubnetDetailsHeader from "./SubnetDetailsHeader";
import SubnetStaticIPs from "./SubnetStaticIPs";
import SubnetSummary from "./SubnetSummary";
import SubnetUsedIPs from "./SubnetUsedIPs";
import Utilisation from "./Utilisation";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { staticRouteActions } from "@/app/store/staticroute";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import { SubnetMeta } from "@/app/store/subnet/types";
import DHCPSnippets from "@/app/subnets/components/DHCPSnippets";
import ReservedRanges from "@/app/subnets/components/ReservedRanges";
import subnetURLs from "@/app/subnets/urls";
import SubnetActionForms from "@/app/subnets/views/SubnetDetails/SubnetActionForms/SubnetActionForms";
import type { SubnetActionType } from "@/app/subnets/views/SubnetDetails/constants";
import {
  subnetActionLabels,
  SubnetActionTypes,
} from "@/app/subnets/views/SubnetDetails/constants";
import { getRelativeRoute, isId } from "@/app/utils";

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
      ? (name as SubnetActionType)
      : null;

  const base = urls.subnets.subnet.index(null);

  return (
    <PageContent
      header={<SubnetDetailsHeader subnet={subnet} />}
      sidePanelContent={
        activeForm ? (
          <SubnetActionForms
            activeForm={activeForm}
            setSidePanelContent={setSidePanelContent}
            subnetId={subnet.id}
            {...sidePanelContent?.extras}
          />
        ) : null
      }
      sidePanelTitle={activeForm ? subnetActionLabels[activeForm] : ""}
    >
      <Routes>
        <Route
          element={
            <Navigate replace to={urls.subnets.subnet.summary({ id })} />
          }
          index
        />
        <Route
          element={
            <>
              <SubnetSummary id={id} />
              <Utilisation statistics={subnet.statistics} />
            </>
          }
          path={getRelativeRoute(urls.subnets.subnet.summary(null), base)}
        />
        <Route
          element={<StaticRoutes subnetId={id} />}
          path={getRelativeRoute(urls.subnets.subnet.staticRoutes(null), base)}
        />
        <Route
          element={
            <>
              {import.meta.env.VITE_APP_STATIC_IPS_ENABLED === "true" && (
                <SubnetStaticIPs />
              )}
              <ReservedRanges subnetId={id} />
            </>
          }
          path={getRelativeRoute(
            urls.subnets.subnet.reservedIpAddresses(null),
            base
          )}
        />
        <Route
          element={
            <DHCPSnippets modelName={SubnetMeta.MODEL} subnetIds={[id]} />
          }
          path={getRelativeRoute(urls.subnets.subnet.dhcpSnippets(null), base)}
        />
        <Route
          element={<SubnetUsedIPs subnetId={id} />}
          path={getRelativeRoute(
            urls.subnets.subnet.usedIpAddresses(null),
            base
          )}
        />
        <Route
          element={
            <Navigate replace to={urls.subnets.subnet.summary({ id })} />
          }
          path={base}
        />
      </Routes>
    </PageContent>
  );
};

export default SubnetDetails;
