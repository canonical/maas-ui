import { useMemo } from "react";

import { ContextualMenu } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import type { DiscoveryResponse } from "@/app/apiclient";
import MacAddressDisplay from "@/app/base/components/MacAddressDisplay";
import TooltipButton from "@/app/base/components/TooltipButton";
import { useSidePanel } from "@/app/base/side-panel-context";
import { NetworkDiscoverySidePanelViews } from "@/app/networkDiscovery/constants";
import { Labels } from "@/app/networkDiscovery/views/DiscoveriesList/DiscoveriesList";
import type { UtcDatetime } from "@/app/store/types/model";
import { formatUtcDatetime } from "@/app/utils/time";

export type DiscoveryColumnDef = ColumnDef<
  DiscoveryResponse,
  Partial<DiscoveryResponse>
>;

const useDiscoveriesTableColumns = (): DiscoveryColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();
  return useMemo(
    () => [
      {
        id: "hostname",
        accessorKey: "hostname",
        enableSorting: true,
        header: "Name",
        cell: ({
          row: {
            original: { hostname, is_external_dhcp },
          },
        }) => {
          return (
            <>
              {hostname || "Unknown"}
              {is_external_dhcp ? (
                <TooltipButton
                  className="u-nudge-right--x-small"
                  message="This device is providing DHCP"
                  position="top-center"
                />
              ) : null}
            </>
          );
        },
      },
      {
        id: "mac_address",
        accessorKey: "mac_address",
        enableSorting: true,
        header: "Mac Address",
        cell: ({
          row: {
            original: { mac_address },
          },
        }) => {
          return <MacAddressDisplay>{mac_address}</MacAddressDisplay>;
        },
      },
      {
        id: "ip",
        accessorKey: "ip",
        enableSorting: true,
        header: "IP",
      },
      {
        id: "observer_hostname",
        accessorKey: "observer_hostname",
        enableSorting: true,
        header: "Rack",
      },
      {
        id: "last_seen",
        accessorKey: "last_seen",
        enableSorting: true,
        header: () => "Last seen",
        cell: ({
          row: {
            original: { last_seen },
          },
        }) => {
          return last_seen ? formatUtcDatetime(last_seen as UtcDatetime) : "—";
        },
      },
      {
        id: "action",
        accessorKey: "id",
        enableSorting: false,
        header: "Action",
        cell: ({ row: { original } }) => {
          return (
            <ContextualMenu
              data-testid="row-menu"
              hasToggleIcon={true}
              links={[
                {
                  children: Labels.AddDiscovery,
                  "data-testid": "add-discovery-link",
                  onClick: () => {
                    setSidePanelContent({
                      view: NetworkDiscoverySidePanelViews.ADD_DISCOVERY,
                      extras: {
                        discovery: original,
                      },
                    });
                  },
                },
                {
                  children: "Delete discovery...",
                  "data-testid": "delete-discovery-link",
                  onClick: () => {
                    setSidePanelContent({
                      view: NetworkDiscoverySidePanelViews.DELETE_DISCOVERY,
                      extras: {
                        discovery: original,
                      },
                    });
                  },
                },
              ]}
              toggleAppearance="base"
              toggleClassName="row-menu-toggle u-no-margin--bottom"
            />
          );
        },
      },
    ],
    [setSidePanelContent]
  );
};

export default useDiscoveriesTableColumns;
