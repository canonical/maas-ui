import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { Link } from "react-router-dom-v5-compat";

import AppSideNavItem from "../AppSideNavItem";
import type { NavGroup } from "../types";
import { isSelected } from "../utils";

import { useId } from "app/base/hooks/base";
import urls from "app/base/urls";
import type { User } from "app/store/user/types";

type Props = {
  authUser: User | null;
  groups: NavGroup[];
  isAdmin: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  path: string;
  showLinks: boolean;
  vaultIncomplete: boolean;
};

export const AppSideNavItems = ({
  authUser,
  groups,
  isAdmin,
  isAuthenticated,
  logout,
  path,
  showLinks,
  vaultIncomplete,
}: Props): JSX.Element => {
  const id = useId();

  return (
    <>
      {showLinks
        ? groups.map((group) => (
            <span key={`${group.groupTitle}-${id}`}>
              <div className="p-muted-heading" id={`${group.groupTitle}-${id}`}>
                {group.groupIcon ? <Icon light name={group.groupIcon} /> : null}
                {group.groupTitle}
              </div>
              <ul
                aria-labelledby={`${group.groupTitle}-${id}`}
                className="l-navigation__items"
              >
                {group.navLinks.map((navLink) => {
                  if (!navLink.adminOnly || isAdmin) {
                    return (
                      <AppSideNavItem
                        hasWarningIcon={
                          navLink.label === "Controllers" && vaultIncomplete
                        }
                        key={navLink.label}
                        navLink={navLink}
                        path={path}
                      />
                    );
                  } else return null;
                })}
              </ul>
            </span>
          ))
        : null}
      {isAuthenticated ? (
        <ul className="l-navigation__items">
          <hr />
          {isAdmin && showLinks ? (
            <>
              <AppSideNavItem
                icon="settings"
                navLink={{ label: "Settings", url: urls.settings.index }}
                path={path}
              />
              <hr />
            </>
          ) : null}

          <li
            className={`l-navigation__item ${
              isSelected(path, { label: "", url: urls.preferences.index })
                ? "is-selected"
                : null
            }`}
          >
            <ContextualMenu
              aria-current={
                isSelected(path, { label: "", url: urls.preferences.index })
                  ? "page"
                  : undefined
              }
              className="l-navigation__link is-dark"
              position="right"
              toggleAppearance="link"
              toggleLabel={
                <>
                  <Icon light name="profile-light" />
                  <span className="l-navigation__link-text">
                    {authUser?.username}
                  </span>
                </>
              }
            >
              <ul>
                <li>
                  <Link to={urls.preferences.index}>Preferences</Link>
                </li>
                <li>
                  <Button appearance="link" onClick={() => logout()}>
                    Log out
                  </Button>
                </li>
              </ul>
            </ContextualMenu>
          </li>
          <hr />
        </ul>
      ) : null}
    </>
  );
};

export default AppSideNavItems;
