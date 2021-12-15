import { useEffect } from "react";

import { MainTable } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
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
            <Link to={`${zonesURLs.details({ id: zone.id })}`}>
              {zone.name}
            </Link>
          ),
        },
        {
          content: zone.description,
        },
        {
          content: (
            <Link to={`${machineURLs.machines.index}${machinesFilter}`}>
              {zone.machines_count}
            </Link>
          ),
          className: "u-align--right",
        },
        {
          content: (
            <Link to={`${deviceURLs.devices.index}${devicesFilter}`}>
              {zone.devices_count}
            </Link>
          ),
          className: "u-align--right",
        },
        {
          content: (
            <LegacyLink route={baseURLs.controllers}>
              {zone.controllers_count}
            </LegacyLink>
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
