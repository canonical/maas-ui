import type { ReactNode } from "react";
import { useEffect } from "react";

import type { NavLink } from "@canonical/react-components";
import {
  isNavigationButton,
  Theme,
  Navigation,
} from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useLocation,
  matchPath,
} from "react-router-dom-v5-compat";

import {
  useCompletedIntro,
  useCompletedUserIntro,
  useGoogleAnalytics,
} from "app/base/hooks";
import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { actions as statusActions } from "app/store/status";

type NavItem = {
  adminOnly?: boolean;
  highlight?: string | string[];
  inHardwareMenu?: boolean;
  label: string;
  url: string;
};

const navLinks: NavItem[] = [
  {
    highlight: [
      urls.machines.machines.index,
      urls.machines.machine.index(null, true),
      urls.pools.pools,
      urls.tags.tags.index,
      urls.tags.tag.index(null, true),
    ],
    inHardwareMenu: true,
    label: "Machines",
    url: urls.machines.machines.index,
  },
  {
    highlight: [
      urls.devices.devices.index,
      urls.devices.device.index(null, true),
    ],
    inHardwareMenu: true,
    label: "Devices",
    url: urls.devices.devices.index,
  },
  {
    adminOnly: true,
    highlight: [
      urls.controllers.controllers.index,
      urls.controllers.controller.index(null, true),
    ],
    inHardwareMenu: true,
    label: "Controllers",
    url: urls.controllers.controllers.index,
  },
  {
    inHardwareMenu: true,
    label: "KVM",
    url: urls.kvm.kvm,
  },
  {
    label: "Images",
    url: urls.images.index,
  },
  {
    highlight: [urls.domains.domains, urls.domains.details(null, true)],
    label: "DNS",
    url: urls.domains.domains,
  },
  {
    highlight: [urls.zones.index, urls.zones.details(null, true)],
    label: "AZs",
    url: urls.zones.index,
  },
  {
    highlight: [
      urls.subnets.index,
      urls.subnets.subnet.index(null, true),
      urls.subnets.space.index(null, true),
      urls.subnets.fabric.index(null, true),
      urls.subnets.vlan.index(null, true),
    ],
    label: "Subnets",
    url: urls.subnets.index,
  },
  {
    adminOnly: true,
    label: "Settings",
    url: urls.settings.index,
  },
];

const generateLink = (props: NavLink): ReactNode => {
  if (props.url) {
    const { isSelected: _, label, url, ...linkProps } = props;
    return (
      <Link {...linkProps} to={url}>
        {label}
      </Link>
    );
  } else if (isNavigationButton(props)) {
    const { isSelected: _, label, url, ...linkProps } = props;
    return (
      // Handle elements that don't need to navigate using react-router
      // e.g. the logout link.
      <button {...linkProps}>{label}</button>
    );
  }
  return null;
};

const isSelected = (path: string, link: NavItem) => {
  // Use the provided highlight(s) or just use the url.
  let highlights = link.highlight || link.url;
  // If the provided highlights aren't an array then make them one so that we
  // can loop over them.
  if (!Array.isArray(highlights)) {
    highlights = [highlights];
  }
  // Check if one of the highlight urls matches the current path.
  return highlights.some((highlight) =>
    // Check the full path, for both legacy/new clients as sometimes the lists
    // are in one client and the details in the other.
    matchPath({ path: highlight, end: false }, path)
  );
};

const generateItems = (
  links: NavItem[],
  path: string,
  forHardwareMenu: boolean
) => {
  if (forHardwareMenu) {
    // Only include the items for the hardware menu.
    links = links.filter((link) => link.inHardwareMenu);
  }
  return links.map((link) => ({
    className: classNames("p-navigation__item", {
      // Items that are also displayed in the hardware menu need to be hidden
      // when the hardware menu is visible.
      "u-hide--hardware-menu-threshold":
        link.inHardwareMenu && !forHardwareMenu,
    }),
    isSelected: isSelected(path, link),
    key: link.url,
    label: link.label,
    url: link.url,
  }));
};

