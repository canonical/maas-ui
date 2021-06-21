import { useEffect, useState } from "react";

import {
  MainTable,
  Tooltip,
  Icon,
  SearchBox,
} from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import { useWindowTitle } from "app/base/hooks";
import { actions as discoveryActions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";
import type { Discovery } from "app/store/discovery/types";
import { DiscoveryMeta } from "app/store/discovery/types";
import type { RootState } from "app/store/root/types";

const generateRows = (discoveries: Discovery[]) =>
  discoveries.map((discovery) => {
    return {
      key: discovery[DiscoveryMeta.PK],
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
        },
        {
          content: (
            <DoubleRow
              primary={discovery.mac_address}
              secondary={discovery.mac_organization || "Unknown"}
            />
          ),
        },
        {
          content: discovery.ip,
        },
        {
          content: discovery.observer_hostname,
        },
        {
          content: <div className="u-truncate">{discovery.last_seen}</div>,
        },
        {
          content: "",
        },
      ],
      sortData: {
        hostname: discovery.hostname,
        ip: discovery.ip,
        lastSeen: discovery.last_seen,
        macAddress: discovery.mac_address,
        rack: discovery.observer_hostname,
      },
    };
  });

const DiscoveriesList = (): JSX.Element => {
  const dispatch = useDispatch();
  const [searchString, setSearchString] = useState("");
  const discoveries = useSelector((state: RootState) =>
    discoverySelectors.search(state, searchString)
  );
  useWindowTitle("Dashboard");

  useEffect(() => {
    dispatch(discoveryActions.fetch());
  }, [dispatch]);

  const headers = [
    {
      content: "Name",
      sortKey: "hostname",
    },
    {
      content: "Mac address",
      sortKey: "macAddress",
    },
    {
      content: "IP",
      sortKey: "ip",
    },
    {
      content: "Rack",
      sortKey: "rack",
    },
    {
      content: "Last seen",
      sortKey: "lastSeen",
    },
    {
      content: "Action",
      className: "u-align--right",
    },
  ];

  return (
    <>
      <SearchBox
        data-test="discoveries-search"
        onChange={(value: string) => setSearchString(value.toLowerCase())}
      />
      <MainTable
        className="p-table--network-discoveries p-table-expanding--light"
        data-test="discoveries-table"
        defaultSort="lastSeen"
        defaultSortDirection="ascending"
        expanding
        headers={headers}
        rows={generateRows(discoveries)}
        sortable
      />
    </>
  );
};

export default DiscoveriesList;
