import { useEffect, useState } from "react";

import { List, MainTable, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TableActions from "app/base/components/TableActions";
import { actions as dhcpsnippetActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { DHCPSnippet } from "app/store/dhcpsnippet/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

const generateRows = (
  dhcpsnippets: DHCPSnippet[],
  expanded: DHCPSnippet["id"] | null,
  machine: Machine,
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
          content: machine.fqdn,
        },
        { content: enabled },
        { content: dhcpsnippet.description },
        {
          content: (
            <TableActions
              onEdit={() => {
                setExpanded(expanded ? null : dhcpsnippet.id);
              }}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: isExpanded,
      expandedContent: isExpanded && <>Edit {dhcpsnippet.name}</>,
      key: dhcpsnippet.id,
      sortData: {
        name: dhcpsnippet.name,
        description: dhcpsnippet.description,
        enabled,
        target: machine.fqdn,
        type,
      },
    };
  });

type Props = {
  systemId: Machine["system_id"];
};

const EditDHCP = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<DHCPSnippet["id"] | null>(null);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const dhcpsnippetLoading = useSelector(dhcpsnippetSelectors.loading);
  const dhcpsnippets = useSelector((state: RootState) =>
    dhcpsnippetSelectors.getByNode(state, systemId)
  );

  useEffect(() => {
    dispatch(dhcpsnippetActions.fetch());
  }, [dispatch]);

  if (!machine) {
    return null;
  }

  if (dhcpsnippetLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h2 className="p-heading--four">DHCP snippets</h2>
      <MainTable
        className="dhcp-snippets-table p-table-expanding--light"
        defaultSort="name"
        defaultSortDirection="descending"
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
        rows={generateRows(dhcpsnippets, expanded, machine, setExpanded)}
        sortable
      />
      <List
        items={[
          <Link to="/settings/dhcp">
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
  );
};

export default EditDHCP;
