import type { ReactElement } from "react";
import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent/PageContent";
import { useGetURLId, useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { staticRouteActions } from "@/app/store/staticroute";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import { SubnetMeta } from "@/app/store/subnet/types";
import subnetURLs from "@/app/subnets/urls";
import {
  StaticDHCPLease,
  StaticRoutes,
  SubnetDetailsHeader,
  SubnetSummary,
  SubnetUsedIPs,
  SubnetUtilisation,
} from "@/app/subnets/views/Subnets/components";
import DHCPSnippets from "@/app/subnets/views/VLANs/components/DHCPSnippets";
import ReservedRangesTable from "@/app/subnets/views/VLANs/components/ReservedRangesTable";
import { getRelativeRoute, isId } from "@/app/utils";

const SubnetDetails = (): ReactElement => {
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

    return () => {
      dispatch(subnetActions.setActive(null));
      dispatch(subnetActions.cleanup());
    };
  }, [dispatch, id, isValidID]);

  if ((!subnet || !isValidID) && !subnetsLoading) {
    return (
      <ModelNotFound
        id={id}
        linkURL={subnetURLs.indexWithParams({ by: "fabric" })}
        modelName="subnet"
      />
    );
  }

  const base = urls.subnets.subnet.index(null);

  return (
    <PageContent
      header={<SubnetDetailsHeader subnet={subnet} />}
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      {!subnet || !isValidID ? (
        <Spinner text="Loading..." />
      ) : (
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
                <SubnetUtilisation statistics={subnet.statistics} />
              </>
            }
            path={getRelativeRoute(urls.subnets.subnet.summary(null), base)}
          />
          <Route
            element={<StaticRoutes subnetId={id} />}
            path={getRelativeRoute(
              urls.subnets.subnet.staticRoutes(null),
              base
            )}
          />
          <Route
            element={
              <>
                <StaticDHCPLease subnetId={id} />
                <ReservedRangesTable subnetId={id} />
              </>
            }
            path={getRelativeRoute(
              urls.subnets.subnet.addressReservation(null),
              base
            )}
          />
          <Route
            element={
              <DHCPSnippets modelName={SubnetMeta.MODEL} subnetIds={[id]} />
            }
            path={getRelativeRoute(
              urls.subnets.subnet.dhcpSnippets(null),
              base
            )}
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
      )}
    </PageContent>
  );
};

export default SubnetDetails;
