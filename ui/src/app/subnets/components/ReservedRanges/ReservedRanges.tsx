import { useEffect, useState } from "react";

import { MainTable, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import TableActions from "app/base/components/TableActions";
import TitledSection from "app/base/components/TitledSection";
import { actions as ipRangeActions } from "app/store/iprange";
import ipRangeSelectors from "app/store/iprange/selectors";
import type { IPRange, IPRangeMeta } from "app/store/iprange/types";
import { IPRangeType } from "app/store/iprange/types";
import type { RootState } from "app/store/root/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { isId } from "app/utils";

export type SubnetProps = {
  subnetId: Subnet[SubnetMeta.PK] | null;
  vlanId?: never;
};

export type VLANProps = {
  subnetId?: never;
  vlanId: VLAN[VLANMeta.PK] | null;
};

export type Props = SubnetProps | VLANProps;

export enum Labels {
  StartIP = "Start IP Address",
  EndIp = "End IP Address",
  Owner = "Owner",
  Type = "Type",
  Comment = "Comment",
  Actions = "Actions",
}

const generateRows = (
  ipRanges: IPRange[],
  expanded: IPRange["id"] | null,
  setExpanded: (id: IPRange["id"] | null) => void
) =>
  ipRanges.map((ipRange: IPRange) => {
    const isExpanded = expanded === ipRange.id;
    const isDynamic = ipRange.type === IPRangeType.Dynamic;
    const owner = isDynamic ? "MAAS" : ipRange.user;
    const comment = isDynamic ? "Dynamic" : ipRange.comment;
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
          content: isDynamic ? "Dynamic" : "Reserved",
        },
        { "aria-label": Labels.Comment, content: comment },
        {
          "aria-label": Labels.Actions,
          content: (
            <TableActions
              onEdit={() => {
                setExpanded(expanded === ipRange.id ? null : ipRange.id);
              }}
              onDelete={() => {
                setExpanded(expanded === ipRange.id ? null : ipRange.id);
              }}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: isExpanded,
      // TODO: Implement the edit form:
      // https://github.com/canonical-web-and-design/app-tribe/issues/663
      expandedContent: isExpanded && "Edit",
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

const ReservedRanges = ({ subnetId, vlanId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<IPRange[IPRangeMeta.PK] | null>(
    null
  );
  const isSubnet = isId(subnetId);
  const ipRangeLoading = useSelector(ipRangeSelectors.loading);
  const ipRanges = useSelector((state: RootState) =>
    isSubnet
      ? ipRangeSelectors.getBySubnet(state, subnetId)
      : ipRangeSelectors.getByVLAN(state, vlanId)
  );

  useEffect(() => {
    dispatch(ipRangeActions.fetch());
  }, [dispatch]);

  return (
    <TitledSection title="Reserved ranges">
      <MainTable
        className="reserved-ranges-table p-table-expanding--light"
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
        rows={generateRows(ipRanges, expanded, setExpanded)}
        sortable
      />
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
