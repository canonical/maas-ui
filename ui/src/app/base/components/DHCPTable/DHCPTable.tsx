import { useEffect, useState } from "react";

import { List, MainTable, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import EditDHCP from "./EditDHCP";

import TableActions from "app/base/components/TableActions";
import settingsURLs from "app/settings/urls";
import { actions as dhcpsnippetActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import type { RootState } from "app/store/root/types";
import type { Node } from "app/store/types/node";

const generateRows = (
  dhcpsnippets: DHCPSnippet[],
  expanded: DHCPSnippet["id"] | null,
  node: Node,
  setExpanded: (id: DHCPSnippet["id"] | null) => void
) =>
  dhcpsnippets.map((dhcpsnippet: DHCPSnippet) => {
    const isExpanded = expanded === dhcpsnippet.id;
    const enabled = dhcpsnippet.enabled ? "Yes" : "No";
    const type =
      (dhcpsnippet.node && "Node") ||
      (dhcpsnippet.subnet && "Subnet") ||
      "Global";
    return {
      className: isExpanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: dhcpsnippet.name,
          role: "rowheader",
        },
        {
          content: type,
        },
        {
          content: node.fqdn,
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
        target: node.fqdn,
        type,
      },
    };
  });

type Props = {
  node: Node;
  nodeType: string;
};

const DHCPTable = ({ node, nodeType }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<DHCPSnippet["id"] | null>(null);
  const dhcpsnippetLoading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippets = useSelector((state: RootState) =>
    dhcpsnippetSelectors.getByNode(state, node.system_id)
  );

  useEffect(() => {
    dispatch(dhcpsnippetActions.fetch());
  }, [dispatch]);

  return (
    <>
      <h2 className="p-heading--four">DHCP snippets</h2>
      {node ? (
        <>
          <MainTable
            className="dhcp-snippets-table p-table-expanding--light"
            defaultSort="name"
            defaultSortDirection="descending"
            emptyStateMsg={
              dhcpsnippetLoading ? (
                <Spinner text="Loading..." />
              ) : (
                `No DHCP snippets applied to this ${nodeType}.`
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
            rows={generateRows(dhcpsnippets, expanded, node, setExpanded)}
            sortable
          />
          <List
            items={[
              <Link to={settingsURLs.dhcp.index}>
                All snippets: Settings &gt; DHCP snippets
              </Link>,
              <a
                className="p-link--external"
                href="https://maas.io/docs/dhcp"
                rel="noreferrer"
                target="_blank"
              >
                About DHCP snippets
              </a>,
            ]}
            middot
          />
        </>
      ) : null}
    </>
  );
};

export default DHCPTable;
