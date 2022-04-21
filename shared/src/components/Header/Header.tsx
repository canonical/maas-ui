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
            "p-navigation__link p-navigation__maas-logo-link u-no-padding--top u-no-padding--right u-no-padding--left",
          // prettier-ignore
          label: (
              <svg className="p-navigation__maas-logo" id="Layer_1" data-name="Layer 1" viewBox="0 0 918.28 410.61" version="1.1" xmlns="http://www.w3.org/2000/svg" height="2.2rem">
                <defs id="defs1206"><style id="style1204">{".cls-1{fill:#111}.cls-3{fill:#fff}"}</style></defs>
                <path className="cls-1" d="M363.8 353.85q-2.37-5.89-6.75-15.57t-9.83-21.11q-5.45-11.44-11.13-23.59t-10.9-22.76q-5.19-10.6-9.19-18.63t-6-11.32q-3.07 29.47-4.84 64T302 377.44h-15.8q2.13-44.58 4.84-85.39t6.72-78.05h14.15Q319 225.77 327 241.22t16 32.08q7.92 16.62 15.36 32.78t13.12 29.13q5.67-13 13.12-29.13T400 273.3q7.92-16.64 15.95-32.08T431 214h13.44q4 37.26 6.72 78.07t4.84 85.37h-16.25q-1.41-38-3.18-72.54t-4.83-64q-1.9 3.3-5.9 11.32t-9.2 18.63q-5.19 10.62-10.85 22.76t-11.09 23.56q-5.43 11.44-9.79 21.11t-6.72 15.57Z" id="path1208" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M607.1 377.44q-4.68-12-8.61-23.16T591 332.62h-79.87q-4.1 10.59-8 21.71t-8.29 23.11h-16.76q9.32-25.53 17.59-47.57t16.25-41.72q7.95-19.66 15.81-37.8T544.24 214h14.14q8.64 18.15 16.41 36.32t15.75 37.83q8 19.67 16.19 41.74t18.06 47.57Zm-56.25-145.07q-8.88 20.37-17.29 41.34t-17.4 45.23h69.77q-9.06-24.3-17.64-45.29t-17.44-41.28Z" id="path1210" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M769 377.44q-4.68-12-8.6-23.16t-7.52-21.66h-79.81q-4.1 10.59-8 21.71t-8.29 23.11H640q9.3-25.53 17.59-47.57t16.24-41.72q8-19.66 15.82-37.8T706.18 214h14.14q8.65 18.15 16.41 36.32t15.76 37.83q8 19.67 16.19 41.74t18.06 47.57Zm-56.21-145.07q-8.88 20.37-17.28 41.34t-17.41 45.23h69.77q-9.06-24.3-17.63-45.29t-17.45-41.28Z" id="path1212" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M852.1 367.06q19.1 0 29.72-7t10.61-22.57q0-9-3.42-15a32.13 32.13 0 0 0-9.08-10.17 59.37 59.37 0 0 0-13-7.07q-7.32-2.92-15.33-6.21a178.93 178.93 0 0 1-18.17-8.21 62.32 62.32 0 0 1-13.68-9.52 36.29 36.29 0 0 1-8.61-12.15 40.39 40.39 0 0 1-2.94-16q0-21 13.91-31.84t38.68-10.85a89.73 89.73 0 0 1 13 .94 100.31 100.31 0 0 1 11.91 2.48 89.66 89.66 0 0 1 10.14 3.42 40.55 40.55 0 0 1 7.67 4l-5.66 13.44a57.13 57.13 0 0 0-16.63-7.54 75.65 75.65 0 0 0-21.11-2.83 62.14 62.14 0 0 0-14.27 1.53 31 31 0 0 0-11.21 5 24.58 24.58 0 0 0-7.43 8.61 26.67 26.67 0 0 0-2.7 12.48 26.25 26.25 0 0 0 2.83 12.74 27.56 27.56 0 0 0 7.9 9 62.71 62.71 0 0 0 11.91 6.84q6.84 3.08 14.86 6.37 9.68 4 18.28 8a65.75 65.75 0 0 1 15 9.44 39.86 39.86 0 0 1 10.14 13.2q3.78 7.78 3.78 19.11 0 22.17-15.45 33.26T851.86 381a115 115 0 0 1-17.22-1.18 110.06 110.06 0 0 1-13.91-2.94 81.25 81.25 0 0 1-10.38-3.66 64.76 64.76 0 0 1-6.61-3.3l5.19-13.92c1.57.94 3.7 2 6.37 3.3a81.49 81.49 0 0 0 9.44 3.66 87.85 87.85 0 0 0 27.36 4.13Z" id="path1214" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path id="rect1216" style={{ fill: "#e95420" }} d="M0 0h233.93v409.52H0z" />
                <path className="cls-1" d="M324.39 163.34a36.75 36.75 0 0 1-14.31-2.76 32.43 32.43 0 0 1-11.5-8.05 38.2 38.2 0 0 1-7.71-13.05 51.89 51.89 0 0 1-2.82-17.77 48.42 48.42 0 0 1 3.05-17.77 39.44 39.44 0 0 1 8.11-13 33.33 33.33 0 0 1 11.73-8 36.7 36.7 0 0 1 13.91-2.71 53.64 53.64 0 0 1 8.17.58 44.1 44.1 0 0 1 6.44 1.44 45 45 0 0 1 4.71 1.72 20.8 20.8 0 0 1 3 1.55l-2.53 6.79a45.28 45.28 0 0 0-7.3-3.39 35.81 35.81 0 0 0-24 .86 25.78 25.78 0 0 0-9.38 7.13 31 31 0 0 0-5.69 10.92 48.93 48.93 0 0 0-1.9 14 50.35 50.35 0 0 0 1.9 14.32 30.64 30.64 0 0 0 5.54 10.85 24.57 24.57 0 0 0 9 6.9 29.42 29.42 0 0 0 12.24 2.41 47.73 47.73 0 0 0 12.71-1.43 36.32 36.32 0 0 0 7.76-2.94l2.19 6.67A13.17 13.17 0 0 1 345 160c-1.31.5-3 1-5 1.55a54.13 54.13 0 0 1-6.9 1.32 66.06 66.06 0 0 1-8.71.47Z" id="path1218" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M379.93 100.78a26.32 26.32 0 0 1 9.94 1.67 17.07 17.07 0 0 1 6.62 4.6 18.2 18.2 0 0 1 3.68 7 32 32 0 0 1 1.15 8.74v37.49a34.07 34.07 0 0 1-3.32.72c-1.46.27-3.14.56-5.06.86s-4 .56-6.38.75-4.74.29-7.19.29a34.31 34.31 0 0 1-8.68-1 19.18 19.18 0 0 1-6.9-3.27 15.43 15.43 0 0 1-4.6-5.75 19.9 19.9 0 0 1-1.67-8.57 17.34 17.34 0 0 1 1.84-8.28 15.6 15.6 0 0 1 5.18-5.69 23 23 0 0 1 7.93-3.28 45.58 45.58 0 0 1 10-1 33.85 33.85 0 0 1 3.39.18c1.19.11 2.34.27 3.45.46s2.07.38 2.87.57a8.85 8.85 0 0 1 1.67.52V124a38.58 38.58 0 0 0-.46-6 13.36 13.36 0 0 0-2-5.29 11.21 11.21 0 0 0-4.37-3.79 16.36 16.36 0 0 0-7.42-1.44 38.41 38.41 0 0 0-9.77.92q-3.22.91-4.72 1.49l-1-6.55a27.94 27.94 0 0 1 6-1.73 52.25 52.25 0 0 1 9.82-.83Zm.69 55.43q4.36 0 7.64-.29a50.75 50.75 0 0 0 5.58-.75v-20.93a23 23 0 0 0-4-1.2 35.66 35.66 0 0 0-7.59-.64 42.85 42.85 0 0 0-5.75.41 16.57 16.57 0 0 0-5.52 1.72 11.4 11.4 0 0 0-4.14 3.62 10.41 10.41 0 0 0-1.61 6.1 13 13 0 0 0 1.09 5.63 9.07 9.07 0 0 0 3.1 3.68 13.74 13.74 0 0 0 4.83 2 29.43 29.43 0 0 0 6.37.65Z" id="path1220" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M419.78 104.23q3.35-.92 9-2.07a70.12 70.12 0 0 1 13.8-1.15 28.79 28.79 0 0 1 11.3 1.99 17.56 17.56 0 0 1 7.25 5.58 22.87 22.87 0 0 1 3.85 8.68 50.89 50.89 0 0 1 1.15 11.16v33.23h-7.48v-30.86a55.88 55.88 0 0 0-.86-10.69 17.81 17.81 0 0 0-2.87-7.13 11.28 11.28 0 0 0-5.29-4 24.2 24.2 0 0 0-8.23-1.21 63.35 63.35 0 0 0-9.14.58 28.26 28.26 0 0 0-5 1v52.21h-7.48Z" id="path1222" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M535.54 131.94a38.48 38.48 0 0 1-2 12.77 28.35 28.35 0 0 1-5.64 9.77 25.5 25.5 0 0 1-8.56 6.27 27.76 27.76 0 0 1-21.85 0 25.44 25.44 0 0 1-8.57-6.27 28.35 28.35 0 0 1-5.64-9.77 41.54 41.54 0 0 1 0-25.53 29 29 0 0 1 5.64-9.83 25.34 25.34 0 0 1 8.57-6.33 27.76 27.76 0 0 1 21.85 0 25.4 25.4 0 0 1 8.56 6.33 29 29 0 0 1 5.64 9.83 38.47 38.47 0 0 1 2 12.76Zm-7.93 0q0-11.14-5.18-17.76a18.18 18.18 0 0 0-28.06 0q-5.17 6.61-5.17 17.76t5.17 17.71a18.28 18.28 0 0 0 28.06 0q5.18-6.55 5.18-17.71Z" id="path1224" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M551.33 104.23q3.33-.92 9-2.07A70 70 0 0 1 574.1 101a28.82 28.82 0 0 1 11.33 2 17.53 17.53 0 0 1 7.24 5.58 22.72 22.72 0 0 1 3.85 8.68 50.28 50.28 0 0 1 1.15 11.16v33.23h-7.47v-30.86a56.71 56.71 0 0 0-.86-10.69 18 18 0 0 0-2.88-7.13 11.18 11.18 0 0 0-5.29-4 24.13 24.13 0 0 0-8.22-1.21 63.15 63.15 0 0 0-9.14.58 28.66 28.66 0 0 0-5 1v52.21h-7.47Z" id="path1226" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M625 84.22a5.59 5.59 0 0 1-1.61 4.2 5.71 5.71 0 0 1-7.82 0 6.28 6.28 0 0 1 0-8.4 5.71 5.71 0 0 1 7.82 0 5.59 5.59 0 0 1 1.61 4.2Zm-1.72 77.39h-7.48v-59.45h7.48Z" id="path1228" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M666.92 162.88a31.68 31.68 0 0 1-12.19-2.19 22.9 22.9 0 0 1-8.79-6.26 28 28 0 0 1-5.35-9.78 43.93 43.93 0 0 1 .06-25.36 28.67 28.67 0 0 1 5.46-9.89 24.23 24.23 0 0 1 8.62-6.38 27.93 27.93 0 0 1 11.39-2.24 48.54 48.54 0 0 1 9 .8 22.81 22.81 0 0 1 6.49 2.07l-1.95 6.44a24.42 24.42 0 0 0-5.18-1.84 34.23 34.23 0 0 0-7.7-.69q-9.9 0-15 6.39t-5.12 18.11a38.91 38.91 0 0 0 1.15 9.72 19.72 19.72 0 0 0 3.74 7.59 17.53 17.53 0 0 0 6.67 4.94 24.8 24.8 0 0 0 10 1.78 25.91 25.91 0 0 0 8.08-1.09 32.85 32.85 0 0 0 4.77-1.9l1.61 6.44a28 28 0 0 1-6.5 2.25 38.94 38.94 0 0 1-9.26 1.09Z" id="path1230" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M714.25 100.78a26.32 26.32 0 0 1 9.94 1.67 17.07 17.07 0 0 1 6.62 4.6 18.2 18.2 0 0 1 3.68 7 32 32 0 0 1 1.15 8.74v37.49a34.07 34.07 0 0 1-3.34.75c-1.46.27-3.14.56-5.06.86s-4 .56-6.38.75-4.74.29-7.19.29a34.31 34.31 0 0 1-8.68-1 19.18 19.18 0 0 1-6.9-3.27 15.43 15.43 0 0 1-4.6-5.75 19.9 19.9 0 0 1-1.67-8.57 17.34 17.34 0 0 1 1.84-8.28 15.6 15.6 0 0 1 5.18-5.69 23 23 0 0 1 7.93-3.28 45.58 45.58 0 0 1 10-1 33.85 33.85 0 0 1 3.39.18c1.19.11 2.34.27 3.45.46s2.07.38 2.87.57a8.85 8.85 0 0 1 1.67.52V124a38.58 38.58 0 0 0-.46-6 13.36 13.36 0 0 0-2-5.29 11.21 11.21 0 0 0-4.37-3.79 16.36 16.36 0 0 0-7.42-1.44 38.41 38.41 0 0 0-9.77.92q-3.23.91-4.72 1.49l-1-6.55a27.94 27.94 0 0 1 6-1.73 52.25 52.25 0 0 1 9.84-.83Zm.69 55.43q4.37 0 7.64-.29a50.75 50.75 0 0 0 5.58-.75v-20.93a23 23 0 0 0-4-1.2 35.66 35.66 0 0 0-7.59-.64 42.85 42.85 0 0 0-5.75.41 16.57 16.57 0 0 0-5.52 1.72 11.4 11.4 0 0 0-4.14 3.62 10.41 10.41 0 0 0-1.61 6.1 13 13 0 0 0 1.09 5.63 9.07 9.07 0 0 0 3.1 3.68 13.74 13.74 0 0 0 4.83 2 29.43 29.43 0 0 0 6.37.65Z" id="path1232" style={{ fill: "#fff", fillOpacity: 1 }} />
                <path className="cls-1" d="M769 162.65a25.17 25.17 0 0 1-6.61-1 11.77 11.77 0 0 1-4.72-2.64 11.25 11.25 0 0 1-2.87-4.6 21.65 21.65 0 0 1-1-7.08V73.75l7.47-1.38v74.75a15.56 15.56 0 0 0 .52 4.43 6.06 6.06 0 0 0 1.55 2.65 6.21 6.21 0 0 0 2.71 1.43 33.35 33.35 0 0 0 4 .81Z" id="path1234" style={{ fill: "#fff", fillOpacity: 1 }} />
                <ellipse className="cls-3" cx="48.15" cy="317.01" rx="13.44" ry="13.3" id="ellipse1236" />
                <path className="cls-3" d="M189.52 307H64.46a19 19 0 0 1 2.21 5.1 18.83 18.83 0 0 1-1.94 14.43c-.09.16-.2.31-.29.46h125.08a6 6 0 0 0 6.06-6v-8a6 6 0 0 0-6.06-5.99Z" id="path1238" />
                <ellipse className="cls-3" cx="48.2" cy="269.53" rx="13.44" ry="13.3" id="ellipse1240" />
                <path className="cls-3" d="M189.52 259.32H64.37a18.93 18.93 0 0 1 .42 19.75l-.16.24h124.89a6 6 0 0 0 6.06-6v-8a6 6 0 0 0-6.06-5.99Z" id="path1242" />
                <ellipse className="cls-3" cx="49.37" cy="222.05" rx="13.44" ry="13.3" id="ellipse1244" />
                <path className="cls-3" d="M189.52 212.05H65.68a19.1 19.1 0 0 1 2.21 5.11A18.83 18.83 0 0 1 66 231.59l-.29.46h123.81a6 6 0 0 0 6.06-6v-8a6 6 0 0 0-6.06-6Z" id="path1246" />
                <ellipse className="cls-3" cx="48.15" cy="364.49" rx="13.44" ry="13.3" id="ellipse1248" />
                <path className="cls-3" d="M189.52 354.5H64.46a19 19 0 0 1 2.21 5.1 18.83 18.83 0 0 1-1.94 14.4c-.09.16-.19.31-.29.46h125.08a6 6 0 0 0 6.06-6v-8a6 6 0 0 0-6.06-5.96Z" id="path1250" />
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
