import { useEffect, useState } from "react";

import { List, MainTable, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import TitledSection from "../TitledSection";

import EditDHCP from "./EditDHCP";

import DhcpSnippetType from "app/base/components/DhcpSnippetType";
import TableActions from "app/base/components/TableActions";
import docsUrls from "app/base/docsUrls";
import settingsURLs from "app/settings/urls";
import { actions as dhcpsnippetActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import type { RootState } from "app/store/root/types";
import type { Subnet } from "app/store/subnet/types";
import type { Node } from "app/store/types/node";
import { isId } from "app/utils";

type BaseProps = {
  className?: string;
  modelName: string;
  node?: Node;
  subnets?: Subnet[];
};

type NodeProps = BaseProps & {
  node: Node;
};

type SubnetProps = BaseProps & {
  subnets: Subnet[];
};

export type Props = NodeProps | SubnetProps;

const generateRows = (
  dhcpsnippets: DHCPSnippet[],
  expanded: DHCPSnippet["id"] | null,
  setExpanded: (id: DHCPSnippet["id"] | null) => void,
  node?: Node,
  subnets?: Subnet[]
) =>
  dhcpsnippets.map((dhcpsnippet: DHCPSnippet) => {
    const isExpanded = expanded === dhcpsnippet.id;
    const enabled = dhcpsnippet.enabled ? "Yes" : "No";
    let typeLabel = "Global";
    let appliesTo: string | null = null;
    if (isId(dhcpsnippet.node) && node) {
      typeLabel = "Node";
      appliesTo = node.fqdn;
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
              nodeId={dhcpsnippet.node}
              subnetId={dhcpsnippet.subnet}
            />
          ),
        },
        {
          content: appliesTo,
          "data-testid": "snippet-applies-to",
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
  modelName,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    dispatch(dhcpsnippetActions.fetch());
  }, [dispatch]);

  return (
    <TitledSection className={className} title="DHCP snippets">
      {node || subnets?.length ? (
        <>
          <MainTable
            className="dhcp-snippets-table p-table-expanding--light"
            defaultSort="name"
            defaultSortDirection="descending"
            emptyStateMsg={
              dhcpsnippetLoading ? (
                <Spinner text="Loading..." />
              ) : (
                `No DHCP snippets applied to this ${modelName}.`
              )
            }
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
              subnets
            )}
            sortable
          />
          <List
            items={[
              <Link to={settingsURLs.dhcp.index}>
                All snippets: Settings &gt; DHCP snippets
              </Link>,
              <a href={docsUrls.dhcp} rel="noreferrer noopener" target="_blank">
                About DHCP snippets
              </a>,
            ]}
            middot
          />
        </>
      ) : null}
    </TitledSection>
  );
};

export default DHCPTable;
