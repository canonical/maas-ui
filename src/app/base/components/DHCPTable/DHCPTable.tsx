import { useState } from "react";

import { ExternalLink } from "@canonical/maas-react-components";
import { List, MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TitledSection from "../TitledSection";

import EditDHCP from "./EditDHCP";

import DhcpSnippetType from "@/app/base/components/DhcpSnippetType";
import TableActions from "@/app/base/components/TableActions";
import docsUrls from "@/app/base/docsUrls";
import { useFetchActions } from "@/app/base/hooks";
import settingsURLs from "@/app/settings/urls";
import { dhcpsnippetActions } from "@/app/store/dhcpsnippet";
import dhcpsnippetSelectors from "@/app/store/dhcpsnippet/selectors";
import type { DHCPSnippet } from "@/app/store/dhcpsnippet/types";
import type { IPRange } from "@/app/store/iprange/types";
import { getIpRangeDisplayName } from "@/app/store/iprange/utils";
import type { RootState } from "@/app/store/root/types";
import type { Subnet } from "@/app/store/subnet/types";
import type { Node } from "@/app/store/types/node";
import { generateEmptyStateMsg, getTableStatus, isId } from "@/app/utils";

type BaseProps = {
  className?: string;
  modelName: string;
  node?: Node;
  subnets?: Subnet[];
  ipRanges?: IPRange[];
};

type NodeProps = BaseProps & {
  node: Node;
};

type SubnetProps = BaseProps & {
  subnets: Subnet[];
};

export type Props = NodeProps | SubnetProps;

export enum Labels {
  LoadingData = "Loading DHCP snippets",
  SectionTitle = "DHCP snippets",
}

export enum TestIds {
  AppliesTo = "snippet-applies-to",
}

const generateRows = (
  dhcpsnippets: DHCPSnippet[],
  expanded: DHCPSnippet["id"] | null,
  setExpanded: (id: DHCPSnippet["id"] | null) => void,
  node?: Node,
  subnets?: Subnet[],
  ipranges?: IPRange[]
) =>
  dhcpsnippets.map((dhcpsnippet: DHCPSnippet) => {
    const isExpanded = expanded === dhcpsnippet.id;
    const enabled = dhcpsnippet.enabled ? "Yes" : "No";
    let typeLabel = "Global";
    let appliesTo: string | null = null;
    if (isId(dhcpsnippet.node) && node) {
      typeLabel = "Node";
      appliesTo = node.fqdn;
    } else if (isId(dhcpsnippet.iprange) && ipranges?.length) {
      typeLabel = "IP Range";
      const ipRange = ipranges.find(({ id }) => id === dhcpsnippet.iprange);
      appliesTo = getIpRangeDisplayName(ipRange);
    } else if (isId(dhcpsnippet.subnet) && subnets?.length) {
      typeLabel = "Subnet";
      appliesTo =
        subnets.find(({ id }) => id === dhcpsnippet.subnet)?.name || "";
    }
    return {
      className: isExpanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: dhcpsnippet.name,
          role: "rowheader",
        },
        {
          content: (
            <DhcpSnippetType
              ipRangeId={dhcpsnippet.iprange}
              nodeId={dhcpsnippet.node}
              subnetId={dhcpsnippet.subnet}
            />
          ),
        },
        {
          content: appliesTo,
          "data-testid": TestIds.AppliesTo,
        },
        { content: enabled },
        { content: dhcpsnippet.description },
        {
          content: (
            <TableActions
              onEdit={() => {
                setExpanded(
                  expanded === dhcpsnippet.id ? null : dhcpsnippet.id
                );
              }}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: isExpanded,
      expandedContent: isExpanded && (
        <EditDHCP
          close={() => {
            setExpanded(null);
          }}
          id={dhcpsnippet.id}
        />
      ),
      key: dhcpsnippet.id,
      sortData: {
        name: dhcpsnippet.name,
        description: dhcpsnippet.description,
        enabled,
        target: appliesTo,
        type: typeLabel,
      },
    };
  });

const DHCPTable = ({
  className,
  node,
  subnets,
  ipRanges,
  modelName,
}: Props): JSX.Element | null => {
  const [expanded, setExpanded] = useState<DHCPSnippet["id"] | null>(null);
  const dhcpsnippetLoading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippets = useSelector((state: RootState) =>
    node
      ? dhcpsnippetSelectors.getByNode(state, node?.system_id)
      : dhcpsnippetSelectors.getBySubnets(
          state,
          subnets?.map(({ id }) => id)
        )
  );

  useFetchActions([dhcpsnippetActions.fetch]);
  const tableStatus = getTableStatus({ isLoading: dhcpsnippetLoading });

  return (
    <TitledSection className={className} title={Labels.SectionTitle}>
      {node || subnets?.length ? (
        <>
          <MainTable
            className="dhcp-snippets-table p-table-expanding--light"
            defaultSort="name"
            defaultSortDirection="descending"
            emptyStateMsg={generateEmptyStateMsg(tableStatus, {
              default: `No DHCP snippets applied to this ${modelName}.`,
            })}
            expanding
            headers={[
              {
                content: "Name",
                sortKey: "name",
              },
              {
                content: "Type",
                sortKey: "type",
              },
              {
                content: "Applies to",
                sortKey: "target",
              },
              {
                content: "Enabled",
                sortKey: "enabled",
              },
              {
                content: "Description",
                sortKey: "description",
              },
              {
                content: "Actions",
                className: "u-align--right",
              },
            ]}
            rows={generateRows(
              dhcpsnippets,
              expanded,
              setExpanded,
              node,
              subnets,
              ipRanges
            )}
            sortable
          />
          <List
            items={[
              <Link to={settingsURLs.dhcp.index}>
                All snippets: Settings &gt; DHCP snippets
              </Link>,
              <ExternalLink to={docsUrls.dhcp}>
                About DHCP snippets
              </ExternalLink>,
            ]}
            middot
          />
        </>
      ) : null}
    </TitledSection>
  );
};

export default DHCPTable;
