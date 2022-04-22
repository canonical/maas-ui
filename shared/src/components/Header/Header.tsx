import React, { useEffect, useRef } from "react";

import classNames from "classnames";
import type { Location as HistoryLocation } from "history";
import PropTypes from "prop-types";

import type { TSFixMe } from "../../types";
import { generateLegacyURL, generateNewURL } from "../../utils";
import Navigation, { Theme } from "../Navigation";

import type { GenerateLink } from "components/Navigation/types";

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
  // Hide the navigation items when the user is not authenticated.
  const showLinks = !!authUser;

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
          showLinks && completedIntro
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
          showLinks
            ? [
                ...(completedIntro
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
                  onClick: (evt) => {
                    evt.preventDefault();
                    localStorage.removeItem("maas-config");
                    logout();
                  },
                  url: "#",
                },
              ]
            : null
        }
        leftNavProps={{ "aria-label": "main" }}
        logo={generateNewLink({
          "aria-label": homepageLink.label,
          "aria-current": isSelected(path, homepageLink, appendNewBase)
            ? "page"
            : undefined,
          className:
            "p-navigation__link p-navigation__maas-logo-link u-no-padding--right u-no-padding--left",
          // prettier-ignore
          label: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="545.3 412.6 100 25.2"
              className="p-navigation__maas-logo"
              aria-hidden="true"
            >
              <path
                fill="#E95420"
                d="M557.9 412.6c-7 0-12.6 5.7-12.6 12.6 0 7 5.7 12.6 12.6 12.6 7 0 12.6-5.7 12.6-12.6 0-7-5.6-12.6-12.6-12.6z"
              />
              <g fill="#FFF">
                <path d="M563.8 419.2h-11.9c-.3 0-.5.2-.5.5v.7c0 .3.2.5.5.5h11.9c.3 0 .5-.2.5-.5v-.7c.1-.3-.2-.5-.5-.5zM563.8 422.6h-11.9c-.3 0-.5.2-.5.5v.7c0 .3.2.5.5.5h11.9c.3 0 .5-.2.5-.5v-.7c.1-.3-.2-.5-.5-.5zM563.8 426h-11.9c-.3 0-.5.2-.5.5v.7c0 .3.2.5.5.5h11.9c.3 0 .5-.2.5-.5v-.7c.1-.2-.2-.5-.5-.5zM563.8 429.4h-11.9c-.3 0-.5.2-.5.5v.7c0 .3.2.5.5.5h11.9c.3 0 .5-.2.5-.5v-.6c.1-.3-.2-.6-.5-.6z" />
              </g>
              <g fill="#FFF">
                <path d="M587.1 431.3c-.2-.4-.4-1-.7-1.7-.3-.7-.7-1.5-1.1-2.3-.4-.8-.8-1.7-1.2-2.5-.4-.9-.8-1.7-1.2-2.5l-1-2-.6-1.2c-.2 2.1-.4 4.4-.5 6.9-.1 2.5-.2 5.1-.3 7.8h-1.7c.2-3.2.3-6.3.5-9.2s.4-5.8.7-8.4h1.5c.5.9 1.1 1.8 1.6 2.9.6 1.1 1.2 2.3 1.7 3.5.6 1.2 1.1 2.4 1.7 3.5s1 2.2 1.4 3.1c.4-.9.9-2 1.4-3.1.5-1.2 1.1-2.3 1.7-3.5.6-1.2 1.1-2.4 1.7-3.5.6-1.1 1.1-2.1 1.6-2.9h1.5c.3 2.7.5 5.5.7 8.4s.4 6 .5 9.2h-1.8c-.1-2.7-.2-5.3-.3-7.8-.1-2.5-.3-4.8-.5-6.9l-.6 1.2-1 2c-.4.8-.8 1.6-1.2 2.5-.4.9-.8 1.7-1.2 2.5-.4.8-.7 1.6-1.1 2.3-.3.7-.6 1.3-.7 1.7h-1.5zM613.1 433.9c-.3-.9-.6-1.7-.9-2.5-.3-.8-.6-1.6-.8-2.3h-8.6c-.3.8-.6 1.5-.9 2.3-.3.8-.6 1.6-.9 2.5h-1.8c.7-1.8 1.3-3.6 1.9-5.1.6-1.6 1.2-3.1 1.8-4.5.6-1.4 1.1-2.8 1.7-4.1l1.8-3.9h1.5l1.8 3.9c.6 1.3 1.1 2.7 1.7 4.1.6 1.4 1.2 2.9 1.7 4.5.6 1.6 1.2 3.3 1.9 5.1h-1.9zm-6-15.7c-.6 1.5-1.3 3-1.9 4.5-.6 1.5-1.2 3.1-1.9 4.9h7.5c-.7-1.8-1.3-3.4-1.9-4.9-.6-1.6-1.2-3.1-1.8-4.5zM630.4 433.9c-.3-.9-.6-1.7-.9-2.5-.3-.8-.6-1.6-.8-2.3H620c-.3.8-.6 1.5-.9 2.3-.3.8-.6 1.6-.9 2.5h-1.8c.7-1.8 1.3-3.6 1.9-5.1.6-1.6 1.2-3.1 1.8-4.5.6-1.4 1.1-2.8 1.7-4.1l1.8-3.9h1.5l1.8 3.9c.6 1.3 1.1 2.7 1.7 4.1s1.2 2.9 1.7 4.5c.6 1.6 1.2 3.3 1.9 5.1h-1.8zm-6.1-15.7c-.6 1.5-1.3 3-1.9 4.5-.6 1.5-1.2 3.1-1.9 4.9h7.5c-.7-1.8-1.3-3.4-1.9-4.9-.5-1.6-1.1-3.1-1.8-4.5zM639.1 432.7c1.4 0 2.4-.3 3.2-.8.8-.5 1.1-1.3 1.1-2.4 0-.6-.1-1.2-.4-1.6-.2-.4-.6-.8-1-1.1s-.9-.6-1.4-.8c-.5-.2-1.1-.4-1.7-.7-.7-.3-1.4-.6-2-.9-.6-.3-1.1-.6-1.5-1-.4-.4-.7-.8-.9-1.3-.2-.5-.3-1.1-.3-1.7 0-1.5.5-2.7 1.5-3.4s2.4-1.2 4.2-1.2c.5 0 .9 0 1.4.1s.9.2 1.3.3c.4.1.8.2 1.1.4.3.1.6.3.8.4l-.6 1.5c-.5-.3-1.1-.6-1.8-.8s-1.5-.3-2.3-.3c-.6 0-1.1.1-1.5.2-.5.1-.9.3-1.2.5s-.6.6-.8.9c-.2.4-.3.8-.3 1.4 0 .5.1 1 .3 1.4.2.4.5.7.9 1 .4.3.8.5 1.3.7.5.2 1 .5 1.6.7.7.3 1.4.6 2 .9.6.3 1.2.6 1.6 1 .5.4.8.9 1.1 1.4.3.6.4 1.2.4 2.1 0 1.6-.6 2.8-1.7 3.6s-2.6 1.2-4.5 1.2c-.7 0-1.3 0-1.9-.1s-1.1-.2-1.5-.3c-.4-.1-.8-.3-1.1-.4-.3-.1-.5-.3-.7-.4l.6-1.5c.2.1.4.2.7.4.3.1.6.3 1 .4.4.1.8.2 1.3.3.6-.1 1.1-.1 1.7-.1z" />
              </g>
            </svg>
            ),
          url: homepageLink.url,
        })}
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
  urlChange: PropTypes.func,
  uuid: PropTypes.string,
  version: PropTypes.string,
};

export default Header;
