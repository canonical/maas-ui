/* eslint-disable react/no-multi-comp */
import { useMemo } from "react";

import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";

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

const AppSideNavItemGroup = ({
  group,
  isAdmin,
  vaultIncomplete,
  path,
}: { group: NavGroup } & Pick<
  Props,
  "isAdmin" | "vaultIncomplete" | "path"
>) => {
  const id = useId();
  const hasActiveChild = useMemo(() => {
    for (const navLink of group.navLinks) {
      if (isSelected(path, navLink)) {
        return true;
      }
    }
    return false;
  }, [group, path]);

  return (
    <>
      <li
        className={classNames("p-side-navigation__item", {
          "has-active-child": hasActiveChild,
        })}
      >
        <span
          className="p-side-navigation__text"
          key={`${group.groupTitle}-${id}`}
        >
          {group.groupIcon ? (
            <Icon
              className="p-side-navigation__icon"
              light
              name={group.groupIcon}
            />
          ) : null}
          <div
            className="p-side-navigation__label p-heading--small"
            id={`${group.groupTitle}-${id}`}
          >
            {group.groupTitle}
          </div>
        </span>
        <ul
          aria-labelledby={`${group.groupTitle}-${id}`}
          className="p-side-navigation__list"
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
      </li>
    </>
  );
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
  return (
    <>
      {showLinks ? (
        <ul className="p-side-navigation__list">
          {groups.map((group, i) => (
            <AppSideNavItemGroup
              group={group}
              isAdmin={isAdmin}
              key={`${i}-${group.groupTitle}`}
              path={path}
              vaultIncomplete={vaultIncomplete}
            />
          ))}
        </ul>
      ) : null}
      {isAuthenticated ? (
        <>
          <ul className="p-side-navigation__list">
            {isAdmin && showLinks ? (
              <>
                <AppSideNavItem
                  icon="settings"
                  navLink={{ label: "Settings", url: urls.settings.index }}
                  path={path}
                />
              </>
            ) : null}
          </ul>
          <ul className="p-side-navigation__list">
            <AppSideNavItem
              icon="profile"
              navLink={{
                label: `${authUser?.username}`,
                url: urls.preferences.index,
              }}
              path={path}
            />

            <ul className="p-side-navigation__list">
              <li className="p-side-navigation__item">
                <Button
                  appearance="link"
                  className="p-side-navigation__button p-side-navigation__link"
                  onClick={() => logout()}
                >
                  <span className="p-side-navigation__label">Log out</span>
                </Button>
              </li>
            </ul>
          </ul>
        </>
      ) : null}
    </>
  );
};

export default AppSideNavItems;
