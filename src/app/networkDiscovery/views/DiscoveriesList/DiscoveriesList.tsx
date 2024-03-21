import { useState } from "react";

import {
  Col,
  ContextualMenu,
  MainTable,
  Row,
} from "@canonical/react-components";
import { useSelector } from "react-redux";

import { NetworkDiscoverySidePanelViews } from "../constants";

import DiscoveriesFilterAccordion from "./DiscoveriesFilterAccordion";

import DoubleRow from "@/app/base/components/DoubleRow";
import MacAddressDisplay from "@/app/base/components/MacAddressDisplay";
import SearchBox from "@/app/base/components/SearchBox";
import TooltipButton from "@/app/base/components/TooltipButton";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { useSidePanel } from "@/app/base/side-panel-context";
import { discoveryActions } from "@/app/store/discovery";
import discoverySelectors from "@/app/store/discovery/selectors";
import type { Discovery } from "@/app/store/discovery/types";
import { DiscoveryMeta } from "@/app/store/discovery/types";
import type { RootState } from "@/app/store/root/types";
import { generateEmptyStateMsg, getTableStatus } from "@/app/utils";

export enum Labels {
  DiscoveriesList = "Discoveries list",
  Loading = "Loading...",
  NoNewDiscoveries = "No new discoveries.",
  AddDiscovery = "Add discovery...",
  DeleteDiscovery = "Delete discovery...",
  NoResults = "No discoveries match the search criteria.",
  EmptyList = "No discoveries available.",
}

const generateRows = (
  discoveries: Discovery[],
  setSidePanelContent: SetSidePanelContent
) =>
  discoveries.map((discovery) => {
    const name = discovery.hostname || "Unknown";
    return {
      key: discovery[DiscoveryMeta.PK],
      "aria-label": name,
      className: "p-table__row",
      columns: [
        {
          content: (
            <>
              {name}
              {discovery.is_external_dhcp ? (
                <TooltipButton
                  className="u-nudge-right--x-small"
                  message="This device is providing DHCP"
                  position="top-center"
                />
              ) : null}
            </>
          ),
        },
        {
          content: (
            <DoubleRow
              primary={
                <MacAddressDisplay>{discovery.mac_address}</MacAddressDisplay>
              }
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
          content: (
            <ContextualMenu
              data-testid="row-menu"
              hasToggleIcon={true}
              links={[
                {
                  children: Labels.AddDiscovery,
                  "data-testid": "add-discovery-link",
                  onClick: () =>
                    setSidePanelContent({
                      view: NetworkDiscoverySidePanelViews.ADD_DISCOVERY,
                      extras: {
                        discovery,
                      },
                    }),
                },
                {
                  children: "Delete discovery...",
                  "data-testid": "delete-discovery-link",
                  onClick: () =>
                    setSidePanelContent({
                      view: NetworkDiscoverySidePanelViews.DELETE_DISCOVERY,
                      extras: {
                        discovery,
                      },
                    }),
                },
              ]}
              toggleAppearance="base"
              toggleClassName="row-menu-toggle u-no-margin--bottom"
            />
          ),
          className: "u-align--right",
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
  const [searchString, setSearchString] = useState("");
  const discoveries = useSelector((state: RootState) =>
    discoverySelectors.search(state, searchString)
  );
  const { setSidePanelContent } = useSidePanel();
  const loading = useSelector(discoverySelectors.loading);
  const loaded = useSelector(discoverySelectors.loaded);

  useWindowTitle("Network Discovery");

  useFetchActions([discoveryActions.fetch]);

  if (loaded && !searchString && discoveries.length === 0) {
    return <div data-testid="no-discoveries">No new discoveries.</div>;
  }

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

  const tableStatus = getTableStatus({
    isLoading: loading,
    hasFilter: !!searchString,
  });

  return (
    <div aria-label={Labels.DiscoveriesList}>
      <Row>
        <Col size={3}>
          <DiscoveriesFilterAccordion
            searchText={searchString}
            setSearchText={setSearchString}
          />
        </Col>
        <Col size={9}>
          <SearchBox
            data-testid="discoveries-search"
            externallyControlled
            onChange={setSearchString}
            value={searchString}
          />
        </Col>
      </Row>
      <MainTable
        className="p-table--network-discoveries p-table-expanding--light"
        data-testid="discoveries-table"
        defaultSort="lastSeen"
        defaultSortDirection="ascending"
        emptyStateMsg={generateEmptyStateMsg(tableStatus, {
          default: Labels.EmptyList,
          filtered: Labels.NoResults,
        })}
        expanding
        headers={headers}
        rows={generateRows(discoveries, setSidePanelContent)}
        sortable
      />
    </div>
  );
};

export default DiscoveriesList;