export const Header = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector(authSelectors.get);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const configLoaded = useSelector(configSelectors.loaded);
  const location = useLocation();
  const completedIntro = useCompletedIntro();
  const completedUserIntro = useCompletedUserIntro();
  useGoogleAnalytics();
  const isAuthenticated = !!authUser;

  // Redirect to the intro pages if not completed.
  useEffect(() => {
    if (configLoaded) {
      if (!completedIntro) {
        navigate({ pathname: urls.intro.index }, { replace: true });
      } else if (isAuthenticated && !completedUserIntro) {
        navigate({ pathname: urls.intro.user }, { replace: true });
      }
    }
  }, [
    completedIntro,
    completedUserIntro,
    configLoaded,
    isAuthenticated,
    navigate,
  ]);

  // Hide the navigation items when the user is not authenticated or hasn't been
  // through the intro process.
  const showLinks = isAuthenticated && completedIntro && completedUserIntro;
  const links = navLinks
    // Remove the admin only items if the user is not an admin.
    .filter(({ adminOnly }) => !adminOnly || isAdmin);
  const homepageLink = isAdmin
    ? { url: urls.dashboard.index, label: "Homepage" }
    : { url: urls.machines.machines.index, label: "Homepage" };
  const path = location.pathname + location.search;

  return (
    <>
      <a href="#main-content" className="p-link--skip">
        Skip to main content
      </a>
      <Navigation
        generateLink={generateLink}
        items={
          showLinks
            ? [
                {
                  className: "p-navigation__hardware-menu",
                  items: generateItems(links, path, true),
                  label: "Hardware",
                },
                ...generateItems(links, path, false),
              ]
            : null
        }
        itemsRight={
          isAuthenticated
            ? [
                ...(showLinks
                  ? [
                      {
                        isSelected: !!matchPath(
                          { path: urls.preferences.prefs, end: false },
                          location.pathname
                        ),
                        label: authUser.username,
                        url: urls.preferences.prefs,
                      },
                    ]
                  : []),
                {
                  label: "Log out",
                  onClick: () => {
                    localStorage.removeItem("maas-config");
                    dispatch(statusActions.logout());
                  },
                },
              ]
            : null
        }
        leftNavProps={{ "aria-label": "main" }}
        logo={{
          "aria-label": homepageLink.label,
          "aria-current": isSelected(path, homepageLink) ? "page" : undefined,
          icon: (
            <svg
              className="p-navigation__logo-icon"
              fill="#fff"
              viewBox="0 0 165.5 174.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="15.57" cy="111.46" rx="13.44" ry="13.3" />
              <path d="M156.94 101.45H31.88a18.91 18.91 0 0 1 .27 19.55c-.09.16-.2.31-.29.46h125.08a6 6 0 0 0 6.06-5.96v-8.06a6 6 0 0 0-6-6Z" />
              <ellipse cx="15.62" cy="63.98" rx="13.44" ry="13.3" />
              <path d="M156.94 53.77H31.79a18.94 18.94 0 0 1 .42 19.75l-.16.24h124.89a6 6 0 0 0 6.06-5.94v-8.06a6 6 0 0 0-6-6Z" />
              <ellipse cx="16.79" cy="16.5" rx="13.44" ry="13.3" />
              <path d="M156.94 6.5H33.1a19.15 19.15 0 0 1 2.21 5.11A18.82 18.82 0 0 1 33.42 26l-.29.46h123.81a6 6 0 0 0 6.06-5.9V12.5a6 6 0 0 0-6-6Z" />
              <ellipse cx="15.57" cy="158.94" rx="13.44" ry="13.3" />
              <path d="M156.94 149H31.88a18.88 18.88 0 0 1 .27 19.5c-.09.16-.19.31-.29.46h125.08A6 6 0 0 0 163 163v-8.06a6 6 0 0 0-6-6Z" />
            </svg>
          ),
          title: "Canonical MAAS",
          url: homepageLink.url,
        }}
        navProps={{ "aria-label": "primary" }}
        rightNavProps={{ "aria-label": "user" }}
        theme={Theme.DARK}
      />
    </>
  );
};
export default Header;
