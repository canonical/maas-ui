import type { ReactNode } from "react";
import { useEffect, useContext } from "react";

import type { NavLink } from "@canonical/react-components";
import { Icon, isNavigationButton, Theme } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useLocation,
  matchPath,
  useMatch,
} from "react-router-dom-v5-compat";

import {
  useCompletedIntro,
  useCompletedUserIntro,
  useGoogleAnalytics,
} from "app/base/hooks";
import ThemePreviewContext from "app/base/theme-preview-context";
import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";

type NavItem = {
  adminOnly?: boolean;
  highlight?: string | string[];
  label: string;
  url: string;
};

type NavGroup = {
  navLinks: NavItem[];
  groupTitle?: string;
  groupIcon?: string;
};

const navGroups: NavGroup[] = [
  {
    navLinks: [
      {
        label: "Images",
        url: urls.images.index,
      },
      {
        label: "Storage",
        url: urls.settings.storage,
      },
      {
        label: "Tags",
        url: urls.tags.index,
      },
      {
        highlight: [urls.zones.index, urls.zones.details(null)],
        label: "AZs",
        url: urls.zones.index,
      },
      {
        label: "Pools",
        url: urls.pools.index,
      },
    ],
  },
  {
    groupTitle: "Hardware",
    groupIcon: "machines-light",
    navLinks: [
      {
        highlight: [urls.machines.index, urls.machines.machine.index(null)],
        label: "Machines",
        url: urls.machines.index,
      },
      {
        highlight: [urls.devices.index, urls.devices.device.index(null)],
        label: "Devices",
        url: urls.devices.index,
      },
      {
        adminOnly: true,
        highlight: [
          urls.controllers.index,
          urls.controllers.controller.index(null),
        ],
        label: "Controllers",
        url: urls.controllers.index,
      },
    ],
  },
  {
    groupTitle: "KVM",
    groupIcon: "cluster-light",
    navLinks: [
      {
        label: "LXD",
        url: urls.kvm.lxd.index,
      },
      {
        label: "Virsh",
        url: urls.kvm.virsh.index,
      },
    ],
  },
  {
    groupTitle: "Networking",
    groupIcon: "connected-light",
    navLinks: [
      {
        highlight: [
          urls.subnets.index,
          urls.subnets.subnet.index(null),
          urls.subnets.space.index(null),
          urls.subnets.fabric.index(null),
          urls.subnets.vlan.index(null),
        ],
        label: "Subnets",
        url: urls.subnets.index,
      },
      {
        highlight: [urls.domains.index, urls.domains.details(null)],
        label: "DNS",
        url: urls.domains.index,
      },
      {
        label: "Network discovery",
        url: urls.dashboard.index,
      },
    ],
  },
];

const GlobalSideNav = (): JSX.Element => {
  return (
    <>
      <p>hello</p>
    </>
  );
};

export default GlobalSideNav;
