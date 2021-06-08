import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import domainSelectors from "app/store/domain/selectors";

const DomainsTable = (): JSX.Element => {
  const domains = useSelector(domainSelectors.all);

  const headers = [
    { content: "Domain" },
    { content: "Authoriatative" },
    { content: "Hosts", className: "u-align--right" },
    { content: "Total records", className: "u-align--right" },
    { content: "Actions", className: "u-align--right" },
  ];
  const rows = domains.map((domain) => {
    return {
      key: domain.id,
      className: "p-table__row",
      columns: [
        {
          content: domain.name,
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
    };
  });

  return (
    <MainTable
      headers={headers}
      paginate={50}
      rows={rows}
      data-test="domains-table"
    />
  );
};

export default DomainsTable;
