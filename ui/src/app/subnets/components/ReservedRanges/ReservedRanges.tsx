import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import {
  ContextualMenu,
  MainTable,
  Notification,
  Spinner,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";

import ReservedRangeForm from "../ReservedRangeForm";

import FormCard from "app/base/components/FormCard";
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
  saving: boolean
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
    return {
      className: isExpanded ? "p-table__row is-active" : null,
      columns: [
        {
          "aria-label": Labels.StartIP,
          content: ipRange.start_ip,
        },
        {
          "aria-label": Labels.EndIp,
          content: ipRange.end_ip,
        },
        {
          "aria-label": Labels.Owner,
          content: owner,
        },
        {
          "aria-label": Labels.Type,
          content: type,
        },
        { "aria-label": Labels.Comment, content: comment },
        {
          "aria-label": Labels.Actions,
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
          className: "u-align--right",
        },
      ],
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

  useEffect(() => {
    dispatch(ipRangeActions.fetch());
  }, [dispatch]);

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
        className="reserved-ranges-table p-table-expanding--light"
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
        headers={[
          {
            content: Labels.StartIP,
            sortKey: "start_ip",
          },
          {
            content: Labels.EndIp,
            sortKey: "end_ip",
          },
          {
            content: Labels.Owner,
            sortKey: "owner",
          },
          {
            content: Labels.Type,
            sortKey: "type",
          },
          {
            content: Labels.Comment,
            sortKey: "comment",
          },
          {
            content: Labels.Actions,
            className: "u-align--right",
          },
        ]}
        rows={generateRows(
          dispatch,
          ipRanges,
          expanded,
          setExpanded,
          saved,
          saving
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
        className="p-link--external"
        href="https://maas.io/docs/ip-ranges"
        rel="noreferrer"
        target="_blank"
      >
        About IP ranges
      </a>
    </TitledSection>
  );
};

export default ReservedRanges;
