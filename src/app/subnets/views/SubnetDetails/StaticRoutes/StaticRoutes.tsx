import { Button, MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { SubnetActionTypes, SubnetDetailsSidePanelViews } from "../constants";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import SubnetLink from "@/app/base/components/SubnetLink";
import TableActions from "@/app/base/components/TableActions";
import TitledSection from "@/app/base/components/TitledSection";
import { useFetchActions } from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { useSidePanel } from "@/app/base/side-panel-context";
import { staticRouteActions } from "@/app/store/staticroute";
import staticRouteSelectors from "@/app/store/staticroute/selectors";
import type { StaticRoute } from "@/app/store/staticroute/types";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "@/app/store/subnet/types";
import { getSubnetDisplay } from "@/app/store/subnet/utils";

export type Props = {
  subnetId: Subnet[SubnetMeta.PK];
};

export enum Labels {
  GatewayIp = "Gateway IP",
  Destination = "Destination",
  Metric = "Metric",
  Actions = "Actions",
}

export enum ExpandedType {
  Create,
  Delete,
  Update,
}

const generateRows = (
  staticRoutes: StaticRoute[],
  subnets: Subnet[],
  setSidePanelContent: SetSidePanelContent
) =>
  staticRoutes.map((staticRoute: StaticRoute) => {
    const subnet = subnets.find(
      (subnet) => subnet.id === staticRoute.destination
    );
    return {
      columns: [
        {
          "aria-label": Labels.GatewayIp,
          content: staticRoute.gateway_ip,
        },
        {
          "aria-label": Labels.Destination,
          content: <SubnetLink id={staticRoute.destination} />,
        },
        {
          "aria-label": Labels.Metric,
          content: staticRoute.metric,
        },
        {
          "aria-label": Labels.Actions,
          content: (
            <TableActions
              onDelete={() => {
                setSidePanelContent({
                  view: SubnetDetailsSidePanelViews[
                    SubnetActionTypes.DeleteStaticRoute
                  ],
                  extras: { staticRouteId: staticRoute.id },
                });
              }}
              onEdit={() => {
                setSidePanelContent({
                  view: SubnetDetailsSidePanelViews[
                    SubnetActionTypes.EditStaticRoute
                  ],
                  extras: { staticRouteId: staticRoute.id },
                });
              }}
            />
          ),
          className: "u-align--right",
        },
      ],
      key: staticRoute.id,
      sortData: {
        destination: getSubnetDisplay(subnet),
        gateway_ip: staticRoute.gateway_ip,
        metric: staticRoute.metric,
      },
    };
  });

const StaticRoutes = ({ subnetId }: Props): React.ReactElement | null => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const staticRoutesLoading = useSelector(staticRouteSelectors.loading);
  const staticRoutes = useSelector(staticRouteSelectors.all).filter(
    (staticRoute) => staticRoute.source === subnetId
  );
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const isSuperUser = useGetIsSuperUser();
  const loading = staticRoutesLoading || subnetsLoading;
  const isAddStaticRouteOpen =
    sidePanelContent?.view ===
    SubnetDetailsSidePanelViews[SubnetActionTypes.AddStaticRoute];

  useFetchActions([staticRouteActions.fetch, subnetActions.fetch]);

  return (
    <TitledSection
      buttons={
        isSuperUser.data ? (
          <Button
            disabled={isAddStaticRouteOpen}
            onClick={() => {
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.AddStaticRoute
                ],
              });
            }}
          >
            Add static route
          </Button>
        ) : null
      }
      className="u-no-padding--top"
      title="Static routes"
    >
      <MainTable
        className="static-routes-table p-table-expanding--light"
        defaultSort="gateway_ip"
        defaultSortDirection="ascending"
        emptyStateMsg={
          loading ? (
            <Spinner text="Loading..." />
          ) : (
            "No static routes for this subnet."
          )
        }
        headers={[
          {
            content: Labels.GatewayIp,
            sortKey: "gateway_ip",
          },
          {
            content: Labels.Destination,
            sortKey: "destination",
          },
          {
            content: Labels.Metric,
            sortKey: "metric",
          },
          {
            content: Labels.Actions,
            className: "u-align--right",
          },
        ]}
        responsive
        rows={generateRows(staticRoutes, subnets, setSidePanelContent)}
        sortable
      />
    </TitledSection>
  );
};

export default StaticRoutes;
