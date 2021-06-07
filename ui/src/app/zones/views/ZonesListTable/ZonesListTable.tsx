import { MainTable } from "@canonical/react-components";

import TableHeader from "app/base/components/TableHeader";

const ZonesListTable = (): JSX.Element => {
  const columns = [
    {
      key: "fqdn",
      className: "fqdn-col",
      content: <NameColumn data-test="fqdn-column" />,
    },
  ];
  const headers = [
    {
      key: "name",
      className: "name-col",
      content: (
        <TableHeader data-test="name-header" sortKey="name">
          Name
        </TableHeader>
      ),
    },
    {
      key: "description",
      className: "description-col",
      content: (
        <TableHeader data-test="description-header" sortKey="description">
          Description
        </TableHeader>
      ),
    },
    {
      key: "machines",
      className: "machines-col u-align--right",
      content: (
        <TableHeader data-test="machines-header" sortKey="machines">
          Machines
        </TableHeader>
      ),
    },
    {
      key: "devices",
      className: "devices-col u-align--right",
      content: (
        <TableHeader data-test="devices-header" sortKey="devices">
          devices
        </TableHeader>
      ),
    },
    {
      key: "controllers",
      className: "controllers-col u-align--right",
      content: (
        <TableHeader data-test="controllers-header" sortKey="controllers">
          Controllers
        </TableHeader>
      ),
    },
  ];

  return (
    <>
      <MainTable className="p-table--zones" headers={headers} rows={columns} />
    </>
  );
};

export default ZonesListTable;
