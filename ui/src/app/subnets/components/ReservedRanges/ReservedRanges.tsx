import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import {
  ContextualMenu,
  MainTable,
  Notification,
  Spinner,
} from "@canonical/react-components";
import type { MainTableCell } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import ReservedRangeForm from "../ReservedRangeForm";

import FormCard from "app/base/components/FormCard";
import SubnetLink from "app/base/components/SubnetLink";
import TableActions from "app/base/components/TableActions";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import TitledSection from "app/base/components/TitledSection";
import { actions as ipRangeActions } from "app/store/iprange";
import ipRangeSelectors from "app/store/iprange/selectors";
import type { IPRange, IPRangeMeta } from "app/store/iprange/types";
import { IPRangeType } from "app/store/iprange/types";
import {
  getCommentDisplay,
  getOwnerDisplay,
  getTypeDisplay,
} from "app/store/iprange/utils";
import type { RootState } from "app/store/root/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { isId } from "app/utils";

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

type Expanded = {
  id?: IPRange[IPRangeMeta.PK];
  type: ExpandedType;
};

const toggleExpanded = (
  id: IPRange[IPRangeMeta.PK],
  expanded: Expanded | null,
  expandedType: ExpandedType,
  setExpanded: (expanded: Expanded | null) => void
) =>
  setExpanded(
    expanded?.id === id && expanded.type === expandedType
      ? null
      : {
          id,
          type: expandedType,
        }
  );

const generateRows = (
  dispatch: Dispatch,
  ipRanges: IPRange[],
  expanded: Expanded | null,
  setExpanded: (expanded: Expanded | null) => void,
  saved: boolean,
  saving: boolean,
  showSubnetColumn: boolean
) =>
  ipRanges.map((ipRange: IPRange) => {
    const isExpanded = expanded?.id === ipRange.id;
    const comment = getCommentDisplay(ipRange);
    const owner = getOwnerDisplay(ipRange);
    const type = getTypeDisplay(ipRange);
    let expandedContent: ReactNode | null = null;
    const onClose = () => setExpanded(null);
    if (expanded?.type === ExpandedType.Delete) {
      expandedContent = (
        <TableDeleteConfirm
          deleted={saved}
          deleting={saving}
          message="Ensure all in-use IP addresses are registered in MAAS before releasing this range to avoid potential collisions. Are you sure you want to remove this IP range?"
          onClose={onClose}
          onConfirm={() => {
            dispatch(ipRangeActions.delete(ipRange.id));
          }}
          sidebar={false}
        />
      );
    } else if (expanded?.type === ExpandedType.Update) {
      expandedContent = <ReservedRangeForm onClose={onClose} id={ipRange.id} />;
    }
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
            onDelete={() => {
              toggleExpanded(
                ipRange.id,
                expanded,
                ExpandedType.Delete,
                setExpanded
              );
            }}
            onEdit={() => {
              toggleExpanded(
                ipRange.id,
                expanded,
                ExpandedType.Update,
                setExpanded
              );
            }}
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
      className: isExpanded ? "p-table__row is-active" : null,
      columns,
      expanded: isExpanded,
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
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const isSubnet = isId(subnetId);
  const ipRangeLoading = useSelector(ipRangeSelectors.loading);
  const saved = useSelector(ipRangeSelectors.saved);
  const saving = useSelector(ipRangeSelectors.saving);
  const ipRanges = useSelector((state: RootState) =>
    isSubnet
      ? ipRangeSelectors.getBySubnet(state, subnetId)
      : ipRangeSelectors.getByVLAN(state, vlanId)
  );
  const isAddingDynamic = expanded?.type === ExpandedType.CreateDynamic;
  const isAdding = expanded?.type === ExpandedType.Create || isAddingDynamic;
  const isDisabled = isId(vlanId) && !hasVLANSubnets;
  const showSubnetColumn = isId(vlanId);

  useEffect(() => {
    dispatch(ipRangeActions.fetch());
  }, [dispatch]);

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

  return (
    <TitledSection
      buttons={
        <ContextualMenu
          toggleLabel={
            isAddingDynamic ? Labels.ReserveDynamicRange : Labels.ReserveRange
          }
          toggleAppearance="positive"
          toggleDisabled={isDisabled}
          hasToggleIcon
          position="right"
          links={[
            {
              children: Labels.ReserveRange,
              "data-testid": "reserve-range-menu-item",
              onClick: () => setExpanded({ type: ExpandedType.Create }),
            },
            {
              children: Labels.ReserveDynamicRange,
              "data-testid": "reserve-dynamic-range-menu-item",
              onClick: () => setExpanded({ type: ExpandedType.CreateDynamic }),
            },
          ]}
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
        responsive
        defaultSort="name"
        defaultSortDirection="descending"
        emptyStateMsg={
          ipRangeLoading ? (
            <Spinner text="Loading..." />
          ) : (
            `No IP ranges have been reserved for this ${
              isSubnet ? "subnet" : "VLAN"
            }.`
          )
        }
        expanding
        headers={headers}
        rows={generateRows(
          dispatch,
          ipRanges,
          expanded,
          setExpanded,
          saved,
          saving,
          showSubnetColumn
        )}
        sortable
      />
      {isAdding ? (
        <FormCard sidebar={false}>
          <ReservedRangeForm
            onClose={() => setExpanded(null)}
            createType={
              isAddingDynamic ? IPRangeType.Dynamic : IPRangeType.Reserved
            }
            subnetId={subnetId}
          />
        </FormCard>
      ) : null}
      <a
        href="https://maas.io/docs/ip-ranges"
        rel="noreferrer noopener"
        target="_blank"
      >
        About IP ranges
      </a>
    </TitledSection>
  );
};

export default ReservedRanges;
