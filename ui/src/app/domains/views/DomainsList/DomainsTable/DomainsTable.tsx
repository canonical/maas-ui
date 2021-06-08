import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import domainSelectors from "app/store/domain/selectors";

const DomainsTable = (): JSX.Element => {
  const domains = useSelector(domainSelectors.all);

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
    return {
      // making sure we don't pass id directly as a key because of
      // https://github.com/canonical-web-and-design/react-components/issues/476
      key: `domain-row-${domain.id}`,
      className: "p-table__row",
      columns: [
        {
          content: domain.name,
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
          content: "",
          className: "u-align--right",
        },
      ],
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
    />
  );
};

export default DomainsTable;
