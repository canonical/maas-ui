import { useState } from "react";

import {
  MainTable,
  ContextualMenu,
  Row,
  Col,
  Button,
} from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import domainURLs from "app/domains/urls";
import domainSelectors from "app/store/domain/selectors";

const DomainsTable = (): JSX.Element => {
  const domains = useSelector(domainSelectors.all);
  const [expandedID, setExpandedID] = useState(-1);
  const headers = [
    {
      content: "Domain",
      sortKey: "name",
      "data-test": "domain-name-header",
    },
    {
      content: "Authoriatative",
      sortKey: "authoritative",
    },
    {
      content: "Hosts",
      sortKey: "hosts",
      className: "u-align--right",
    },
    {
      content: "Total records",
      sortKey: "records",
      className: "u-align--right",
    },
    {
      content: "Actions",
      className: "u-align--right",
    },
  ];

  const rows = domains.map((domain) => {
    const isActive = expandedID === domain.id;
    return {
      // making sure we don't pass id directly as a key because of
      // https://github.com/canonical-web-and-design/react-components/issues/476
      key: `domain-row-${domain.id}`,
      className: `p-table__row ${isActive ? "is-active" : ""}`,
      columns: [
        {
          content: (
            <Link to={domainURLs.details({ id: domain.id })}>
              {domain.is_default ? `${domain.name} (default)` : domain.name}
            </Link>
          ),
          "data-test": "domain-name",
        },
        {
          content: domain.authoritative ? "Yes" : "No",
        },
        {
          content: domain.hosts,
          className: "u-align--right",
        },
        {
          content: domain.resource_count,
          className: "u-align--right",
        },
        {
          content: (
            <ContextualMenu
              hasToggleIcon={true}
              toggleAppearance="base"
              links={[
                {
                  children: "Set default...",
                  onClick: () => {
                    setExpandedID(domain.id);
                  },
                },
              ]}
            />
          ),
          className: "u-align--right",
        },
      ],
      expanded: isActive,
      expandedContent: (
        <ExpandedContent setExpandedID={setExpandedID} id={domain.id} />
      ),
      sortData: {
        name: domain.name,
        authoritative: domain.authoritative,
        hosts: domain.hosts,
        records: domain.resource_count,
      },
    };
  });

  return (
    <MainTable
      data-test="domains-table"
      headers={headers}
      rows={rows}
      paginate={50}
      sortable
      defaultSort="name"
      defaultSortDirection="ascending"
      expanding={true}
    />
  );
};

const ExpandedContent = ({ setExpandedID, id }): JSX.Element => {
  return (
    <Row>
      <Col>
        <hr />
      </Col>
      <Col size="9">
        Setting this domain as the default will update all existing machines (in
        Ready state) with the new default domain. Are you sure?
      </Col>
      <Col size="3" className="u-align--right">
        <Button
          appearance="base"
          onClick={() => {
            setExpandedID(-1);
          }}
        >
          Cancel
        </Button>
        <Button
          appearance="positive"
          onClick={() => {
            console.log(id);
          }}
        >
          Save
        </Button>
      </Col>
    </Row>
  );
};

export default DomainsTable;
