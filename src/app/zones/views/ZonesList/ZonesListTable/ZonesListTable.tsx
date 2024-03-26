import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useFetchActions } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { FilterDevices } from "@/app/store/device/utils";
import { FilterMachines } from "@/app/store/machine/utils";
import { zoneActions } from "@/app/store/zone";
import zoneSelectors from "@/app/store/zone/selectors";

export enum TestIds {
  ZonesTable = "zones-table",
}

const ZonesListTable = (): JSX.Element => {
  const zones = useSelector(zoneSelectors.all);

  useFetchActions([zoneActions.fetch]);

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
    const devicesFilter = FilterDevices.filtersToQueryString({
      zone: [zone.name],
    });
    const machinesFilter = FilterMachines.filtersToQueryString({
      zone: [zone.name],
    });
    return {
      key: zone.id,
      className: "p-table__row",
      columns: [
        {
          content: (
            <Link to={`${urls.zones.details({ id: zone.id })}`}>
              {zone.name}
            </Link>
          ),
        },
        {
          content: zone.description,
        },
        {
          content: (
            <Link to={`${urls.machines.index}${machinesFilter}`}>
              {zone.machines_count}
            </Link>
          ),
          className: "u-align--right",
        },
        {
          content: (
            <Link to={`${urls.devices.index}${devicesFilter}`}>
              {zone.devices_count}
            </Link>
          ),
          className: "u-align--right",
        },
        {
          content: (
            <Link to={urls.controllers.index}>{zone.controllers_count}</Link>
          ),
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
    <MainTable
      className="p-table--zones"
      data-testid={TestIds.ZonesTable}
      defaultSort="name"
      defaultSortDirection="ascending"
      emptyStateMsg="No zones available."
      headers={headers}
      rows={rows}
      sortable
    />
  );
};

export default ZonesListTable;
