import type { NavGroup } from "./types";

import urls from "@/app/base/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

const navGroups: NavGroup[] = [
  {
    navLinks: [
      {
        highlight: [urls.machines.index, urls.machines.machine.index(null)],
        icon: "machines",
        label: "Machines",
        requiredEntitlements: [Entitlement.CAN_VIEW_MACHINES],
        url: urls.machines.index,
      },
      {
        highlight: [urls.devices.index, urls.devices.device.index(null)],
        icon: "pods",
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
        icon: "controllers",
        label: "Controllers",
        requiredEntitlements: [Entitlement.CAN_VIEW_CONTROLLERS],
        url: urls.controllers.index,
      },
      ...(import.meta.env.VITE_APP_AGENT_ENROLLMENT === "true"
        ? [
            {
              highlight: [urls.racks.index],
              icon: "containers",
              label: "Racks",
              requiredEntitlements: [Entitlement.CAN_VIEW_CONTROLLERS],
              url: urls.racks.index,
            },
          ]
        : []),
      {
        highlight: [urls.switches.index],
        icon: "mount-2",
        label: "Switches",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.switches.index,
      },
      {
        icon: "image",
        label: "Images",
        requiredEntitlements: [Entitlement.CAN_VIEW_BOOT_ENTITIES],
        url: urls.images.index,
      },
    ],
  },
  {
    navLinks: [
      {
        highlight: [urls.tags.index, urls.tags.tag.index(null)],
        icon: "tag",
        label: "Tags",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.tags.index,
      },
      {
        highlight: [urls.zones.index],
        icon: "bundle",
        label: "AZs",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.zones.index,
      },
      {
        icon: "canvas",
        label: "Pools",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.pools.index,
      },
    ],
  },
  {
    groupIcon: "connected",
    groupTitle: "Networking",
    isExpandable: true,
    navLinks: [
      {
        highlight: [
          urls.networks.index,
          urls.networks.subnets.index,
          urls.networks.subnet.index(null),
        ],
        label: "Subnets",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.networks.subnets.index,
      },
      {
        highlight: [urls.networks.vlans.index, urls.networks.vlan.index(null)],
        label: "VLANs",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.networks.vlans.index,
      },
      {
        highlight: [
          urls.networks.fabrics.index,
          urls.networks.fabric.index(null),
        ],
        label: "Fabrics",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.networks.fabrics.index,
      },
      {
        highlight: [
          urls.networks.spaces.index,
          urls.networks.space.index(null),
        ],
        label: "Spaces",
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        url: urls.networks.spaces.index,
      },
      {
        highlight: [urls.domains.index, urls.domains.details(null)],
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        label: "DNS",
        url: urls.domains.index,
      },
      {
        requiredEntitlements: [Entitlement.CAN_VIEW_GLOBAL_ENTITIES],
        label: "Discovery",
        url: urls.networkDiscovery.index,
      },
    ],
  },
];

export { navGroups };
