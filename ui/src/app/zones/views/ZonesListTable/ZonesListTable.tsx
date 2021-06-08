import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import zoneSelectors from "app/store/zone/selectors";

const ZonesListTable = (): JSX.Element => {
  const zones = useSelector(zoneSelectors.all);

  const headers = [
    { content: "Name", sortKey: "name" },
    { content: "Description", sortKey: "description" },
    { content: "Machines", sortKey: "machines", className: "u-align--right" },
    { content: "Devices", sortKey: "devices", className: "u-align--right" },
    {
      content: "Controllers",
      sortKey: "controllers",
      className: "u-align--right",
    },
  ];
  const rows = zones.map((zone) => {
    return {
      key: zone.id,
      className: "p-table__row",
      columns: [
        {
          content: zone.name,
        },
        {
          content: zone.description,
        },
        {
          content: zone.machines_count,
          className: "u-align--right",
        },
        {
          content: zone.devices_count,
          className: "u-align--right",
        },
        {
          content: zone.controllers_count,
          className: "u-align--right",
        },
      ],
      sortData: {
        name: zone.name,
        description: zone.description,
        machines: zone.machines_count,
        devices: zone.devices_count,
        controllers: zone.controllers_count,
      },
    };
  });

  return (
    <>
      <MainTable
        className="p-table--zones"
        headers={headers}
        rows={rows}
        sortable
      />
    </>
  );
};

export default ZonesListTable;
