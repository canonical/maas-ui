import type { ReactNode } from "react";
import { useState } from "react";

import { ExternalLink } from "@canonical/maas-react-components";
import {
  ContextualMenu,
  MainTable,
  Notification,
} from "@canonical/react-components";
import type { MainTableCell } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import { useSelector } from "react-redux";

import SubnetLink from "app/base/components/SubnetLink";
import TableActions from "app/base/components/TableActions";
import TitledSection from "app/base/components/TitledSection";
import docsUrls from "app/base/docsUrls";
import { useFetchActions } from "app/base/hooks";
import type { SetSidePanelContent } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";
import { actions as ipRangeActions } from "app/store/iprange";
import ipRangeSelectors from "app/store/iprange/selectors";
import type { IPRange } from "app/store/iprange/types";
import { IPRangeType } from "app/store/iprange/types";
import {
  getCommentDisplay,
  getOwnerDisplay,
  getTypeDisplay,
} from "app/store/iprange/utils";
import type { RootState } from "app/store/root/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import {
  SubnetActionTypes,
  SubnetDetailsSidePanelViews,
} from "app/subnets/views/SubnetDetails/constants";
import { generateEmptyStateMsg, getTableStatus, isId } from "app/utils";

export type SubnetProps = {
  subnetId: Subnet[SubnetMeta.PK] | null;
  hasVLANSubnets?: never;
  vlanId?: never;
};

export type VLANProps = {
  hasVLANSubnets?: boolean;
  subnetId?: never;
  vlanId: VLAN[VLANMeta.PK] | null;
};

export type Props = SubnetProps | VLANProps;

export enum Labels {
  Actions = "Actions",
  Comment = "Comment",
  EndIp = "End IP Address",
  Owner = "Owner",
  ReserveDynamicRange = "Reserve dynamic range",
  ReserveRange = "Reserve range",
  StartIP = "Start IP Address",
  Subnet = "Subnet",
  Type = "Type",
}

export enum ExpandedType {
  Create,
  CreateDynamic,
  Delete,
  Update,
}

const generateRows = (
  ipRanges: IPRange[],
  showSubnetColumn: boolean,
  setSidePanelContent: SetSidePanelContent
) =>
  ipRanges.map((ipRange: IPRange) => {
    const comment = getCommentDisplay(ipRange);
    const owner = getOwnerDisplay(ipRange);
    const type = getTypeDisplay(ipRange);
    let expandedContent: ReactNode | null = null;

    const columns: MainTableCell[] = [
      {
        "aria-label": Labels.StartIP,
        className: "start-ip-col",
        content: ipRange.start_ip,
      },
      {
        "aria-label": Labels.EndIp,
        className: "end-ip-col",
        content: ipRange.end_ip,
      },
      {
        "aria-label": Labels.Owner,
        className: "owner-col",
        content: owner,
      },
      {
        "aria-label": Labels.Type,
        className: "type-col",
        content: type,
      },
      {
        "aria-label": Labels.Comment,
        className: "comment-col",
        content: comment,
      },
      {
        "aria-label": Labels.Actions,
        className: "actions-col u-align--right",
        content: (
          <TableActions
            onDelete={() =>
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.DeleteReservedRange
                ],
                extras: {
                  ipRangeId: ipRange.id,
                },
              })
            }
            onEdit={() =>
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.ReserveRange
                ],
                extras: {
                  ipRangeId: ipRange.id,
                },
              })
            }
          />
        ),
      },
    ];
    if (showSubnetColumn) {
      columns.unshift({
        "aria-label": Labels.Subnet,
        className: "subnet-col",
        content: <SubnetLink id={ipRange.subnet} />,
      });
    }
    return {
      columns,
      expandedContent: expandedContent,
      key: ipRange.id,
      sortData: {
        comment,
        end_ip: ipRange.end_ip,
        owner,
        start_ip: ipRange.start_ip,
        type: ipRange.type,
      },
    };
  });

const ReservedRanges = ({
  hasVLANSubnets,
  subnetId,
  vlanId,
}: Props): JSX.Element | null => {
  const [isAddingDynamic, setIsAddingDynamic] = useState(false);
  const { setSidePanelContent } = useSidePanel();
  const isSubnet = isId(subnetId);
  const ipRangeLoading = useSelector(ipRangeSelectors.loading);
  const ipRanges = useSelector((state: RootState) =>
    isSubnet
      ? ipRangeSelectors.getBySubnet(state, subnetId)
      : ipRangeSelectors.getByVLAN(state, vlanId)
  );
  const isDisabled = isId(vlanId) && !hasVLANSubnets;
  const showSubnetColumn = isId(vlanId);

  useFetchActions([ipRangeActions.fetch]);

  const headers = [
    {
      content: Labels.StartIP,
      className: "start-ip-col",
      sortKey: "start_ip",
    },
    {
      content: Labels.EndIp,
      className: "end-ip-col",
      sortKey: "end_ip",
    },
    {
      content: Labels.Owner,
      className: "owner-col",
      sortKey: "owner",
    },
    {
      content: Labels.Type,
      className: "type-col",
      sortKey: "type",
    },
    {
      content: Labels.Comment,
      className: "comment-col",
      sortKey: "comment",
    },
    {
      content: Labels.Actions,
      className: "actions-col u-align--right",
    },
  ];

  if (showSubnetColumn) {
    headers.unshift({
      content: Labels.Subnet,
      className: "subnet-col",
      sortKey: "subnet",
    });
  }

  const tableStatus = getTableStatus({ isLoading: ipRangeLoading });

  return (
    <TitledSection
      buttons={
        <ContextualMenu
          hasToggleIcon
          links={[
            {
              children: Labels.ReserveRange,
              "data-testid": "reserve-range-menu-item",
              onClick: () => {
                setSidePanelContent({
                  view: SubnetDetailsSidePanelViews[
                    SubnetActionTypes.ReserveRange
                  ],
                  extras: {
                    createType: IPRangeType.Reserved,
                  },
                });
                setIsAddingDynamic(false);
              },
            },
            {
              children: Labels.ReserveDynamicRange,
              "data-testid": "reserve-dynamic-range-menu-item",
              onClick: () => {
                setSidePanelContent({
                  view: SubnetDetailsSidePanelViews[
                    SubnetActionTypes.ReserveRange
                  ],
                  extras: {
                    createType: IPRangeType.Dynamic,
                  },
                });
                setIsAddingDynamic(true);
              },
            },
          ]}
          position="right"
          toggleAppearance="positive"
          toggleDisabled={isDisabled}
          toggleLabel={
            isAddingDynamic ? Labels.ReserveDynamicRange : Labels.ReserveRange
          }
        />
      }
      title="Reserved ranges"
    >
      {isDisabled ? (
        <Notification severity="caution">
          No subnets are available on this VLAN. Ranges cannot be reserved.
        </Notification>
      ) : null}
      <MainTable
        className={classNames(
          "reserved-ranges-table",
          "p-table-expanding--light",
          {
            "reserved-ranges-table--has-subnet": showSubnetColumn,
          }
        )}
        defaultSort="name"
        defaultSortDirection="descending"
        emptyStateMsg={generateEmptyStateMsg(tableStatus, {
          default: `No IP ranges have been reserved for this ${
            isSubnet ? "subnet" : "VLAN"
          }.`,
        })}
        expanding
        headers={headers}
        responsive
        rows={generateRows(ipRanges, showSubnetColumn, setSidePanelContent)}
        sortable
      />
      <ExternalLink to={docsUrls.ipRanges}>About IP ranges</ExternalLink>
    </TitledSection>
  );
};

export default ReservedRanges;
