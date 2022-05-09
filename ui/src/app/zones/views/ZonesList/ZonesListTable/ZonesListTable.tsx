import { useEffect } from "react";

import { MainTable } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import controllersURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import { FilterDevices } from "app/store/device/utils";
import { FilterMachines } from "app/store/machine/utils";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import zonesURLs from "app/zones/urls";

const ZonesListTable = (): JSX.Element => {
  const zones = useSelector(zoneSelectors.all);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  const headers = [
    { content: "Name", sortKey: "name" },
    { content: "Description", sortKey: "description" },
    { className: "u-align--right", content: "Machines", sortKey: "machines" },
    { className: "u-align--right", content: "Devices", sortKey: "devices" },
    {
      className: "u-align--right",
      content: "Controllers",
      sortKey: "controllers",
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
      className: "p-table__row",
      columns: [
        {
          content: (
            <Link to={`${zonesURLs.details({ id: zone.id })}`}>
              {zone.name}
            </Link>
          ),
        },
        {
          content: zone.description,
        },
        {
          className: "u-align--right",
          content: (
            <Link to={`${machineURLs.machines.index}${machinesFilter}`}>
              {zone.machines_count}
            </Link>
          ),
        },
        {
          className: "u-align--right",
          content: (
            <Link to={`${deviceURLs.devices.index}${devicesFilter}`}>
              {zone.devices_count}
            </Link>
          ),
        },
        {
          className: "u-align--right",
          content: (
            <Link to={controllersURLs.controllers.index}>
              {zone.controllers_count}
            </Link>
          ),
        },
      ],
      key: zone.id,
      sortData: {
        controllers: zone.controllers_count,
        description: zone.description,
        devices: zone.devices_count,
        machines: zone.machines_count,
        name: zone.name,
      },
    };
  });

  return (
    <MainTable
      className="p-table--zones"
      data-testid="zones-table"
      defaultSort="name"
      defaultSortDirection="ascending"
      headers={headers}
      rows={rows}
      sortable
    />
  );
};

export default ZonesListTable;
