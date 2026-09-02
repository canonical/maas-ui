import { useMemo } from "react";

import { Navigation } from "@canonical/maas-react-components";
import { Button, Icon } from "@canonical/react-components";

import AppSideNavItem from "../AppSideNavItem";
import type { SideNavigationProps } from "../AppSideNavigation";
import type { NavGroup } from "../types";
import { isSelected } from "../utils";

import {
  useGetUserEntitlements,
  type CurrentUserInfo,
} from "@/app/api/query/auth";
import type { EntitlementResponse } from "@/app/apiclient";
import { useHasEntitlements } from "@/app/base/hooks";
import { useId } from "@/app/base/hooks/base";
import urls from "@/app/base/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { hasPermissions } from "@/app/utils/permissions";

type Props = {
  authUser: CurrentUserInfo | undefined;
  groups: NavGroup[];
  isAuthenticated: boolean;
  logout: () => void;
  path: string;
  setIsCollapsed: SideNavigationProps["setIsCollapsed"];
  showLinks: boolean;
  vaultIncomplete: boolean;
};

type AppSideNavItemGroupProps = Pick<
  Props,
  "authUser" | "path" | "setIsCollapsed" | "vaultIncomplete"
> & {
  group: NavGroup;
  entitlements: EntitlementResponse[] | undefined;
};
const AppSideNavItemGroup = ({
  entitlements,
  group,
  vaultIncomplete,
  path,
  setIsCollapsed,
}: AppSideNavItemGroupProps) => {
  const id = useId();
  const hasActiveChild = useMemo(() => {
    for (const navLink of group.navLinks) {
      if (isSelected(path, navLink)) {
        return true;
      }
    }
    return false;
  }, [group, path]);

  const filteredGroups = group.navLinks.map((navLink) => ({
    ...navLink,
    disabled: !hasPermissions(entitlements, navLink.requiredEntitlements || []),
  }));

  return (
    <>
      <Navigation.Item hasActiveChild={hasActiveChild}>
        <Navigation.Text key={`${group.groupTitle}-${id}`}>
          {group.groupIcon ? <Navigation.Icon name={group.groupIcon} /> : null}
          <Navigation.Label id={`${group.groupTitle}-${id}`} variant="group">
            {group.groupTitle}
          </Navigation.Label>
        </Navigation.Text>
        <Navigation.List aria-labelledby={`${group.groupTitle}-${id}`}>
          {filteredGroups.map((navLink) => (
            <AppSideNavItem
              disabled={navLink.disabled}
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
              setIsCollapsed={setIsCollapsed}
            />
          ))}
        </Navigation.List>
      </Navigation.Item>
    </>
  );
};

export const AppSideNavItems = ({
  authUser,
  groups,
  isAuthenticated,
  logout,
  path,
  setIsCollapsed,
  showLinks,
  vaultIncomplete,
}: Props): React.ReactElement => {
  const { data: userEntitlements } = useGetUserEntitlements();
  const canViewSettingsLink = useHasEntitlements([
    Entitlement.CAN_VIEW_CONFIGURATIONS,
  ]);
  return (
    <>
      {showLinks ? (
        <ul className="p-side-navigation__list">
          {groups.map((group, i) => (
            <AppSideNavItemGroup
              authUser={authUser}
              entitlements={userEntitlements}
              group={group}
              key={`${i}-${group.groupTitle}`}
              path={path}
              setIsCollapsed={setIsCollapsed}
              vaultIncomplete={vaultIncomplete}
            />
          ))}
        </ul>
      ) : null}
      {isAuthenticated ? (
        <>
          {showLinks ? (
            <ul className="p-side-navigation__list">
              <>
                <AppSideNavItem
                  disabled={!canViewSettingsLink}
                  icon="settings"
                  navLink={{ label: "Settings", url: urls.settings.index }}
                  path={path}
                  setIsCollapsed={setIsCollapsed}
                />
              </>
            </ul>
          ) : null}
          <ul className="p-side-navigation__list">
            <AppSideNavItem
              disabled={false}
              icon="profile"
              navLink={{
                label: `${authUser?.username}`,
                url: urls.preferences.index,
              }}
              path={path}
              setIsCollapsed={setIsCollapsed}
            />

            <ul className="p-side-navigation__list">
              <li className="p-side-navigation__item">
                <Button
                  appearance="link"
                  className="p-side-navigation__button p-side-navigation__link"
                  onClick={() => {
                    logout();
                  }}
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
