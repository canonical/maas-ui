import React, { useEffect, useRef } from "react";

import type { GenerateLink } from "@canonical/react-components";
import { Theme, Navigation } from "@canonical/react-components";
import classNames from "classnames";
import type { Location as HistoryLocation } from "history";
import PropTypes from "prop-types";

import type { TSFixMe } from "../../types";
import { generateLegacyURL, generateNewURL } from "../../utils";

type Props = {
  appendNewBase?: boolean;
  authUser?: {
    id: number;
    is_superuser?: boolean;
    username: string;
  } | null;
  completedIntro?: boolean;
  debug?: boolean;
  enableAnalytics?: boolean;
  generateNewLink: GenerateLink;
  location: Location | HistoryLocation;
  logout: () => void;
  rootScope?: TSFixMe;
  uuid?: string;
  version?: string;
};

type NavItem = {
  adminOnly?: boolean;
  highlight?: string | string[];
  inHardwareMenu?: boolean;
  label: string;
  url: string;
};

const navLinks: NavItem[] = [
  {
    highlight: ["/machine", "/pool", "/tag"],
    inHardwareMenu: true,
    label: "Machines",
    url: "/machines",
  },
  {
    highlight: "/device",
    inHardwareMenu: true,
    label: "Devices",
    url: "/devices",
  },
  {
    adminOnly: true,
    highlight: "/controller",
    inHardwareMenu: true,
    label: "Controllers",
    url: "/controllers",
  },
  {
    inHardwareMenu: true,
    label: "KVM",
    url: "/kvm",
  },
  {
    label: "Images",
    url: "/images",
  },
  {
    highlight: "/domain",
    label: "DNS",
    url: "/domains",
  },
  {
    highlight: "/zone",
    label: "AZs",
    url: "/zones",
  },
  {
    highlight: ["/networks", "/subnet", "/space", "/fabric", "/vlan"],
    label: "Subnets",
    url: "/networks?by=fabric",
  },
  {
    adminOnly: true,
    label: "Settings",
    url: "/settings",
  },
];

const generateURL = (
  url: NavItem["url"],
  isLegacy: boolean,
  appendNewBase: boolean
) => {
  if (isLegacy) {
    return generateLegacyURL(url);
  } else if (appendNewBase) {
    return generateNewURL(url, appendNewBase);
  }
  return url;
};

const isSelected = (path: string, link: NavItem, appendNewBase: boolean) => {
  // Use the provided highlight(s) or just use the url.
  let highlights = link.highlight || link.url;
  // If the provided highlights aren't an array then make them one so that we
  // can loop over them.
  if (!Array.isArray(highlights)) {
    highlights = [highlights];
  }
  // Check if one of the highlight urls matches the current path.
  return highlights.some(
    (start) =>
      // Check the full path, for both legacy/new clients as sometimes the lists
      // are in one client and the details in the other.
      path.startsWith(generateURL(start, true, appendNewBase)) ||
      path.startsWith(generateURL(start, false, appendNewBase))
  );
};

const generateItems = (
  links: NavItem[],
  location: Props["location"],
  appendNewBase: boolean,
  forHardwareMenu: boolean
) => {
  if (forHardwareMenu) {
    // Only include the items for the hardware menu.
    links = links.filter((link) => link.inHardwareMenu);
  }
  const path = location.pathname + location.search;
  return links.map((link) => ({
    className: classNames("p-navigation__item", {
      // Items that are also displayed in the hardware menu need to be hidden
      // when the hardware menu is visible.
      "u-hide--hardware-menu-threshold":
        link.inHardwareMenu && !forHardwareMenu,
    }),
    isSelected: isSelected(path, link, appendNewBase),
    key: link.url,
    label: link.label,
    url: link.url,
  }));
};

