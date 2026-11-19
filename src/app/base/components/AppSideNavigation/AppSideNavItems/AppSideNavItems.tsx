import { useMemo, useState } from "react";

import { Navigation } from "@canonical/maas-react-components";
import { Badge, Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import AppSideNavItem from "../AppSideNavItem";
import type { SideNavigationProps } from "../AppSideNavigation";
import type { NavGroup } from "../types";
import { isSelected } from "../utils";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import { useAllNotifications } from "@/app/api/query/notifications";
import type { EntitlementResponse } from "@/app/apiclient";
import urls from "@/app/base/urls";
import configSelectors from "@/app/store/config/selectors";
import { hasPermissions } from "@/app/utils/permissions";

type Props = {
  groups: NavGroup[];
  path: string;
  setIsCollapsed: SideNavigationProps["setIsCollapsed"];
  showLinks: boolean;
  vaultIncomplete: boolean;
};

type AppSideNavItemGroupProps = Pick<
  Props,
  "path" | "setIsCollapsed" | "vaultIncomplete"
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
  const [isExpanded, setIsExpanded] = useState(true);
  const hasActiveChild = useMemo(() => {
    for (const navLink of group.navLinks) {
      if (isSelected(path, navLink)) {
        return true;
      }
    }
    return false;
  }, [group, path]);

  const switchProvisioningEnabled = useSelector(
    configSelectors.experimentalSwitchProvisioning
  );

  // Only used to render the severity summary on the "Notifications" nav
  // item, so it's disabled entirely unless that nav item can actually be
  // shown. Counts the user's full notification history (not just active
  // ones), matching what the Notifications page itself shows.
  const allNotifications = useAllNotifications({
    enabled: import.meta.env.VITE_APP_NOTIFICATIONS_PAGE === "true",
  });
  const notificationCount = allNotifications.data?.items.length ?? 0;

  const filteredLinks = group.navLinks
    .filter(
      (navLink) =>
        switchProvisioningEnabled || navLink.url !== urls.switches.index
    )
    .map((navLink) => ({
      ...navLink,
      disabled: !hasPermissions(
        entitlements,
        navLink.requiredEntitlements || []
      ),
    }));

  const items = filteredLinks.map((navLink) => (
    <AppSideNavItem
      disabled={navLink.disabled}
      icon={
        navLink.label === "Controllers" && vaultIncomplete ? (
          <Icon
            aria-label="warning"
            data-testid="warning-icon"
            name="security-warning-grey"
          />
        ) : navLink.label === "Notifications" ? (
          <>
            <Navigation.Icon name={navLink.icon ?? "notifications"} />
            {notificationCount > 0 ? (
              <Badge
                aria-label={`${notificationCount} notifications`}
                className="u-nudge-right--small"
                value={notificationCount}
              />
            ) : null}
          </>
        ) : (
          navLink.icon
        )
      }
      key={navLink.label}
      navLink={navLink}
      path={path}
      setIsCollapsed={setIsCollapsed}
    />
  ));

  if (group.isExpandable) {
    return (
      <Navigation.Group
        hasActiveChild={hasActiveChild}
        icon={group.groupIcon}
        isExpanded={isExpanded}
        label={group.groupTitle ?? ""}
        setIsExpanded={setIsExpanded}
      >
        {items}
      </Navigation.Group>
    );
  }

  return <>{items}</>;
};

export const AppSideNavItems = ({
  groups,
  path,
  setIsCollapsed,
  showLinks,
  vaultIncomplete,
}: Props): React.ReactElement | null => {
  const { data: userEntitlements } = useGetUserEntitlements();

  if (!showLinks) {
    return null;
  }

  return (
    <>
      {groups.map((group, i) => (
        <Navigation.List key={`${i}-${group.groupTitle ?? "group"}`}>
          <AppSideNavItemGroup
            entitlements={userEntitlements}
            group={group}
            path={path}
            setIsCollapsed={setIsCollapsed}
            vaultIncomplete={vaultIncomplete}
          />
        </Navigation.List>
      ))}
      <Navigation.List>
        <AppSideNavItem
          disabled={false}
          icon="settings"
          navLink={{ label: "Settings", url: urls.settings.index }}
          path={path}
          setIsCollapsed={setIsCollapsed}
        />
      </Navigation.List>
    </>
  );
};

export default AppSideNavItems;
