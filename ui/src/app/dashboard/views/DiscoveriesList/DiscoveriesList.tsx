import { useEffect } from "react";

import { MainTable, Tooltip, Icon } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import DiscoveriesListHeader from "../DiscoveriesListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";

const DiscoveriesList = (): JSX.Element => {
  useWindowTitle("Dashboard");

  const discoveries = useSelector(discoverySelectors.all);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch());
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
  const rows = discoveries.map((discovery) => {
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
            <>
              <div className="u-truncate">
                {discovery.mac_address || "Unknown"}
              </div>
              <div className="u-truncate">
                <small>{discovery.mac_organization}</small>
              </div>
            </>
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
          content: discovery.last_seen,
          className: "p-table--network-discoveries__last-seen",
        },
        {
          content: "",
          className: "p-table--network-discoveries__chevron",
        },
      ],
      sortData: {
        hostname: discovery.hostname,
        mac_address: discovery.mac_address,
        ip: discovery.ip,
        rack: discovery.observer_hostname,
        last_seen: discovery.last_seen,
      },
    };
  });

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <MainTable
        className="p-table--network-discoveries"
        data-test="discoveries-table"
        defaultSort="last_seen"
        defaultSortDirection="ascending"
        headers={headers}
        rows={rows}
        sortable
      />
    </Section>
  );
};

export default DiscoveriesList;
