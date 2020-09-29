import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import HardwareMenu from "./HardwareMenu";
import { generateLegacyURL, generateNewURL } from "../../utils";

const useVisible = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const toggleValue = (evt, preventDefault = true) => {
    if (preventDefault) {
      evt.preventDefault();
    }
    setValue(!value);
  };
  return [value, toggleValue];
};

const generateURL = (url, isLegacy, appendNewBase) => {
  if (isLegacy) {
    return generateLegacyURL(url);
  } else if (appendNewBase) {
    return generateNewURL(url, appendNewBase);
  }
  return url;
};

const isSelected = (path, link, appendNewBase) => {
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

export const Header = ({
  appendNewBase = true,
  authUser,
  completedIntro,
  debug,
  enableAnalytics,
  generateLegacyLink,
  generateNewLink,
  location,
  logout,
  onSkip,
  rootScope,
  showRSD,
  urlChange,
  uuid,
  version,
}) => {
  const [hardwareMenuOpen, toggleHardwareMenu] = useVisible(false);
  const [mobileMenuOpen, toggleMobileMenu] = useVisible(false);

  useEffect(() => {
    let unlisten;
    if (!debug && enableAnalytics && uuid && version && authUser) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l !== "dataLayer" ? "&l=" + l : "";
        j.async = true;
        const src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        j.src = src;
        if (document.querySelectorAll(`script[src="${src}"]`).length === 0) {
          f.parentNode.insertBefore(j, f);
        }
      })(window, document, "script", "dataLayer", "GTM-P4TGJR9");

      window.ga =
        window.ga ||
        function () {
          (window.ga.q = window.ga.q || []).push(arguments);
        };
      window.ga.l = +new Date();
      window.ga("create", "UA-1018242-63", "auto", {
        userId: `${uuid}-${authUser.id}`,
      });
      window.ga("set", "dimension1", version);
      window.ga("set", "dimension2", uuid);

      const sendPageview = () => {
        const path = window.location.pathname + window.location.search;
        window.ga("send", "pageview", path);
      };
      if (rootScope) {
        rootScope.$on("$routeChangeSuccess", sendPageview);
      } else if (urlChange) {
        unlisten = urlChange(sendPageview);
      }
    }
    return () => {
      unlisten && unlisten();
    };
  }, [debug, enableAnalytics, uuid, version, authUser, rootScope, urlChange]);

  const links = [
    {
      highlight: "/machine",
      inHardwareMenu: true,
      label: "Machines",
      url: "/machines",
    },
    {
      highlight: "/device",
      inHardwareMenu: true,
      isLegacy: true,
      label: "Devices",
      url: "/devices",
    },
    {
      adminOnly: true,
      highlight: "/controller",
      inHardwareMenu: true,
      isLegacy: true,
      label: "Controllers",
      url: "/controllers",
    },
    {
      inHardwareMenu: true,
      label: "KVM",
      url: "/kvm",
    },
    {
      hidden: !showRSD,
      inHardwareMenu: true,
      label: "RSD",
      url: "/rsd",
    },
    {
      isLegacy: true,
      label: "Images",
      url: "/images",
    },
    {
      highlight: "/domain",
      isLegacy: true,
      label: "DNS",
      url: "/domains",
    },
    {
      highlight: "/zone",
      isLegacy: true,
      label: "AZs",
      url: "/zones",
    },
    {
      highlight: ["/networks", "/subnet", "/space", "/fabric", "/vlan"],
      isLegacy: true,
      label: "Subnets",
      url: "/networks?by=fabric",
    },
    {
      adminOnly: true,
      label: "Settings",
      url: "/settings",
    },
  ]
    // Remove the admin only items if the user is not an admin.
    .filter(
      ({ adminOnly }) => !adminOnly || (authUser && authUser.is_superuser)
    )
    // Remove the hidden items.
    .filter(({ hidden }) => !hidden);

  const generateLink = (link, linkClass = undefined) => {
    return link.isLegacy
      ? generateLegacyLink(link, linkClass, appendNewBase)
      : generateNewLink(link, linkClass, appendNewBase);
  };

  const generateNavItems = (links) => {
    const hardwareLinks = links.filter((link) => link.inHardwareMenu);
    const path = location.pathname + location.search;

    const linkItems = links.map((link) => (
      <li
        className={classNames("p-navigation__link", {
          "is-selected": isSelected(path, link, appendNewBase),
          "u-hide--hardware-menu-threshold": link.inHardwareMenu,
        })}
        key={link.url}
        role="menuitem"
      >
        {generateLink(link)}
      </li>
    ));

    return (
      <nav
        className={classNames("p-navigation__nav", {
          "u-show": mobileMenuOpen,
        })}
      >
        <span className="u-off-screen">
          <a href="#main-content">Jump to main content</a>
        </span>
        <ul className="p-navigation__links" role="menu">
          {completedIntro && (
            <>
              <li
                className={classNames(
                  "p-navigation__link p-subnav is-dark hardware-menu",
                  { "is-active": hardwareMenuOpen }
                )}
                role="menuitem"
              >
                {/* eslint-disable-next-line */}
                <a
                  onClick={toggleHardwareMenu}
                  className="hardware-menu__toggle"
                >
                  Hardware
                </a>
                {hardwareMenuOpen && (
                  <HardwareMenu
                    generateLink={generateLink}
                    links={hardwareLinks}
                    toggleHardwareMenu={toggleHardwareMenu}
                  />
                )}
              </li>
              {linkItems}
            </>
          )}
        </ul>
        <ul className="p-navigation__links" role="menu">
          {!completedIntro && (
            <li className="p-navigation__link" role="menuitem">
              {/* eslint-disable-next-line */}
              <a
                onClick={(evt) => {
                  evt.preventDefault();
                  onSkip();
                }}
                data-test="skipIntro"
              >
                Skip
              </a>
            </li>
          )}
          <li
            className={classNames("p-navigation__link", {
              "is-selected": location.pathname.startsWith(
                generateURL("/account/prefs", false, appendNewBase)
              ),
            })}
            role="menuitem"
          >
            {generateLink({ url: "/account/prefs", label: authUser.username })}
          </li>
          <li className="p-navigation__link" role="menuitem">
            {/* eslint-disable-next-line */}
            <a
              onClick={(evt) => {
                evt.preventDefault();
                localStorage.removeItem("maas-config");
                logout();
              }}
            >
              Log out
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <header id="navigation" className="p-navigation is-dark">
        <div className="p-navigation__row row">
          <div className="p-navigation__banner">
            <div className="p-navigation__logo">
              <a
                href={generateLegacyURL("/dashboard")}
                className="p-navigation__link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="25.2"
                  viewBox="545.3 412.6 100 25.2"
                  alt=""
                  className="p-navigation__image"
                >
                  <title>MAAS logo</title>
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
              </a>
            </div>
            {/* eslint-disable-next-line */}
            <a
              className="p-navigation__toggle--open"
              title="Toggle menu"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? "Close menu" : "Menu"}
            </a>
          </div>
          {authUser && generateNavItems(links)}
        </div>
      </header>
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
  generateLegacyLink: PropTypes.func.isRequired,
  generateNewLink: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  onSkip: PropTypes.func,
  rootScope: PropTypes.object,
  showRSD: PropTypes.bool,
  urlChange: PropTypes.func,
  uuid: PropTypes.string,
  version: PropTypes.string,
};

export default Header;
