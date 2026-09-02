import type { NavGroup } from "./types";

import urls from "@/app/base/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

const navGroups: NavGroup[] = [
  {
    groupTitle: "Hardware",
    groupIcon: "machines",
    navLinks: [
      {
        highlight: [urls.machines.index, urls.machines.machine.index(null)],
        label: "Machines",
        requiredEntitlements: [Entitlement.CAN_VIEW_MACHINES],
        url: urls.machines.index,
      },
      ...(import.meta.env.VITE_APP_SWITCH_PROVISIONING === "true"
        ? [
            {
              highlight: [urls.switches.index],
              label: "Switches",
              requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
              url: urls.switches.index,
            },
          ]
        : []),
      {
        highlight: [urls.devices.index, urls.devices.device.index(null)],
        label: "Devices",
        requiredEntitlements: [Entitlement.CAN_VIEW_DEVICES],
        url: urls.devices.index,
      },
      {
        adminOnly: true,
        highlight: [
          urls.controllers.index,
          urls.controllers.controller.index(null),
        ],
        label: "Controllers",
        requiredEntitlements: [Entitlement.CAN_VIEW_CONTROLLERS],
        url: urls.controllers.index,
      },
      ...(import.meta.env.VITE_APP_AGENT_ENROLLMENT === "true"
        ? [
            {
              highlight: [urls.racks.index],
              label: "Racks",
              requiredEntitlements: [Entitlement.CAN_VIEW_CONTROLLERS],
              url: urls.racks.index,
            },
          ]
        : []),
    ],
  },
  {
    groupTitle: "Organisation",
    groupIcon: "tag",
    navLinks: [
      {
        highlight: [urls.tags.index, urls.tags.tag.index(null)],
        label: "Tags",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.tags.index,
      },
      {
        highlight: [urls.zones.index],
        label: "AZs",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.zones.index,
      },
      {
        label: "Pools",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.pools.index,
      },
    ],
  },
  {
    groupTitle: "Configuration",
    groupIcon: "units",
    navLinks: [
      {
        label: "Images",
        requiredEntitlements: [Entitlement.CAN_VIEW_BOOT_ENTITIES],
        url: urls.images.index,
      },
    ],
  },
  {
    groupTitle: "Networking",
    groupIcon: "connected",
    navLinks: [
      {
        highlight: [
          urls.networks.index,
          urls.networks.subnets.index,
          urls.networks.fabrics.index,
          urls.networks.spaces.index,
          urls.networks.vlans.index,
          urls.networks.subnet.index(null),
          urls.networks.space.index(null),
          urls.networks.fabric.index(null),
          urls.networks.vlan.index(null),
        ],
        label: "Networks",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.networks.subnets.indexWithParams({ by: "fabric" }),
      },
      {
        highlight: [urls.domains.index, urls.domains.details(null)],
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        label: "DNS",
        url: urls.domains.index,
      },
      {
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        label: "Network discovery",
        url: urls.networkDiscovery.index,
      },
    ],
  },
];

export { navGroups };
