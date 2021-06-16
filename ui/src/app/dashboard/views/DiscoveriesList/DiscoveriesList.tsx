import { useEffect, useState } from "react";

import {
  MainTable,
  Tooltip,
  Icon,
  SearchBox,
} from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import DiscoveryEditForm from "../DiscoveryEditForm";

import { useWindowTitle } from "app/base/hooks";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { actions as discoveryActions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

const DiscoveriesList = (): JSX.Element => {
  const [searchString, setSearchString] = useState("");
  useWindowTitle("Dashboard");

  const discoveries = useSelector((state: RootState) =>
    discoverySelectors.search(state, searchString)
  );
  const [expandedRow, setExpandedRow] = useState(null);

  const domains = useSelector(domainSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const devices = useSelector(deviceSelectors.all);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(discoveryActions.fetch());
    dispatch(domainActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
    dispatch(machineActions.fetch());
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  const headers = [
    {
      content: "Name",
      sortKey: "hostname",
      className: "p-table--network-discoveries__name",
    },
    {
      content: "Mac address",
      sortKey: "mac_address",
      className: "p-table--network-discoveries__mac",
    },
    {
      content: "IP",
      sortKey: "ip",
      className: "p-table--network-discoveries__ip",
    },
    {
      content: "Rack",
      sortKey: "rack",
      className: "p-table--network-discoveries__rack",
    },
    {
      content: "Last seen",
      sortKey: "last_seen",
      className: "p-table--network-discoveries__last-seen",
    },
    {
      content: "Action",
      className: "p-table--network-discoveries__chevron u-align--right",
    },
  ];

  const rows = discoveries.map((discovery, index) => {
    return {
      key: discovery.id,
      className: "p-table__row",
      columns: [
        {
          content: (
            <>
              {discovery.hostname || "Unknown"}
              {discovery.is_external_dhcp ? (
                <Tooltip
                  message="This device is providing DHCP"
                  className="u-nudge-right"
                  position="top-center"
                >
                  <Icon name="information" />
                </Tooltip>
              ) : null}
            </>
          ),
          className: "p-table--network-discoveries__name",
        },
        {
          content: (
            <div>
              <div className="u-truncate">
                {discovery.mac_address || "Unknown"}
              </div>
              <div className="u-truncate">
                <small>{discovery.mac_organization}</small>
              </div>
            </div>
          ),
          className: "p-table--network-discoveries__mac",
        },
        {
          content: discovery.ip,
          className: "p-table--network-discoveries__ip",
        },
        {
          content: discovery.observer_hostname,
          className: "p-table--network-discoveries__rack",
        },
        {
          content: <div className="u-truncate">{discovery.last_seen}</div>,
          className: "p-table--network-discoveries__last-seen",
        },
        {
          content: (
            <button
              className="u-toggle p-button--base"
              onClick={() =>
                setExpandedRow(expandedRow === index ? null : index)
              }
            >
              {expandedRow === index ? (
                <i className="p-icon--close">Close edit panel</i>
              ) : (
                <i className="p-icon--chevron-down">Expande edit panel</i>
              )}
            </button>
          ),
          className: "p-table--network-discoveries__chevron u-align--right",
        },
      ],
      sortData: {
        hostname: discovery.hostname,
        mac_address: discovery.mac_address,
        ip: discovery.ip,
        rack: discovery.observer_hostname,
        last_seen: discovery.last_seen,
      },
      expanded: expandedRow === index,
      expandedContent: (
        <DiscoveryEditForm
          discovery={discovery}
          domains={domains}
          subnet={subnets.find(
            (subnet) => subnet.cidr === discovery.subnet_cidr
          )}
          vlan={vlans.find((vlan) => vlan.id === discovery.vlan)}
          machines={machines.filter((machine) => machine.status_code === 6)}
          devices={devices}
        />
      ),
    };
  });

  const handlechange = (value: string) => {
    setSearchString(value.toLowerCase());
  };

  return (
    <>
      <SearchBox
        data-test="discoveries-search"
        onChange={(value: string) => handlechange(value)}
      />
      <MainTable
        className="p-table--network-discoveries"
        data-test="discoveries-table"
        defaultSort="last_seen"
        defaultSortDirection="ascending"
        headers={headers}
        rows={rows}
        sortable
        expanding
      />
    </>
  );
};

export default DiscoveriesList;
