import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import zoneSelectors from "app/store/zone/selectors";

const ZonesListTable = (): JSX.Element => {
  const zones = useSelector(zoneSelectors.all);

  const headers = [
    { content: "Name" },
    { content: "Description" },
    { content: "Machines", className: "u-align--right" },
    { content: "Devices", className: "u-align--right" },
    { content: "Controllers", className: "u-align--right" },
  ];
  console.log(zones);
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