export const Header = ({
  appendNewBase = true,
  authUser,
  completedIntro,
  debug,
  enableAnalytics,
  generateNewLink,
  location,
  logout,
  rootScope,
  uuid,
  version,
}: Props): JSX.Element => {
  const sendPageview = useRef<(() => void) | null>(null);
  const previousURL = useRef<string>();
  const isAuthenticated = !!authUser;
  // Hide the navigation items when the user is not authenticated or hasn't been
  // through the intro process.
  const showLinks = isAuthenticated && completedIntro;

  useEffect(() => {
    if (!debug && enableAnalytics && uuid && version && authUser) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        const f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l !== "dataLayer" ? "&l=" + l : "";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        j.async = true;
        const src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        j.src = src;
        if (document.querySelectorAll(`script[src="${src}"]`).length === 0) {
          f.parentNode.insertBefore(j, f);
        }
      })(window, document, "script", "dataLayer", "GTM-P4TGJR9");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ga =
        window.ga ||
        function () {
          // eslint-disable-next-line prefer-rest-params
          (window.ga.q = window.ga.q || []).push(arguments);
          return window.ga;
        };
      window.ga.l = +new Date();
      window.ga("create", "UA-1018242-63", "auto", {
        userId: `${uuid}-${authUser.id}`,
      });
      window.ga("set", "dimension1", version);
      window.ga("set", "dimension2", uuid);

      sendPageview.current = () => {
        const path = window.location.pathname + window.location.search;
        if (path !== previousURL.current) {
          window.ga("send", "pageview", path);
          previousURL.current = path;
        }
      };
      if (rootScope) {
        rootScope.$on("$locationChangeSuccess", sendPageview.current);
      }
    }
  }, [debug, enableAnalytics, uuid, version, authUser, rootScope]);

  useEffect(() => {
    // Handle route change events for ui app. The legacy app uses the
    // `rootScope.$on("$routeChangeSuccess"...` listener above.
    if (!rootScope && location && sendPageview.current) {
      sendPageview.current();
    }
  }, [location, rootScope]);

  const links = navLinks
    // Remove the admin only items if the user is not an admin.
    .filter(
      ({ adminOnly }) => !adminOnly || (authUser && authUser.is_superuser)
    );

  const homepageLink = authUser?.is_superuser
    ? { url: "/dashboard", label: "Homepage" }
    : { url: "/machines", label: "Homepage" };
  const path = location.pathname + location.search;

  return (
    <>
      <a href="#main-content" className="p-link--skip">
        Skip to main content
      </a>
      <Navigation
        generateLink={generateNewLink}
        items={
          showLinks
            ? [
                {
                  className: "p-navigation__hardware-menu",
                  items: generateItems(links, location, appendNewBase, true),
                  label: "Hardware",
                },
                ...generateItems(links, location, appendNewBase, false),
              ]
            : null
        }
        itemsRight={
          isAuthenticated
            ? [
                ...(showLinks
                  ? [
                      {
                        isSelected: location.pathname.startsWith(
                          generateURL("/account/prefs", false, appendNewBase)
                        ),
                        label: authUser.username,
                        url: "/account/prefs",
                      },
                    ]
                  : []),
                {
                  label: "Log out",
                  onClick: () => {
                    localStorage.removeItem("maas-config");
                    logout();
                  },
                },
              ]
            : null
        }
        leftNavProps={{ "aria-label": "main" }}
        logo={{
          "aria-label": homepageLink.label,
          "aria-current": isSelected(path, homepageLink, appendNewBase)
            ? "page"
            : undefined,
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

Header.propTypes = {
  appendNewBase: PropTypes.bool,
  authUser: PropTypes.shape({
    id: PropTypes.number,
    is_superuser: PropTypes.bool,
    username: PropTypes.string,
  }),
  completedIntro: PropTypes.bool,
  debug: PropTypes.bool,
  enableAnalytics: PropTypes.bool,
  generateNewLink: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  rootScope: PropTypes.object,
  showRSD: PropTypes.bool,
  uuid: PropTypes.string,
  version: PropTypes.string,
};

export default Header;
