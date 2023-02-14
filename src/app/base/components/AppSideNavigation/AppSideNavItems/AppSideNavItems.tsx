import { Button, Icon } from "@canonical/react-components";

import AppSideNavItem from "../AppSideNavItem";
import type { NavGroup } from "../types";

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
                        icon={
                          navLink.label === "Controllers" && vaultIncomplete ? (
                            <Icon
                              aria-label="warning"
                              data-testid="warning-icon"
                              name="security-warning-grey"
                            />
                          ) : undefined
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
          <AppSideNavItem
            icon="profile"
            navLink={{
              label: `${authUser?.username}`,
              url: urls.preferences.index,
            }}
            path={path}
          />
          <hr />

          <li className="l-navigation__item">
            <Button
              appearance="link"
              className="l-navigation__link"
              onClick={() => logout()}
            >
              <span className="l-navigation__link-text">Log out</span>
            </Button>
          </li>
          <hr />
        </ul>
      ) : null}
    </>
  );
};

export default AppSideNavItems;
